# Remaining UI Components Migration Plan

This document lists all components in `@pulwave/ui` that have not yet been migrated to `@pulwave/ui`.

## Priority Levels
- **P0**: Critical - needed immediately for core functionality
- **P1**: High - commonly used across the app
- **P2**: Medium - used in specific features
- **P3**: Low - rarely used or can be deferred

---

## P0 - Critical Components

| Component | Notes |
|-----------|-------|
| `Breadcrumbs` | Navigation essential |
| `Link` | Navigation essential |
| `Form` | Form handling |
| `FormGrid` | Form layouts |
| `Radio` | Form input |
| `Switch` | Form input |
| `DatePicker` | Form input |
| `TimePicker` | Form input |
| `Toast` | User feedback |

---

## P1 - High Priority Components

| Component | Notes |
|-----------|-------|
| `Accordion` | Common UI pattern |
| `AvatarGroup` | User displays |
| `Drawer` | Navigation/panels |
| `Popover` | Tooltips/menus |
| `Progress` | Loading states |
| `Slider` | Inputs |
| `Stepper` | Multi-step flows |
| `Tag` | Labels |
| `Chip` | Labels |
| `StatusIndicator` | Status displays |
| `Timeline` | Activity logs |
| `Tabs` | Already in ui2 |

---

## P2 - Medium Priority Components

| Component | Notes |
|-----------|-------|
| `AvatarUpload` | Profile editing |
| `Box` | Layout primitive |
| `BulkActionBar` | Data tables |
| `BurgerMenu` | Mobile nav |
| `Carousel` | Media displays |
| `CheckboxGroup` | Form inputs |
| `ColorPicker` | Settings |
| `ColumnChips` | Table filters |
| `Command` | Command palette |
| `DataList` | Data display |
| `FileUpload` | File handling |
| `FilterableDataTable` | Advanced tables |
| `Grid` | Layout |
| `GroupRow` | Table groups |
| `InfiniteScroll` | Pagination |
| `Inline` | Layout |
| `Label` | Forms |
| `LocaleSelector` | i18n |
| `MobileHeader` | Mobile nav |
| `NumberedList` | Lists |
| `PulwaveProvider` | Global provider |
| `RatingStars` | Reviews |
| `RichTextEditor` | Content editing |
| `SearchFilter` | Filtering |
| `SegmentedControl` | Toggle groups |
| `SidebarSection` | Navigation |
| `SplitButton` | Action buttons |
| `SplitPane` | Layouts |
| `StatCard` | Dashboards |
| `TransferList` | List management |
| `TreeView` | Hierarchical data |

---

## P3 - Low Priority Components

| Component | Notes |
|-----------|-------|
| `ExportData` | Data export |
| `SkipLink` | Accessibility |
| `ThemeToggle` | Theme switching |
| `Vector` | SVG handling |
| `VerificationBadge` | Trust indicators |
| `Wizard` | Multi-step forms |

---

## Migration Guidelines

1. **Folder Structure**: Each component should follow `Component/Component.tsx` pattern
2. **Styles**: Extract to `styles/partials/_main.scss` using nested BEM
3. **Imports**: Use `classNames` from `@pulwave/foundation`, not `cn`
4. **Types**: Ensure proper TypeScript types and JSDoc
5. **CVA**: Apply CVA pattern for variant components where applicable

## Running Migrations

```bash
# Copy component from ui to ui2
Copy-Item -Path "packages/ui/components/ComponentName" -Destination "packages/ui2/components/ComponentName" -Recurse

# Update imports in the component
# Add to packages/ui2/index.ts exports
```