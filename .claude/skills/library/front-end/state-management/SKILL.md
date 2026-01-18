---
name: state-management
description: State management patterns for React applications. Covers local state, context, Zustand, Redux, React Query, and state machines.
version: 1.0.0
tags: [State Management, Context, Zustand, Redux, React Query, XState]
---

# State Management Guide

State management patterns for React applications.

## When to Use

- Choosing state management solution
- Implementing global state
- Managing server state
- Building complex state machines

## Quick Reference

### Selection Guide
| State Type | Tool |
|------------|------|
| Local | useState/useReducer |
| Shared | Context |
| Global | Zustand |
| Server | React Query |
| Complex | XState |

### Context Pattern
```tsx
const value = useMemo(() => ({ user, setUser }), [user]);
return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
```

### Zustand Store
```tsx
export const useStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
}));
```

## Full Compiled Guide

For complete implementation guidance with 35+ state management patterns and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **State Type Selection** (CRITICAL) - When to use TanStack Query vs Context vs URL vs useState
- **TanStack Query Patterns** (CRITICAL) - Query keys, useQuery, useMutation, pagination, prefetching
- **React Context Patterns** (MEDIUM) - When to use, optimization, memoization
- **URL State Management** (HIGH) - nuqs library for shareable state
- **Optimistic Updates** (MEDIUM-HIGH) - Instant UX with rollback
- Plus complete decision trees and real-world examples

**Category Guide**: [../front-end/AGENTS.md](../front-end/AGENTS.md) - All front-end skills compilation

## Additional Resources

### Selection Guide
Detailed comparison in `references/selection.md`:
- When to use each tool
- Pros and cons
- Migration strategies

### Patterns
Implementation patterns in `references/patterns.md`:
- Context optimization
- Zustand slices
- React Query setup
