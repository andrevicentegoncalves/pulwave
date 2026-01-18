# Logging Patterns

## Structured Logging (JSON)

Text logs are hard to query. JSON is machine readable.

*Bad*:
`[2023-01-01] User 123 login failed`

*Good*:
```json
{
  "timestamp": "2023-01-01T12:00:00Z",
  "level": "error",
  "event": "auth_login_failed",
  "user_id": "123",
  "reason": "invalid_password",
  "ip": "1.2.3.4"
}
```
*Query*: `event:auth_login_failed AND reason:invalid_password`

## Log Levels

1. **ERROR**: System is broken. Wake up on-call? (Maybe).
2. **WARN**: Something weird happened, but handled.
3. **INFO**: Normal lifecycle (Startup, Login, Purchase).
4. **DEBUG**: detailed state. Only enabled when diagnosing.
5. **TRACE**: Everything. Firehose.

## Context Propagation

Pass a `trace_id` or `request_id` through every log in a single request.
Allows filtering logs by "Show me everything that happened in Request X".

```javascript
logger.info("Processing payment", { request_id: req.id });
```

## PII Redaction

**Never** log:
- Passwords
- Credit Card numbers
- API Keys
- PII (Emails, Phones) in plain text (if GDPR sensitive)

Use a logger middleware to scrub these fields automatically.
