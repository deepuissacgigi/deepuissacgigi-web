import express from 'express';
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
// Cache: 10 minute check period.
// Note: In Serverless environment, this cache is ephemeral and will reset on cold starts.
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 600 });

// Server-side blocklist for disposable/reserved domains
const BLOCKED_DOMAINS = new Set([
    'example.com', 'example.org', 'example.net', 'test.com', 'localhost', 'invalid',
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

const SUSPICIOUS_ROLES = new Set(['admin', 'support', 'info', 'sales', 'marketing', 'webmaster', 'contact']);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

// Rate Limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30, // 30 req/min
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// --- ENDPOINTS ---

app.post('/api/precheck', async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string') return res.status(400).json({ precheck: "fail", reason: "Invalid input" });

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
        return res.json({ precheck: "fail", reason: "That doesn't look like a valid email format" });
    }

    const [localPart, domain] = trimmedEmail.split('@');

    if (BLOCKED_DOMAINS.has(domain)) {
        return res.json({ precheck: "fail", reason: "Please use a real email address, not a temporary one" });
    }

    if (SUSPICIOUS_ROLES.has(localPart)) {
        return res.json({ precheck: "fail", reason: "Please use your personal email instead of a generic address" });
    }

    const dnsCacheKey = `dns:${domain}`;
    let hasMx = cache.get(dnsCacheKey);

    if (hasMx === undefined) {
        try {
            const mxRecords = await dns.resolveMx(domain);
            hasMx = mxRecords && mxRecords.length > 0;
            if (!hasMx) {
                const aRecords = await dns.resolve4(domain).catch(() => []);
                hasMx = aRecords.length > 0;
            }
            cache.set(dnsCacheKey, hasMx, 86400);
        } catch (error) {
            console.error(`DNS lookup failed for ${domain}:`, error.message);
            return res.json({ precheck: "fail", reason: "We couldn't verify this email domain exists" });
        }
    }

    if (!hasMx) {
        return res.json({ precheck: "fail", reason: "This email domain doesn't seem to accept messages" });
    }

    cache.set(`precheck:${trimmedEmail}`, "pass", 86400);
    return res.json({ precheck: "pass" });
});

// Admin Metrics
app.get('/api/metrics', (req, res) => {
    res.json({
        cache_stats: cache.getStats()
    });
});

// For local testing (optional) if ran directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const port = 3001;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

// Export for Vercel
export default app;
