# ADR-007: Tooling & Internal Packages

**Status:** Accepted
**Date:** 2026-01-14
**Deciders:** Architecture Team
**Technical Story:** Developer experience improvements and monorepo best practices

---

## Context and Problem Statement

As the monorepo grows, shared configurations (TypeScript, ESLint, Prettier) were duplicated across packages. Additionally, environment variable validation was missing, leading to runtime errors when config was misconfigured. Should we centralize tooling configs and add type-safe environment handling?

## Decision Drivers

- Duplicated tsconfig.json files across 20+ packages
- No centralized ESLint/Prettier configurations
- Environment variables accessed without validation
- Top monorepos (Cal.com, Midday, Documenso) use this pattern
- Need to distinguish "internal only" vs "potentially publishable" packages

## Considered Options

1. **Create tooling/ and internal/ package categories**
2. Keep configurations in each package
3. Use root-level configs only

## Decision Outcome

**Chosen option:** "Create tooling/ and internal/ package categories"

### New Packages Created

**Tooling packages** (`packages/tooling/`):
- `@pulwave/tooling-typescript` - Base TypeScript configurations
- `@pulwave/tooling-eslint` - Shared ESLint rules
- `@pulwave/tooling-prettier` - Prettier configuration

**Internal packages** (`packages/internal/`):
- `@pulwave/internal-env` - Zod-based environment validation

### Rationale

**Tooling Packages**:
- Single source of truth for compiler/linter settings
- Easy to update across all packages at once
- Reduces package.json noise in consuming packages
- Standard pattern in enterprise monorepos

**Internal Packages**:
- Clear distinction from publishable packages
- Environment validation catches errors at startup
- Type-safe `import { clientEnv } from '@pulwave/internal-env'`
- Prevents `undefined` runtime errors

### Positive Consequences

- Single TypeScript base config extended by all packages
- Environment validation with clear error messages
- Reduced duplication across package.json files
- Better IDE support with consistent settings
- Runtime safety for environment variables

### Negative Consequences

- Additional packages to maintain
- Slightly more complex package resolution
- Developers need to understand the distinction

## Implementation Details

### Tooling Structure

```
packages/tooling/
├── typescript/
│   ├── package.json       # @pulwave/tooling-typescript
│   ├── base.json          # Base config (ES2022, strict)
│   ├── react.json         # React preset (extends base)
│   └── node.json          # Node.js preset (extends base)
├── eslint/
│   ├── package.json       # @pulwave/tooling-eslint
│   ├── index.js           # Base ESLint config
│   └── react.js           # React-specific rules
└── prettier/
    ├── package.json       # @pulwave/tooling-prettier
    └── index.js           # Prettier configuration
```

### Internal Structure

```
packages/internal/
└── env/
    ├── package.json       # @pulwave/internal-env
    ├── index.ts           # Main export
    └── src/
        ├── schema.ts      # Zod schemas
        ├── client.ts      # Browser env (VITE_*)
        └── server.ts      # Server env (DB_*, API_*)
```

### Usage Examples

**TypeScript extending base:**
```json
{
  "extends": "@pulwave/tooling-typescript/react.json",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

**Environment validation:**
```typescript
import { clientEnv } from '@pulwave/internal-env';

// Type-safe, validated at startup
const supabase = createClient(
  clientEnv.VITE_SUPABASE_URL,
  clientEnv.VITE_SUPABASE_ANON_KEY
);
```

### Workspace Configuration

```json
{
  "workspaces": [
    "packages/tooling/*",
    "packages/internal/*",
    "packages/foundation",
    "packages/data",
    ...
  ]
}
```

## Verification

- `packages/tooling/typescript/` - Base configs created
- `packages/tooling/eslint/` - ESLint configs created
- `packages/tooling/prettier/` - Prettier config created
- `packages/internal/env/` - Zod validation working
- `packages/data/providers/supabase/client.ts` - Using env validation

## Alternatives Considered

### Option 2: Keep Configurations in Each Package

**Pros**: No additional packages, simple structure
**Cons**: Duplication, drift between packages, harder to update

**Rejected because**: Maintenance burden increases with scale

### Option 3: Root-Level Configs Only

**Pros**: Centralized, no package overhead
**Cons**: Can't version independently, harder to extend per-package

**Rejected because**: Less flexible for different package types

## Links

- [Cal.com tooling packages](https://github.com/calcom/cal.com/tree/main/packages/config)
- [Midday internal packages](https://github.com/midday-ai/midday/tree/main/packages/env)
- [ADR-006: Package Reorganization](./006-package-reorganization.md)

---

**Tags:** tooling, internal, developer-experience, typescript, eslint, environment
**Related ADRs:** ADR-006
