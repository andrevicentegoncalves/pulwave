# @pulwave/eslint-config

ESLint configuration for the Pulwave monorepo with architecture boundary enforcement.

## Features

- ✅ **TypeScript Support** - Full TypeScript linting with recommended rules
- ✅ **React Support** - React-specific linting for JSX/TSX files
- ✅ **Architecture Boundaries** - Automatic enforcement of monorepo layer rules
- ✅ **Deep Import Prevention** - Blocks `../../../` relative imports
- ✅ **Layer Isolation** - Prevents upward dependencies in the architecture

## Installation

This package is already installed in the monorepo. For individual packages:

```bash
npm install -D @pulwave/eslint-config
```

## Usage

### For Node.js Packages

```js
// eslint.config.js
import { baseConfig } from '@pulwave/eslint-config';

export default baseConfig;
```

### For React Packages

```js
// eslint.config.js
import { reactConfig } from '@pulwave/eslint-config/react';

export default reactConfig;
```

### Custom Configuration

```js
// eslint.config.js
import { baseConfig, boundariesConfig } from '@pulwave/eslint-config';

export default [
    ...baseConfig,
    {
        // Your custom rules
        rules: {
            'no-console': 'warn',
        },
    },
];
```

## Architecture Boundaries

The ESLint boundaries plugin enforces the Pulwave monorepo architecture automatically.

### Layer Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│  APPS (apps/web/*)                                      │  ← Can import from all below
├─────────────────────────────────────────────────────────┤
│  EXPERIENCE (packages/experience/*)                     │  ← Can import features & below
├─────────────────────────────────────────────────────────┤
│  PAGES (packages/pages/*)                               │  ← Can import features & below
├─────────────────────────────────────────────────────────┤
│  FEATURES (packages/features/*)                         │  ← Can import widgets, ui, data
├─────────────────────────────────────────────────────────┤
│  WIDGETS (packages/widgets/)                            │  ← Can import patterns, ui
├─────────────────────────────────────────────────────────┤
│  PATTERNS (packages/patterns/)                          │  ← Can import ui
├─────────────────────────────────────────────────────────┤
│  UI (packages/shared/ui/)                               │  ← Can import foundation only
├─────────────────────────────────────────────────────────┤
│  DATA (packages/entities/)                              │  ← Can import foundation
├─────────────────────────────────────────────────────────┤
│  FOUNDATION (packages/shared/{hooks,utils,types}/)      │  ← Base layer (no imports)
└─────────────────────────────────────────────────────────┘
```

### Enforced Rules

#### ✅ Allowed (Downward Dependencies)

```typescript
// ✅ Features can import UI
import { Button } from '@pulwave/ui';

// ✅ UI can import foundation
import { useDebounce } from '@pulwave/hooks';

// ✅ Pages can import features
import { LoginForm } from '@pulwave/features-auth';
```

#### ❌ Blocked (Upward Dependencies)

```typescript
// ❌ UI cannot import features
import { LoginForm } from '@pulwave/features-auth';
// Error: Import from disallowed layer

// ❌ Foundation cannot import UI
import { Button } from '@pulwave/ui';
// Error: Import from disallowed layer

// ❌ Features cannot import from other features
import { AdminTable } from '@pulwave/features-admin';
// Error: Lateral imports not allowed
```

#### ❌ Blocked (Deep Relative Imports)

```typescript
// ❌ Deep relative imports
import { Button } from '../../../shared/ui/components/Button';
// Error: Use package alias instead

// ✅ Package alias (correct)
import { Button } from '@pulwave/ui';
```

### Ignored Files

The following patterns are ignored by boundaries:
- Test files: `**/*.test.{ts,tsx}`, `**/*.spec.{ts,tsx}`
- Test directories: `**/__tests__/**`, `**/__mocks__/**`
- Storybook: `**/*.stories.{ts,tsx}`

## Rules Reference

### boundaries/element-types

Enforces layer-based import restrictions.

**Severity**: `error`

**Examples**:
```typescript
// ❌ Error: UI importing from features
// File: packages/shared/ui/components/Button.tsx
import { useAuth } from '@pulwave/features-auth';
// boundaries/element-types: Import from 'features' is not allowed in 'ui' layer

// ✅ Correct
import { useDebounce } from '@pulwave/hooks';
```

### boundaries/no-private

Prevents deep relative imports (e.g., `../../../`).

**Severity**: `error`

**Examples**:
```typescript
// ❌ Error: Deep relative import
import { Button } from '../../../shared/ui/components/Button';
// boundaries/no-private: Use package alias instead of deep relative import

// ✅ Correct
import { Button } from '@pulwave/ui';
```

### boundaries/external

Prevents importing from package internals.

**Severity**: `error`

**Examples**:
```typescript
// ❌ Error: Importing package internals
import { helper } from '@pulwave/ui/internal/utils';
// boundaries/external: Cannot import package internals

// ✅ Correct: Use public exports
import { Button } from '@pulwave/ui';
```

## Troubleshooting

### "Cannot find module 'eslint-plugin-boundaries'"

Install the plugin:
```bash
npm install -D eslint-plugin-boundaries
```

### Boundaries not enforced

1. Ensure ESLint config is using the flat config format (not `.eslintrc`)
2. Verify boundaries config is included:
   ```js
   import { baseConfig } from '@pulwave/eslint-config';
   export default baseConfig; // boundaries included
   ```

### False positives

If you have a legitimate case that's being blocked:
1. Check if the import pattern is correct (should use `@pulwave/*` aliases)
2. If needed, add to ignored patterns in `boundaries.js`

## Testing Boundaries

To test if boundaries are working:

```bash
# Run ESLint on a specific package
npm run lint -w @pulwave/ui

# Run ESLint on all packages
npm run lint
```

Example violations you should see:
```
packages/shared/ui/components/Example.tsx
  5:1  error  Import from 'features' is not allowed in 'ui' layer  boundaries/element-types
  8:1  error  Use package alias instead of deep relative import   boundaries/no-private
```

## Migration Guide

### From Deep Imports to Package Aliases

**Before**:
```typescript
import { Button } from '../../../shared/ui/components/Button';
import { useAuth } from '../../../../entities/auth/hooks';
```

**After**:
```typescript
import { Button } from '@pulwave/ui';
import { useAuth } from '@pulwave/entity-auth';
```

### Finding Deep Imports

```bash
# Find all deep imports in your codebase
grep -r "from ['\"]\.\.\/\.\./\.\./" packages --include="*.ts" --include="*.tsx"
```

## Architecture Benefits

### Before Boundaries
- ❌ Circular dependencies possible
- ❌ UI components importing business logic
- ❌ Deep relative imports (`../../../`)
- ❌ Foundation packages importing from features
- ❌ Manual code reviews to catch violations

### After Boundaries
- ✅ Circular dependencies prevented
- ✅ Clean separation of concerns enforced
- ✅ Package aliases required (`@pulwave/*`)
- ✅ Layer hierarchy maintained
- ✅ **Automatic enforcement via ESLint**

## Related Documentation

- [CLAUDE.md](../../../../.claude/CLAUDE.md) - Full architecture guide
- [ARCHITECTURE-STRUCTURE-PLAN.md](../../../../.claude/ARCHITECTURE-STRUCTURE-PLAN.md) - Implementation plan (Round 24)
- [Pulwave Library Skills](../../../../.claude/skills/) - Coding patterns

## Package Configuration

This package includes:
- `index.js` - Base config for Node.js
- `react.js` - React config with JSX support
- `boundaries.js` - Architecture boundaries rules
- `package.json` - Package dependencies

## Version

Current version: `1.0.0`

## License

MIT
