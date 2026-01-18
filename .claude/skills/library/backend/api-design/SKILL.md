---
name: api-design
description: Standards for designing robust, scalable, and intuitive APIs. Covers RESTful conventions, status codes, and GraphQL best practices.
version: 1.0.0
tags: [Backend, API, REST, GraphQL, Design]
---

# API Design

Creating interfaces that developers love to use.

## When to Use

- Designing a new endpoint
- Refactoring legacy controllers
- Choosing between REST and GraphQL
- Documenting API contracts (Swagger/OpenAPI)

## Quick Reference

### REST Best Practices
1. **Resources as Nouns**: `/users`, `/products` (Not `/getUsers`)
2. **HTTP Methods**:
   - `GET`: Read (Safe, Cacheable)
   - `POST`: Create (Non-idempotent)
   - `PUT`: Replace (Idempotent)
   - `PATCH`: Update partial (Idempotent)
   - `DELETE`: Remove (Idempotent)
3. **Plural Naming**: `/items` instead of `/item`
4. **Nesting**: `/users/{id}/posts` (Keep strict hierarchy shallow)

### Common Status Codes
- **200 OK**: Success
- **201 Created**: Resource created (POST)
- **204 No Content**: Success but empty body (DELETE)
- **400 Bad Request**: Validation error
- **401 Unauthorized**: No token / Invalid token
- **403 Forbidden**: Valid token, but not allowed
- **404 Not Found**: Resource doesn't exist
- **429 Too Many Requests**: Rate limit hit
- **500 Internal Server Error**: Bug in server

## Full Compiled Guide

For complete implementation guidance with 45+ API design patterns and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **REST API Design** (CRITICAL) - Resource naming, HTTP methods, URL structure, status codes, idempotency
- **Request/Response Design** (CRITICAL) - Request validation with Zod, response format, error responses, pagination (cursor & offset), filtering and sorting
- **GraphQL Design** (HIGH) - Schema design, queries, mutations, N+1 problem (DataLoader), security (depth limiting)
- **API Versioning** (CRITICAL) - Versioning strategies (URL/header), breaking changes, deprecation policy, version communication, migration path
- **Error Handling** (CRITICAL) - Error response format with codes, validation errors, HTTP status codes, error messages, error logging
- **Security** (CRITICAL) - Authentication (JWT, Supabase), authorization (ownership, RBAC), input validation, rate limiting, CORS
- **Documentation** (HIGH) - OpenAPI/Swagger, request/response examples, authentication documentation, error documentation, changelog
- **Performance** (HIGH) - Caching (HTTP headers, Redis), compression, payload size, query optimization, rate limiting
- **Testing** (HIGH) - Contract testing (OpenAPI validation), integration testing, performance testing (k6), security testing, documentation testing
- **Common Patterns** (MEDIUM) - HATEOAS, batch operations, webhooks, long-running operations, file uploads
- Plus complete HTTP status codes reference, REST vs GraphQL decision matrix, API design checklist, and OpenAPI specification template

**Category Guide**: [../backend/AGENTS.md](../backend/AGENTS.md) - Complete backend category with all patterns and examples

## Additional Resources

### REST Patterns
Guilde in `references/rest.md`:
- Naming conventions
- Pagination (Cursor vs Offset)
- Filtering and Sorting
- Error response format

### GraphQL Patterns
Guide in `references/graphql.md`:
- Schema design
- N+1 problem solution (DataLoaders)
- Mutation design
- Security (Depth limiting)

## Key Metrics

- **TTFB (Time To First Byte)**: < 200ms
- **Payload Size**: Keep < 100KB (Gzip enabled)
- **Availability**: 99.9% uptime

## Tools

- **Postman**: Testing and documentation
- **Swagger/OpenAPI**: Contract definition
- **GraphiQL**: GraphQL IDE
- **Zod/Joi**: Input validation libraries
