# Email Validation & ZeroBounce Gating POC

This is a production-ready Proof of Concept for a 2-stage Email Validation System.

## Features
- **Frontend**: React-based input with standard regex & domain blocking.
- **Backend**: Node/Express server.
- **Cost-Saving**: Only calls ZeroBounce if local checks (Regex, DNS, Blocklist) pass.
- **Caching**: Results cached for 30 days (valid) / 7 days (unknown) to save credits.
- **Deduplication**: Prevents double-spending credits on concurrent button clicks.

## Setup

1.  **Backend**
    ```bash
    cd backend
    npm install
    # Create .env from example
    cp .env.example .env
    # Add your ZEROBOUNCE_API_KEY in .env
    npm start
    ```
    Runs on `http://localhost:3001`.

2.  **Frontend**
    Copy `frontend/EmailVerifyInput.jsx` into your React project.
    Install dependencies logic is built-in standard React.

## How it Works

1.  **Precheck (`/api/precheck`)**:
    - Checks Syntax.
    - Checks Blocked Domains (`example.com`, etc).
    - Checks DNS MX Records.
    - **Cost**: $0.

2.  **Verify (`/api/verify-with-zerobounce`)**:
    - Called ONLY if Precheck passes.
    - Checks Local Cache (NodeCache).
    - Checks In-Flight Map (Deduplicates simultaneous requests).
    - Calls ZeroBounce API.
    - **Cost**: 1 Credit (unless cached).

## Testing

Run the included logic test:
```bash
cd backend
npm test
```

## Security Limits
- **Rate Limit**: 5 ZeroBounce verification requests per minute per IP.
- **API Key**: Never exposed to client.
