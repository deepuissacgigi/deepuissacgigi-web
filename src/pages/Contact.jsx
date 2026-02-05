import React, { useState, useRef, useCallback, useEffect } from 'react';
import Button from '../components/ui/Button';
import SeoHead from '../components/SeoHead';
import { SEO_DATA } from '../utils/seoData';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Mail, Phone, MapPin, Instagram, MessageCircle, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import '../index.scss';
import './Contact.scss';

// ============================================================================
// CONFIGURATION
// ============================================================================
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');
const CACHE_KEY = 'emailVerificationCache';
const CACHE_EXPIRY_DAYS = 30;

// Common typo corrections (frontend quick-check)
const TYPO_CORRECTIONS = {
    'gmail.con': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'hotmail.con': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'yahoo.con': 'yahoo.com',
    'icloud.con': 'icloud.com',
    'icoud.com': 'icloud.com',
};

// Quick disposable check (frontend layer - backend has more extensive list)
const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'throwaway.email', 'fakeinbox.com', 'yopmail.com', 'sharklasers.com',
    'trashmail.com', 'temp-mail.org', 'getnada.com', 'emailondeck.com'
]);

// ============================================================================
// CACHE UTILITIES (with retry logic - 3 attempts before permanent block)
// ============================================================================
const MAX_ATTEMPTS = 3;

const getEmailCache = () => {
    try {
        const cache = localStorage.getItem(CACHE_KEY);
        return cache ? JSON.parse(cache) : {};
    } catch {
        return {};
    }
};

const setEmailCache = (email, isValid) => {
    try {
        const cache = getEmailCache();
        const existing = cache[email.toLowerCase()] || {};
        const attempts = isValid ? 0 : (existing.attempts || 0) + 1;

        cache[email.toLowerCase()] = {
            valid: isValid,
            attempts: attempts,
            timestamp: Date.now(),
            expiry: Date.now() + (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.warn('Cache write failed:', e);
    }
};

const checkEmailCache = (email) => {
    const cache = getEmailCache();
    const entry = cache[email.toLowerCase()];
    if (entry && Date.now() < entry.expiry) {
        if (entry.valid === true) {
            return { status: 'valid' };
        }
        // If invalid but still has attempts left, allow retry
        if (entry.attempts < MAX_ATTEMPTS) {
            return { status: 'retry', attemptsLeft: MAX_ATTEMPTS - entry.attempts };
        }
        // Max attempts reached
        return { status: 'blocked', attempts: entry.attempts };
    }
    return { status: 'not_cached' };
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================
const RFC_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const checkTypo = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && TYPO_CORRECTIONS[domain]) {
        return TYPO_CORRECTIONS[domain];
    }
    return null;
};

const isDisposable = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return DISPOSABLE_DOMAINS.has(domain);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Contact = () => {
    const [headerRef, headerVisible] = useIntersectionObserver({ triggerOnce: true });
    const form = useRef();

    // Form State
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error

    // Email Validation State
    const [emailError, setEmailError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [typoSuggestion, setTypoSuggestion] = useState('');
    const [verifyingDots, setVerifyingDots] = useState('.');
    const [sendingDots, setSendingDots] = useState('.');

    // Debounce/Dedup refs
    const verificationInProgress = useRef(false);
    const lastVerifiedEmail = useRef('');
    const dotsIntervalRef = useRef(null);
    const sendingDotsIntervalRef = useRef(null);

    // Animated dots effect - smooth looping "Verifying email." → ".." → "..."
    useEffect(() => {
        if (isVerifying) {
            // Clear any existing interval first
            if (dotsIntervalRef.current) {
                clearInterval(dotsIntervalRef.current);
            }

            setVerifyingDots('.');
            dotsIntervalRef.current = setInterval(() => {
                setVerifyingDots(prev => {
                    if (prev === '.') return '..';
                    if (prev === '..') return '...';
                    return '.';
                });
            }, 400);
        } else {
            // Stop interval immediately when not verifying
            if (dotsIntervalRef.current) {
                clearInterval(dotsIntervalRef.current);
                dotsIntervalRef.current = null;
            }
        }

        // Cleanup on unmount
        return () => {
            if (dotsIntervalRef.current) {
                clearInterval(dotsIntervalRef.current);
            }
        };
    }, [isVerifying]);

    // Animated dots for "Sending..." button
    useEffect(() => {
        if (isLoading) {
            if (sendingDotsIntervalRef.current) {
                clearInterval(sendingDotsIntervalRef.current);
            }

            setSendingDots('.');
            sendingDotsIntervalRef.current = setInterval(() => {
                setSendingDots(prev => {
                    if (prev === '.') return '..';
                    if (prev === '..') return '...';
                    if (prev === '...') return '....';
                    if (prev === '....') return '.....';
                    return '.';
                });
            }, 300);
        } else {
            if (sendingDotsIntervalRef.current) {
                clearInterval(sendingDotsIntervalRef.current);
                sendingDotsIntervalRef.current = null;
            }
        }

        return () => {
            if (sendingDotsIntervalRef.current) {
                clearInterval(sendingDotsIntervalRef.current);
            }
        };
    }, [isLoading]);

    // ========================================================================
    // EMAIL VERIFICATION LOGIC
    // ========================================================================
    const verifyEmail = useCallback(async (email) => {
        // Prevent duplicate calls
        if (verificationInProgress.current) return false;
        if (lastVerifiedEmail.current === email.toLowerCase() && isVerified) return true;

        const trimmedEmail = email.trim().toLowerCase();

        // Reset states
        setEmailError('');
        setTypoSuggestion('');
        setIsVerified(false);

        // ====== LAYER 1: Basic Format Check (Frontend) ======
        if (!RFC_EMAIL_REGEX.test(trimmedEmail)) {
            setEmailError("Hmm, that doesn't look like a valid email address");
            return false;
        }

        // ====== LAYER 2: Typo Detection (Frontend) ======
        const suggestedDomain = checkTypo(trimmedEmail);
        if (suggestedDomain) {
            const [localPart] = trimmedEmail.split('@');
            setTypoSuggestion(`${localPart}@${suggestedDomain}`);
            setEmailError(`Did you mean ${localPart}@${suggestedDomain}?`);
            return false;
        }

        // ====== LAYER 3: Disposable Check (Frontend) ======
        if (isDisposable(trimmedEmail)) {
            setEmailError("Please use a real email address, not a temporary one");
            return false;
        }

        // ====== LAYER 4: Local Cache Check ======
        const cachedResult = checkEmailCache(trimmedEmail);

        if (cachedResult.status === 'valid') {
            console.log('[CACHE HIT] Email verified from localStorage');
            setIsVerified(true);
            lastVerifiedEmail.current = trimmedEmail;
            return true;
        } else if (cachedResult.status === 'blocked') {
            setEmailError("We couldn't verify this email after 3 attempts. Please try a different one");
            return false;
        } else if (cachedResult.status === 'retry') {
            console.log(`[RETRY] Attempt ${MAX_ATTEMPTS - cachedResult.attemptsLeft + 1}/${MAX_ATTEMPTS} for ${trimmedEmail}`);
            // Continue to backend verification
        }

        // ====== LAYER 5: Backend Precheck (DNS/MX) ======
        verificationInProgress.current = true;
        setIsVerifying(true);

        try {
            // Backend Precheck Only (No ZeroBounce)
            const preResponse = await fetch(`${BACKEND_URL}/api/precheck`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmedEmail })
            });

            if (!preResponse.ok) throw new Error('Network error');

            const preData = await preResponse.json();

            if (preData.precheck !== 'pass') {
                setEmailError(preData.reason || "We couldn't verify this email");
                setIsVerifying(false);
                verificationInProgress.current = false;
                setEmailCache(trimmedEmail, false);
                return false;
            }

            // Precheck passed - email is valid!
            setIsVerified(true);
            setEmailCache(trimmedEmail, true);
            lastVerifiedEmail.current = trimmedEmail;
            setIsVerifying(false);
            verificationInProgress.current = false;
            return true;

        } catch (error) {
            console.error('Verification Error:', error);
            // On error, let the user pass but warn? Or just fail?
            // "Fail open" is usually better for personal sites if server is down
            // But here we'll retry.
            setEmailError("Couldn't connect to verification server. Please try again.");
            setIsVerifying(false);
            verificationInProgress.current = false;
            return false;
        }
    }, [isVerified]);

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    // When user edits email, reset all validation states
    const handleEmailChange = () => {
        setEmailError('');
        setTypoSuggestion('');
        setIsVerified(false);
        lastVerifiedEmail.current = '';
    };

    // When user focuses on MESSAGE textarea, trigger verification
    const handleMessageFocus = () => {
        const emailValue = form.current?.email?.value;

        // Don't verify if already verified, verifying, or no email
        if (!emailValue || isVerified || isVerifying) return;

        verifyEmail(emailValue);
    };

    // Apply typo suggestion
    const applyTypoSuggestion = () => {
        if (typoSuggestion && form.current?.email) {
            form.current.email.value = typoSuggestion;
            setTypoSuggestion('');
            setEmailError('');
            // Re-verify with corrected email
            verifyEmail(typoSuggestion);
        }
    };

    // ========================================================================
    // SEND EMAIL
    // ========================================================================
    const sendEmail = async (e) => {
        e.preventDefault();

        const emailValue = form.current.email.value;
        const nameValue = form.current.name.value;

        // Final safety check
        if (!isVerified) {
            const valid = await verifyEmail(emailValue);
            if (!valid) return;
        }

        if (!emailValue || !nameValue) return;

        setIsLoading(true);
        setStatus('idle');

        // EmailJS Configuration
        // EmailJS Configuration
        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const ADMIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
        const REPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_REPLY_TEMPLATE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        // Google Apps Script URL
        const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

        // 1. Send to Google Sheets
        const formData = new FormData(form.current);
        const data = new URLSearchParams(formData);

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: data,
            mode: 'no-cors'
        }).catch(err => console.error("Sheets Error:", err));

        // 2. Send Admin Notification
        const adminPromise = emailjs.sendForm(SERVICE_ID, ADMIN_TEMPLATE_ID, form.current, PUBLIC_KEY);

        // 3. Send Auto-Reply
        const replyPromise = emailjs.sendForm(SERVICE_ID, REPLY_TEMPLATE_ID, form.current, PUBLIC_KEY);

        Promise.all([adminPromise, replyPromise])
            .then((results) => {
                console.log("Emails sent successfully");
                setIsLoading(false);
                setStatus('success');
                e.target.reset();
                setIsVerified(false);
                setIsVerifying(false);
                lastVerifiedEmail.current = '';
                setTimeout(() => setStatus('idle'), 5000);
            })
            .catch((error) => {
                console.log("EmailJS Error:", error.text);
                setIsLoading(false);
                setStatus('error');
            });
    };

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <div id="contact" className="section-container" style={{ padding: '8rem 0' }}>
            <SeoHead {...SEO_DATA.contact} />
            <div className="container">
                <div
                    ref={headerRef}
                    className={`section-header ${headerVisible ? 'animate-fade-in' : 'opacity-0'}`}
                >
                    <h2
                        className={`section-title ${headerVisible ? 'animate-glitch-reveal' : 'opacity-0'}`}
                        data-text="Get In Touch"
                    >
                        Get In Touch
                    </h2>
                    <p className="section-description">
                        Have a project in mind or just want to say hi? I'd love to hear from you.
                    </p>
                </div>

                <div className="contact-grid">
                    {/* Contact Info Panel */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 className="glow-on-hover" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Contact Info</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: 'rgba(100,108,255,0.1)', padding: '0.8rem', borderRadius: '50%', color: '#646cff' }}>
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#888' }}>Phone / WhatsApp</p>
                                    <p style={{ fontSize: '1rem', color: '#fff' }}>(+49) 15510437615</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: 'rgba(100,108,255,0.1)', padding: '0.8rem', borderRadius: '50%', color: '#646cff' }}>
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#888' }}>Email</p>
                                    <p style={{ fontSize: '1rem', color: '#fff' }}>deepuissacgigi@gmail.com</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: 'rgba(100,108,255,0.1)', padding: '0.8rem', borderRadius: '50%', color: '#646cff' }}>
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#888' }}>Location</p>
                                    <p style={{ fontSize: '1rem', color: '#fff' }}>Zwickau, Germany</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2.5rem' }}>
                            <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#aaa' }}>Socials</p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <a href="https://www.instagram.com/i.s.s.a.c._/" target="_blank" rel="noreferrer" className="btn-icon" style={{ color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '8px', transition: '0.3s' }}>
                                    <Instagram size={20} />
                                </a>
                                <div className="btn-icon" style={{ color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer' }}>
                                    <MessageCircle size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form
                        ref={form}
                        className="contact-form glass-panel"
                        onSubmit={sendEmail}
                        style={{ padding: '2rem' }}
                    >
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" placeholder="Your Name" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="your@email.com"
                                required
                                style={{
                                    borderColor: emailError ? '#ef4444' : isVerified ? '#10b981' : '',
                                    transition: 'border-color 0.2s'
                                }}
                                onChange={handleEmailChange}
                            />
                            {/* Error Message */}
                            {emailError && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                                    <AlertCircle size={14} style={{ color: '#ef4444' }} />
                                    <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>
                                        {emailError}
                                    </span>
                                    {typoSuggestion && (
                                        <button
                                            type="button"
                                            onClick={applyTypoSuggestion}
                                            style={{
                                                background: 'rgba(100,108,255,0.2)',
                                                border: '1px solid #646cff',
                                                color: '#646cff',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Fix it
                                        </button>
                                    )}
                                </div>
                            )}
                            {/* Verifying Indicator */}
                            {isVerifying && (
                                <span style={{
                                    color: '#646cff',
                                    fontSize: '0.85rem',
                                    marginTop: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontFamily: 'monospace'
                                }}>
                                    <Loader2 className="animate-spin" size={14} />
                                    <span style={{ minWidth: '120px' }}>Verifying email{verifyingDots}</span>
                                </span>
                            )}
                            {/* Verified Indicator */}
                            {isVerified && !emailError && (
                                <span style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <CheckCircle2 size={14} /> Email verified
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                name="message"
                                id="message"
                                rows="5"
                                placeholder="How can I help you?"
                                required
                                onFocus={handleMessageFocus}
                            />
                        </div>

                        <Button
                            variant="primary"
                            type="submit"
                            className={`professional-send-btn ${isLoading ? 'loading' : ''} ${status === 'success' ? 'success' : ''}`}
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                height: '54px',
                                transition: 'all 0.3s ease',
                                opacity: 1
                            }}
                            disabled={isLoading || isVerifying || (!isVerified && status !== 'success')}
                        >
                            <div className="btn-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span style={{ fontFamily: 'monospace', minWidth: '90px', textAlign: 'left' }}>Sending{sendingDots}</span>
                                    </>
                                ) : status === 'success' ? (
                                    <>
                                        <CheckCircle2 size={18} />
                                        <span>Message Sent!</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isVerifying ? "VERIFYING..." : "SEND MESSAGE"}</span>
                                        {!isVerifying && <Send size={18} />}
                                    </>
                                )}
                            </div>
                        </Button>

                        {status === 'error' && (
                            <p style={{ color: '#ff6b6b', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                                Something went wrong. Please try again or email me directly.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
