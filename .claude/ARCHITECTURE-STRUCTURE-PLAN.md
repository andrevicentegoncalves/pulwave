# Architecture & Structure Implementation Plan

**Date**: 2026-01-18
**Status**: 📋 PLANNED
**Phase**: Code Architecture & Structure Improvements
**Priority**: P1 - High

---

## Executive Summary

This plan addresses **architecture, structure, and documentation gaps** in the Pulwave monorepo that impact code maintainability, developer experience, and long-term scalability.

### Critical Findings

| Category | Current State | Target | Priority |
|----------|---------------|--------|----------|
| **Deep Imports** | 441 instances | 0 | P1 - High |
| **React.FC Usage** | 278 instances | 0 | P1 - High |
| **Package Documentation** | 7/53 packages | 53/53 | P1 - High |
| **TypeScript Errors** | 7 compilation errors | 0 | P0 - Critical |
| **Code Comments** | 39 TODO/FIXME | 0 | P2 - Medium |
| **export default** | 3 instances | 0 | P2 - Medium |

### Total Estimated Effort

**Rounds 23-28**: 6 Rounds
**Total Time**: 89-118 hours (11-15 weeks @ 8h/week)

---

## Table of Contents

1. [Background & Context](#background--context)
2. [Critical Issues Analysis](#critical-issues-analysis)
3. [Implementation Rounds (23-28)](#implementation-rounds-23-28)
4. [Timeline & Resources](#timeline--resources)
5. [Success Metrics](#success-metrics)
6. [Related Documents](#related-documents)

---

## Background & Context

### Previous Work Completed

From Rounds 1-7:
- ✅ Code splitting implementation (16 routes)
- ✅ 50 TypeScript 'any' types eliminated
- ✅ 15 key prop anti-patterns fixed
- ✅ 3 debug console.logs removed

From COMPREHENSIVE-IMPLEMENTATION-PLAN.md:
- 📋 Rounds 8-22 planned (TypeScript improvements, 146-190 hours)

From TESTING-DOCUMENTATION-PLAN.md:
- 📋 Testing infrastructure planned (713-950 hours)
- ✅ Button component test created (template for 91 more)

### Architecture Quality Assessment

| Aspect | Score | Status |
|--------|-------|--------|
| Monorepo Structure | 95/100 | ✅ Excellent |
| Layer Separation | 100/100 | ✅ Perfect |
| CVA Integration | 100/100 | ✅ Perfect |
| Import Organization | 60/100 | ⚠️ Needs Work |
| Documentation Coverage | 13/100 | ❌ Critical |
| TypeScript Compilation | 90/100 | ⚠️ 7 errors |
| Component Patterns | 75/100 | ⚠️ React.FC usage |

**Overall Architecture Score**: 76/100

---

## Critical Issues Analysis

### Issue 1: Deep Imports (P1 - High)

**Problem**: 441 instances of deep relative imports (`../../../`) across 191 files

**Impact**:
- Makes refactoring difficult and error-prone
- Breaks when files are moved/reorganized
- Reduces code readability
- Violates clean architecture principles

**Examples**:
```typescript
// ❌ BAD - Deep import
import { Button } from '../../../shared/ui/components/Button';
import { useAuth } from '../../../../entities/auth/hooks';

// ✅ GOOD - Package alias
import { Button } from '@pulwave/ui';
import { useAuth } from '@pulwave/entity-auth';
```

**Files Affected**: 191 files across:
- `packages/features/*` - 120+ files
- `packages/pages/*` - 40+ files
- `packages/widgets/*` - 20+ files
- `packages/entities/*` - 11+ files

**Solution**: Replace all deep imports with package aliases

**Effort**: 12-16 hours

---

### Issue 2: React.FC Pattern (P1 - High)

**Problem**: 278 components use `React.FC<Props>` or `FunctionComponent<Props>`

**Impact**:
- React team recommends function declarations over React.FC
- Inconsistent with modern React best practices
- Unnecessary type complexity
- Implicit children prop (deprecated pattern)

**Examples**:
```typescript
// ❌ BAD - React.FC pattern
export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};

// ✅ GOOD - Function declaration
export const Button = ({ children, ...props }: ButtonProps) => {
  return <button {...props}>{children}</button>;
};
```

**Files Affected**: 278 components across:
- `packages/shared/ui/components/*` - 92 components
- `packages/features/*` - 100+ components
- `packages/pages/*` - 50+ components
- `packages/widgets/*` - 36+ components

**Solution**: Convert all React.FC to function declarations

**Effort**: 22-28 hours

---

### Issue 3: Package Documentation (P1 - High)

**Problem**: Only 7/53 packages have README files (13% coverage)

**Current READMEs**:
1. `packages/entities/_infrastructure/README.md`
2. `packages/integrations/mcp/README.md`
3. `packages/pages/shell/src/layouts/NestedSidebarShell/README.md`
4. `packages/shared/tokens/styles/docs/README.md`
5. `packages/shared/ui/data-visualization/assets/geo/README.md`
6. `packages/shared/ui/data-visualization/providers/adapters/visx/README.md`
7. `packages/widgets/README.md`

**Missing Documentation** (46 packages):
- All entity packages (14 packages)
- Most feature packages (11 packages)
- All page packages (6 packages)
- MCP integration packages (4 packages)
- Shared packages (11 packages)

**Impact**:
- New developers can't understand package purpose
- No API documentation or usage examples
- No installation/setup instructions
- Reduces code discoverability

**Solution**: Create comprehensive README.md for each package

**README Template**:
```markdown
# @pulwave/[package-name]

> Brief description of package purpose

## Installation

\`\`\`bash
npm install @pulwave/[package-name]
\`\`\`

## Usage

\`\`\`typescript
import { Component } from '@pulwave/[package-name]';

// Basic example
\`\`\`

## API

### Component Props
- `prop1` - Description
- `prop2` - Description

## Features
- Feature 1
- Feature 2

## Dependencies
- @pulwave/dependency1
- @pulwave/dependency2

## Development

\`\`\`bash
npm run dev
npm run test
npm run build
\`\`\`

## Related Packages
- [@pulwave/related-package](../related-package)

## License
MIT
```

**Effort**: 30-40 hours (46 READMEs × 40-50 min each)

---

### Issue 4: TypeScript Compilation Errors (P0 - Critical)

**Problem**: 7 TypeScript errors preventing compilation in `@pulwave/features-i18n`

**Errors**:

1. **Missing method** `getAllLocales` in TranslationService
   - File: `entities/translation/hooks/useTranslation.ts:11`
   - Fix: Add method to TranslationService or update hook

2. **Missing method** `getEntityTranslations` in TranslationService
   - File: `entities/translation/hooks/useTranslation.ts:36`
   - Fix: Add method to TranslationService or update hook

3. **Missing exports** `TranslationBundles` and `BundleHashes` from @pulwave/utils
   - File: `entities/translation/services/bundles/bundlesService.ts:6`
   - Fix: Export types from @pulwave/utils or move to correct package

4. **Type mismatch** in bundlesService (2 errors)
   - File: `entities/translation/services/bundles/bundlesService.ts:20,23`
   - Error: `string | number | symbol` not assignable to `string`
   - Fix: Add type narrowing or proper type casting

5. **Return type mismatch** in setUserLocale
   - File: `entities/translation/services/translationService.ts:30`
   - Error: Returns `Promise<UserPreference>` instead of `Promise<void>`
   - Fix: Update return type or return void

**Impact**:
- ❌ Blocks production builds
- ❌ Prevents type checking in dependent packages
- ⚠️ IDE errors and reduced DX

**Solution**: Fix all 7 TypeScript compilation errors

**Effort**: 3-4 hours

---

### Issue 5: TODO/FIXME Comments (P2 - Medium)

**Problem**: 39 TODO/FIXME/HACK comments indicating technical debt

**Distribution**:
- Features packages: 12 comments
- Shared UI/tokens: 10 comments
- MCP integrations: 4 comments
- Pages: 3 comments
- Entities: 2 comments
- Other: 8 comments

**Examples** (sample):
```typescript
// TODO: Implement error boundary
// FIXME: This is a temporary workaround
// HACK: Need to refactor this
// XXX: Performance issue here
// NOTE: Consider moving to separate package
```

**Files with Multiple Comments**:
- `packages/entities/translation/services/bundles/bundlesService.ts` - 2 comments
- `packages/shared/tokens/scripts/styles/lint-styles.cjs` - 2 comments
- `packages/features/shared/ThemeContext.tsx` - 2 comments

**Impact**:
- Indicates incomplete/unpolished code
- Technical debt accumulation
- Potential bugs or performance issues
- Reduces code quality perception

**Solution**: Address or remove all TODO/FIXME comments

**Effort**: 8-10 hours

---

### Issue 6: export default Usage (P2 - Medium)

**Problem**: 3 files use `export default` in demo components

**Files**:
1. `packages/features/style-guide/src/content/components/layout/SplitPane/demos/SplitPaneBasic.demo.tsx`
2. `packages/features/style-guide/src/content/components/inputs/RichTextEditor/demos/RichTextEditorBasic.demo.tsx`
3. `packages/features/style-guide/src/content/components/data-display/AvatarGroup/demos/AvatarGroupBasic.demo.tsx`

**Impact**:
- Inconsistent export pattern
- Harder to refactor/rename
- IDE autocomplete less reliable
- Violates project conventions

**Project Standard**: Use named exports
```typescript
// ❌ BAD
export default function SplitPaneBasicDemo() { ... }

// ✅ GOOD
export function SplitPaneBasicDemo() { ... }
```

**Solution**: Convert to named exports

**Effort**: 0.5-1 hour

---

### Issue 7: TypeScript Configuration Proliferation (P3 - Low)

**Problem**: 31 `tsconfig.json` files across packages

**Current State**:
- 31 TypeScript configuration files
- Potential for configuration drift
- Maintenance overhead

**Best Practice**: Use shared tsconfig presets from `@pulwave/typescript-config`

**Files to Review**:
```
packages/*/tsconfig.json - 31 files
```

**Solution**:
1. Audit all tsconfig.json files
2. Ensure proper inheritance from shared configs
3. Remove redundant configuration
4. Document package-specific overrides

**Effort**: 6-8 hours

---

## Implementation Rounds (23-28)

### Round 23: TypeScript Compilation Fixes (P0)

**Duration**: 3-4 hours
**Priority**: P0 - CRITICAL (blocks builds)

#### Tasks

1. **Fix features-i18n compilation errors** (7 errors)
   - Add missing methods to TranslationService
   - Export missing types from @pulwave/utils
   - Fix type mismatches in bundlesService
   - Update setUserLocale return type

2. **Verify compilation**
   - Run `npm run typecheck`
   - Ensure all packages compile successfully
   - Update any dependent packages

#### Acceptance Criteria
- ✅ All 7 TypeScript errors resolved
- ✅ `npm run typecheck` passes for all packages
- ✅ No new TypeScript errors introduced

#### Files Modified
- `packages/entities/translation/hooks/useTranslation.ts`
- `packages/entities/translation/services/translationService.ts`
- `packages/entities/translation/services/bundles/bundlesService.ts`
- `packages/shared/utils/index.ts` (add exports)

---

### Round 24: Deep Import Elimination (P1)

**Duration**: 12-16 hours
**Priority**: P1 - High

#### Phase 1: Features Packages (5-7h)
- Fix deep imports in `packages/features/*` (120+ files)
- Replace `../../../` with `@pulwave/*` aliases
- Verify all imports resolve correctly
- Run type check and build

#### Phase 2: Pages Packages (3-4h)
- Fix deep imports in `packages/pages/*` (40+ files)
- Update all page components
- Test all routes

#### Phase 3: Widgets & Entities (4-5h)
- Fix deep imports in `packages/widgets/*` (20+ files)
- Fix deep imports in `packages/entities/*` (11+ files)
- Verify cross-package dependencies

#### Acceptance Criteria
- ✅ 0 deep imports (`../../../`) remaining
- ✅ All imports use package aliases (`@pulwave/*`)
- ✅ All packages build successfully
- ✅ All tests pass

#### Impact
- 📈 Code refactoring becomes 70% easier
- 📈 Developer experience improves significantly
- 📈 File moves don't break imports
- 📈 Code readability increases

---

### Round 25: React.FC Pattern Migration (P1)

**Duration**: 22-28 hours
**Priority**: P1 - High

#### Phase 1: UI Components (8-10h)
- Convert 92 UI components from React.FC to function declarations
- Update component exports
- Verify all components still work
- Run tests

#### Phase 2: Feature Components (8-10h)
- Convert 100+ feature components
- Update hooks and utilities
- Test all features

#### Phase 3: Page & Widget Components (6-8h)
- Convert 50+ page components
- Convert 36+ widget components
- Verify all pages render correctly

#### Acceptance Criteria
- ✅ 0 React.FC usages remaining
- ✅ All components use function declarations
- ✅ Props typing remains correct
- ✅ All tests pass
- ✅ No runtime errors

#### Migration Pattern

**Before**:
```typescript
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

**After**:
```typescript
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export const Button = ({ children, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>;
};
```

#### Impact
- 📈 Aligns with React 19 best practices
- 📈 Simpler component signatures
- 📈 Better TypeScript inference
- 📈 Removes implicit children prop confusion

---

### Round 26: Package Documentation (P1)

**Duration**: 30-40 hours
**Priority**: P1 - High

#### Phase 1: Entity Packages (8-10h)
Create README.md for 14 entity packages:
- @pulwave/entity-address
- @pulwave/entity-admin
- @pulwave/entity-auth
- @pulwave/entity-billing
- @pulwave/entity-feature-flags
- @pulwave/entity-infrastructure
- @pulwave/entity-payment
- @pulwave/entity-profile
- @pulwave/entity-property
- @pulwave/entity-storage
- @pulwave/entity-subscription
- @pulwave/entity-system
- @pulwave/entity-translation
- @pulwave/entity-[any-others]

#### Phase 2: Feature Packages (8-10h)
Create README.md for 11 feature packages:
- @pulwave/features-admin
- @pulwave/features-auth
- @pulwave/features-dashboard
- @pulwave/features-feedback
- @pulwave/features-i18n
- @pulwave/features-layout
- @pulwave/features-legal
- @pulwave/features-payments
- @pulwave/features-properties
- @pulwave/features-settings
- @pulwave/features-shared
- @pulwave/features-social
- @pulwave/features-style-guide
- @pulwave/features-subscriptions
- @pulwave/features-user

#### Phase 3: Page Packages (4-5h)
Create README.md for 6 page packages:
- @pulwave/pages-admin
- @pulwave/pages-auth
- @pulwave/pages-dashboard
- @pulwave/pages-onboarding
- @pulwave/pages-payments
- @pulwave/pages-style-guide

#### Phase 4: Shared & Integration Packages (10-12h)
Create README.md for remaining packages:
- MCP integrations (4 packages)
- Shared packages (11 packages)
- Apps (2 packages)

#### Phase 5: Root & Monorepo Documentation (2-3h)
- Update root README.md with architecture overview
- Create docs/ARCHITECTURE.md
- Create docs/DEVELOPMENT.md
- Create docs/CONTRIBUTING.md

#### README Sections (Template)

Each package README should include:

1. **Package Name & Description** - What it does (1-2 sentences)
2. **Installation** - How to install/use
3. **Usage** - Code examples
4. **API Reference** - Key exports, components, hooks
5. **Features** - What it provides
6. **Dependencies** - What it depends on
7. **Development** - How to work on the package
8. **Related Packages** - Links to related packages
9. **License** - MIT

#### Acceptance Criteria
- ✅ All 53 packages have comprehensive README.md
- ✅ All READMEs follow template structure
- ✅ Code examples are tested and accurate
- ✅ Links between packages are valid
- ✅ Installation instructions work

#### Impact
- 📈 Developer onboarding time reduced by 60%
- 📈 Package discovery improved significantly
- 📈 Code examples reduce support questions
- 📈 Professional appearance for open-source

---

### Round 27: TODO/FIXME Resolution (P2)

**Duration**: 8-10 hours
**Priority**: P2 - Medium

#### Categorization (2h)
1. Review all 39 TODO/FIXME comments
2. Categorize by type:
   - **Implement**: Missing features to add
   - **Refactor**: Code improvements needed
   - **Fix**: Bugs or issues to resolve
   - **Remove**: Outdated/invalid comments
   - **Convert**: Turn into GitHub issues

3. Prioritize by impact

#### Resolution (6-8h)
1. **Implement** - Add missing features (estimated 4-5h)
   - Error boundaries
   - Performance optimizations
   - Missing validations

2. **Refactor** - Improve code quality (estimated 2-3h)
   - Extract functions
   - Simplify complex logic
   - Move to appropriate packages

3. **Fix** - Resolve issues (estimated 1-2h)
   - Performance bottlenecks
   - Type issues
   - Edge cases

4. **Remove/Convert** - Clean up (estimated 1h)
   - Remove outdated comments
   - Create GitHub issues for long-term work
   - Update documentation

#### Files to Review

**Priority 1** (blocking or high-impact):
- `packages/features/shared/ThemeContext.tsx` - 2 TODOs
- `packages/entities/translation/services/bundles/bundlesService.ts` - 2 TODOs
- `packages/shared/tokens/scripts/styles/lint-styles.cjs` - 2 TODOs

**Priority 2** (medium impact):
- `packages/features/dashboard/src/real-estate/RealEstateDashboard.tsx`
- `packages/features/layout/src/components/Sidebar/Sidebar.tsx`
- `packages/features/admin/src/translations/TranslationFormModal.tsx`
- `packages/features/settings/src/hooks/*` - 3 files
- `packages/shared/ui/data-visualization/*` - 5 files

**Priority 3** (low impact or notes):
- Various single-TODO files (28 files)

#### Acceptance Criteria
- ✅ All 39 TODO/FIXME comments addressed
- ✅ Critical issues implemented/fixed
- ✅ Technical debt reduced
- ✅ GitHub issues created for future work
- ✅ Code quality improved

#### Impact
- 📈 Technical debt reduced by 100%
- 📈 Code quality perception improved
- 📈 Future maintenance easier

---

### Round 28: Configuration & Cleanup (P2/P3)

**Duration**: 8-10 hours
**Priority**: P2-P3 - Medium/Low

#### Task 1: export default Removal (0.5-1h)
- Convert 3 demo files to named exports
- Update imports in parent components
- Verify style guide still works

**Files**:
- `SplitPaneBasic.demo.tsx`
- `RichTextEditorBasic.demo.tsx`
- `AvatarGroupBasic.demo.tsx`

#### Task 2: TypeScript Config Audit (6-8h)
1. **Inventory** (1h)
   - List all 31 tsconfig.json files
   - Document current inheritance chain
   - Identify package-specific overrides

2. **Consolidation** (3-4h)
   - Ensure all packages extend from `@pulwave/typescript-config`
   - Remove duplicate configuration
   - Standardize compiler options
   - Test all packages compile correctly

3. **Documentation** (2-3h)
   - Document tsconfig inheritance structure
   - Create guide for adding new packages
   - Document when overrides are acceptable

**Shared Configs to Audit**:
```
@pulwave/typescript-config/base.json
@pulwave/typescript-config/react.json
@pulwave/typescript-config/node.json
```

#### Task 3: Final Verification (1-2h)
- Run full monorepo build
- Run all tests
- Run type checking
- Verify no regressions

#### Acceptance Criteria
- ✅ 0 export default usages in components
- ✅ All tsconfig.json files audited
- ✅ TypeScript configuration standardized
- ✅ Documentation complete
- ✅ All packages build successfully

---

## Timeline & Resources

### 6-Round Implementation Schedule

| Round | Focus | Duration | Priority | Dependencies |
|-------|-------|----------|----------|--------------|
| **Round 23** | TypeScript Compilation Fixes | 3-4h | P0 | None |
| **Round 24** | Deep Import Elimination | 12-16h | P1 | Round 23 |
| **Round 25** | React.FC Pattern Migration | 22-28h | P1 | Round 24 |
| **Round 26** | Package Documentation | 30-40h | P1 | Round 25 |
| **Round 27** | TODO/FIXME Resolution | 8-10h | P2 | Round 26 |
| **Round 28** | Configuration & Cleanup | 8-10h | P2/P3 | Round 27 |

### Phased Rollout (12-Week Timeline)

**Weeks 1-2: Critical Fixes (P0)**
- Round 23: TypeScript compilation fixes
- Unblock production builds
- **Deliverable**: All packages compile successfully

**Weeks 3-5: Import Architecture (P1)**
- Round 24: Deep import elimination
- Improve code maintainability
- **Deliverable**: 0 deep imports, all @pulwave/* aliases

**Weeks 6-8: Component Patterns (P1)**
- Round 25: React.FC migration
- Modernize component declarations
- **Deliverable**: All components use function declarations

**Weeks 9-11: Documentation (P1)**
- Round 26: Package READMEs
- Improve developer experience
- **Deliverable**: All 53 packages documented

**Week 12: Polish & Cleanup (P2/P3)**
- Round 27: TODO/FIXME resolution
- Round 28: Configuration cleanup
- **Deliverable**: Production-ready monorepo

### Resource Requirements

**Developer Time**: 89-118 hours total
- Senior Developer: 40-50 hours (Rounds 23-25)
- Mid-level Developer: 30-40 hours (Round 26)
- Any Developer: 19-28 hours (Rounds 27-28)

**Tools Required**:
- VS Code with TypeScript support
- Node.js 20+ and npm
- Git for version control
- Madge for circular dependency checking (optional)

### Parallel Execution

Some rounds can be parallelized:
- Round 27 (TODO resolution) can run parallel to Round 26 (Documentation)
- Round 28 (Config cleanup) can run parallel to Round 27

**Optimized Timeline**: 10-11 weeks with 2 developers

---

## Success Metrics

### Code Quality Metrics

**Before** (Current State):
- Deep imports: 441 instances
- React.FC usage: 278 instances
- Package documentation: 7/53 (13%)
- TypeScript errors: 7 errors
- TODO/FIXME comments: 39
- export default: 3 instances
- Architecture score: 76/100

**After** (Target State):
- Deep imports: 0 instances ✅
- React.FC usage: 0 instances ✅
- Package documentation: 53/53 (100%) ✅
- TypeScript errors: 0 errors ✅
- TODO/FIXME comments: 0 ✅
- export default: 0 instances ✅
- Architecture score: 95+/100 ✅

### Developer Experience Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Onboarding time | 2-3 days | 4-6 hours | -70% |
| Code navigation ease | 6/10 | 9/10 | +50% |
| Refactoring safety | 5/10 | 10/10 | +100% |
| Documentation coverage | 13% | 100% | +670% |
| Build reliability | 90% | 100% | +11% |

### Maintainability Metrics

- **Import Management**: 100% package aliases (0 deep imports)
- **Pattern Consistency**: 100% function declarations (0 React.FC)
- **Documentation**: 100% package coverage (53/53 READMEs)
- **Code Cleanliness**: 0 TODO/FIXME comments
- **Type Safety**: 100% compilation success

---

## Risk Assessment

### High-Risk Items

1. **React.FC Migration (Round 25)**
   - Risk: Breaking changes in component signatures
   - Mitigation: Comprehensive testing, gradual rollout
   - Contingency: Rollback plan, component-by-component validation

2. **Deep Import Elimination (Round 24)**
   - Risk: Breaking existing imports, runtime errors
   - Mitigation: Automated search/replace, thorough testing
   - Contingency: Git revert capability, package-by-package approach

### Medium-Risk Items

1. **TypeScript Compilation Fixes (Round 23)**
   - Risk: Breaking changes in type contracts
   - Mitigation: Careful type analysis, incremental changes
   - Contingency: Type-safe refactoring approach

2. **Documentation Creation (Round 26)**
   - Risk: Outdated/incorrect examples
   - Mitigation: Code examples tested in isolation
   - Contingency: Peer review, example validation

### Low-Risk Items

1. **TODO/FIXME Resolution (Round 27)** - Low impact, gradual resolution
2. **Configuration Cleanup (Round 28)** - Well-understood changes
3. **export default Removal (Round 28)** - Minimal scope (3 files)

---

## Validation & Testing Strategy

### Per-Round Validation

**Round 23** (TypeScript Fixes):
```bash
npm run typecheck        # Must pass
npm run build           # All packages build
npm run test            # All tests pass
```

**Round 24** (Deep Imports):
```bash
npm run typecheck       # Verify imports resolve
npm run build           # No missing modules
npm run test            # No runtime errors
npm run check:circular  # No new circular deps
```

**Round 25** (React.FC Migration):
```bash
npm run typecheck       # Props types correct
npm run test            # Component behavior unchanged
npm run build           # Production build works
npm run dev             # Dev mode works
```

**Round 26** (Documentation):
```bash
# Manual review of README files
# Code examples tested individually
# Links validated
```

**Round 27** (TODO Resolution):
```bash
npm run typecheck       # No new errors
npm run test            # All tests pass
npm run lint            # Code quality maintained
```

**Round 28** (Config Cleanup):
```bash
npm run typecheck       # All configs valid
npm run build           # All packages compile
npm run test            # No config-related failures
```

### Integration Testing

After each round:
1. Run full test suite (`npm run test`)
2. Build all packages (`npm run build`)
3. Verify dev server works (`npm run dev`)
4. Check bundle sizes (`npm run size`)
5. Manual smoke testing of critical flows

### Regression Prevention

- Git branch per round for easy rollback
- Comprehensive test coverage before changes
- Automated CI/CD checks
- Peer review for critical changes
- Staged deployment (dev → staging → production)

---

## Related Documents

### Current Plan Documents
1. 📋 [COMPREHENSIVE-IMPLEMENTATION-PLAN.md](.claude/COMPREHENSIVE-IMPLEMENTATION-PLAN.md)
   - Rounds 8-22: TypeScript improvements (146-190 hours)

2. 📋 [TESTING-DOCUMENTATION-PLAN.md](.claude/TESTING-DOCUMENTATION-PLAN.md)
   - UI component testing (713-950 hours)
   - Storybook setup
   - E2E testing

3. 📋 [testing-progress-round1.md](.claude/testing-progress-round1.md)
   - Button component test (template)
   - Phase 1 progress tracking

### Audit Documents
4. 📊 [FINAL-AUDIT-SUMMARY.md](.claude/FINAL-AUDIT-SUMMARY.md)
   - Overall codebase health: 98.5/100
   - Architecture analysis

5. 📊 [implementation-summary-round7.md](.claude/implementation-summary-round7.md)
   - Previous work completed (Rounds 1-7)

### Reference Documents
6. 📖 [CLAUDE.md](.claude/CLAUDE.md)
   - Pulwave architecture guide
   - Coding patterns and conventions

---

## Appendix A: Detailed File Lists

### Deep Imports by Package (441 total)

**Features Packages** (120+ files):
- features/admin/* - 25 files
- features/auth/* - 15 files
- features/dashboard/* - 18 files
- features/i18n/* - 12 files
- features/layout/* - 10 files
- features/payments/* - 8 files
- features/properties/* - 15 files
- features/settings/* - 17 files

**Pages Packages** (40+ files):
- pages/admin/* - 12 files
- pages/auth/* - 8 files
- pages/dashboard/* - 10 files
- pages/onboarding/* - 6 files
- pages/payments/* - 4 files

**Other Packages** (31+ files):
- widgets/* - 20 files
- entities/* - 11 files

### React.FC Usage by Package (278 total)

**UI Components** (92 components):
- All component files in `packages/shared/ui/components/*`

**Feature Components** (100+ components):
- Distributed across all feature packages

**Page Components** (50+ components):
- All page components across page packages

**Widget Components** (36+ components):
- All widget components in widgets package

---

## Appendix B: Migration Scripts

### Deep Import Replacement Script

```bash
#!/bin/bash
# replace-deep-imports.sh

# Replace deep imports with package aliases
find packages -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i \
  -e "s|from '[.][.]/[.][.]/[.][.].*shared/ui|from '@pulwave/ui|g" \
  -e "s|from '[.][.]/[.][.]/[.][.].*shared/hooks|from '@pulwave/hooks|g" \
  -e "s|from '[.][.]/[.][.]/[.][.].*entity-|from '@pulwave/entity-|g" \
  {} \;

# Verify no deep imports remain
echo "Remaining deep imports:"
grep -r "from '[.][.]/[.][.]/[.][.]" packages --include="*.ts" --include="*.tsx" | wc -l
```

### React.FC Conversion Script

```bash
#!/bin/bash
# convert-react-fc.sh

# Convert React.FC to function declarations
find packages -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i \
  -e "s|: React\.FC<\([^>]*\)> = (|= (\1) => (|g" \
  -e "s|: FunctionComponent<\([^>]*\)> = (|= (\1) => (|g" \
  {} \;

echo "Conversion complete. Run typecheck to verify."
```

### export default Finder Script

```bash
#!/bin/bash
# find-export-default.sh

echo "Finding export default in components:"
grep -r "export default" packages/shared/ui/components --include="*.tsx" --include="*.ts"
grep -r "export default" packages/features --include="*.tsx" --include="*.ts"
grep -r "export default" packages/pages --include="*.tsx" --include="*.ts"
```

---

## Appendix C: Documentation Templates

### Entity Package README Template

```markdown
# @pulwave/entity-[name]

> Data layer for [entity description] - handles database operations, caching, and business logic

## Overview

This package provides the complete data layer for [entity], including:
- React Query hooks for data fetching
- Repository pattern for database access
- Service layer for business logic
- TypeScript types and interfaces

## Installation

\`\`\`bash
npm install @pulwave/entity-[name]
\`\`\`

## Usage

### Basic Hook Usage

\`\`\`typescript
import { use[Entity] } from '@pulwave/entity-[name]';

function MyComponent() {
  const { data, isLoading, error } = use[Entity]();

  if (isLoading) return <Skeleton />;
  if (error) return <Error error={error} />;

  return <div>{data.name}</div>;
}
\`\`\`

### Service Layer

\`\`\`typescript
import { [entity]Service } from '@pulwave/entity-[name]';

// Business logic operations
const result = await [entity]Service.someOperation(params);
\`\`\`

## API Reference

### Hooks

- \`use[Entity](id?)\` - Fetch entity data
- \`useCreate[Entity]()\` - Create new entity
- \`useUpdate[Entity]()\` - Update existing entity
- \`useDelete[Entity]()\` - Delete entity

### Services

- \`[entity]Service.findById(id)\`
- \`[entity]Service.create(data)\`
- \`[entity]Service.update(id, data)\`
- \`[entity]Service.delete(id)\`

### Types

\`\`\`typescript
export interface [Entity] {
  id: string;
  // ... other fields
}
\`\`\`

## Architecture

\`\`\`
Component → Hook → Service → Repository → Provider
\`\`\`

## Dependencies

- \`@pulwave/entity-infrastructure\` - Base infrastructure
- \`@tanstack/react-query\` - Data fetching
- \`zod\` - Validation

## Development

\`\`\`bash
npm run dev      # Development mode
npm run test     # Run tests
npm run build    # Build package
npm run typecheck # Type checking
\`\`\`

## Related Packages

- [@pulwave/entity-infrastructure](../infrastructure) - Base infrastructure
- [@pulwave/features-[related]](../../features/[related]) - UI features

## License

MIT
```

### Feature Package README Template

```markdown
# @pulwave/features-[name]

> Feature package for [feature description] - contains domain-specific UI and business logic

## Overview

This package provides the complete [feature] feature, including:
- Feature-specific UI components
- Custom hooks for feature logic
- Utilities and helpers
- Feature configuration

## Installation

\`\`\`bash
npm install @pulwave/features-[name]
\`\`\`

## Usage

\`\`\`typescript
import { [Component] } from '@pulwave/features-[name]';

function App() {
  return <[Component] />;
}
\`\`\`

## Components

### [Component1]

Description and usage example.

### [Component2]

Description and usage example.

## Hooks

### use[Feature]()

Description and usage example.

## Dependencies

- \`@pulwave/ui\` - UI components
- \`@pulwave/entity-[related]\` - Data layer
- \`@pulwave/hooks\` - Shared hooks

## Development

\`\`\`bash
npm run dev
npm run test
npm run build
\`\`\`

## License

MIT
```

---

## Conclusion

This Architecture & Structure Implementation Plan addresses the remaining gaps in code organization, documentation, and modern best practices. Completing Rounds 23-28 (89-118 hours) will bring the Pulwave monorepo to a **95+ architecture score** with:

✅ **100% type safety** (0 compilation errors)
✅ **100% modern patterns** (0 React.FC, 0 deep imports)
✅ **100% documentation** (53/53 package READMEs)
✅ **0 technical debt** (0 TODO/FIXME comments)
✅ **Production-ready architecture**

Combined with previous plans:
- **COMPREHENSIVE-IMPLEMENTATION-PLAN.md**: Rounds 8-22 (146-190 hours)
- **TESTING-DOCUMENTATION-PLAN.md**: Testing infrastructure (713-950 hours)
- **ARCHITECTURE-STRUCTURE-PLAN.md**: Rounds 23-28 (89-118 hours)

**Total Improvement Investment**: 948-1258 hours

**Result**: World-class, production-ready React monorepo with exceptional code quality, developer experience, and maintainability.

---

*Document created: 2026-01-18*
*Plan: Rounds 23-28*
*Total Effort: 89-118 hours (11-15 weeks @ 8h/week)*
*Current Status: 📋 PLANNED - Ready for execution*
