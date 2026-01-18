# Threat Modeling (STRIDE)

## Methodology

### 1. Data Flow Diagram (DFD)
Map out how data moves.
- **External Entities**: Users, APIs.
- **Processes**: Functions, Servers.
- **Data Stores**: DBs, S3.
- **Data Flows**: Arrows showing movement.

### 2. STRIDE Analysis
For each element in the DFD, ask:
- **Spoofing**: Can someone pretend to be the User? (Fix: JWT/OAuth).
- **Tampering**: Can someone change the price in the API request? (Fix: Server-side validation).
- **Repudiation**: Can a user deny they made a purchase? (Fix: Detailed Audit Logs).
- **Information Disclosure**: Does the error message leak the DB schema? (Fix: Generic error messages).
- **Denial of Service**: Can I spam the login endpoint? (Fix: Rate Limiting).
- **Elevation of Privilege**: Can a regular user access `/admin`? (Fix: RBAC/RLS).

## Mitigation Strategies

- **Primary**: Fix the code.
- **Secondary**: Add WAF rules.
- **Tertiary**: Detection/Alerting.

## Privacy (GDPR/PII)

- **Minimization**: Don't collect what you don't need.
- **Anonymization**: Remove identifiers for analytics.
- **Pseudonymization**: Replace IDs with reversible tokens (if needed for support).
- **Consent**: Explicit opt-in for marketing.
