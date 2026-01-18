# Penetration Testing Methodology

## Testing Approach

### 1. Reconnaissance Phase
- Map attack surface
- Identify entry points
- Enumerate endpoints, parameters, and user roles
- Collect version information (if disclosed)

### 2. Vulnerability Identification
- Run automated scanners
- Manual testing of business logic
- Test authentication and authorization
- Input validation testing
- Configuration review

### 3. Active Breach Testing
**Actually attempt to exploit vulnerabilities with real attack vectors.**

Unlike passive scanning, actively:
- Attempt SQL injection with malicious payloads
- Test XSS with script execution
- Try privilege escalation
- Attempt IDOR attacks
- Execute command injection tests

### 4. Persistent Iteration ("Ralph Wiggum Loop")
**Keep testing until the attack surface is fully mapped.**

- Iterate through all test categories
- Re-test failed scenarios
- Discover chained vulnerabilities
- Map all access paths

### 5. Fix Verification
**After remediation, re-run all tests to confirm fixes.**

- Verify vulnerability is patched
- Ensure no regression
- Confirm defense-in-depth
- Test for bypass techniques

## Test Categories (250+ Tests)

### 1. Authentication & Session Management (40 tests)
- Login security (SQL injection, brute force)
- Session fixation
- JWT security
- Password reset flows
- MFA bypass
- OAuth/OIDC security
- Credential enumeration
- Session timeout

### 2. Authorization & Access Control (35 tests)
- IDOR (Insecure Direct Object Reference)
- Horizontal privilege escalation
- Vertical privilege escalation
- Missing function-level access control
- Path traversal
- Mass assignment
- Parameter tampering

### 3. Input Validation & Injection (50 tests)
- SQL injection (UNION, blind, time-based)
- NoSQL injection
- XSS (stored, reflected, DOM-based)
- Command injection
- LDAP injection
- XML injection
- Template injection
- CRLF injection

### 4. API Security (40 tests)
- Rate limiting
- GraphQL security (introspection, depth attacks)
- REST API abuse
- API version disclosure
- Mass assignment in APIs
- Insecure deserialization
- CORS misconfiguration
- JWT algorithm confusion

### 5. Cryptography & Data Protection (25 tests)
- Weak SSL/TLS configuration
- Sensitive data in transit
- Missing security headers (HSTS, CSP)
- Password storage (plain text, weak hashing)
- Encryption at rest
- Hardcoded secrets
- Predictable tokens

### 6. Business Logic (30 tests)
- Race conditions
- Negative quantities
- Price manipulation
- Workflow bypass
- Coupon/discount abuse
- Account takeover via logic flaws
- Integer overflow

### 7. Configuration & Deployment (30 tests)
- Debug mode enabled
- Verbose error messages
- Default credentials
- Missing security headers
- Directory listing
- Information disclosure
- Backup files accessible
- Git/SVN folders exposed

### 8. Database Security (Supabase-specific)
- Row Level Security (RLS) disabled
- RLS with `USING (true)` (always bypass)
- Deep access bypasses
- Tenant isolation failures
- Database function exploits

### 9. Real-time & WebSocket Security
- WebSocket injection
- Authentication bypass
- Message tampering
- Channel hijacking

### 10. Backup & Operations Security
- Backup exposure
- Log injection
- Monitoring bypass
- Audit trail tampering

## Severity Classification

### CRITICAL
- Remote code execution
- Authentication bypass
- SQL injection with data access
- Privilege escalation to admin
- Sensitive data exposure

**SLA:** Fix immediately (0-24 hours)

### HIGH
- Unauthorized data access
- XSS with session hijacking
- CSRF on critical actions
- Weak cryptography
- Missing authorization

**SLA:** Fix within 7 days

### MEDIUM
- Information disclosure
- Missing security headers
- Weak password policy
- Session timeout issues
- CORS misconfiguration

**SLA:** Fix within 30 days

### LOW
- Version disclosure
- Verbose error messages
- Non-sensitive information leakage

**SLA:** Fix within 90 days

## Reporting Format

```json
{
  "vulnerability": {
    "id": "AUTH-001",
    "name": "SQL Injection in Login",
    "severity": "CRITICAL",
    "category": "Authentication",
    "cwe": "CWE-89",
    "owasp": "A03:2021 – Injection",
    "description": "Login endpoint vulnerable to SQL injection",
    "impact": "Complete database compromise",
    "exploitability": "Easy",
    "poc": {
      "steps": ["..."],
      "payload": "admin' OR '1'='1",
      "response": "..."
    },
    "remediation": "Use parameterized queries",
    "references": [
      "https://owasp.org/www-community/attacks/SQL_Injection"
    ]
  }
}
```

## Ethical Guidelines

1. **Only test projects you own or have explicit authorization**
2. **Do not test in production without approval**
3. **Stop testing immediately if you discover an active breach**
4. **Report critical vulnerabilities immediately**
5. **Do not exfiltrate sensitive data**
6. **Respect rate limits and system resources**
7. **Document all findings responsibly**

## Compliance Mapping

### OWASP ASVS Level 2
- Authentication (V2)
- Session Management (V3)
- Access Control (V4)
- Input Validation (V5)
- Cryptography (V6)
- Error Handling (V7)
- Data Protection (V8)

### PCI DSS
- 6.3.2 Security Testing
- 11.3 Penetration Testing

### SOC 2
- CC6.6 Security Testing
- CC7.1 Vulnerability Management

### GDPR
- Article 32 - Security of Processing
- Article 25 - Data Protection by Design
