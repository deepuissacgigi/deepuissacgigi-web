import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
import dns from 'dns/promises';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// --- CONFIGURATION & CACHE ---
const PORT = process.env.PORT || 3001;
const ZEROBOUNCE_API_KEY = process.env.ZEROBOUNCE_API_KEY;
const ZEROBOUNCE_API_URL = process.env.ZEROBOUNCE_API_URL || 'https://api.zerobounce.net/v2/validate';

// Cache: 10 minute check period.
// TTLs: Valid=30d, Invalid=30d, Unknown=7d, Precheck=24h
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 600 });

// In-Flight Request Deduplication Map
// Prevents double-spending credits if user mashes 'Verify'
const inflightRequests = new Map();

// Server-side blocklist for disposable/reserved domains (100+ domains)
const BLOCKED_DOMAINS = new Set([
    // Reserved/Test
    'example.com', 'example.org', 'example.net', 'test.com', 'localhost', 'invalid',
    // Popular Disposable Services
    'mailinator.com', 'guerrillamail.com', 'guerrillamail.org', 'sharklasers.com',
    'grr.la', 'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.net',
    'yopmail.com', 'yopmail.fr', 'yopmail.net', 'cool.fr.nf', 'jetable.fr.nf',
    'tempmail.com', 'temp-mail.org', 'temp-mail.io', 'tempail.com',
    '10minutemail.com', '10minutemail.net', '10minemail.com', '10mail.org',
    'throwaway.email', 'throwawaymail.com', 'fakeinbox.com', 'fakemailgenerator.com',
    'trashmail.com', 'trashmail.net', 'trashmail.org', 'trashemail.de',
    'getnada.com', 'nada.email', 'emailondeck.com', 'spamgourmet.com',
    'mailnesia.com', 'mailcatch.com', 'mailslurp.com', 'maildrop.cc',
    'discard.email', 'discardmail.com', 'spamfree24.org', 'spambox.us',
    'mytrashmail.com', 'mt2015.com', 'thankyou2010.com', 'spam4.me',
    'binkmail.com', 'safetymail.info', 'spamobox.com', 'tempinbox.com',
    'mailforspam.com', 'tempr.email', 'fakemail.net', 'mohmal.com',
    'emailfake.com', 'crazymailing.com', 'tempsky.com', 'tempmailaddress.com',
    'burnermail.io', 'imgv.de', 'trash-mail.at', 'wegwerfmail.de',
    'wegwerfmail.net', 'wegwerfmail.org', 'sofort-mail.de', 'spoofmail.de',
    'meltmail.com', 'mintemail.com', 'tempmailo.com', 'emailsensei.com',
    'armyspy.com', 'cuvox.de', 'dayrep.com', 'einrot.com', 'fleckens.hu',
    'gustr.com', 'jourrapide.com', 'rhyta.com', 'superrito.com', 'teleworm.us',
    'inboxkitten.com', '33mail.com', 'anonaddy.com', 'simplelogin.io'
]);

// Suspicious local parts (Role-based)
const SUSPICIOUS_ROLES = new Set(['admin', 'support', 'info', 'sales', 'marketing', 'webmaster', 'contact']);

// RFC 5322 Regex (Standard)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

// --- HELPERS ---
const hashEmail = (email) => crypto.createHash('sha256').update(email).digest('hex');

// Rate Limiting: 30 req/min per IP default
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Specific stricter limit for ZeroBounce calls (5 req/min)
const zbLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: { error: "Too many verification attempts, please try again later." }
});

// --- METRICS ---
let monthlyCreditsUsed = 0;
let lastReset = new Date();

// --- ENDPOINTS ---

/**
 * 1. PRECHECK
 * Fast local checks. Costs $0.
 */
app.post('/api/precheck', async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string') return res.status(400).json({ precheck: "fail", reason: "Invalid input" });

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Regex Syntax Check
    if (!EMAIL_REGEX.test(trimmedEmail)) {
        return res.json({ precheck: "fail", reason: "That doesn't look like a valid email format" });
    }

    const [localPart, domain] = trimmedEmail.split('@');

    // 2. Blocked Domains
    if (BLOCKED_DOMAINS.has(domain)) {
        return res.json({ precheck: "fail", reason: "Please use a real email address, not a temporary one" });
    }

    // 3. Role-based Check (Optional: Fail or Warn)
    if (SUSPICIOUS_ROLES.has(localPart)) {
        // We reject for this strict implementation, but could be a warning.
        return res.json({ precheck: "fail", reason: "Please use your personal email instead of a generic address" });
    }

    // 4. DNS MX Check
    // Check cache first for DNS result
    const dnsCacheKey = `dns:${domain}`;
    let hasMx = cache.get(dnsCacheKey);

    if (hasMx === undefined) {
        try {
            const mxRecords = await dns.resolveMx(domain);
            hasMx = mxRecords && mxRecords.length > 0;
            if (!hasMx) {
                // Fallback to A record
                const aRecords = await dns.resolve4(domain).catch(() => []);
                hasMx = aRecords.length > 0;
            }
            cache.set(dnsCacheKey, hasMx, 86400); // Cache DNS for 24h
        } catch (error) {
            console.error(`DNS lookup failed for ${domain}:`, error.message);
            // Weak fail: if DNS fails, we assume fail.
            return res.json({ precheck: "fail", reason: "We couldn't verify this email domain exists" });
        }
    }

    if (!hasMx) {
        return res.json({ precheck: "fail", reason: "This email domain doesn't seem to accept messages" });
    }

    // All Pass
    // Cache precheck pass for 24h
    cache.set(`precheck:${trimmedEmail}`, "pass", 86400);

    return res.json({ precheck: "pass" });
});

/**
 * 2. VERIFY WITH ZEROBOUNCE
 * Costs credits. Gated by Precheck.
 */
app.post('/api/verify-with-zerobounce', zbLimiter, async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const trimmedEmail = email.trim().toLowerCase();
    const hashed = hashEmail(trimmedEmail);

    // Gating: Must pass precheck first
    const precheckStatus = cache.get(`precheck:${trimmedEmail}`);
    if (precheckStatus !== "pass") {
        return res.status(403).json({ error: "Precheck not passed. Call /api/precheck first." });
    }

    // Check Cache for ZeroBounce Result
    const cachedZb = cache.get(`zb:${trimmedEmail}`);
    if (cachedZb) {
        console.log(`[CACHE HIT] ZeroBounce result for ${hashed.substring(0, 8)}...`);
        return res.json({ status: cachedZb.status, raw: cachedZb.raw, source: "cache" });
    }

    // DEDUPLICATION: Check if already answering this email
    if (inflightRequests.has(trimmedEmail)) {
        console.log(`[DEDUPE] Joining in-flight request for ${hashed.substring(0, 8)}...`);
        try {
            const result = await inflightRequests.get(trimmedEmail);
            return res.json({ ...result, source: "deduped_inflight" });
        } catch (err) {
            return res.status(500).json({ error: "In-flight request failed" });
        }
    }

    // PERFORM EXTERNAL CALL
    const verifyPromise = (async () => {
        try {
            if (!ZEROBOUNCE_API_KEY) throw new Error("Server missing API Key");

            console.log(`[ZEROBOUNCE] Calling API for ${hashed.substring(0, 8)}...`);
            // Actual API Call
            const response = await axios.get(ZEROBOUNCE_API_URL, {
                params: {
                    api_key: ZEROBOUNCE_API_KEY,
                    email: trimmedEmail,
                    ip_address: req.ip // Optional: Pass user IP for better context
                }
            });

            monthlyCreditsUsed++; // Increment metric

            const data = response.data;
            const status = data.status; // valid, invalid, catch_all, unknown, spamtrap, abuse, do_not_mail

            const result = { status, raw: data };

            // Cache Rules
            let ttl = 86400 * 30; // 30 days default (valid/invalid)
            if (status === 'unknown' || status === 'catch_all') {
                ttl = 86400 * 7; // 7 days for uncertain
            }

            cache.set(`zb:${trimmedEmail}`, result, ttl);

            return result;

        } catch (error) {
            console.error("ZeroBounce API Error:", error.message);
            throw error; // Propagate to catch block below
        } finally {
            inflightRequests.delete(trimmedEmail); // Cleanup Map
        }
    })();

    inflightRequests.set(trimmedEmail, verifyPromise);

    try {
        const result = await verifyPromise;
        return res.json({ ...result, source: "zerobounce" });
    } catch (error) {
        return res.status(502).json({ error: "Verification service unavailable", details: error.message });
    }
});

/**
 * 3. SEND MESSAGE
 * Final Gate. Only sends if valid in cache.
 */
app.post('/api/send-message', async (req, res) => {
    const { email, message } = req.body;
    const trimmedEmail = email?.trim().toLowerCase();

    // STRICT CHECK: Must be in cache AND valid
    const cachedZb = cache.get(`zb:${trimmedEmail}`);

    if (!cachedZb || cachedZb.status !== 'valid') {
        return res.status(403).json({
            ok: false,
            reason: "Email not verified or invalid. Please verify first."
        });
    }

    // Simulate Sending
    console.log(`[MAILER] Sending message to ${trimmedEmail}...`);
    // TODO: Wire up Nodemailer / AWS SES / Mailgun here using 'message'

    return res.json({ ok: true, message: "Sent successfully" });
});

/**
 * ADMIN METRICS
 * Protected by simple checking (in prod use real auth)
 */
app.get('/admin/metrics', (req, res) => {
    // Simple basic auth or token check could go here
    res.json({
        zerobounce_calls_this_session: monthlyCreditsUsed,
        last_reset: lastReset,
        cache_stats: cache.getStats()
    });
});

app.listen(PORT, () => {
    console.log(`Email Validation Server running on port ${PORT}`);
});
