---
name: code-hygiene
description: Standards for maintaining a clean, efficient codebase. Covers dead code elimination, dependency auditing, and code quality automation.
version: 1.0.0
tags: [Code Quality, Hygiene, Dependencies, Dead Code]
---

# Code Hygiene & Quality

Keeping the garden clean.

## When to Use

- Performing a library-wide dependency upgrade
- Hunting for unused components/functions
- Setting up linting/formatting rules
- Reducing technical debt

## Quick Reference

### Dead Code Elimination
- **Tree Shaking**: Automatic removal of unused exports (Webpack/Vite).
- **Manual Audit**: If it's not tested and not imported, delete it.
- **Rule**: "Deleted code is the fastest code."

### Dependency Audit
- **Direct vs Transitive**: Know what your libraries depend on.
- **Security**: Run `npm audit` or `pnpm audit`.
- **Bloat**: Check `bundlephobia.com` before adding a new package.

## Full Compiled Guide

**Category Guide**: [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Complete crosscutting category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

### Hygiene Patterns
Guide in `references/hygiene.md`:
- Removing dead code (patterns to find it)
- Dependency versioning (Semantic Versioning)
- Ghost dependencies

### Automation
Guide in `references/automation.md`:
- Linter configurations (ESLint/Prettier)
- Pre-commit hooks (Husky)
- Automated dependency PRs (Renovate)

## Key Metrics

- **Bundle Size**: Total JS weight.
- **Vulnerability Count**: Unfixed security issues.
- **Type Coverage**: % of code with strict types.

## Tools

- **Knip**: Find unused files, dependencies, and exports.
- **Depcheck**: Check for unused dependencies.
- **Renovate / Dependabot**: Auto-updates.
- **Husky + Lint-staged**: Git Hooks.
