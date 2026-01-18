---
name: react
description: Comprehensive React development skill covering hooks, performance optimization, UI patterns, state management, and component architecture.
version: 1.0.0
tags: [React, Hooks, Performance, UI Patterns, State Management, Components]
---

# React Development Guide

Comprehensive React skill covering hooks, performance, UI patterns, state management, and component architecture.

## When to Use

- Building React components and features
- Optimizing React application performance
- Implementing UI patterns (loading, error, empty states)
- Debugging re-render issues
- Reviewing React code

## Quick Reference

### Critical Priorities

1. **Defer await until needed** - Move awaits into branches where they're used
2. **Use Promise.all()** - Parallelize independent async operations
3. **Avoid barrel imports** - Import directly from source files
4. **Dynamic imports** - Lazy-load heavy components
5. **Profile first** - Use React DevTools before optimizing

### Core Patterns

**Parallel data fetching:**
```tsx
const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
```

**Loading state golden rule:**
```tsx
if (loading && !data) return <Loading />; // Only when no cache
```

**Button during async:**
```tsx
<Button disabled={loading} isLoading={loading}>Submit</Button>
```

## Full Compiled Guide

For complete implementation guidance with 40+ React patterns and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **React Hooks** (CRITICAL) - 6 core patterns (useState, useEffect, useMemo, useCallback, useRef)
- **Component Patterns** (HIGH) - 3 architectural patterns (compound, controlled/uncontrolled, render props)
- **UI State Patterns** (HIGH) - 4 UX patterns (loading, error, empty, button states)
- **Custom Hooks** (MEDIUM-HIGH) - Naming and structure best practices
- **Context Patterns** (MEDIUM) - When and how to use Context
- Plus complete TypeScript examples for Pulwave stack

**Category Guide**: [../front-end/AGENTS.md](../front-end/AGENTS.md) - All front-end skills compilation

## Additional Resources

### Performance Optimization
Comprehensive guide in `references/performance.md`:
- Eliminating request waterfalls
- Bundle size optimization
- Re-render prevention
- Memoization strategies

### UI State Patterns
Complete patterns in `references/ui-states.md`:
- Loading state decision tree
- Error handling hierarchy
- Empty state requirements
- Button state management

### Component Patterns
Best practices in `references/patterns.md`:
- Compound components
- Controlled vs uncontrolled
- Custom hooks
- Context optimization

## Key Metrics

- **Time to Interactive (TTI)**: When page becomes interactive
- **Largest Contentful Paint (LCP)**: When main content is visible
- **Bundle size**: Initial JavaScript payload

## Anti-Patterns

❌ Use barrel imports from large libraries
❌ Block parallel operations with sequential awaits
❌ Show spinner when cached data exists
❌ Swallow errors silently

✅ Import directly from source files
✅ Use Promise.all() for independent operations
✅ Show loading only when no data exists
✅ Always surface errors to users
