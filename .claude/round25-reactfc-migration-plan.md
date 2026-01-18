# Round 25: React.FC Pattern Migration

**Date**: 2026-01-18
**Status**: 📋 PLANNED
**Priority**: P1 - High

---

## Executive Summary

Migrate **474 React.FC instances** to function declarations aligned with React 19 best practices. This migration removes the implicit `children` prop that React.FC provides, making component APIs more explicit and preparing for React 19's stricter TypeScript definitions.

---

## Why This Matters

### React 19 Alignment
- React 19 removed implicit `children` from `React.FC`
- Explicit props make component contracts clearer
- Better TypeScript inference without the `React.FC` wrapper
- Aligns with official React team recommendations

### Benefits
- ✅ **Clearer APIs** - No implicit props, explicit contracts
- ✅ **Better TypeScript** - Direct type inference, no wrapper overhead
- ✅ **React 19 Ready** - Prepared for future React versions
- ✅ **Reduced Magic** - Less framework magic, more explicit code
- ✅ **Smaller Bundle** - Removes unnecessary type wrapper

---

## Scope

### Total Files: 474

#### By Package Category:

| Package | Files | Pattern |
|---------|-------|---------|
| **Apps** | 30 | Page components, entry points |
| **Pages** | 7 | Shell pages, auth pages |
| **Features** | 98 | Feature components, business logic |
| **Widgets** | 6 | Composite widgets |
| **Shared UI** | 238 | Data-viz charts, UI components |
| **Style Guide** | 95 | Demo components, docs |

#### By Type:

| Type | Count | Example |
|------|-------|---------|
| **Simple (no props)** | ~180 | `const Page: React.FC = () => {}` |
| **With Props** | ~250 | `const Component: React.FC<Props> = ({}) => {}` |
| **With forwardRef** | ~44 | Already migrated or needs ref handling |

---

## Migration Patterns

### Pattern 1: Simple Component (No Props)

**BEFORE**:
```typescript
import React from 'react';

export const DashboardPage: React.FC = () => {
    return <div>Dashboard</div>;
};
```

**AFTER**:
```typescript
export const DashboardPage = () => {
    return <div>Dashboard</div>;
};
```

**Changes**:
- Remove `React` import (unless used elsewhere)
- Remove `: React.FC` type annotation
- Keep everything else the same

---

### Pattern 2: Component With Props

**BEFORE**:
```typescript
import React from 'react';

interface UserInfoProps {
    name: string;
    email: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({ name, email }) => {
    return (
        <div>
            <h3>{name}</h3>
            <p>{email}</p>
        </div>
    );
};
```

**AFTER**:
```typescript
interface UserInfoProps {
    name: string;
    email: string;
}

export const UserInfo = ({ name, email }: UserInfoProps) => {
    return (
        <div>
            <h3>{name}</h3>
            <p>{email}</p>
        </div>
    );
};
```

**Changes**:
- Remove `React` import (unless used elsewhere)
- Remove `: React.FC<Props>` annotation
- Add props type directly to parameters: `({ param }: Props)`

---

### Pattern 3: Component With Children Prop

**BEFORE**:
```typescript
import React from 'react';

interface CardProps {
    title: string;
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
    return (
        <div className="card">
            <h2>{title}</h2>
            {children}
        </div>
    );
};
```

**AFTER**:
```typescript
import type { ReactNode } from 'react';

interface CardProps {
    title: string;
    children?: ReactNode;  // ← Explicitly add children
}

export const Card = ({ title, children }: CardProps) => {
    return (
        <div className="card">
            <h2>{title}</h2>
            {children}
        </div>
    );
};
```

**Changes**:
- Add `children?: ReactNode` to props interface explicitly
- Import `ReactNode` from 'react' (type-only)
- Move props type to function parameters

---

### Pattern 4: Component Using React Namespace

**BEFORE**:
```typescript
import React from 'react';

export const Demo: React.FC = () => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        console.log('Count:', count);
    }, [count]);

    return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
```

**AFTER**:
```typescript
import { useState, useEffect } from 'react';

export const Demo = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log('Count:', count);
    }, [count]);

    return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
```

**Changes**:
- Import hooks directly: `import { useState, useEffect } from 'react'`
- Remove `React.` namespace prefix
- Remove `: React.FC` annotation

---

### Pattern 5: Already Using forwardRef (No Change Needed)

**CURRENT** (Already correct):
```typescript
import { forwardRef } from 'react';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant,
    children,
    ...props
}, ref) => {
    return (
        <button ref={ref} {...props}>
            {children}
        </button>
    );
});
Button.displayName = 'Button';
```

**Action**: ✅ **No change required** - Already using modern pattern

---

## Phase Breakdown

### Phase 1: Apps (30 files) - 3-4 hours

**Packages**:
- `apps/web/real-estate/src/pages/` (15 files)
- `apps/web/restaurant/src/pages/` (14 files)
- `apps/web/restaurant/src/App.tsx` (1 file)

**Pattern**: Mostly simple page components with no props

**Approach**: Manual migration or single agent

**Verification**: Run dev server for each app, test routing

---

### Phase 2: Pages & Widgets (13 files) - 2-3 hours

**Packages**:
- `packages/pages/*/src/pages/` (7 files)
- `packages/widgets/` (6 files)

**Pattern**: Shell pages, layout widgets with props

**Approach**: Manual migration

**Verification**: Test in style guide and admin pages

---

### Phase 3: Features (98 files) - 10-12 hours

**Packages**:
- `packages/features/style-guide/` (95 files - demos and docs)
- `packages/features/layout/` (1 file)
- `packages/features/settings/` (1 file)
- `packages/features/shared/` (1 file)

**Pattern**: Mixed - demos (simple), feature components (with props)

**Approach**: Use Task tool with agent for style-guide demos (95 files)

**Verification**: Run style guide, verify all demos render

---

### Phase 4: Shared UI - Core Components (20 files) - 3-4 hours

**Packages**:
- `packages/shared/ui/components/` (20 files needing migration)

**Pattern**: UI components with props, some with children

**Approach**: Manual migration (critical components)

**Verification**: Run component tests, visual regression

---

### Phase 5: Data Visualization (238 files) - 18-24 hours

**Packages**:
- `packages/shared/ui/data-visualization/charts/` (~160 files)
- `packages/shared/ui/data-visualization/primitives/` (~30 files)
- `packages/shared/ui/data-visualization/providers/adapters/` (~48 files)

**Pattern**: Chart components with extensive props

**Approach**:
1. Use Task tool with multiple parallel agents (charts by category)
2. Migrate primitives manually first (foundation)
3. Then migrate charts (depend on primitives)
4. Finally adapters

**Verification**: Run data-viz style guide section, test all chart types

---

### Phase 6: Admin & Remaining Features (75 files) - 8-10 hours

**Packages**:
- `packages/features/admin/` (30 files)
- `packages/features/auth/` (10 files)
- `packages/features/settings/` (8 files)
- `packages/features/properties/` (1 file)
- `packages/features/legal/` (1 file)
- `packages/features/social/` (1 file)
- `packages/features/subscriptions/` (1 file)
- `packages/features/feedback/` (1 file)
- `packages/features/dashboard/` (1 file)
- `packages/features/shared/` (21 files)

**Pattern**: Feature-specific components with business logic

**Approach**: Mixed - manual for complex, agent for simple

**Verification**: Test admin panel, auth flows, settings pages

---

## Detailed Migration Checklist

### Pre-Migration
- [ ] Commit all pending changes (clean working tree)
- [ ] Run full test suite to establish baseline
- [ ] Run typecheck to establish baseline
- [ ] Document current React.FC count: 474 files

### Per-Phase Checklist
For each phase:
- [ ] Identify all files in phase
- [ ] Choose migration approach (manual vs agent)
- [ ] Perform migration
- [ ] Run typecheck for affected packages
- [ ] Run tests for affected packages
- [ ] Visual verification (run dev server)
- [ ] Git commit with descriptive message
- [ ] Update progress document

### Post-Migration
- [ ] Verify zero React.FC instances remain
- [ ] Run full test suite
- [ ] Run full typecheck
- [ ] Update documentation
- [ ] Create completion summary
- [ ] Mark Round 25 complete

---

## Import Strategy

### React Import Changes

**Before Migration**:
```typescript
import React from 'react';
import { useState, useEffect } from 'react';
```

**After Migration**:
```typescript
// Option 1: Only keep if React.createElement or React.Fragment used directly
import React from 'react';
import { useState, useEffect } from 'react';

// Option 2: Remove React default import if only hooks used
import { useState, useEffect } from 'react';

// Option 3: Add type imports when needed
import type { ReactNode, MouseEvent } from 'react';
```

**Decision Rules**:
1. **Keep `import React`** if:
   - Using JSX (transpiler needs it) ← **Always true in our setup**
   - Using `React.createElement` directly
   - Using `React.Fragment` directly
   - Using other React namespace methods

2. **Remove `import React`** if:
   - Only using hooks (useState, useEffect, etc.)
   - Only using types (import as `type` instead)
   - **AND** Vite/JSX runtime doesn't need it

3. **Our Approach**: Keep `import React` or convert to named imports only when safe

---

## Verification Strategy

### Automated Checks

```bash
# 1. Count remaining React.FC instances
find packages apps -name "*.tsx" -type f -exec grep -l "React\.FC" {} \; | wc -l
# Target: 0

# 2. TypeScript compilation
npm run typecheck
# Target: No new errors

# 3. Linting
npm run lint
# Target: No new errors

# 4. Tests
npm run test
# Target: All pass

# 5. Build
npm run build
# Target: Success
```

### Manual Verification

For each major component category:
- [ ] Open in dev server
- [ ] Verify rendering
- [ ] Test interactions
- [ ] Check console for errors
- [ ] Verify TypeScript types work correctly

**Key Areas**:
- Admin panel pages
- Auth flows
- Settings pages
- Data visualization charts
- Style guide demos

---

## Risk Mitigation

### Potential Issues

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|---------|-----------|
| Children prop missing | High | Medium | Add explicit `children?: ReactNode` to all interfaces that need it |
| React import needed for JSX | Medium | High | Keep React import in all files, or verify JSX runtime config |
| Type inference breaks | Low | Medium | Add explicit types where needed |
| forwardRef components affected | Low | High | Don't touch forwardRef components (already correct) |
| Breaking component APIs | Low | High | Components don't change API, only implementation |

### Rollback Plan

If critical issues arise:
1. Git revert to pre-migration commit
2. Re-plan approach for problematic areas
3. Continue with safer packages

### Testing Strategy

**Phase Testing**:
- After each phase, run:
  - `npm run typecheck -w [package]`
  - `npm run test -w [package]`
  - Visual check in dev server

**Final Testing**:
- Full typecheck: `npm run typecheck`
- Full test suite: `npm run test`
- Build verification: `npm run build`
- E2E smoke tests in each app

---

## Time Estimate

| Phase | Files | Hours | Approach |
|-------|-------|-------|----------|
| Phase 1: Apps | 30 | 3-4 | Manual or single agent |
| Phase 2: Pages & Widgets | 13 | 2-3 | Manual |
| Phase 3: Features | 98 | 10-12 | Agent for style-guide |
| Phase 4: Shared UI Core | 20 | 3-4 | Manual |
| Phase 5: Data Visualization | 238 | 18-24 | Parallel agents |
| Phase 6: Admin & Remaining | 75 | 8-10 | Mixed |
| **Testing & Verification** | - | 6-8 | All phases |
| **Documentation** | - | 2-3 | Summary, updates |
| **Total** | **474** | **52-68** | **~60 hours avg** |

**Note**: Original estimate was 22-28h for 278 files. Actual count is 474 files, so adjusted to 52-68h (scaled proportionally with buffer).

---

## Success Criteria

1. ✅ Zero `React.FC` instances in codebase
2. ✅ Zero `React.FunctionComponent` instances
3. ✅ All TypeScript compilation passes
4. ✅ All tests pass
5. ✅ All apps build successfully
6. ✅ Manual verification of key features works
7. ✅ No regression in bundle size
8. ✅ Documentation updated

---

## Files to Update

Based on grep results, the 474 files are distributed as follows:

### Apps (30 files)
```
apps/web/real-estate/src/pages/*.tsx (15)
apps/web/restaurant/src/pages/*.tsx (14)
apps/web/restaurant/src/App.tsx (1)
```

### Pages (7 files)
```
packages/pages/admin/src/pages/*.tsx (5)
packages/pages/auth/src/pages/*.tsx (2)
packages/pages/onboarding/wrappers/*.tsx (1)
packages/pages/shell/src/layouts/*.tsx (3)
packages/pages/style-guide/src/pages/*.tsx (2)
```

### Features (98 files)
```
packages/features/style-guide/src/** (95)
packages/features/admin/src/** (30)
packages/features/auth/src/** (10)
packages/features/settings/src/** (12)
packages/features/layout/src/** (6)
packages/features/shared/** (22)
packages/features/properties/** (1)
packages/features/legal/** (1)
packages/features/social/** (1)
packages/features/subscriptions/** (1)
packages/features/feedback/** (1)
packages/features/dashboard/** (1)
```

### Shared UI (258 files)
```
packages/shared/ui/data-visualization/** (238)
packages/shared/ui/components/** (20)
```

### Widgets (6 files)
```
packages/widgets/layout/** (3)
packages/widgets/data-display/** (2)
packages/widgets/data-transfer/** (2)
packages/widgets/feedback/** (1)
```

### Entity (1 file)
```
packages/entities/translation/hooks/__tests__/useTranslation.test.tsx (1)
```

---

## Next Steps

1. **Review this plan** - Confirm approach and estimates
2. **Choose starting phase** - Recommend Phase 1 (Apps) for quick wins
3. **Set up tracking** - Create progress document
4. **Begin Phase 1** - Migrate 30 app pages
5. **Verify and commit** - Test, verify, commit Phase 1
6. **Continue phases** - Systematic execution through Phase 6

---

## Related Documentation

- [ARCHITECTURE-STRUCTURE-PLAN.md](.claude/ARCHITECTURE-STRUCTURE-PLAN.md) - Overall architecture plan
- [round24-completion-summary.md](.claude/round24-completion-summary.md) - Previous round context
- [CLAUDE.md](.claude/CLAUDE.md) - Project conventions

---

## Notes

- **React 19 Context**: React 19 removed implicit `children` from `React.FC`, making this migration essential for future-proofing
- **Type Safety**: Explicit props improve type safety and IDE autocomplete
- **Bundle Size**: Removing React.FC wrapper reduces bundle size marginally
- **Developer Experience**: Clearer component contracts improve DX
- **Consistency**: Many files already use function declarations; this creates consistency

---

**Round 25 Status**: 📋 **PLANNED**

*Last Updated: 2026-01-18*
