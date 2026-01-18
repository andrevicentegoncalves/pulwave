# ADR-005: React Query for Server State

**Status:** Accepted  
**Date:** 2026-01-12  
**Deciders:** Architecture Team

---

## Context and Problem Statement

How should we manage server state (data fetching, caching, synchronization) in React components to ensure optimal performance and developer experience?

## Decision Drivers

- Need automatic caching and cache invalidation
- Want to eliminate manual loading/error states
- Must support optimistic updates
- Require background refetching
- Need to minimize server requests

## Considered Options

1. **React Query (@tanstack/react-query)**
2. Redux Toolkit with RTK Query
3. SWR
4. Manual useEffect + fetch + useState

## Decision Outcome

**Chosen option:** "React Query"

### Rationale

React Query provides industry-leading server state management:
- Automatic background refetching
- Intelligent caching with stale-while-revalidate
- Built-in loading/error states
- Optimistic updates
- Pagination and infinite scroll support
- Typed hooks with TypeScript
- DevTools for debugging

### Implementation Pattern

```typescript
// hooks/useProfile.ts
export const useProfile = (userId: string) => {
    return useQuery({
        queryKey: profileKeys.detail(userId),
        queryFn: () => profileService.find(userId),
        staleTime: 300000, // 5 minutes
        enabled: !!userId,
    });
};

// keys/index.ts (cache key organization)
export const profileKeys = {
    all: ['profile'] as const,
    lists: () => [...profileKeys.all, 'list'] as const,
    list: (filters: string) => [...profileKeys.lists(), { filters }] as const,
    details: () => [...profileKeys.all, 'detail'] as const,
    detail: (id: string) => [...profileKeys.details(), id] as const,
};
```

### Positive Consequences

- Automatic request deduplication
- Background updates keep data fresh
- Excellent developer experience
- Reduced boilerplate (no manual loading states)
- Built-in pagination support
- DevTools for debugging cache

### Negative Consequences

- Learning curve for query keys structure
- Need to understand cache invalidation
- Additional dependency

## Cache Strategy

- **5-layer key structure**: `domain > type > identifier > filters > params`
- **Organized keys**: Each domain has dedicated key factory
- **Automatic invalidation**: Mutations invalidate related queries
- **Prefetching**: Background loading for better UX

## Current Usage

- 592 tests passing across data layer
- All data hooks use React Query
- Consistent cache key patterns
- Optimistic updates in critical paths

## Links

- [React Query Docs](https://tanstack.com/query/latest)
- [Data Layer Documentation](../packages/features/data/docs/README.md)
- [ADR-001: Provider-Agnostic Data Layer](./001-provider-agnostic-data-layer.md)

---

**Tags:** react, state-management, caching, data-fetching  
**Related ADRs:** ADR-001, ADR-002
