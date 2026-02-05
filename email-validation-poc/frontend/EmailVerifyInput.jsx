import React, { useState, useEffect, useCallback } from 'react';

// Simple debounce hook
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const EmailVerifyInput = ({ onVerified }) => {
    const [email, setEmail] = useState('');
    const debouncedEmail = useDebounce(email, 800); // 800ms debounce

    const [status, setStatus] = useState('idle'); // idle, prechecking, verifying, valid, invalid, error
    const [message, setMessage] = useState('');
    const [canSend, setCanSend] = useState(false);

    // Client-side Regex (matches server)
    const isValidSyntax = (e) => /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(e);

    // Client-side Blocklist
    const isBlockedDomain = (e) => {
        const blocked = ['example.com', 'test.com', 'localhost', 'invalid'];
        const domain = e.split('@')[1];
        return blocked.includes(domain);
    };

    const checkEmail = useCallback(async (targetEmail) => {
        if (!targetEmail) {
            setStatus('idle');
            setMessage('');
            return;
        }

        // 1. Client Syntax Check
        if (!isValidSyntax(targetEmail)) {
            setStatus('error');
            setMessage('Invalid email format');
            return;
        }
        if (isBlockedDomain(targetEmail)) {
            setStatus('error');
            setMessage('Domain is not allowed');
            return;
        }

        try {
            setStatus('prechecking');
            setMessage('Checking domain...');

            // 2. Server Precheck (MX, Blocklist)
            const preRes = await fetch('http://localhost:3001/api/precheck', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: targetEmail })
            });
            const preData = await preRes.json();

            if (preData.precheck !== 'pass') {
                setStatus('error');
                setMessage(preData.reason || "Verification failed");
                return;
            }

            // 3. ZeroBounce Verification
            setStatus('verifying');
            setMessage('Verifying with secure server...');

            const verifyRes = await fetch('http://localhost:3001/api/verify-with-zerobounce', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: targetEmail })
            });

            if (verifyRes.status === 429) {
                setStatus('error');
                setMessage('Too many requests. Please wait.');
                return;
            }

            const verifyData = await verifyRes.json();

            if (verifyData.status === 'valid') {
                setStatus('valid');
                setMessage('Email verified ✓');
                setCanSend(true);
                if (onVerified) onVerified(targetEmail, true);
            } else {
                setStatus('invalid');
                setMessage(`Email is ${verifyData.status.replace('_', ' ')}`);
                setCanSend(false);
                if (onVerified) onVerified(targetEmail, false);
            }

        } catch (err) {
            console.error(err);
            setStatus('error');
            setMessage('Connection error');
        }
    }, [onVerified]);

    // Effect to trigger check when debounced email changes
    useEffect(() => {
        setCanSend(false);
        checkEmail(debouncedEmail);
    }, [debouncedEmail, checkEmail]);

    // Styles
    const getBorderColor = () => {
        if (status === 'valid') return '#10b981'; // Green
        if (status === 'invalid' || status === 'error') return '#ef4444'; // Red
        if (status === 'verifying' || status === 'prechecking') return '#3b82f6'; // Blue
        return '#ccc';
    };

    return (
        <div style={{ maxWidth: '400px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Email Verification</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter business email..."
                    style={{
                        padding: '10px',
                        borderRadius: '6px',
                        border: `2px solid ${getBorderColor()}`,
                        outline: 'none',
                        fontSize: '16px',
                        transition: 'border-color 0.3s'
                    }}
                />

                <div style={{ minHeight: '20px', fontSize: '12px' }}>
                    {status === 'prechecking' && <span style={{ color: '#666' }}>Looking up DNS...</span>}
                    {status === 'verifying' && <span style={{ color: '#3b82f6' }}>Verifying authenticity...</span>}
                    {status === 'valid' && <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ {message}</span>}
                    {(status === 'error' || status === 'invalid') && <span style={{ color: '#ef4444' }}>⚠ {message}</span>}
                </div>

                <button
                    disabled={!canSend}
                    style={{
                        padding: '10px 20px',
                        background: canSend ? '#10b981' : '#e5e7eb',
                        color: canSend ? 'white' : '#9ca3af',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: canSend ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold',
                        transition: 'all 0.3s'
                    }}
                    onClick={() => alert(`Sending message to ${email}...`)}
                >
                    Send Message
                </button>
            </div>
        </div>
    );
};

export default EmailVerifyInput;
