# Frontend Coding Standards

> Senior Frontend + SaaS Architecture Guidelines

## Architecture & Responsibilities

- **Assembly Layer**: `packages/experience/` packages are thin assembly layers that orchestrate features with application-level concerns (Auth, User, Shell).
- **Feature Layer**: `packages/features/` packages contain business logic, agnostic services, and content (e.g., style guide documentation).
- **UI Layer**: `packages/ui/` contains granular primitives and compound components.
- **Data Layer**: `packages/features/data` is strictly database-agnostic. All backend calls must go through services/repositories.

## Styling & Design System

- **BEM + CVA Architecture**:
  - Use **BEM** (Block Element Modifier) for all CSS classes.
  - Use **CVA** (class-variance-authority) to manage component variants, sizes, and states.
  - Styles MUST be organized in a `styles` folder within the component directory, using modular SCSS (partials).
- **No Utility-First (Tailwind)**: Avoid Tailwind unless explicitly requested. Confirm version if used.
- **Tokens Over Magic Values**: Use SCSS variables for colors, spacing, and typography.
- **No Inline Styles**: Use `cn()` from `@pulwave/foundation` for conditional classes.

## Components & Reusability

- **Compound Components**: Use the `Object.assign` pattern for sub-components (e.g., `Card.Header`, `Card.Body`).
- **Polymorphism**: Support the `as` prop to allow semantic HTML flexibility (e.g., `Text as="h1"`, `Card as="section"`).
- **Registry Pattern**: Feature content (like documentation) should be registered in a centralized registry within the feature package.

## Configuration & Constants

- Move constants to **shared config files**
- **Centralize** feature flags and environment-specific values
- **Avoid duplication** of enums or types across frontend and backend

## Documentation

- Add clear documentation for:
  - Components
  - Hooks
  - Services
  - Complex logic
- Use **JSDoc comments** where appropriate
- Document **assumptions, side effects, and data flow**
- If behavior is non-obvious, explain **why**, not just what

## Data, Types & Validation

- Define **clear interfaces/types** for all data structures
- **Validate backend responses**
- Handle **loading, error, and empty states** explicitly
- **Avoid leaking backend implementation details** into the UI

## Performance & Quality

- Prevent **unnecessary re-renders**
- Use **memoization only when justified**
- Avoid premature optimization but **flag future risks**
- Ensure **accessibility (a11y)** best practices

## Future-Proofing

- Design with **extensibility** in mind
- **Avoid assumptions** about:
  - Number of locales
  - Number of users
  - Data size
  - Feature growth
- **Flag technical debt** and suggest incremental improvements

## Code Review Checklist

When reviewing code, check for:
- ❏ Architectural issues
- ❏ Refactor opportunities
- ❏ Missing abstractions
- ❏ Reusable component opportunities
- ❏ Clear folder structure
- ❏ Proper error handling
- ❏ Accessibility compliance

---

*The goal is a clean, scalable, well-documented frontend architecture that aligns with modern SaaS standards and can grow without rewrites.*
