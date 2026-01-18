# Round 26: TypeScript Error Fixes

**Started**: 2026-01-18
**Status**: 🔄 Planning
**Goal**: Fix ~30 TypeScript errors discovered during Round 25 typecheck

---

## Overview

During Round 25's final typecheck, we discovered approximately 30 pre-existing TypeScript errors in the `@pulwave/ui` package and related components. These errors are unrelated to the React.FC migration but should be fixed to maintain code quality.

---

## Error Categories

### 1. DisplayName Property Issues (4 instances)
**Affected Files**:
- `packages/shared/ui/components/DataTable/DataTable.tsx:14` - Column component
- `packages/shared/ui/components/Label/Label.tsx:70` - Label compound component
- `packages/shared/ui/components/NumberedList/NumberedList.tsx:97` - NumberedList compound component
- `packages/shared/ui/components/StatusIndicator/StatusIndicator.tsx:81` - StatusIndicator compound component

**Issue**: TypeScript doesn't recognize `displayName` property on function components with compound components pattern.

**Solution**: Either:
- Add explicit type annotation for displayName
- Use namespace pattern instead
- Remove displayName if not needed

### 2. MouseEvent Type Mismatches (3 instances)
**Affected Files**:
- `packages/shared/ui/components/DatePicker/DatePicker.tsx:94,95` - document.addEventListener with React MouseEvent
- `packages/shared/ui/components/TimePicker/TimePicker.tsx:193` - Button onClick with DOM MouseEvent

**Issue**: Mixing React's `MouseEvent<T>` with DOM's native `MouseEvent` in event handlers.

**Solution**: Use correct MouseEvent type:
- React components: `MouseEvent<HTMLElement>` from 'react'
- DOM addEventListener: native `globalThis.MouseEvent`

### 3. GroupRow Type Issues (11 instances)
**Affected File**: `packages/shared/ui/components/GroupRow/GroupRow.tsx`

**Issues**:
- Line 82,176,220: `{}.includes()` / `{}.split()` - empty object treated as string
- Lines 100,105,115,228,232: `{}` not assignable to ReactNode or string

**Solution**: Fix prop types and default values to have proper string types instead of empty objects.

### 4. Input Ref Type Issues (1 instance)
**Affected File**: `packages/shared/ui/components/Input/Input.tsx:40`

**Issue**: Ref type incompatibility between HTMLInputElement and HTMLTextAreaElement.

**Solution**: Use union ref type or separate refs for input vs textarea.

### 5. Menu Icon Type Issues (3 instances)
**Affected File**: `packages/shared/ui/components/Menu/Menu.tsx:57,88,116`

**Issue**: Icon prop type is too broad (ReactNode) but used as JSX component.

**Solution**: Constrain icon prop to ComponentType or React.ElementType.

### 6. Switch Type Issues (1 instance)
**Affected File**: `packages/shared/ui/components/Switch/Switch.tsx:60`

**Issue**: `boolean | null` not assignable to `boolean | undefined`.

**Solution**: Convert null to undefined or handle null explicitly.

### 7. Tabs Key Type Issue (1 instance)
**Affected File**: `packages/shared/ui/components/Tabs/Tabs.tsx:93`

**Issue**: Boolean value `true` used as key prop.

**Solution**: Use proper key type (string | number).

### 8. Chart Type Issues (5 instances)
**Affected Files**:
- `packages/shared/ui/data-visualization/charts/geography/WorldMapChart/WorldMapChart.tsx:255` - Empty object as string
- `packages/shared/ui/data-visualization/charts/hierarchical/TreemapChart/TreemapChart.tsx:153` - Tooltip formatter type mismatch
- `packages/shared/ui/data-visualization/charts/radial/RadarChart/RadarChart.tsx:85,92` - Missing textSecondary color
- `packages/shared/ui/data-visualization/charts/visx/cartesian/LineChart/LineChart.tsx:125` - Curve type string vs factory
- `packages/shared/ui/data-visualization/primitives/ChartContainer/ChartContainer.tsx:45` - Null not assignable to string | boolean

---

## Execution Plan

### Phase 1: Compound Component DisplayName Fixes
**Files**: 4
**Method**: Manual or single agent
**Time**: 15-30 min

Fix displayName type issues in:
- DataTable
- Label
- NumberedList
- StatusIndicator

### Phase 2: Event Handler Type Fixes
**Files**: 2
**Method**: Manual
**Time**: 15-30 min

Fix MouseEvent type mismatches in:
- DatePicker (2 instances)
- TimePicker (1 instance)

### Phase 3: GroupRow Props & Types
**Files**: 1
**Method**: Manual (complex, needs careful analysis)
**Time**: 30-45 min

Fix all 11 type issues in GroupRow component.

### Phase 4: Input/Form Component Fixes
**Files**: 3
**Method**: Manual
**Time**: 15-30 min

Fix type issues in:
- Input (ref type)
- Switch (null vs undefined)
- Menu (icon types)

### Phase 5: Tabs & Misc UI Fixes
**Files**: 1
**Method**: Manual
**Time**: 10-15 min

Fix Tabs key type issue.

### Phase 6: Chart Component Fixes
**Files**: 5
**Method**: Manual or agent
**Time**: 30-45 min

Fix type issues in chart components.

---

## Total Estimated Time

- **Best case**: 2-2.5 hours
- **Worst case**: 3-4 hours
- **Likely**: 2.5-3 hours

---

## Success Criteria

1. ✅ All 30 TypeScript errors resolved
2. ✅ `npm run typecheck` passes for @pulwave/features-legal (the package that revealed the errors)
3. ✅ No new errors introduced
4. ✅ All existing functionality preserved
5. ✅ Code follows existing patterns and conventions

---

## Verification Commands

```bash
# Check specific package
npm run typecheck -w @pulwave/features-legal

# Check all UI packages
npm run typecheck -w @pulwave/ui

# Full typecheck
npm run typecheck

# Verify no regressions
npm run lint
npm run test
```

---

*Created: 2026-01-18*
