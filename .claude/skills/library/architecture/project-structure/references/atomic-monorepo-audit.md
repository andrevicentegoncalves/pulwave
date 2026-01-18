# Atomic Monorepo Structure Audit

> **Execution Model**: This audit is divided into 12 atomic phases. Execute ONE phase at a time and STOP. Wait for user instructions before proceeding to the next phase. Each phase produces a specific deliverable.

---

## Audit Overview

| Phase | Name | Focus | Deliverable |
|-------|------|-------|-------------|
| 1 | Root Inventory | Root-level files/folders | Inventory table |
| 2 | Package Discovery | All packages/apps | Package map |
| 3 | Dependency Graph | Internal dependencies | Dependency matrix |
| 4 | Config Audit | Configuration files | Config inventory |
| 5 | Hidden Files Audit | Dot-files and dot-folders | Hidden items table |
| 6 | Scripts Audit | Build/utility scripts | Scripts inventory |
| 7 | Documentation Audit | README, docs, guides | Docs coverage report |
| 8 | Naming Consistency | Naming conventions | Inconsistencies list |
| 9 | Layer Violations | Architecture boundaries | Violations report |
| 10 | Benchmark Comparison | vs. Top monorepos | Gap analysis |
| 11 | Dead Code Hunt | Orphaned files | Candidates list |
| 12 | Final Report | Synthesis | Prioritized action plan |

---

## PHASE 1: Root Inventory

### Objective
Catalog everything at the repository root level.

### Actions

1. **List all visible items at root**
```bash
ls -la | grep -v "^\." | head -50
```

2. **Count items at root**
```bash
ls -la | wc -l
```

3. **Categorize each item**

For each item, classify as:
- `APP` - Runnable application
- `PKG` - Package directory
- `CFG` - Configuration file
- `DOC` - Documentation
- `BUILD` - Build-related
- `CI` - CI/CD related
- `TOOL` - Tooling/scripts
- `MISC` - Miscellaneous
- `UNKNOWN` - Needs investigation

### Deliverable Template

```markdown
## Phase 1: Root Inventory

**Total items at root**: [NUMBER]
**Healthy threshold**: 15-20 items max

| Item | Type | Category | Belongs at Root? | Notes |
|------|------|----------|------------------|-------|
| apps/ | dir | APP | YES | Application directory |
| packages/ | dir | PKG | YES | Shared packages |
| .env | file | CFG | NO | Should be .env.example only |
| ... | ... | ... | ... | ... |

### Root-Level Health Score
- [ ] Under 20 items: GOOD
- [ ] 20-30 items: NEEDS CLEANUP
- [ ] 30+ items: CRITICAL

### Items that should NOT be at root:
1. [item] - Reason - Where it should go
2. ...

### Missing expected items:
1. [item] - Why it's expected
2. ...
```

### STOP
**Output the Phase 1 deliverable and WAIT for instructions.**

---

## PHASE 2: Package Discovery

### Objective
Map all packages and applications in the monorepo.

### Actions

1. **Find all package.json files**
```bash
find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*"
```

2. **For each package.json, extract**:
   - Path
   - Package name (from `name` field)
   - Version
   - Main/exports fields
   - Private flag
   - Dependencies count
   - devDependencies count

3. **Classify each package**:
   - `APP` - In apps/ directory, deployable
   - `LIBRARY` - In packages/, publishable
   - `INTERNAL` - Private, internal-only
   - `CONFIG` - Configuration package
   - `TOOLING` - Build/lint tooling

### Deliverable Template

```markdown
## Phase 2: Package Discovery

**Total packages found**: [NUMBER]

### Applications (apps/)

| Package | Path | Version | Private | Has Exports | Status |
|---------|------|---------|---------|-------------|--------|
| @org/web | apps/web | 0.0.0 | true | YES | OK |
| ... | ... | ... | ... | ... | ... |

### Libraries (packages/)

| Package | Path | Version | Private | Has Exports | Deps | Status |
|---------|------|---------|---------|-------------|------|--------|
| @org/ui | packages/ui | 1.0.0 | false | YES | 5 | OK |
| ... | ... | ... | ... | ... | ... | ... |

### Issues Found

| Package | Issue | Severity | Fix |
|---------|-------|----------|-----|
| packages/foo | Missing name field | HIGH | Add name to package.json |
| packages/bar | No exports field | MEDIUM | Add exports for ESM |
| ... | ... | ... | ... |

### Package Naming Analysis
- Namespace used: [@org/...]
- Consistent: [YES/NO]
- Violations: [list]
```

### STOP
**Output the Phase 2 deliverable and WAIT for instructions.**

---

## PHASE 3: Dependency Graph

### Objective
Map internal package dependencies and detect issues.

### Actions

1. **For each package, extract internal dependencies**
   - Look for `workspace:*` or `@org/*` in dependencies
   - Build a dependency matrix

2. **Check for circular dependencies**
```bash
# If madge is available
npx madge --circular --extensions ts,tsx packages/
```

3. **Build layer classification**
   - Foundation (no internal deps)
   - Core (deps on foundation only)
   - Feature (deps on core/foundation)
   - App (deps on anything)

### Deliverable Template

```markdown
## Phase 3: Dependency Graph

### Dependency Matrix

| Package | Depends On | Depended By | Layer |
|---------|------------|-------------|-------|
| @org/foundation | - | ui, data | L0 |
| @org/ui | foundation | features | L1 |
| @org/data | foundation | features | L1 |
| @org/features | ui, data | apps | L2 |
| @org/web | all | - | L3 |

### Visual Graph

```
L3 (Apps)     : [web] [admin]
                  ↓      ↓
L2 (Features) : [feature-a] [feature-b]
                  ↓      ↓
L1 (Core)     : [ui] [data]
                  ↓
L0 (Base)     : [foundation]
```

### Circular Dependencies
- [ ] None found - HEALTHY
- [ ] Found: [list cycles]

### Layer Violations
| From | To | Violation Type |
|------|-----|----------------|
| ui | features | Lower importing higher |
| ... | ... | ... |

### Orphan Packages (no dependents, not an app)
1. [package] - Consider removing or integrating
```

### STOP
**Output the Phase 3 deliverable and WAIT for instructions.**

---

## PHASE 4: Configuration Audit

### Objective
Inventory all configuration files and check for sprawl.

### Actions

1. **Find all TypeScript configs**
```bash
find . -name "tsconfig*.json" -not -path "*/node_modules/*"
```

2. **Find all ESLint configs**
```bash
find . \( -name ".eslintrc*" -o -name "eslint.config.*" \) -not -path "*/node_modules/*"
```

3. **Find all other configs**
```bash
# Prettier, Stylelint, Vite, Next, Tailwind, etc.
find . \( -name ".prettierrc*" -o -name "prettier.config.*" -o -name ".stylelintrc*" -o -name "vite.config.*" -o -name "next.config.*" -o -name "tailwind.config.*" \) -not -path "*/node_modules/*"
```

4. **For each config, check if it extends a base**

### Deliverable Template

```markdown
## Phase 4: Configuration Audit

### TypeScript Configs

| Location | Extends | Issues |
|----------|---------|--------|
| /tsconfig.json | - | Base config (OK) |
| /packages/ui/tsconfig.json | ../../tsconfig.json | OK |
| /packages/foo/tsconfig.json | - | NOT EXTENDING BASE |
| ... | ... | ... |

**Sprawl Score**: [X] configs not extending base / [Y] total = [%]

### ESLint Configs

| Location | Type | Extends Base? | Issues |
|----------|------|---------------|--------|
| /eslint.config.js | flat | BASE | OK |
| /packages/ui/eslint.config.js | flat | YES | OK |
| ... | ... | ... | ... |

### Other Configs

| Config Type | Count | Centralized? | Location(s) |
|-------------|-------|--------------|-------------|
| Prettier | 1 | YES | /.prettierrc |
| Tailwind | 3 | NO | [list] |
| Vite | 4 | N/A | Per-app OK |
| ... | ... | ... | ... |

### Recommendations

| Issue | Severity | Fix |
|-------|----------|-----|
| 5 ESLint configs not extending base | HIGH | Create shared config package |
| Tailwind config duplicated | MEDIUM | Extract to packages/config/tailwind |
| ... | ... | ... |

### Ideal Config Structure
```
tooling/               # or packages/config/
├── eslint/
│   ├── base.js
│   └── package.json
├── typescript/
│   ├── base.json
│   └── package.json
└── tailwind/
    ├── preset.js
    └── package.json
```
```

### STOP
**Output the Phase 4 deliverable and WAIT for instructions.**

---

## PHASE 5: Hidden Files Audit

### Objective
Audit all dot-files and dot-directories.

### Actions

1. **List all hidden items at root**
```bash
ls -la | grep "^\."
```

2. **Find all hidden directories recursively**
```bash
find . -type d -name ".*" -not -path "*/node_modules/*" -not -path "*/.git/*"
```

3. **Classify each hidden item**

### Deliverable Template

```markdown
## Phase 5: Hidden Files Audit

### Root-Level Hidden Items

| Item | Type | Purpose | Gitignored? | Should Exist? |
|------|------|---------|-------------|---------------|
| .git/ | dir | Git repo | N/A | YES |
| .github/ | dir | GitHub config | NO | YES |
| .husky/ | dir | Git hooks | NO | OPTIONAL |
| .vscode/ | dir | Editor config | PARTIAL | YES (shared) |
| .env | file | Secrets | SHOULD BE | NO - use .env.example |
| .env.local | file | Local secrets | YES | OK if gitignored |
| .turbo/ | dir | Turbo cache | YES | OK if gitignored |
| .next/ | dir | Next.js cache | YES | OK if gitignored |
| ... | ... | ... | ... | ... |

### Hidden Directories in Packages

| Location | Purpose | Concern |
|----------|---------|---------|
| packages/ui/.storybook/ | Storybook config | OK |
| packages/foo/.cache/ | Build cache | Should be gitignored |
| ... | ... | ... |

### Suspicious Items

| Item | Concern | Action |
|------|---------|--------|
| .ai-helpers/ | AI tooling at root | Consider moving to .claude/ or docs/ |
| .claude/ | Claude config | OK if intentional |
| .internal/ | Unknown purpose | Investigate |
| ... | ... | ... |

### .gitignore Coverage

| Item | Gitignored? | Should Be? | Action |
|------|-------------|------------|--------|
| .env | NO | YES | Add to .gitignore |
| .turbo/ | YES | YES | OK |
| node_modules/ | YES | YES | OK |
| dist/ | YES | YES | OK |
| ... | ... | ... | ... |
```

### STOP
**Output the Phase 5 deliverable and WAIT for instructions.**

---

## PHASE 6: Scripts Audit

### Objective
Inventory all scripts and check organization.

### Actions

1. **Extract scripts from root package.json**

2. **Find all script files**
```bash
find . \( -name "*.sh" -o -name "*.js" -o -name "*.ts" \) -path "*/scripts/*" -not -path "*/node_modules/*"
```

3. **Check for scripts in unusual locations**
```bash
find . -name "*.sh" -not -path "*/node_modules/*" -not -path "*/scripts/*" -not -path "*/.husky/*"
```

4. **Analyze turbo.json tasks**

### Deliverable Template

```markdown
## Phase 6: Scripts Audit

### Package.json Scripts (Root)

| Script | Command | Purpose | Turbo Task? |
|--------|---------|---------|-------------|
| dev | turbo dev | Run dev servers | YES |
| build | turbo build | Build all | YES |
| lint | turbo lint | Lint all | YES |
| test | vitest | Run tests | NO - should be |
| ... | ... | ... | ... |

### Script Files

| Location | Purpose | Issues |
|----------|---------|--------|
| /scripts/generate-types.sh | Generate TS types | OK |
| /scripts/deploy.js | Deployment | OK |
| /packages/ui/build.sh | Build UI | WRONG LOCATION |
| ... | ... | ... |

### Turbo Tasks Analysis

| Task | Defined | Has dependsOn | Has outputs | Cached |
|------|---------|---------------|-------------|--------|
| build | YES | ^build | dist/** | YES |
| dev | YES | - | - | NO |
| lint | YES | - | - | NO |
| test | NO | - | - | - |
| ... | ... | ... | ... | ... |

### Issues

| Issue | Severity | Fix |
|-------|----------|-----|
| Test not in turbo pipeline | MEDIUM | Add test task to turbo.json |
| Build script in package folder | LOW | Move to /scripts or turbo task |
| ... | ... | ... |

### Recommended Script Organization
```
/scripts/
├── build/           # Build-related scripts
├── ci/              # CI/CD scripts
├── db/              # Database scripts
├── codegen/         # Code generation
└── utils/           # Utility scripts
```
```

### STOP
**Output the Phase 6 deliverable and WAIT for instructions.**

---

## PHASE 7: Documentation Audit

### Objective
Assess documentation coverage and organization.

### Actions

1. **Find all README files**
```bash
find . -name "README.md" -not -path "*/node_modules/*"
```

2. **Find all documentation files**
```bash
find . \( -name "*.md" -o -name "*.mdx" \) -not -path "*/node_modules/*" | head -100
```

3. **Check for essential docs at root**
   - README.md
   - CONTRIBUTING.md
   - CHANGELOG.md
   - LICENSE
   - CODE_OF_CONDUCT.md

### Deliverable Template

```markdown
## Phase 7: Documentation Audit

### Essential Root Documents

| Document | Exists | Quality | Issues |
|----------|--------|---------|--------|
| README.md | YES | GOOD | Missing badges |
| CONTRIBUTING.md | NO | - | MISSING |
| CHANGELOG.md | YES | OUTDATED | Last update 6mo ago |
| LICENSE | YES | OK | - |
| CODE_OF_CONDUCT.md | NO | - | Consider adding |

### Package READMEs

| Package | Has README | Quality | Issues |
|---------|------------|---------|--------|
| @org/ui | YES | GOOD | - |
| @org/data | YES | MINIMAL | Missing API docs |
| @org/features-foo | NO | - | MISSING |
| ... | ... | ... | ... |

**README Coverage**: [X] / [Y] packages = [%]

### Documentation Location Analysis

| Location | File Count | Purpose |
|----------|------------|---------|
| /docs/ | 15 | Main documentation |
| /apps/docs/ | 25 | Documentation site |
| /.claude/ | 10 | AI context |
| /.ai-helpers/ | 5 | AI helpers |
| ... | ... | ... |

### Issues

| Issue | Severity | Fix |
|-------|----------|-----|
| No CONTRIBUTING.md | MEDIUM | Create contribution guide |
| 3 packages missing README | HIGH | Add READMEs |
| Docs scattered across .claude/ and docs/ | LOW | Consider consolidating |
| ... | ... | ... |

### Recommended Docs Structure
```
/docs/
├── architecture/     # Architecture decisions
├── guides/           # How-to guides
├── api/              # API documentation
└── contributing/     # Contribution guides

/apps/docs/           # Documentation website (optional)
```
```

### STOP
**Output the Phase 7 deliverable and WAIT for instructions.**

---

## PHASE 8: Naming Consistency

### Objective
Check for naming convention consistency.

### Actions

1. **Analyze folder naming**
   - kebab-case vs camelCase vs PascalCase vs snake_case

2. **Analyze file naming**
   - Components: PascalCase expected
   - Utilities: camelCase expected
   - Constants: camelCase or SCREAMING_SNAKE

3. **Analyze package naming**
   - Scoped: @org/package-name
   - Consistent prefix patterns

### Deliverable Template

```markdown
## Phase 8: Naming Consistency

### Folder Naming

| Convention | Count | Examples | Expected |
|------------|-------|----------|----------|
| kebab-case | 45 | feature-auth, ui-button | YES |
| camelCase | 12 | userProfile, dataUtils | NO |
| PascalCase | 8 | Button, UserCard | Components only |
| snake_case | 2 | old_utils | NO |

**Consistency Score**: [%] following convention

### File Naming

| Type | Convention | Count | Violations |
|------|------------|-------|------------|
| Components | PascalCase.tsx | 120 | 5 (list) |
| Hooks | useCamelCase.ts | 45 | 2 (list) |
| Utils | camelCase.ts | 30 | 0 |
| Types | types.ts / PascalCase.types.ts | 25 | 3 (list) |
| Styles | _kebab-case.scss | 40 | 1 (list) |

### Package Naming

| Pattern | Count | Examples |
|---------|-------|----------|
| @pulwave/features-* | 10 | @pulwave/features-auth |
| @pulwave/ui | 1 | Single UI package |
| @pulwave/experience-* | 5 | @pulwave/experience-admin |
| Unscoped | 2 | config, utils |

**Issues**:
- [ ] Unscoped packages should use @pulwave/ namespace

### Specific Violations

| Location | Current | Should Be | Type |
|----------|---------|-----------|------|
| packages/userAuth/ | camelCase | user-auth | Folder |
| Button.component.tsx | Non-standard | Button.tsx | File |
| useGetUser.ts | verbose | useUser.ts | File |
| ... | ... | ... | ... |

### Naming Convention Rules (Proposed)

```
Folders:
- kebab-case for all folders
- Exception: Component folders can be PascalCase

Files:
- Components: PascalCase.tsx (Button.tsx)
- Hooks: use[Name].ts (useAuth.ts)
- Utils: camelCase.ts (formatDate.ts)
- Types: types.ts or [Name].types.ts
- Styles: _kebab-case.scss
- Tests: [Name].test.ts (colocated)
- Stories: [Name].stories.tsx (colocated)

Packages:
- @pulwave/[layer]-[name]
- All kebab-case after namespace
```
```

### STOP
**Output the Phase 8 deliverable and WAIT for instructions.**

---

## PHASE 9: Layer Violations

### Objective
Detect architectural boundary violations.

### Actions

1. **Define the layer hierarchy**
```
L0: Foundation (no deps)
L1: UI, Data (deps on L0)
L2: Patterns (deps on L1, L0)
L3: Features (deps on L2, L1, L0)
L4: Experience (deps on L3, L2, L1, L0)
L5: Apps (deps on any)
```

2. **For each package, check imports**
   - Does UI import from Features? VIOLATION
   - Do Features import from other Features? VIOLATION
   - Does Data import from UI? VIOLATION

3. **Check for direct database/API access in wrong layers**

### Deliverable Template

```markdown
## Phase 9: Layer Violations

### Layer Hierarchy

```
L5: Apps (apps/*)
    ↓ allowed
L4: Experience (packages/experience/*)
    ↓ allowed
L3: Features (packages/features/*)
    ↓ allowed
L2: Patterns (packages/patterns/*)
    ↓ allowed
L1: UI, Data (packages/ui, packages/data)
    ↓ allowed
L0: Foundation (packages/foundation)
```

### Package Layer Classification

| Package | Assigned Layer | Correct? |
|---------|----------------|----------|
| @pulwave/foundation | L0 | YES |
| @pulwave/ui | L1 | YES |
| @pulwave/data | L1 | YES |
| @pulwave/patterns | L2 | YES |
| @pulwave/features-* | L3 | CHECK |
| @pulwave/experience-* | L4 | CHECK |
| apps/* | L5 | YES |

### Violations Found

| From | To | Type | File | Line |
|------|-----|------|------|------|
| @pulwave/ui | @pulwave/features-auth | L1 → L3 | Button.tsx | 5 |
| @pulwave/features-a | @pulwave/features-b | L3 → L3 | Service.ts | 12 |
| @pulwave/data | @pulwave/ui | L1 → L1 (sibling) | hook.ts | 8 |
| ... | ... | ... | ... | ... |

**Violation Count**: [X] total
- Critical (upward): [X]
- Sibling (L3→L3): [X]
- Questionable: [X]

### Analysis

**Most Problematic Package**: [package] with [X] violations

**Common Violation Patterns**:
1. Features importing other features for shared components
   - Fix: Extract shared component to UI layer
2. UI importing auth hooks
   - Fix: Pass auth state as props
3. ...

### Remediation Priority

| Violation | Impact | Fix Effort | Priority |
|-----------|--------|------------|----------|
| UI → Features | HIGH | MEDIUM | 1 |
| Features → Features | HIGH | HIGH | 2 |
| ... | ... | ... | ... |
```

### STOP
**Output the Phase 9 deliverable and WAIT for instructions.**

---

## PHASE 10: Benchmark Comparison

### Objective
Compare against industry-leading monorepos.

### Actions

1. **Compare root structure**
2. **Compare package organization**
3. **Compare naming conventions**
4. **Identify missing patterns**

### Benchmark References

| Monorepo | URL | Notable Pattern |
|----------|-----|-----------------|
| Cal.com | github.com/calcom/cal.com | apps/packages split |
| Supabase | github.com/supabase/supabase | Clear layer separation |
| Plane | github.com/makeplane/plane | Module-based packages |
| Dub | github.com/dubinc/dub | Clean Turborepo setup |
| Trigger.dev | github.com/triggerdotdev/trigger.dev | Excellent organization |
| Documenso | github.com/documenso/documenso | Prisma integration |
| Turborepo Kitchen Sink | github.com/vercel/turbo/examples | Reference patterns |

### Deliverable Template

```markdown
## Phase 10: Benchmark Comparison

### Root Structure Comparison

| Aspect | This Repo | Cal.com | Supabase | Assessment |
|--------|-----------|---------|----------|------------|
| Root items | 35 | 18 | 22 | TOO MANY |
| Has apps/ | YES | YES | YES | OK |
| Has packages/ | YES | YES | YES | OK |
| Has tooling/ | NO | YES | NO | MISSING |
| Has docs/ | YES | NO (app) | YES | OK |
| Config at root | 12 | 6 | 8 | TOO MANY |

### Package Organization Comparison

| Aspect | This Repo | Best Practice | Gap |
|--------|-----------|---------------|-----|
| UI package | Monolithic | Monolithic or atomic | OK |
| Feature isolation | Separate packages | Separate packages | OK |
| Config package | Missing | Dedicated package | MISSING |
| Types package | Inline | Can be inline | OK |

### Naming Comparison

| Aspect | This Repo | Industry Standard | Status |
|--------|-----------|-------------------|--------|
| Package namespace | @pulwave/ | @org/ | OK |
| Folder case | Mixed | kebab-case | FIX |
| Feature prefix | features- | features-/feature- | OK |

### Missing Patterns

| Pattern | Seen In | Benefit | Priority |
|---------|---------|---------|----------|
| Tooling package | Cal.com, Trigger.dev | Centralized configs | HIGH |
| Workspace protocols | All | Consistent deps | Check |
| Changesets | Cal.com, Dub | Versioning | MEDIUM |
| ... | ... | ... | ... |

### Patterns to Adopt

1. **From Cal.com**: [specific pattern]
2. **From Trigger.dev**: [specific pattern]
3. **From Turborepo examples**: [specific pattern]

### Patterns This Repo Does Well

1. [Pattern] - Better than benchmarks because...
2. [Pattern] - Industry-leading approach
```

### STOP
**Output the Phase 10 deliverable and WAIT for instructions.**

---

## PHASE 11: Dead Code Hunt

### Objective
Identify potentially orphaned or dead code.

### Actions

1. **Find files not imported anywhere**
2. **Find exports not used**
3. **Find packages with no dependents (and not apps)**
4. **Find empty or near-empty directories**

### Deliverable Template

```markdown
## Phase 11: Dead Code Hunt

### Orphan File Candidates

| File | Last Modified | Imported By | Confidence |
|------|---------------|-------------|------------|
| src/old-utils.ts | 6 months ago | Nothing | HIGH |
| components/Legacy.tsx | 1 year ago | Nothing | HIGH |
| ... | ... | ... | ... |

**Method**: Cross-referenced imports across all files

### Unused Exports

| Package | Export | Used By | Action |
|---------|--------|---------|--------|
| @pulwave/ui | OldButton | Nothing | Remove |
| @pulwave/data | legacyHook | Nothing | Remove |
| ... | ... | ... | ... |

### Orphan Packages

| Package | Dependents | Is App? | Action |
|---------|------------|---------|--------|
| @pulwave/legacy-utils | 0 | NO | Remove or integrate |
| @pulwave/old-feature | 0 | NO | Archive |
| ... | ... | ... | ... |

### Empty/Near-Empty Directories

| Directory | Files | Purpose | Action |
|-----------|-------|---------|--------|
| packages/old/ | 0 | Unknown | Delete |
| src/deprecated/ | 1 | Legacy | Archive |
| ... | ... | ... | ... |

### Stale Files (by git history)

| File | Last Commit | Age | Action |
|------|-------------|-----|--------|
| legacy/old.ts | abc123 | 2 years | Review |
| ... | ... | ... | ... |

### Cleanup Estimate

| Category | Count | Effort | Risk |
|----------|-------|--------|------|
| Orphan files | 12 | LOW | LOW |
| Unused exports | 25 | LOW | MEDIUM |
| Orphan packages | 2 | MEDIUM | HIGH |
| Empty directories | 5 | LOW | LOW |

**Total cleanup candidates**: [X] items
**Estimated effort**: [hours]
```

### STOP
**Output the Phase 11 deliverable and WAIT for instructions.**

---

## PHASE 12: Final Report

### Objective
Synthesize all findings into an actionable plan.

### Deliverable Template

```markdown
## Final Audit Report

### Executive Summary

**Overall Health Score**: [A/B/C/D/F]

**Scores by Category**:
| Category | Score | Status |
|----------|-------|--------|
| Root Organization | [X/10] | [emoji] |
| Package Structure | [X/10] | [emoji] |
| Dependencies | [X/10] | [emoji] |
| Configuration | [X/10] | [emoji] |
| Documentation | [X/10] | [emoji] |
| Naming | [X/10] | [emoji] |
| Architecture | [X/10] | [emoji] |
| Code Hygiene | [X/10] | [emoji] |

### Top 5 Issues (Must Fix)

1. **[Issue]** - [Location] - [Why critical]
2. **[Issue]** - [Location] - [Why critical]
3. **[Issue]** - [Location] - [Why critical]
4. **[Issue]** - [Location] - [Why critical]
5. **[Issue]** - [Location] - [Why critical]

### All Findings Summary

| Severity | Count | Examples |
|----------|-------|----------|
| CRITICAL | X | Layer violations, circular deps |
| HIGH | X | Config sprawl, missing package.json |
| MEDIUM | X | Naming inconsistency, missing docs |
| LOW | X | Style preferences, nice-to-haves |

### Migration Plan

#### Phase 1: Quick Wins (< 1 day)
- [ ] Task 1 - [effort: Xh]
- [ ] Task 2 - [effort: Xh]
- [ ] Task 3 - [effort: Xh]

#### Phase 2: Structural Fixes (1-3 days)
- [ ] Task 1 - [effort: Xd]
- [ ] Task 2 - [effort: Xd]

#### Phase 3: Major Refactoring (1 week+)
- [ ] Task 1 - [effort: Xw]
- [ ] Task 2 - [effort: Xw]

### Target Structure

```
[Ideal folder structure for this specific codebase]
```

### Appendix: Reference Links

- Cal.com: [relevant pattern URL]
- Turborepo: [relevant pattern URL]
- [Other references]

---

**Audit completed by**: [AI/Human]
**Date**: [Date]
**Scope**: Full monorepo structure audit
```

### STOP
**This completes the atomic audit. Deliver the final report.**

---

## Execution Instructions

1. **Execute ONE phase at a time**
2. **Produce the deliverable for that phase**
3. **STOP and wait for user instructions**
4. **Do not proceed to next phase until instructed**
5. **User may ask to skip, repeat, or deep-dive on any phase**

The user controls the pace. Some phases may take longer. Some may be skipped if not relevant.
