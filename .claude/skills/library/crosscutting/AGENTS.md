# Crosscutting Skills - Category Guide

**Version 2.0.0**
Pulwave Engineering
2026-01-18

> **Note:**
> This is the crosscutting category compilation for AI agents and LLMs working on the Pulwave codebase.
> This document aggregates all 15 crosscutting skills that apply across all layers and domains.

## Abstract

Comprehensive crosscutting concerns guide for Pulwave. Contains 15 skills covering authentication, error handling, logging, monitoring, security, caching, i18n, feature flags, environment validation, code hygiene, debugging, API documentation, SEO, internal communications, and brand guidelines. These skills apply across frontend, backend, and infrastructure.

**Crosscutting Principles:**
- Apply consistently across all layers
- Centralized configuration and utilities
- Reusable patterns and abstractions
- Security-first mindset

---

## Table of Contents

1. [Security](#1-security) (CRITICAL) - XSS, CSRF, SQL injection
2. [Authentication](#2-authentication) (HIGH) - Supabase Auth, JWTs
3. [Error Handling](#3-error-handling) (HIGH) - Boundaries, logging
4. [Monitoring](#4-monitoring) (HIGH) - APM, error tracking
5. [Caching](#5-caching) (HIGH) - Browser, CDN, service worker
6. [Environment Validation](#6-environment-validation) (HIGH) - Zod env
7. [Logging](#7-logging) (MEDIUM) - Structured logging
8. [I18n](#8-i18n) (MEDIUM) - Internationalization
9. [Feature Flags](#9-feature-flags) (MEDIUM) - Toggles, rollouts
10. [Code Hygiene](#10-code-hygiene) (MEDIUM) - Linting, formatting
11. [Debugging](#11-debugging) (MEDIUM) - Tools, techniques
12. [API Docs](#12-api-docs) (LOW) - OpenAPI, Swagger
13. [SEO](#13-seo) (MEDIUM) - Meta tags, structured data
14. [Internal Comms](#14-internal-comms) (LOW) - Internal communication templates
15. [Brand Guidelines](#15-brand-guidelines) (LOW) - Brand consistency tools

---

## 1. Security

**Location**: [security/](security/)
**Quick Ref**: [SKILL.md](security/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q1 priority

**Impact**: CRITICAL

OWASP Top 10 prevention, XSS, CSRF, SQL injection, authentication security, data validation, secure headers.

### Key Patterns

- **Input validation** - Never trust user input
- **Output encoding** - Prevent XSS
- **Parameterized queries** - Prevent SQL injection
- **CSRF tokens** - Protect state-changing operations
- **Security headers** - CSP, X-Frame-Options, etc.

### When to Use

- Handling user input
- Rendering user content
- Database queries
- State-changing operations
- API authentication

### Security Examples

```typescript
// XSS Prevention
// BAD: Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// GOOD: Sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

// SQL Injection Prevention
// BAD: String concatenation
supabase.raw(`SELECT * FROM users WHERE id = '${userId}'`)

// GOOD: Parameterized query
supabase.from('users').select('*').eq('id', userId)

// CSRF Protection
// Use CSRF tokens for state-changing operations
const csrfToken = getCsrfToken();
await fetch('/api/update', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify(data),
});
```

---

## 2. Authentication

**Location**: [authentication/](authentication/)
**Quick Ref**: [SKILL.md](authentication/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q1 priority

**Impact**: HIGH

Supabase Auth patterns, JWT handling, session management, OAuth, passwordless auth, MFA.

### Key Patterns

- **Supabase Auth** - Built-in auth solution
- **JWT tokens** - Secure token handling
- **Session management** - Refresh tokens
- **OAuth providers** - Google, GitHub, etc.
- **Row Level Security** - Database-level authorization

### When to Use

- Implementing login/signup
- Protecting routes
- API authorization
- OAuth integration
- Session handling

### Authentication Examples

```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Protected route
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}
```

---

## 3. Error Handling

**Location**: [error-handling/](error-handling/)
**Quick Ref**: [SKILL.md](error-handling/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q1 priority

**Impact**: HIGH

Error boundaries, error logging, user-friendly error messages, retry strategies, error recovery.

### Key Patterns

- **Error boundaries** - Catch React errors
- **Structured logging** - Log with context
- **User-friendly messages** - Never show technical errors
- **Retry logic** - Automatic retry for transient failures
- **Error monitoring** - Sentry integration

### When to Use

- Handling exceptions
- Logging errors
- User error feedback
- Retry mechanisms
- Error monitoring

### Error Handling Examples

```typescript
// Error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// Structured error logging
logger.error('Failed to update profile', {
  userId,
  error: error.message,
  stack: error.stack,
  context: { profileData },
});

// User-friendly error messages
try {
  await updateProfile(data);
} catch (error) {
  if (error instanceof ValidationError) {
    toast.error('Please check your input and try again');
  } else if (error instanceof NetworkError) {
    toast.error('Connection issue. Please check your internet');
  } else {
    toast.error('Something went wrong. Please try again later');
  }
}
```

---

## 4. Monitoring

**Location**: [monitoring/](monitoring/)
**Quick Ref**: [SKILL.md](monitoring/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: HIGH

APM (Application Performance Monitoring), error tracking, performance metrics, user analytics, real-time monitoring.

### Key Patterns

- **Sentry** - Error tracking
- **PostHog** - User analytics
- **Web Vitals** - Performance metrics
- **Custom metrics** - Business KPIs

### When to Use

- Error tracking
- Performance monitoring
- User behavior analytics
- Business metrics

---

## 5. Caching

**Location**: [caching/](caching/)
**Quick Ref**: [SKILL.md](caching/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: HIGH

Browser caching, CDN caching, service worker caching, TanStack Query caching, cache invalidation.

### Key Patterns

- **TanStack Query** - Automatic data caching
- **Service Worker** - Offline caching
- **CDN caching** - Edge caching with Vercel
- **Cache invalidation** - Stale-while-revalidate

### When to Use

- Optimizing performance
- Offline support
- Reducing API calls
- Static asset caching

---

## 6. Environment Validation

**Location**: [env-validation/](env-validation/)
**Quick Ref**: [SKILL.md](env-validation/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q1 priority

**Impact**: HIGH

Zod schema validation for environment variables, type-safe env access, validation at startup.

### Key Patterns

- **Zod schemas** - Validate env vars
- **Type-safe access** - Autocomplete for env
- **Startup validation** - Fail fast
- **Required vs optional** - Clear declarations

### When to Use

- Setting up environment variables
- Accessing configuration
- Validating env in CI/CD

### Environment Validation Example

```typescript
// packages/internal-env/src/client.ts
import { z } from 'zod';

const clientEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_SENTRY_DSN: z.string().url().optional(),
});

export const clientEnv = clientEnvSchema.parse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
});

// Usage (type-safe)
import { clientEnv } from '@pulwave/internal-env';
const supabase = createClient(clientEnv.VITE_SUPABASE_URL, clientEnv.VITE_SUPABASE_ANON_KEY);
```

---

## 7. Logging

**Location**: [logging/](logging/)
**Quick Ref**: [SKILL.md](logging/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: MEDIUM

Structured logging, log levels, log aggregation, contextual logging, production logging.

### Key Patterns

- **Structured logs** - JSON format
- **Log levels** - debug, info, warn, error
- **Contextual data** - Include relevant context
- **Log aggregation** - Centralized logging

### When to Use

- Debugging issues
- Audit trails
- Performance analysis
- Error investigation

---

## 8. I18n

**Location**: [i18n/](i18n/)
**Quick Ref**: [SKILL.md](i18n/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: MEDIUM

Internationalization patterns, translation management, locale detection, RTL support, date/number formatting.

### Key Patterns

- **react-i18next** - Translation library
- **Locale detection** - Auto-detect user language
- **RTL support** - Right-to-left languages
- **Intl formatters** - Dates, numbers, currency

### When to Use

- Supporting multiple languages
- Date/number formatting
- RTL languages
- Translation management

---

## 9. Feature Flags

**Location**: [feature-flags/](feature-flags/)
**Quick Ref**: [SKILL.md](feature-flags/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q3 priority

**Impact**: MEDIUM

Feature toggles, gradual rollouts, A/B testing, canary releases, runtime configuration.

### Key Patterns

- **Feature toggles** - Enable/disable features
- **Gradual rollout** - 10% → 50% → 100%
- **A/B testing** - Test variants
- **Kill switch** - Emergency disable

### When to Use

- Rolling out new features
- A/B testing
- Emergency disables
- Beta features

---

## 10. Code Hygiene

**Location**: [code-hygiene/](code-hygiene/)
**Quick Ref**: [SKILL.md](code-hygiene/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q3 priority

**Impact**: MEDIUM

ESLint rules, Prettier formatting, Stylelint for CSS, commit conventions, code review checklist.

### Key Patterns

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Stylelint** - SCSS linting
- **Conventional commits** - Commit message format

### When to Use

- Code review
- Pre-commit hooks
- CI checks
- Code quality maintenance

---

## 11. Debugging

**Location**: [debugging/](debugging/)
**Quick Ref**: [SKILL.md](debugging/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q3 priority

**Impact**: MEDIUM

Debugging tools, techniques, Chrome DevTools, React DevTools, network debugging, performance profiling.

### Key Patterns

- **Chrome DevTools** - Browser debugging
- **React DevTools** - Component tree, profiler
- **Network tab** - API debugging
- **Performance profiling** - Find bottlenecks

### When to Use

- Debugging issues
- Performance analysis
- Network inspection
- State debugging

---

## 12. API Docs

**Location**: [api-docs/](api-docs/)
**Quick Ref**: [SKILL.md](api-docs/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q4 priority

**Impact**: LOW

OpenAPI specifications, Swagger UI, API documentation generation, versioning.

### Key Patterns

- **OpenAPI 3.0** - API specification
- **Swagger UI** - Interactive docs
- **Auto-generation** - Generate from code
- **Versioning** - Document versions

### When to Use

- Documenting APIs
- API client generation
- External API consumers

---

## 13. SEO

**Location**: [seo/](seo/)
**Quick Ref**: [SKILL.md](seo/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q3 priority

**Impact**: MEDIUM

Meta tags, Open Graph, structured data (JSON-LD), semantic HTML, sitemaps, robots.txt.

### Key Patterns

- **Meta tags** - Title, description, keywords
- **Open Graph** - Social media previews
- **JSON-LD** - Structured data
- **Semantic HTML** - Proper heading hierarchy

### When to Use

- Optimizing for search engines
- Social media sharing
- Improving discoverability

---

## 14. Internal Comms

**Location**: [internal-comms/](internal-comms/)
**Quick Ref**: [SKILL.md](internal-comms/SKILL.md)
**Provider**: Anthropic

**Impact**: LOW

Internal communication templates and tools for creating company newsletters, FAQ answers, and general communications. Streamlines internal documentation and messaging.

**See individual skill folder for full documentation and examples.**

---

## 15. Brand Guidelines

**Location**: [brand-guidelines/](brand-guidelines/)
**Quick Ref**: [SKILL.md](brand-guidelines/SKILL.md)
**Provider**: Anthropic

**Impact**: LOW

Brand consistency tools and guidelines for maintaining unified messaging, design language, and brand identity across all communication channels.

**See individual skill folder for full documentation and examples.**

---

## Coverage Status

| Skill | SKILL.md | AGENTS.md | Priority |
|-------|----------|-----------|----------|
| security | ✅ | ⚠️ Q1 | CRITICAL |
| authentication | ✅ | ⚠️ Q1 | HIGH |
| error-handling | ✅ | ⚠️ Q1 | HIGH |
| monitoring | ✅ | ⚠️ Q2 | HIGH |
| caching | ✅ | ⚠️ Q2 | HIGH |
| env-validation | ✅ | ⚠️ Q1 | HIGH |
| logging | ✅ | ⚠️ Q2 | MEDIUM |
| i18n | ✅ | ⚠️ Q2 | MEDIUM |
| feature-flags | ✅ | ⚠️ Q3 | MEDIUM |
| code-hygiene | ✅ | ⚠️ Q3 | MEDIUM |
| debugging | ✅ | ⚠️ Q3 | MEDIUM |
| api-docs | ✅ | ⚠️ Q4 | LOW |
| seo | ✅ | ⚠️ Q3 | MEDIUM |
| internal-comms | ✅ | ✅ | LOW |
| brand-guidelines | ✅ | ✅ | LOW |

**Current**: 2/15 skills with AGENTS.md (13%)
**Q1 Target**: 6/15 skills (40%)
**Q2 Target**: 10/15 skills (67%)

---

## Related Categories

- **Front-End** - [../front-end/AGENTS.md](../front-end/AGENTS.md) - Frontend patterns
- **Backend** - [../backend/AGENTS.md](../backend/AGENTS.md) - Backend patterns
- **DevOps** - [../dev-ops/AGENTS.md](../dev-ops/AGENTS.md) - Deployment, monitoring

---

## Further Reading

- [Pulwave Architecture Guide](../../../CLAUDE.md)
- [Master Skills Library](../AGENTS.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## Version History

### 2.0.0 (2026-01-18)
- Added: internal-comms skill (internal communication templates)
- Added: brand-guidelines skill (brand consistency tools)
- Total skills: 13 → 15
- Updated: Table of contents, coverage status
- Migration: Skills moved from `.claude/skills/anthropic/` to `.claude/skills/library/crosscutting/`

### 1.0.0 (2026-01-16)
- Initial version with 13 skills

---

**Last Updated**: 2026-01-18
**Version**: 2.0.0
**Total Skills**: 15
**With AGENTS.md**: 2
**Maintained By**: Pulwave Engineering
