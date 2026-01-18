# Monorepo Structure Audit Prompt

Use this prompt to have an AI thoroughly audit a monorepo's folder structure against industry best practices.

---

## The Prompt

```markdown
# Monorepo Folder Structure Audit

You are a senior software architect specializing in monorepo design. Your task is to audit the folder structure of this codebase and identify any files, folders, or organizational patterns that are out of place, redundant, or violate modern monorepo conventions.

## Phase 1: Discovery

First, thoroughly explore the codebase structure:

1. **Root-level inventory**: List all top-level files and directories
2. **Package structure**: Map all packages/apps and their purposes
3. **Config files**: Identify all configuration files and their locations
4. **Hidden directories**: Document all dot-folders and their purposes
5. **Scripts location**: Find where build/utility scripts live
6. **Documentation**: Locate all documentation files

## Phase 2: Benchmark Comparison

Compare against these industry-leading monorepos:

### Tier 1: Build Tool References
- **Turborepo** (vercel/turborepo): The gold standard for JS/TS monorepos
- **Nx** (nrwl/nx): Enterprise-grade monorepo tooling
- **Lerna** (lerna/lerna): Original JS monorepo tool

### Tier 2: Production SaaS Monorepos
- **Vercel** (vercel/vercel): Next.js creators
- **Cal.com** (calcom/cal.com): Open-source scheduling
- **Supabase** (supabase/supabase): Firebase alternative
- **Plane** (makeplane/plane): Open-source Jira alternative
- **Infisical** (Infisical/infisical): Secret management
- **Documenso** (documenso/documenso): Open-source DocuSign
- **Formbricks** (formbricks/formbricks): Survey platform
- **Dub** (dubinc/dub): Link management
- **Trigger.dev** (triggerdotdev/trigger.dev): Background jobs

### Tier 3: Enterprise Patterns
- **Shopify Hydrogen** (Shopify/hydrogen)
- **Stripe CLI** (stripe/stripe-cli)
- **Linear** (linear/linear - private but documented patterns)

## Phase 3: Standard Structure Expectations

### Root Level
```
monorepo/
├── .github/                    # GitHub Actions, templates
├── .husky/                     # Git hooks
├── .vscode/                    # Editor config (team-shared)
├── apps/                       # Deployable applications
├── packages/                   # Shared libraries
├── docs/                       # Documentation
├── scripts/                    # Build/utility scripts
├── tooling/                    # Shared configs (eslint, ts, prettier)
├── .env.example                # Environment template
├── .gitignore
├── .npmrc / .pnpmrc            # Package manager config
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # Workspace definition (if pnpm)
├── turbo.json                  # Turborepo config (if using)
├── tsconfig.json               # Root TypeScript config
└── README.md
```

### Apps Structure
```
apps/
├── web/                        # Main web application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── api/                        # Backend API (if separate)
├── mobile/                     # React Native / Expo
├── docs/                       # Documentation site
└── admin/                      # Admin dashboard
```

### Packages Structure
```
packages/
├── ui/                         # Shared UI components
├── config/                     # Shared configs
│   ├── eslint/
│   ├── typescript/
│   └── tailwind/
├── database/                   # DB client, schemas, migrations
├── lib/                        # Shared utilities
├── types/                      # Shared TypeScript types
├── analytics/                  # Analytics abstraction
├── auth/                       # Auth utilities
└── emails/                     # Email templates (React Email)
```

## Phase 4: Red Flags to Identify

### Critical Issues
1. **Config file sprawl**: ESLint/TS configs duplicated across packages instead of extending base
2. **God packages**: Single package doing too much (>20 exports = split candidate)
3. **Circular dependencies**: Packages importing each other
4. **Layer violations**: Lower layers importing higher layers
5. **Orphaned files**: Files not imported anywhere
6. **Root pollution**: Too many files at monorepo root
7. **Missing barrel files**: Packages without clear entry points
8. **Inconsistent naming**: Mixed conventions (kebab-case vs camelCase folders)

### Structural Smells
1. **Flat package structure**: No logical grouping (all packages at same level)
2. **Mixed concerns**: Business logic in UI package
3. **No tooling package**: Shared configs scattered or duplicated
4. **Scripts in wrong places**: Build scripts inside app folders
5. **Test files misplaced**: Tests not colocated with source
6. **Assets in wrong package**: Static assets in library packages
7. **Environment files committed**: .env files (not .example) in git

### Naming Issues
1. **Generic names**: `utils/`, `helpers/`, `common/` (too vague)
2. **Inconsistent prefixes**: Some packages `@org/pkg`, others plain names
3. **Plural/singular mixing**: `component/` vs `hooks/`

## Phase 5: Audit Report Template

Generate a report with this structure:

### 1. Executive Summary
- Overall health score (A-F)
- Top 3 issues to fix immediately
- Estimated effort to remediate

### 2. Current Structure Map
- Visual tree of current structure
- Package dependency graph

### 3. Findings by Severity

#### CRITICAL (Fix Immediately)
| Location | Issue | Recommendation |
|----------|-------|----------------|
| path/to/issue | Description | How to fix |

#### HIGH (Fix Soon)
| Location | Issue | Recommendation |
|----------|-------|----------------|

#### MEDIUM (Technical Debt)
| Location | Issue | Recommendation |
|----------|-------|----------------|

#### LOW (Nice to Have)
| Location | Issue | Recommendation |
|----------|-------|----------------|

### 4. Migration Plan
For each critical/high issue:
1. Steps to fix
2. Files to move/rename
3. Imports to update
4. Testing required

### 5. Target Structure
Proposed ideal folder structure for this specific codebase.

### 6. Appendix: Reference Patterns
Links to similar patterns in reference monorepos.

## Phase 6: Specific Checks

Run these specific validations:

### Package.json Checks
- [ ] All packages have consistent `name` field format
- [ ] `main`, `types`, and `exports` fields defined
- [ ] No relative path dependencies (use `workspace:*`)
- [ ] Version field present

### TypeScript Checks
- [ ] All tsconfig.json extend a base config
- [ ] Path aliases consistent across packages
- [ ] `composite` and `references` used for project references

### Build Tool Checks
- [ ] turbo.json defines all tasks
- [ ] Pipeline dependencies correct (`^build` pattern)
- [ ] Outputs and inputs specified for caching

### CI/CD Checks
- [ ] GitHub Actions in `.github/workflows/`
- [ ] Reusable workflows used where possible
- [ ] Matrix builds for packages

### Documentation Checks
- [ ] README at monorepo root
- [ ] README in each package
- [ ] CONTRIBUTING.md at root
- [ ] Architecture decision records (ADRs) location

## Execution Instructions

1. Start with Phase 1: Explore thoroughly before judging
2. Use file search to find all files matching patterns
3. Check package.json in each package
4. Look for imports between packages
5. Identify the dependency graph
6. Compare against benchmarks
7. Generate comprehensive report
8. Propose specific, actionable fixes

BE THOROUGH. Missing a structural issue now means technical debt later.
```

---

## Quick Checklist Version

For a faster audit, use this condensed checklist:

### Root Level
- [ ] No source code at root
- [ ] Config files minimal (extend from tooling/)
- [ ] Only essential dotfiles
- [ ] README.md present

### Apps
- [ ] Each app is independently deployable
- [ ] Apps don't import from each other
- [ ] Minimal business logic (use packages)

### Packages
- [ ] Clear single responsibility
- [ ] Proper package.json with exports
- [ ] tsconfig extends base
- [ ] README documenting usage

### Dependencies
- [ ] No circular deps
- [ ] Layer violations: NONE
- [ ] Peer deps for shared libraries

### Naming
- [ ] Consistent case (kebab-case recommended)
- [ ] Scoped packages (@org/name)
- [ ] Descriptive, not generic

---

## Common Monorepo Anti-Patterns

| Anti-Pattern | Why It's Bad | Fix |
|--------------|--------------|-----|
| Everything in `/src` | No reuse, poor caching | Split into packages |
| `/shared` folder | Becomes dumping ground | Create specific packages |
| Configs everywhere | Drift, inconsistency | Centralize in `/tooling` |
| Giant `/lib` | God package | Split by domain |
| `/common` | Too vague | Name by function |
| Nested monorepos | Complexity explosion | Flatten structure |
| `/core` in every package | Overused pattern | Only where truly shared |
