# Pulwave Monorepo

A modern, scalable multi-vertical platform built with React 19, Vite 7, Turborepo, and Supabase.

## Architecture

This project follows an **Atomic Modular Monorepo** architecture with strict separation of concerns and database agnosticism.

For a detailed technical breakdown, see our [**Comprehensive Architecture Guide**](./docs/ARCHITECTURE.md).

### Package Layers

| Layer | Package | Description |
|-------|---------|-------------|
| **Apps** | `apps/web/*` | Thin orchestration shells (real-estate, restaurant) |
| **Pages** | `packages/pages/*` | Page assembly and routing |
| **Features** | `packages/features/*` | Domain logic and UI |
| **Widgets** | `packages/widgets/` | Reusable layout compositions |
| **Shared** | `packages/shared/*` | UI components, hooks, tokens, utilities |
| **Entities** | `packages/entities/` | Provider-agnostic data layer (9 domains) |
| **Integrations** | `packages/integrations/*` | External service integrations (MCP, etc.) |
| **Internal** | `packages/internal/*` | Internal-only packages (env validation) |

## Key Features

- **Provider-Agnostic Data Layer**: `@pulwave/entities` implements hexagonal architecture with Supabase
- **Type-Safe Environment**: Zod validation via `@pulwave/internal-env`
- **110+ UI Components**: Core components + data visualization (charts, maps)
- **149+ Test Directories**: Comprehensive test coverage in data layer
- **CI/CD Pipeline**: GitHub Actions with typecheck, lint, build, bundle size checks
- **Pre-commit Hooks**: Husky + lint-staged for code quality

## Development

```bash
# Install dependencies
npm install

# Run all apps in dev mode
npm run dev

# Run specific app
npm run dev -w apps/web/real-estate

# Type check all packages
npm run typecheck

# Lint all packages
npm run lint

# Run tests
npm run test

# Check circular dependencies
npm run check:circular

# Check bundle size
npm run size
```

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Run all apps in development mode |
| `build` | Build all packages |
| `typecheck` | TypeScript type checking |
| `lint` | ESLint + Stylelint |
| `test` | Run all tests |
| `check:circular` | Detect circular dependencies |
| `check:architecture` | Validate package boundaries |
| `gen:types` | Generate Supabase types |
| `create:package` | Scaffold new package |

## Tech Stack

- **Runtime**: React 19, React Router 7
- **Build**: Vite 7, Turborepo 2.7
- **Styling**: SCSS with BEM + CSS custom properties
- **State**: TanStack Query 5, Zod 3
- **Database**: Supabase (abstracted)
- **Testing**: Vitest, Playwright
- **Quality**: ESLint 9, Prettier, Husky

---
© 2026 Pulwave. All rights reserved.
