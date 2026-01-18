# @pulwave/patterns

Reusable UI patterns built on top of `@pulwave/ui` components.

## Overview

Patterns are higher-level abstractions that combine multiple components to solve common UI problems. They are opinionated implementations that follow best practices for accessibility, responsiveness, and user experience.

## Pattern Categories

### Data Display Patterns
- **EmptyState** - Illustration + message + action for null results.
- **LoadingState** - Spinner and Skeleton feedback for async operations.
- **ErrorState** - Error feedback with retry mechanics.
- **DataCard** - Metric visualization with trend indicators.

### Navigation Patterns
- **Breadcrumb** - Automated navigation path generation.
- **Pagination** - Server-side pagination controls.
- **StepIndicator** - Multi-phase wizard progress.

## Installation

```bash
npm install @pulwave/patterns
```

## Usage

```tsx
import { EmptyState, LoadingState } from '@pulwave/patterns';

// Empty state
<EmptyState
    icon={<SearchX />}
    title="No results found"
    description="Try adjusting your search or filters"
    action={{ label: 'Clear filters', onClick: handleClear }}
/>

// Loading state (Spinner)
<LoadingState message="Fetching data..." />

// Loading state (Skeleton)
<LoadingState variant="skeleton" lines={5} />
```

## Creating New Patterns

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on creating new patterns.

## Principles

1. **Composition over configuration** - Patterns should compose components, not replace them
2. **Accessibility first** - All patterns must be keyboard navigable and screen reader friendly
3. **Responsive by default** - Patterns should work on all screen sizes
4. **Consistent API** - Similar props across patterns for predictability

---

*Part of the Pulwave Design System*
