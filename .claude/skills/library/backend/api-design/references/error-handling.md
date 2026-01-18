# Error Handling Patterns

## Standard API Error Response (JSON)

Always return a consistent structure so the Frontend can handle it generically.

```json
{
  "error": {
    "code": "auth_invalid_credentials",
    "message": "The email or password you entered is incorrect.",
    "requestId": "req_12345",
    "details": {
      "field": "password",
      "hint": "Try resetting your password if you forgot it."
    }
  }
}
```

## Global Error Handling

### Backend (Node/Express)
Use a centralized error middleware. Never let the server crash.

```javascript
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({ 
    error: { code: err.code, message: err.message } 
  });
});
```

### Frontend (React)
Use **Error Boundaries** to catch component-level crashes and show a fallback UI instead of a white screen.

## Types of Errors

1. **Operational**: Expected failures (404, 401, 422). Handle these gracefully.
2. **Programmer**: Bugs (ReferenceError, TypeError). Fix the code.
3. **Infrastructure**: Network down, DB timeout. Implement retries/circuit breakers.

## Status Code Map

- **400**: Bad Request (Invalid payload).
- **401**: Unauthorized (No token).
- **403**: Forbidden (Insufficient permissions).
- **404**: Not Found.
- **422**: Unprocessable Entity (Validation failed).
- **429**: Too Many Requests (Rate limit).
- **500**: Internal Server Error (Something broke).
