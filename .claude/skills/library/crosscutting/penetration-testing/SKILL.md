---
name: penetration-testing
description: Comprehensive penetration testing methodology for web applications. Covers OWASP Top 10, API security, authentication testing, and automated security scanning with 250+ test scenarios.
version: 1.0.0
tags: [Security, Penetration Testing, OWASP, API Security, Vulnerability Assessment]
---

# Penetration Testing Guide

Comprehensive penetration testing methodology for identifying and validating security vulnerabilities in web applications.

## When to Use

- Security audits and assessments
- Pre-production security validation
- Compliance requirements (SOC 2, ISO 27001)
- After major feature releases
- Quarterly security reviews

## Quick Reference

### OWASP Top 10 Focus Areas
1. **Broken Access Control** - Authorization bypass, IDOR
2. **Cryptographic Failures** - Weak encryption, exposed secrets
3. **Injection** - SQL, NoSQL, Command injection
4. **Insecure Design** - Missing security controls
5. **Security Misconfiguration** - Default configs, verbose errors
6. **Vulnerable Components** - Outdated dependencies
7. **Authentication Failures** - Weak passwords, session issues
8. **Data Integrity Failures** - Unsigned/unverified data
9. **Logging Failures** - Missing security event logs
10. **SSRF** - Server-side request forgery

### Test Script Usage
```bash
# Run all 250+ tests
npm run security:pentest

# Run specific category
npm run security:pentest -- --category=auth

# Generate detailed report
npm run security:pentest -- --report=detailed
```

## Full Compiled Guide

**Category Guide**: [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Complete crosscutting category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

### Test Categories
Complete test matrix in `references/test-matrix.md`:
- Authentication & Session Management (40+ tests)
- Authorization & Access Control (35+ tests)
- Input Validation & Injection (50+ tests)
- API Security (40+ tests)
- Cryptography & Data Protection (25+ tests)
- Business Logic (30+ tests)
- Configuration & Deployment (30+ tests)

### Methodology
Testing approach in `references/methodology.md`:
- Reconnaissance phase
- Vulnerability identification
- Exploitation attempts
- Reporting and remediation

### Automation
Script details in `references/automation.md`:
- Test framework architecture
- Custom test development
- CI/CD integration
- False positive handling

## Key Metrics

- **Critical vulnerabilities**: 0 acceptable
- **High severity**: Fix within 7 days
- **Medium severity**: Fix within 30 days
- **Test coverage**: 250+ scenarios across 7 categories

## Integration

**CI/CD Pipeline:**
```yaml
# .github/workflows/security.yml
- name: Run Penetration Tests
  run: npm run security:pentest -- --ci-mode
```

**Pre-deployment:**
```bash
# Before production deployment
npm run security:pentest -- --env=staging --report=full
```

## Compliance

- ✅ OWASP ASVS Level 2
- ✅ SOC 2 Security Testing
- ✅ PCI DSS 6.3.2
- ✅ GDPR Security Controls
