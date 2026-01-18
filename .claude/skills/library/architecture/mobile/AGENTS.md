# Mobile Architecture - Implementation Guide

**Version 1.0.0**
Pulwave Engineering
2026-01-17

> **Note:**
> This is the detailed implementation guide for mobile-first architecture in Pulwave.
> For quick reference, see [SKILL.md](SKILL.md). For category overview, see [../AGENTS.md](../AGENTS.md).

## Abstract

Comprehensive guide to implementing mobile-first responsive design, touch interactions, performance optimization for mobile devices, safe area handling, and mobile-specific patterns in Pulwave's Atomic Modular Monorepo.

**Key Concepts:**
- Mobile-first CSS methodology
- Touch interaction optimization
- Safe area insets for notches and rounded corners
- Performance optimization for mobile networks
- Responsive breakpoint system

---

## Table of Contents

1. [Mobile-First CSS](#1-mobile-first-css)
2. [Touch Interactions](#2-touch-interactions)
3. [Safe Area Handling](#3-safe-area-handling)
4. [Performance Optimization](#4-performance-optimization)
5. [Responsive Patterns](#5-responsive-patterns)

---

## 1. Mobile-First CSS

### Breakpoint System

```scss
// Foundation tokens
$breakpoints: (
  'sm': 640px,   // Mobile landscape
  'md': 768px,   // Tablet portrait
  'lg': 1024px,  // Tablet landscape
  'xl': 1280px,  // Desktop
  '2xl': 1536px, // Large desktop
);

// Mobile-first approach
.component {
  // Mobile styles (default)
  padding: var(--spacing-4);

  // Tablet and up
  @media (min-width: 768px) {
    padding: var(--spacing-6);
  }

  // Desktop and up
  @media (min-width: 1024px) {
    padding: var(--spacing-8);
  }
}
```

---

## 2. Touch Interactions

### Touch-Optimized Elements

```scss
.btn {
  // Minimum touch target: 44x44px (iOS) / 48x48px (Android)
  min-height: 48px;
  min-width: 48px;

  // Remove 300ms tap delay
  touch-action: manipulation;

  // Prevent text selection on double-tap
  user-select: none;

  // Touch feedback
  &:active {
    transform: scale(0.98);
  }
}
```

### Swipe Gestures

```typescript
import { useSwipeGesture } from '@pulwave/foundation/hooks';

function MobileCard() {
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeGesture({
    onSwipeLeft: () => console.log('Swiped left'),
    onSwipeRight: () => console.log('Swiped right'),
  });

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      Swipeable content
    </div>
  );
}
```

---

## 3. Safe Area Handling

### Safe Area Insets

```scss
.mobile-header {
  // Account for notches and status bars
  padding-top: max(var(--spacing-4), env(safe-area-inset-top));
  padding-left: max(var(--spacing-4), env(safe-area-inset-left));
  padding-right: max(var(--spacing-4), env(safe-area-inset-right));
}

.mobile-footer {
  padding-bottom: max(var(--spacing-4), env(safe-area-inset-bottom));
}
```

---

## 4. Performance Optimization

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@pulwave/ui';

// Lazy load desktop-only features
const DesktopDashboard = lazy(() => import('./DesktopDashboard'));

function Dashboard() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (!isDesktop) {
    return <MobileDashboard />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DesktopDashboard />
    </Suspense>
  );
}
```

### Reduced Bundle Size

```typescript
// Feature detection for mobile
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

// Only import heavy dependencies on desktop
if (!isMobile) {
  await import('./desktop-only-features');
}
```

---

## 5. Responsive Patterns

### Mobile Navigation

```tsx
import { BurgerMenu } from '@pulwave/ui';

function MobileHeader() {
  return (
    <header className="mobile-header">
      <BurgerMenu />
      <h1>Pulwave</h1>
    </header>
  );
}
```

### Responsive Grid

```scss
.grid {
  display: grid;
  gap: var(--spacing-4);

  // Mobile: 1 column
  grid-template-columns: 1fr;

  // Tablet: 2 columns
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  // Desktop: 3 columns
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Best Practices

1. **Start mobile-first** - Base styles for mobile, enhance for larger screens
2. **Touch targets ≥ 48px** - Ensure tappable elements are large enough
3. **Use `touch-action: manipulation`** - Remove tap delay
4. **Safe area insets** - Account for notches and rounded corners
5. **Lazy load desktop features** - Reduce mobile bundle size
6. **Test on real devices** - Emulators don't capture all issues
7. **Optimize images** - Use responsive images and modern formats

---

**Last Updated**: 2026-01-17
**Version**: 1.0.0
**Maintained By**: Pulwave Engineering
