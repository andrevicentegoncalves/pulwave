---
name: project-structure
description: Standards for folder structure, monorepo architecture, and code organization with atomic modular patterns.
version: 1.0.0
tags: [Architecture, Turborepo, Monorepo, Folder Structure, Atomic Design, Nx]
---

# Project Structure & Monorepo Architecture

Rules for organizing code, managing monorepos, and enforcing modular boundaries.

## When to Use

- Setting up a new repository
- Refactoring loose files
- Adding a new package to the monorepo
- Deciding where to put a new component or utility
- Enforcing architectural boundaries
- Optimizing CI/CD build times

## Quick Reference

### Monorepo Structure (Turborepo)
```
/apps            # Runnable applications (Next.js, Express)
  /web           # Main web app
  /docs          # Documentation site
/packages        # Shared libraries
  /ui            # UI Component library
  /config        # Shared configs (ESLint, TSConfig)
  /utils         # Shared helper functions
/tools           # Build tooling & scripts
```

### Feature Folder Pattern (Atomic-ish)
Keep related things together.
```
/feature-name
  /components    # UI specific to this feature
  /hooks         # Logic specific to this feature
  /utils         # Helpers specific to this feature
  /types.ts      # Types
  index.ts       # Public API
```

## Full Compiled Guide

For complete implementation guidance with 30+ architecture rules and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **Layer Architecture** (CRITICAL) - 7-layer system with dependency rules
- **Package Organization** (HIGH) - Naming, structure, barrel exports
- **Code Placement Rules** (HIGH) - Where to put components, hooks, utilities
- **Dependency Management** (CRITICAL) - Workspace protocol, circular dependency prevention
- **Turborepo Patterns** (MEDIUM) - Task pipeline and caching
- **Import Rules** (HIGH) - Import order and path aliases
- **Architectural Boundaries** (CRITICAL) - Enforcement with ESLint

**Category Guide**: [../architecture/AGENTS.md](../architecture/AGENTS.md) - All architecture skills compilation

## Additional Resources

### Monorepo Management
Guide in `references/monorepo.md`:
- Turborepo configuration
- Workspace dependency management
- Sharing code between apps
- Release workflow (Changesets)

### Folder Conventions
Guide in `references/folder-conventions.md`:
- Atomic Layout (Atoms, Molecules...) vs Feature-based
- Barrel files (index.ts) usage rules
- Naming conventions (PascalCase vs kebab-case)

### Monorepo Structure Audit
Guide in `references/monorepo-audit.md`:
- Comprehensive audit prompt for folder structure
- Benchmark against top 20 SaaS monorepos
- Red flags and anti-patterns to identify
- Migration plan templates
- Severity-based finding classification

### Atomic Monorepo Audit (Step-by-Step)
Guide in `references/atomic-monorepo-audit.md`:
- 12-phase interactive audit process
- Execute one phase at a time, wait for instructions
- Phase deliverable templates included
- Covers: Root inventory, package discovery, dependency graph, config audit, hidden files, scripts, documentation, naming, layer violations, benchmarking, dead code, final report

### Quick Audit Prompts
Guide in `references/audit-prompt-quick.md`:
- Copy-paste ready prompts for quick audits
- Minimal version (5-min audit)
- Focused variants: config-only, boundaries-only, dead-code-only

## Key Rules

1. **No Circular Dependencies**: Packages cannot depend on each other cyclically.
2. **One Direction**: Apps depend on Packages. Packages depend on Packages.
3. **Colocation**: Put tests, styles, and utils next to the code that uses them.
4. **Explicit Exports**: Use `index.ts` to define what is public.

## Tools

- **Turborepo**: Build system / orchestrator.
- **Nx**: Alternative build system with more features.
- **pnpm**: Package manager (fast, disk space efficient).
- **Changesets**: Versioning and changelog generation.
- **Manypkg**: Monorepo dependency checking.
- **eslint-plugin-import**: Enforce module boundaries.

## Scoring (0-10)

- **10**: Fully atomic, sub-second build caching, 0 circular dependencies, enforced boundaries.
- **7**: Basic monorepo setup, some shared packages, manual dependency management.
- **3**: Pseudo-monorepo (nested folders but no orchestration), heavy coupling.
- **0**: Monolithic mess with duplicate code and dependency hell.
