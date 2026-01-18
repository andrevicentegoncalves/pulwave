# System Inventory

## Packages

### Shared
*   `packages/shared/ui`: Component library (91+ components + data visualization).
*   `packages/shared/tokens`: Base styles, design tokens, theme.
*   `packages/shared/hooks`: Shared React hooks.
*   `packages/shared/utils`: Utility functions.

### Widgets
*   `packages/widgets`: Higher-level UI patterns and compositions.

### Features (Business Logic)
*   `packages/features/*`: Feature modules (admin, auth, dashboard, payments, etc.).

### Pages (App assembly)
*   `packages/pages/shell`: Application shells (AppShell, NestedSidebarShell).
*   `packages/pages/auth`: Authentication flows.
*   `packages/pages/style-guide`: Design system documentation.

### Entities (Data Layer)
*   `packages/entities`: Provider-agnostic data access layer (Hexagonal Architecture).

## Verified Status
*   **Infrastructure**: 100% database-agnostic.
*   **Testing**: 450+ unit tests passing.
