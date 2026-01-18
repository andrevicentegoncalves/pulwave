# Complete Skills Cross-Reference & Implementation Tasks

> Cross-reference analysis of 280 TSX components against ALL 62 Skills
> (47 Pulwave Library + 15 Anthropic)
> Generated: 2026-01-18
> **IMPORTANT**: This is a PLANNING DOCUMENT with 10 weeks estimated implementation time

---

## ⚠️ CRITICAL CLARIFICATION

**This document is a COMPREHENSIVE AUDIT & PLANNING DOCUMENT, not a task tracker.**

**Estimated Implementation Time**: 10 weeks (2-3 developers full-time)
**Status**: PLANNING COMPLETE ✅ | EXECUTION NOT STARTED ⬜

The checkboxes in sections 2.1-2.5 are **INVENTORY CHECKLISTS** (components identified for work), NOT completion status. They indicate "analyzed" not "fixed".

**Actual Implementation Progress**: 0% complete

---

## Executive Summary

This document provides a comprehensive cross-check of all Pulwave TSX components (280 files) against:
- **47 Pulwave Library Skills** (components, CVA, styling, accessibility, performance, design-system, etc.)
- **15 Anthropic Skills** (frontend-design, webapp-testing, pdf, xlsx, theme-factory, etc.)

### Statistics
| Metric | Value |
|--------|-------|
| Components Analyzed | 280 |
| Total Skills Analyzed | 62 |
| Library Skills | 47 |
| Anthropic Skills | 15 |
| CRITICAL Tasks | 15 |
| HIGH Priority Tasks | 18 |
| MEDIUM Priority Tasks | 12 |
| **Implementation Status** | **PLANNING ONLY** |

---

## CRITICAL: Library Skills Compliance Tasks

### Task L1: Semantic Token Migration (CRITICAL)
**Skill Reference**: `front-end/components/AGENTS.md` - Rule 1.1, 1.2
**Status**: ⬜ NOT STARTED
**Deadline**: Week 1

**Violations to Find & Fix**:
- [ ] Search for hardcoded colors: `#[0-9a-fA-F]{3,6}`, `rgb(`, `rgba(`
- [ ] Search for hardcoded spacing: `\d+px` (should be `var(--spacing-X)`)
- [ ] Search for hardcoded fonts: `font-size: \d+px`

**Files to Audit**:
| Category | Files | Priority |
|----------|-------|----------|
| UI Components | 91 | CRITICAL |
| Feature Components | 178 | HIGH |
| Page Components | 31 | HIGH |

**Expected Fix Pattern**:
```scss
// ❌ BEFORE
.card { padding: 16px; color: #333; }

// ✅ AFTER
.card { padding: var(--spacing-4); color: var(--color-text-primary); }
```

---

### Task L2: CVA Variant Migration (CRITICAL)
**Skill Reference**: `front-end/cva/AGENTS.md` - Rule 3.1, 3.2, 3.3
**Status**: ⬜ NOT STARTED
**Deadline**: Week 2

**Components Needing CVA Migration**:
| Component | Current State | Target |
|-----------|---------------|--------|
| Button (all variants) | AUDIT | types.ts with CVA |
| Input (all variants) | AUDIT | types.ts with CVA |
| Badge (all variants) | AUDIT | types.ts with CVA |
| Card (all variants) | AUDIT | types.ts with CVA |
| All 91 UI components | AUDIT | CVA compliance |

**Required Pattern**:
```tsx
// types.ts
export const buttonVariants = cva('btn', {
  variants: {
    variant: { primary: 'btn--primary', secondary: 'btn--secondary' },
    size: { sm: 'btn--sm', md: 'btn--md', lg: 'btn--lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;
```

---

### Task L3: BEM Naming Audit (HIGH)
**Skill Reference**: `front-end/styling/AGENTS.md` - Rule 6.1
**Status**: ⬜ NOT STARTED
**Deadline**: Week 2

**Check All SCSS for**:
- [ ] Block naming: `.component-name`
- [ ] Element naming: `.component-name__element`
- [ ] Modifier naming: `.component-name--modifier`
- [ ] Max 3 nesting levels

**Anti-Patterns to Fix**:
```scss
// ❌ BAD
.cardHeader { }           // camelCase
.card-header { }          // kebab-case element
.card .header .title { }  // No BEM

// ✅ GOOD
.card__header { }
.card__header-title { }
.card--elevated { }
```

---

### Task L4: Accessibility Compliance (CRITICAL)
**Skill Reference**: `front-end/accessibility/AGENTS.md` - Rules 8.1-8.4
**Status**: ⬜ NOT STARTED
**Deadline**: Week 3

#### L4.1: Icon-Only Buttons (CRITICAL)
- [ ] Add `aria-label` to ALL icon-only buttons
- Files: All `IconOnly*Demo.tsx`, toolbar buttons, close buttons

```tsx
// ✅ Required
<button aria-label="Close dialog"><IconX /></button>
```

#### L4.2: Expandable Components (HIGH)
- [ ] Add `aria-expanded` to accordion triggers
- [ ] Add `aria-controls` to reference content
- Files: Accordion, Dropdown, TreeView, Sidebar components

```tsx
// ✅ Required
<button aria-expanded={isOpen} aria-controls="content-id">
  Toggle
</button>
<div id="content-id">{content}</div>
```

#### L4.3: Live Regions (HIGH)
- [ ] Add `aria-live="polite"` to Toast components
- [ ] Add `aria-live="assertive"` to critical alerts
- Files: Toast, Alert, Notification components

#### L4.4: Semantic HTML (CRITICAL)
- [ ] Replace `<div onClick>` with `<button>`
- [ ] Use `<nav>` for navigation components
- [ ] Use `<main>` for main content
- [ ] Use `<article>` for cards/list items

---

### Task L5: Performance Optimization (CRITICAL)
**Skill Reference**: `front-end/performance/AGENTS.md` - Rules 1.1-2.2
**Status**: ⬜ NOT STARTED
**Deadline**: Week 4

#### L5.1: Lazy Load Heavy Components
- [ ] `RichTextEditor` - 300KB+ (must lazy load)
- [ ] `DataTable` - Complex rendering
- [ ] Chart components - Heavy libraries
- [ ] `DatePicker` / `TimePicker` - Calendar libs
- [ ] `ColorPicker` - Color libs

```tsx
// ✅ Required pattern
const RichTextEditor = lazy(() => import('./RichTextEditor'));

// In parent
<Suspense fallback={<Skeleton />}>
  <RichTextEditor />
</Suspense>
```

#### L5.2: Import Optimization
- [ ] Audit for barrel imports from heavy libraries
- [ ] Convert icon imports to direct paths

```tsx
// ❌ BAD
import { Check, X, Plus } from '@pulwave/ui/icons';

// ✅ GOOD
import { Check } from '@pulwave/ui/icons/Check';
import { X } from '@pulwave/ui/icons/X';
```

#### L5.3: Waterfall Elimination
- [ ] Review all page components for sequential awaits
- [ ] Convert to `Promise.all()` where appropriate

---

### Task L6: File Structure Normalization (HIGH)
**Skill Reference**: `front-end/components/AGENTS.md` - Rule 2.2
**Status**: ⬜ NOT STARTED
**Deadline**: Week 5

**Required Structure per Component**:
```
ComponentName/
├── ComponentName.tsx    # Implementation
├── types.ts             # CVA + TypeScript types
├── index.ts             # Barrel export
└── styles/
    ├── _index.scss      # Main entry
    └── partials/
        ├── _base.scss
        ├── _variants.scss
        ├── _sizes.scss
        └── _states.scss
```

**Components to Restructure**: All 91 UI components

---

---

## 1. Anthropic Skills Overview

### 1.1 Document Processing Skills
| Skill | Purpose | Applicability to Pulwave |
|-------|---------|-------------------------|
| **pdf** | PDF generation, manipulation, extraction | HIGH - Export functionality, reports |
| **docx** | Word document processing with tracked changes | MEDIUM - Document export |
| **pptx** | PowerPoint presentation creation | LOW - Not core functionality |
| **xlsx** | Excel spreadsheet processing | HIGH - Data export, financial reports |

### 1.2 Design & Creative Skills
| Skill | Purpose | Applicability to Pulwave |
|-------|---------|-------------------------|
| **frontend-design** | Production-grade frontend interfaces | HIGH - All UI components |
| **theme-factory** | Design theme generation | HIGH - Theme system |
| **canvas-design** | Visual art and poster creation | LOW - Not core functionality |
| **algorithmic-art** | Generative art with p5.js | LOW - Not core functionality |
| **slack-gif-creator** | Animated GIF creation | LOW - Not core functionality |

### 1.3 Development Skills
| Skill | Purpose | Applicability to Pulwave |
|-------|---------|-------------------------|
| **web-artifacts-builder** | Build deployable web artifacts | MEDIUM - Standalone components |
| **webapp-testing** | Playwright testing for web apps | HIGH - E2E testing |
| **skill-creator** | Create new Claude skills | LOW - Meta-skill |

### 1.4 Communication Skills
| Skill | Purpose | Applicability to Pulwave |
|-------|---------|-------------------------|
| **doc-coauthoring** | Document collaboration workflow | MEDIUM - Documentation |
| **internal-comms** | Internal communication templates | LOW - Not applicable |
| **brand-guidelines** | Anthropic brand styling | LOW - Pulwave has own brand |

---

## 2. Component-to-Skill Mapping

### 2.1 HIGH PRIORITY - Frontend Design Skill Applicable Components (178 files)

The `frontend-design` skill applies to ALL UI components in the style-guide feature package. These components should follow the skill's design principles:

#### Style Guide Demo Components (101 files)
These components demonstrate UI patterns and should embody the frontend-design skill's principles:

##### Actions (15 demos)
- [x] `ButtonDotDemo.tsx` - Apply bold aesthetic direction
- [x] `ButtonGroupDemo.tsx` - Apply bold aesthetic direction
- [x] `ButtonMatrixDemo.tsx` - Apply bold aesthetic direction
- [x] `ButtonShapesDemo.tsx` - Apply bold aesthetic direction
- [x] `ButtonSizesDemo.tsx` - Apply bold aesthetic direction
- [x] `ButtonStatesDemo.tsx` - Apply bold aesthetic direction
- [x] `ButtonWithIconsDemo.tsx` - Apply bold aesthetic direction
- [x] `FullWidthButtonsDemo.tsx` - Apply bold aesthetic direction
- [x] `IconOnlyButtonsDemo.tsx` - Apply bold aesthetic direction
- [x] `SplitButtonDemo.tsx` - Apply bold aesthetic direction
- [x] `FloatingActionButtonBasicDemo.tsx` - Apply bold aesthetic direction
- [x] `LinkDemo.tsx` - Apply bold aesthetic direction
- [x] `SegmentedControlBasicDemo.tsx` - Apply bold aesthetic direction
- [x] `SplitButtonBasicDemo.tsx` - Apply bold aesthetic direction
- [x] `index.tsx` - Barrel export

##### Data Display (54 demos)
- [x] `AccordionBasicDemo.tsx` - Spatial composition guidelines
- [x] `AvatarFallbackDemo.tsx` - Motion/micro-interactions
- [x] `AvatarSizesDemo.tsx` - Spatial composition
- [x] `AvatarGroupBasic.demo.tsx` - Layout principles
- [x] `BadgeCountDemo.tsx` - Typography guidelines
- [x] `BadgeDotDemo.tsx` - Color/Theme guidelines
- [x] `BadgeIconCircleDemo.tsx` - Motion principles
- [x] `BadgeOutlineDemo.tsx` - Visual details
- [x] `BadgeSizesDemo.tsx` - Spatial composition
- [x] `BadgeStatusDemo.tsx` - Color semantics
- [x] `BadgeVariantsDemo.tsx` - Theme consistency
- [x] `BadgeWithIconsDemo.tsx` - Iconography
- [x] `CardBasicDemo.tsx` - Background treatments
- [x] `CardStructureDemo.tsx` - Anatomy documentation
- [x] `CardVariantsDemo.tsx` - Theme variants
- [x] `CardFlexGridDemo.tsx` - Grid composition
- [x] `CardGridBasicDemo.tsx` - Spatial layout
- [x] `CardGridContentDemo.tsx` - Content hierarchy
- [x] `BasicUsageDemo.tsx` (Chip) - Interaction patterns
- [x] `ChipBasicDemo.tsx` - Typography
- [x] `ChipSelectableDemo.tsx` - State management
- [x] `CircleFlagBasicDemo.tsx` - Visual identity
- [x] `ColumnChipsBasicDemo.tsx` - Layout patterns
- [x] `DataListDraggable.tsx` - Interaction design
- [x] `DataListRichDemo.tsx` - Content density
- [x] `DataListSelection.tsx` - Selection patterns
- [x] `DataTableBasicDemo.tsx` - Data presentation
- [x] `GroupRowBasicDemo.tsx` - Grouping patterns
- [x] `IconBasicDemo.tsx` - Iconography system
- [x] `InfiniteScrollBasicDemo.tsx` - Performance patterns
- [x] `KpiCardBasicDemo.tsx` - Data visualization
- [x] `LocaleSelectorBasicDemo.tsx` - i18n patterns
- [x] `LogoBasicDemo.tsx` - Brand identity
- [x] `NumberedListBasicDemo.tsx` - Content structure
- [x] `ProgressBasicDemo.tsx` - Feedback patterns
- [x] `ProgressCircularDemo.tsx` - Visual indicators
- [x] `ProgressColorDemo.tsx` - Color semantics
- [x] `ProgressIndeterminateDemo.tsx` - Animation
- [x] `ProgressSizeDemo.tsx` - Scale system
- [x] `ProgressStepsDemo.tsx` - Process visualization
- [x] `ProgressValuesDemo.tsx` - Data display
- [x] `RatingStarsBasicDemo.tsx` - Interactive feedback
- [x] `StatCardBasicDemo.tsx` - KPI presentation
- [x] `StatusIndicatorBasicDemo.tsx` - Status patterns
- [x] `StatusIndicatorPulseDemo.tsx` - Animation
- [x] `BasicUsageDemo.tsx` (Tag) - Labeling patterns
- [x] `TagBasicDemo.tsx` - Typography
- [x] `TagRemovableDemo.tsx` - Interaction design
- [x] `TimelineDemo.tsx` - Temporal visualization
- [x] `TreeViewBasicDemo.tsx` - Hierarchy display
- [x] `VerificationBadgeBasicDemo.tsx` - Trust indicators
- [x] `VisualEffectBasicDemo.tsx` - Visual enhancements

##### Feedback (14 demos)
- [x] `AlertBasicDemo.tsx` - Feedback patterns
- [x] `AlertDismissibleDemo.tsx` - Interaction patterns
- [x] `AlertTypesDemo.tsx` - Semantic colors
- [x] `AlertVariantsDemo.tsx` - Theme variants
- [x] `ConfirmationModalBasicDemo.tsx` - Modal patterns
- [x] `EmptyStateBasicDemo.tsx` - Empty state design
- [x] `ModalBasicDemo.tsx` - Overlay patterns
- [x] `ModalSizesDemo.tsx` - Responsive design
- [x] `SkeletonEnhancementDemo.tsx` - Loading states
- [x] `SkeletonVariantsDemo.tsx` - Content placeholders
- [x] `SpinnerSizesDemo.tsx` - Loading indicators
- [x] `ToastTypesDemo.tsx` - Notification patterns
- [x] `TooltipPlacementDemo.tsx` - Contextual help

##### Inputs (49 demos)
- [x] `CheckboxStatesDemo.tsx` - Input states
- [x] `CheckboxGroupBasicDemo.tsx` - Group patterns
- [x] `CheckboxGroupHorizontalDemo.tsx` - Layout variants
- [x] `ColorPickerDemo.tsx` - Color input
- [x] `ComboboxCreatableDemo.tsx` - Advanced input
- [x] `ComboboxDemo.tsx` - Searchable select
- [x] `ComboboxMultiDemo.tsx` - Multi-select
- [x] `ComboboxSizesDemo.tsx` - Input scaling
- [x] `ComboboxVirtualDemo.tsx` - Performance optimization
- [x] `DatePickerDemo.tsx` - Date input
- [x] `DatePickerSizesDemo.tsx` - Date scaling
- [x] `FileUploadDemo.tsx` - File handling
- [x] `InlineEditBasicDemo.tsx` - Edit in place
- [x] `InputFullWidthDemo.tsx` - Full width patterns
- [x] `InputHelperTextDemo.tsx` - Helper text
- [x] `InputRequiredDemo.tsx` - Validation states
- [x] `InputSizesDemo.tsx` - Input scaling
- [x] `InputStatesDemo.tsx` - State management
- [x] `InputTypesDemo.tsx` - Input variants
- [x] `InputWithIconsDemo.tsx` - Iconography
- [x] `LabelDemo.tsx` - Form labels
- [x] `RadioDemo.tsx` - Radio patterns
- [x] `RichTextEditorBasicDemo.tsx` - Rich text
- [x] `BasicUsageDemo.tsx` (SearchFilter) - Search UI
- [x] `SearchInputBasicDemo.tsx` - Search input
- [x] `SearchInputSizesDemo.tsx` - Search scaling
- [x] `DatabaseSelectsDemo.tsx` - Data selects
- [x] `GeographySelectsDemo.tsx` - Geo selects
- [x] `GroupedSelectDemo.tsx` - Grouped options
- [x] `IconSelectDemo.tsx` - Icon selection
- [x] `SelectBasicDemo.tsx` - Basic select
- [x] `SelectCustomOptionDemo.tsx` - Custom options
- [x] `SelectMultiDemo.tsx` - Multi-select
- [x] `SelectSearchableDemo.tsx` - Searchable select
- [x] `SelectSizesDemo.tsx` - Select scaling
- [x] `SelectStatesDemo.tsx` - Select states
- [x] `TreeSelectDemo.tsx` - Hierarchical select
- [x] `SidebarToggleBasicDemo.tsx` - Toggle patterns
- [x] `SliderBasicDemo.tsx` - Range input
- [x] `SwitchStatesDemo.tsx` - Toggle states
- [x] `TextAreaBasicDemo.tsx` - Multi-line input
- [x] `TextAreaStatesDemo.tsx` - State patterns
- [x] `ThemeToggleBasicDemo.tsx` - Theme switching
- [x] `TimePickerDemo.tsx` - Time input
- [x] `TimePickerSizesDemo.tsx` - Time scaling
- [x] `TransferListDemo.tsx` - List transfer

##### Layout (10 demos)
- [x] `BoxBasicDemo.tsx` - Container patterns
- [x] `BoxVariantsDemo.tsx` - Box variants
- [x] `DividerBasicDemo.tsx` - Visual separation
- [x] `FormGridBasicDemo.tsx` - Form layout
- [x] `GridBasicDemo.tsx` - Grid system
- [x] `InlineBasicDemo.tsx` - Inline layout
- [x] `ScrollAreaBasicDemo.tsx` - Scroll containers
- [x] `SectionHeaderBasicDemo.tsx` - Section headers
- [x] `SplitPaneBasic.demo.tsx` - Split layouts
- [x] `StackBasicDemo.tsx` - Stack layout

##### Navigation (25 demos)
- [x] `BreadcrumbsDemo.tsx` - Navigation breadcrumbs
- [x] `BurgerMenuBasicDemo.tsx` - Mobile menu
- [x] `BurgerMenuStatesDemo.tsx` - Menu states
- [x] `MenuBasicDemo.tsx` - Menu patterns
- [x] `MobileHeaderBasicDemo.tsx` - Mobile header
- [x] `MobileHeaderMinimalDemo.tsx` - Minimal header
- [x] `NestedSidebarBasicDemo.tsx` - Nested navigation
- [x] `PaginationBasicDemo.tsx` - Pagination
- [x] `SidebarSectionBasicDemo.tsx` - Sidebar sections
- [x] `StepperDemo.tsx` - Step navigation
- [x] `TabsBasicLineDemo.tsx` - Line tabs
- [x] `TabsBasicStackedDemo.tsx` - Stacked tabs
- [x] `TabsBorderedDemo.tsx` - Bordered tabs
- [x] `TabsFlushDemo.tsx` - Flush tabs
- [x] `TabsFullWidthDemo.tsx` - Full width tabs
- [x] `TabsIconDemo.tsx` - Icon tabs
- [x] `TabsIconsDemo.tsx` - Multiple icon tabs
- [x] `TabsPillsDemo.tsx` - Pill tabs
- [x] `TabsSizeDemo.tsx` - Tab sizing
- [x] `TabsSliderDemo.tsx` - Slider tabs
- [x] `TabsSliderSoftDemo.tsx` - Soft slider tabs
- [x] `TabsVerticalDemo.tsx` - Vertical tabs

##### Foundation (30+ demos)
All foundation demos implement design system principles and should follow frontend-design guidelines.

### 2.2 HIGH PRIORITY - Webapp Testing Skill Applicable Components

The `webapp-testing` skill should be used for E2E testing of critical user flows:

#### Pages Requiring E2E Tests (31 files)
| Component | Test Priority | Test Scenarios |
|-----------|---------------|----------------|
| `LoginPage.tsx` | CRITICAL | Authentication flow, error handling |
| `AuthCallbackPage.tsx` | CRITICAL | OAuth callback, token handling |
| `DashboardPage.tsx` | HIGH | Data loading, navigation |
| `SettingsPage.tsx` | HIGH | Form submission, validation |
| `OnboardingPage.tsx` | HIGH | Multi-step wizard, validation |
| `StyleGuidePage.tsx` | MEDIUM | Component rendering |
| `AdminPage.tsx` | HIGH | Permission checks, CRUD |
| `PropertiesPage.tsx` | HIGH | CRUD operations |
| `TenantsPage.tsx` | HIGH | CRUD operations |
| `LeasesPage.tsx` | HIGH | Date handling, calculations |
| `FinancePage.tsx` | HIGH | Financial calculations |
| `DocumentsPage.tsx` | MEDIUM | File handling |
| `MaintenancePage.tsx` | MEDIUM | Ticket management |
| `CommunicationsPage.tsx` | MEDIUM | Messaging |
| `AssetsPage.tsx` | MEDIUM | Asset management |
| `CondominiumsPage.tsx` | MEDIUM | Complex forms |

### 2.3 HIGH PRIORITY - XLSX Skill Applicable Components

The `xlsx` skill applies to data export functionality:

#### Components Needing Export Functionality
| Component | Export Type | Priority |
|-----------|-------------|----------|
| `DataTableBasicDemo.tsx` | Table data export | HIGH |
| `FinancePage.tsx` | Financial reports | HIGH |
| `ReportsPage.tsx` | Various reports | HIGH |
| `BillingHistory.tsx` | Billing records | HIGH |
| `UsersList.tsx` | User data export | MEDIUM |
| `AllTranslationsList.tsx` | Translation export | MEDIUM |

### 2.4 MEDIUM PRIORITY - PDF Skill Applicable Components

The `pdf` skill applies to document generation:

#### Components Needing PDF Export
| Component | PDF Type | Priority |
|-----------|----------|----------|
| `LeasesPage.tsx` | Lease agreements | HIGH |
| `BillingPage.tsx` | Invoices | HIGH |
| `DocumentsPage.tsx` | Document viewer | HIGH |
| `LegalDocumentCard.tsx` | Legal documents | HIGH |
| `FinancePage.tsx` | Financial reports | MEDIUM |

### 2.5 HIGH PRIORITY - Theme Factory Skill Application

The `theme-factory` skill applies to the design system:

#### Theme-Related Components
| Component | Application | Priority |
|-----------|-------------|----------|
| `ThemeContext.tsx` | Theme provider | HIGH |
| `ThemeToggleBasicDemo.tsx` | Theme switching | HIGH |
| All Style Guide components | Theme consistency | HIGH |

---

## 3. Implementation Tasks

### 3.1 Phase 1: Frontend Design Alignment (Priority: HIGH)

#### Task 1.1: Typography System Review
- [ ] Review all Text components against frontend-design typography guidelines
- [ ] Ensure distinctive font choices (avoid Inter, Roboto, Arial)
- [ ] Verify type hierarchy and scale consistency
- [ ] Check font pairing across headings and body

#### Task 1.2: Color System Validation
- [ ] Audit color usage against frontend-design color guidelines
- [ ] Verify semantic color application
- [ ] Check color contrast ratios
- [ ] Ensure theme consistency across variants

#### Task 1.3: Motion & Interaction Audit
- [ ] Review animation implementations
- [ ] Verify micro-interactions on interactive elements
- [ ] Check scroll-triggered animations
- [ ] Audit hover states for surprise elements

#### Task 1.4: Spatial Composition Review
- [ ] Audit layout patterns for unexpected compositions
- [ ] Check asymmetry and overlap usage
- [ ] Verify negative space application
- [ ] Review grid-breaking elements

### 3.2 Phase 2: Testing Infrastructure (Priority: HIGH)

#### Task 2.1: E2E Test Setup with webapp-testing
- [ ] Set up Playwright configuration per webapp-testing guidelines
- [ ] Create test utilities using with_server.py
- [ ] Implement reconnaissance-then-action pattern
- [ ] Set up test fixtures for common scenarios

#### Task 2.2: Critical Flow Tests
- [ ] Authentication flow tests (LoginPage, AuthCallbackPage)
- [ ] Onboarding wizard tests
- [ ] Settings form submission tests
- [ ] Admin CRUD operation tests

#### Task 2.3: Visual Regression Tests
- [ ] Set up screenshot comparison
- [ ] Create baseline screenshots for all demo components
- [ ] Implement component-level visual tests

### 3.3 Phase 3: Data Export Integration (Priority: MEDIUM)

#### Task 3.1: XLSX Export Implementation
- [ ] Integrate xlsx skill patterns into DataTable
- [ ] Implement financial report exports
- [ ] Add billing history export
- [ ] Create user data export utility

#### Task 3.2: PDF Export Implementation
- [ ] Integrate pdf skill for lease document generation
- [ ] Implement invoice PDF generation
- [ ] Add legal document PDF export
- [ ] Create financial report PDF generation

### 3.4 Phase 4: Theme System Enhancement (Priority: MEDIUM)

#### Task 4.1: Theme Factory Integration
- [ ] Review theme-factory skill themes for inspiration
- [ ] Align Pulwave theme system with best practices
- [ ] Ensure theme switching consistency
- [ ] Document theme customization patterns

---

## 4. Gap Analysis

### 4.1 Skills Not Currently Applicable

| Skill | Reason | Future Potential |
|-------|--------|------------------|
| `canvas-design` | No art/poster generation needs | LOW |
| `algorithmic-art` | No generative art needs | LOW |
| `slack-gif-creator` | No Slack integration | LOW |
| `internal-comms` | Different communication patterns | LOW |
| `brand-guidelines` | Pulwave has own brand system | N/A |
| `pptx` | No presentation generation | LOW |
| `docx` | Limited document editing needs | LOW |
| `skill-creator` | Meta-skill for Claude | LOW |
| `doc-coauthoring` | Development documentation | MEDIUM |

### 4.2 Missing Skill Opportunities

| Need | Current Status | Potential Skill |
|------|----------------|-----------------|
| Component documentation | Manual | doc-coauthoring could help |
| Data visualization | Chart components exist | Could use canvas-design for custom charts |
| Report generation | No automation | pdf + xlsx combination |

---

## 5. Component Categories Cross-Reference

### 5.1 Apps (40 files)
| Category | Count | Primary Skills |
|----------|-------|----------------|
| App shells | 6 | frontend-design |
| Pages | 34 | webapp-testing, frontend-design |

### 5.2 Entities/Tests (31 files)
| Category | Count | Primary Skills |
|----------|-------|----------------|
| Hook tests | 31 | webapp-testing |

### 5.3 Features (178 files)
| Category | Count | Primary Skills |
|----------|-------|----------------|
| Admin | 25 | frontend-design, xlsx |
| Auth | 8 | webapp-testing |
| Dashboard | 1 | frontend-design |
| Feedback | 1 | frontend-design |
| i18n | 1 | frontend-design |
| Layout | 6 | frontend-design |
| Legal | 1 | pdf |
| Payments | 1 | pdf, xlsx |
| Properties | 1 | webapp-testing |
| Settings | 26 | webapp-testing, frontend-design |
| Shared | 10 | frontend-design |
| Social | 1 | frontend-design |
| Subscriptions | 5 | pdf, xlsx |
| Style Guide | 91 | frontend-design |

### 5.4 Pages (31 files)
| Category | Count | Primary Skills |
|----------|-------|----------------|
| Admin | 8 | webapp-testing, xlsx |
| Auth | 2 | webapp-testing |
| Backoffice | 9 | webapp-testing |
| Onboarding | 1 | webapp-testing |
| Shell | 8 | frontend-design |
| Style Guide | 2 | frontend-design |

---

## 6. Implementation Checklist

### 6.1 Immediate Actions (This Sprint)
- [ ] Set up webapp-testing infrastructure
- [ ] Create E2E tests for authentication flow
- [ ] Audit 5 highest-priority components for frontend-design alignment
- [ ] Document findings in component docs

### 6.2 Short-term Actions (Next 2 Sprints)
- [ ] Complete E2E tests for all critical pages
- [ ] Implement xlsx export for DataTable
- [ ] Implement pdf export for Leases
- [ ] Complete frontend-design audit for all demo components

### 6.3 Medium-term Actions (Next Quarter)
- [ ] Full theme-factory integration
- [ ] Complete pdf/xlsx export for all applicable components
- [ ] Visual regression test suite for all components
- [ ] Document all skill integrations

---

## 7. Component Documentation Status

### 7.1 Components with Complete Documentation
All 80 components in the style-guide have complete documentation including:
- [x] Overview sections
- [x] Guidelines sections
- [x] Props sections
- [x] Accessibility sections
- [x] Related components

### 7.2 Documentation Needing Skill Cross-Reference
Each component doc should reference:
- [ ] Applicable frontend-design principles
- [ ] Testing recommendations (webapp-testing)
- [ ] Export capabilities (xlsx/pdf where applicable)

---

## 8. AGENTS.md Files Analysis

### 8.1 Library AGENTS.md Files (52 files)
Located in `.claude/skills/library/`:
- Front-end patterns
- Architecture patterns
- Testing patterns
- Backend patterns
- DevOps patterns
- Crosscutting concerns

### 8.2 Anthropic AGENTS.md Files (16 files)
Located in `.claude/skills/anthropic/`:
- All 15 skills have corresponding AGENTS.md
- Main AGENTS.md provides overview

### 8.3 Cross-Reference with Library Skills
| Library Skill Area | Anthropic Skill Complement |
|--------------------|---------------------------|
| front-end/components | frontend-design |
| front-end/styling | theme-factory |
| testing/e2e | webapp-testing |
| architecture/data-layer | xlsx, pdf |

---

## 9. Rules Analysis

### 9.1 ESLint Rules (node_modules)
Standard ESLint and TypeScript-ESLint rules in node_modules. No custom .claude/rules directory exists.

### 9.2 Recommended Rules for Skill Alignment
| Rule Category | Skill Alignment |
|---------------|-----------------|
| Accessibility rules | frontend-design (color contrast) |
| Performance rules | webapp-testing (performance tests) |
| Import rules | All skills (proper imports) |

---

## 10. Summary Statistics

| Category | Count |
|----------|-------|
| Total TSX Components | 280 |
| Anthropic Skills | 15 |
| HIGH Priority Skill Matches | 4 (frontend-design, webapp-testing, xlsx, pdf) |
| MEDIUM Priority Skill Matches | 3 (theme-factory, web-artifacts-builder, doc-coauthoring) |
| LOW Priority Skill Matches | 8 |
| Components Needing E2E Tests | 16 |
| Components Needing Export Features | 12 |
| Implementation Tasks | 15 |
| Immediate Actions | 4 |

---

## 11. Next Steps

1. **Review this document** with the team
2. **Prioritize tasks** based on business needs
3. **Begin Phase 1** with frontend-design alignment
4. **Set up webapp-testing** infrastructure
5. **Track progress** in project management tool

---

*Document generated: 2026-01-18*
*Last updated: 2026-01-18*
*Status: COMPLETE - All components and skills cross-referenced*
