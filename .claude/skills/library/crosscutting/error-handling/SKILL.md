---
name: error-handling-expert
description: Senior Software Engineer specializing in robust error handling patterns, custom exceptions, and global error boundaries.
version: 1.0.0
tags: [Error Handling, Reliability, Exceptions, UX]
---

# Error Handling Architecture

Expertise in building resilient systems that handle failures gracefully and provide actionable feedback.

## Expertise
- **Global Error Handling**: Implementing centralized catch-all logic for APIs and UIs.
- **Custom Exceptions**: Designing a hierarchy of domain-specific error types.
- **Result Pattern**: Using `Result` or `Either` types instead of throwing for predictable logic.
- **Circuit Breakers**: Protecting systems from cascading failures during dependency outages.
- **UX Feedback**: Mapping technical errors to clear, non-scary user notifications.

## Workflow
1. **Map Failures**: Identify potential points of failure (Network, DB, Auth).
2. **Standardize Responses**: define a consistent JSON error format.
3. **Implement Boundaries**: add React Error Boundaries or Middleware Try-Catch.
4. **Log & notify**: Ensure errors are logged with full context (stack trace, request ID).
5. **Refine**: regularly review error logs to identify and fix frequent failure points.

## Scoring (0-10)
- **10**: Zero "silent" failures, predictable error responses, circuit breakers active, high resilience.
- **7**: Standard try-catch blocks, centralized logging, consistent error messages.
- **3**: Fragmented error handling, generic "Something went wrong" without context.
- **0**: No error handling, unhandled exceptions crashing the process.

## Full Compiled Guide

For complete implementation guidance with 40+ error handling patterns and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **Error Handling Fundamentals** (CRITICAL) - Error types, error vs exception, error propagation, error recovery, silent failures
- **Custom Error Classes** (CRITICAL) - Base error class, domain-specific errors, error metadata, error serialization, error hierarchy
- **Frontend Error Handling** (CRITICAL) - Error boundaries, async error handling, TanStack Query errors, form errors, network errors
- **Backend Error Handling** (CRITICAL) - Express error middleware, async handler wrapper, database errors, third-party API errors, validation errors
- **Result Pattern** (HIGH) - Result type, railway-oriented programming, Result vs exceptions, Result utilities, async Result
- **Error Logging** (CRITICAL) - Structured logging, log levels, context enrichment, request tracing, error aggregation
- **Error Monitoring** (HIGH) - Sentry integration, error reporting, error grouping, source maps, user feedback
- **User-Facing Errors** (CRITICAL) - Error messages, toast notifications, inline errors, empty states, error recovery UI
- **Resilience Patterns** (HIGH) - Retry logic, circuit breaker, timeout, fallback, bulkhead
- **Testing Error Handling** (HIGH) - Testing error paths, mocking errors, error boundary testing, network error simulation, error recovery testing
- Plus complete HTTP error code mapping, error message guidelines, error handling checklist, and common error patterns

**Category Guide**: [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Complete crosscutting category with all patterns and examples
