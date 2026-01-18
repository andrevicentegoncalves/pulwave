# Quick Monorepo Audit Prompt

> Copy everything below the line and paste to any AI assistant

---

## COPY FROM HERE

```markdown
# Monorepo Structure Audit Request

Audit this monorepo's folder structure against industry best practices. Compare against these top open-source SaaS monorepos:

**Benchmarks:**
- Cal.com (github.com/calcom/cal.com)
- Supabase (github.com/supabase/supabase)
- Plane (github.com/makeplane/plane)
- Documenso (github.com/documenso/documenso)
- Dub (github.com/dubinc/dub)
- Trigger.dev (github.com/triggerdotdev/trigger.dev)
- Turborepo examples (github.com/vercel/turbo/examples)

## Steps

### 1. Discover
- List all root-level files and directories
- Find all package.json files and map the package graph
- Locate all config files (tsconfig, eslint, prettier, vite, etc.)
- Document all hidden directories (.github, .husky, etc.)
- Find all scripts locations

### 2. Check for Red Flags
- **Config sprawl**: Same config duplicated across packages
- **Circular deps**: Packages importing each other
- **Layer violations**: Lower layers importing higher layers
- **God packages**: Package with 50+ exports
- **Root pollution**: 30+ items at repo root
- **Orphaned files**: Files imported nowhere
- **Missing package.json**: Directories that look like packages but aren't
- **Generic names**: folders named `utils`, `helpers`, `common`, `shared`
- **Inconsistent naming**: mixing `kebab-case` and `PascalCase` folders

### 3. Expected Structure

```
monorepo/
├── .github/                  # CI/CD, templates
├── apps/                     # Deployable apps
│   ├── web/
│   └── api/
├── packages/                 # Shared libraries
│   ├── ui/                   # Components
│   ├── config/               # Shared configs
│   └── lib/                  # Utilities
├── scripts/                  # Build scripts
├── package.json
├── turbo.json
├── tsconfig.json
└── README.md
```

### 4. Generate Report

Output a report with:

| Severity | Location | Issue | Fix |
|----------|----------|-------|-----|
| CRITICAL | path/to/file | What's wrong | How to fix |
| HIGH | | | |
| MEDIUM | | | |
| LOW | | | |

### 5. Migration Plan

Provide phased migration:
- Phase 1: Quick wins (< 1 hour)
- Phase 2: Structural fixes (1-2 days)
- Phase 3: Major refactoring (if needed)

## Constraints
- Be thorough - explore before judging
- Be specific - give exact paths
- Be actionable - every finding needs a fix
- Be realistic - consider migration cost vs benefit
```

---

## Variations

### Minimal Version (5-min audit)

```markdown
Audit this monorepo structure. Find:
1. Files/folders that shouldn't be at root level
2. Config files that should be centralized
3. Packages that violate layer boundaries
4. Obvious naming inconsistencies

Compare against Cal.com and Turborepo examples.
Output a prioritized list of issues with fixes.
```

### Focus: Config Files Only

```markdown
Audit the configuration file organization in this monorepo:
1. Find ALL config files (tsconfig, eslint, prettier, vite, etc.)
2. Identify which are duplicated vs. properly extending a base
3. Check if there's a central tooling/config package
4. Recommend consolidation strategy

Output: Table of config files with recommendations.
```

### Focus: Package Boundaries Only

```markdown
Audit the package boundaries in this monorepo:
1. Map all internal package dependencies
2. Find any circular dependencies
3. Check for layer violations (UI importing data, etc.)
4. Identify "god packages" with too many responsibilities

Output: Dependency graph + list of violations.
```

### Focus: Dead Code Hunt

```markdown
Find potentially orphaned or dead code:
1. Files that aren't imported anywhere
2. Exports that aren't used externally
3. Packages with no dependents
4. Directories that look abandoned

Output: List of candidates for deletion with confidence level.
```
