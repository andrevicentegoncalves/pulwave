---
name: env-validation
description: Type-safe environment variable validation using Zod with client/server separation.
version: 1.0.0
tags: [Environment, Validation, Zod, TypeScript, Security]
---

# Environment Validation

Type-safe environment variable validation with Zod and client/server separation.

## When to Use

- Validate env vars at build/runtime
- Separate client (browser-safe) from server (secrets)
- Catch configuration errors early
- Type-safe env access

## Quick Reference

### Schema Definition
```typescript
import { z } from 'zod';

export const clientEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().min(1),
  VITE_SUPABASE_ANON_KEY: z.string().min(100),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_SKIP_ONBOARDING: z.string().transform(v => v === 'true').default('false'),
});

export const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
});
```

### Usage
```typescript
import { clientEnv, isProduction } from '@pulwave/internal-env';

const client = createClient(
  clientEnv.VITE_SUPABASE_URL,
  clientEnv.VITE_SUPABASE_ANON_KEY
);
```

## Key Rules

| Rule | Why |
|------|-----|
| `VITE_` prefix for client | Vite exposes these to browser |
| No prefix for server | Never in client bundle |
| Validate at startup | Fail fast on bad config |
| Type inference | `z.infer<typeof schema>` |

## Workflow

1. **Define Schema**: Zod schema per environment
2. **Parse on Import**: Validate immediately
3. **Export Typed**: Expose typed `clientEnv`/`serverEnv`
4. **Fail Early**: Throw in development, log in production

## Scoring (0-10)

- **10**: Full Zod validation, client/server split, helpful errors
- **7**: Basic validation, some type safety
- **3**: Manual `process.env` access, no validation
- **0**: Hardcoded values, no env usage

## Full Compiled Guide

**Category Guide**: [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Complete crosscutting category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

- `references/schemas.md` - Zod schema patterns
- `references/client-server.md` - Client vs server split
