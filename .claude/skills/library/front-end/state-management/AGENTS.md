# State Management Guide

**Version 1.0.0**
Pulwave Engineering
2026-01-17

> **Note:**
> This document is designed for AI agents and LLMs working on the Pulwave codebase.
> Reference specific sections by number (e.g., "follow rule 2.3") for targeted guidance.

## Abstract

Comprehensive state management guide for Pulwave's React 19 application. Contains 35+ patterns across 6 categories covering TanStack Query (server state), React Context (client state), URL state management, local state patterns, optimistic updates, and state architecture decisions. Essential for managing data effectively across the application.

**Pulwave State Stack:**
- TanStack Query 5 (server state - THE primary solution)
- React Context (client state - theme, auth, UI preferences)
- nuqs (URL state - filters, pagination)
- useState/useReducer (local component state)
- No Redux, No Zustand (not needed with TanStack Query)

**State Philosophy:**
- Server state ≠ Client state (use different tools)
- TanStack Query for ALL server data
- Context sparingly (only for truly global client state)
- URL as source of truth for filters/pagination
- Local state as close to usage as possible

---

## Table of Contents

1. [State Type Selection](#1-state-type-selection) (CRITICAL)
2. [TanStack Query Patterns](#2-tanstack-query-patterns) (CRITICAL)
3. [React Context Patterns](#3-react-context-patterns) (MEDIUM)
4. [URL State Management](#4-url-state-management) (HIGH)
5. [Local State Patterns](#5-local-state-patterns) (MEDIUM)
6. [Optimistic Updates](#6-optimistic-updates) (MEDIUM-HIGH)

---

## 1. State Type Selection

**Impact: CRITICAL**

Choosing the right state management tool is the most important decision. Using the wrong tool creates complexity and bugs.

### 1.1 The Four State Types

**Impact: CRITICAL** (fundamental classification)

All state falls into one of four categories. Use the right tool for each.

**1. Server State (Remote Data)**
- Data fetched from APIs/database
- Not owned by the frontend
- Can be stale
- Can be shared across components
- **Tool:** TanStack Query ✅
- **Examples:** User profile, property listings, invoices

**2. Client State (UI State)**
- Data owned by the frontend
- Never stale
- Synchronous
- **Tool:** React Context, useState ✅
- **Examples:** Theme, sidebar open/closed, selected language

**3. URL State (Shareable UI State)**
- UI state that should be shareable via URL
- Synchronizes browser history
- **Tool:** nuqs (useQueryState) ✅
- **Examples:** Filters, sorting, pagination, selected tab

**4. Local State (Component State)**
- State used only within one component
- Not shared
- **Tool:** useState, useReducer ✅
- **Examples:** Form field values, modal open/closed, hover state

**Decision Tree:**

```
Is this data from a server/database?
  → Yes: TanStack Query

No, is this UI state that should be in the URL (shareable)?
  → Yes: nuqs (URL state)

No, is this needed across many unrelated components?
  → Yes: React Context

No, is this only needed in one component?
  → Yes: useState/useReducer
```

**Incorrect: useState for server data**

```typescript
// WRONG
function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile().then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  // Problems:
  // - No caching
  // - No refetch on window focus
  // - No automatic retry
  // - Manual loading state
  // - Stale data if component remounts
}
```

**Correct: TanStack Query for server data**

```typescript
// CORRECT
function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  // Benefits:
  // - Automatic caching
  // - Refetch on window focus
  // - Automatic retry on failure
  // - Built-in loading state
  // - Shared across components
  // - Automatic revalidation
}
```

**Incorrect: Context for server data**

```typescript
// WRONG
const ProfileContext = createContext();

function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, []);

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}

// Problems:
// - All consumers re-render on any profile change
// - No caching between mounts
// - Manual refetch logic
// - Context pollution
```

**Correct: TanStack Query (shared automatically)**

```typescript
// CORRECT
// Multiple components use the same query key
function ProfileCard() {
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });
  // Shares cache with ProfilePage
}

function ProfileSettings() {
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });
  // Shares cache with ProfilePage and ProfileCard
}

// Benefits:
// - Automatic cache sharing
// - Single network request
// - Independent rendering
// - No provider needed
```

**Pulwave-Specific Notes:**
- **ALWAYS use TanStack Query for server data**
- Context only for: theme, auth state, UI preferences
- URL state for: filters, sorting, pagination, search
- Local state for: form inputs, modals, hover

---

### 1.2 State Ownership Matrix

**Impact: HIGH** (prevents architectural confusion)

| State Example | Type | Tool | Why |
|---------------|------|------|-----|
| User profile from API | Server | TanStack Query | Remote data, can be stale |
| Dark mode preference | Client | Context | Global UI state |
| Selected tab ID | URL | nuqs | Shareable, browser history |
| Form field value | Local | useState | Component-specific |
| Property listings | Server | TanStack Query | Remote data |
| Sidebar open/closed | Client | useState/Context | UI state (use Context if needed globally) |
| Search query | URL | nuqs | Shareable, history |
| Hover state | Local | useState | Ephemeral, component-only |
| Shopping cart | Server + Client | TanStack Query + Optimistic | Server truth, client optimism |

**Pulwave-Specific Notes:**
- In Pulwave: 80% TanStack Query, 15% URL state, 5% Context/local state
- When in doubt for server data: TanStack Query
- When in doubt for UI state: Start with local useState, promote to URL/Context if needed

---

## 2. TanStack Query Patterns

**Impact: CRITICAL**

TanStack Query is Pulwave's primary state management solution. Mastering it is essential.

### 2.1 Query Keys: The Foundation

**Impact: CRITICAL** (enables caching, invalidation, prefetching)

Query keys uniquely identify queries. Proper key structure enables powerful caching and invalidation patterns.

**Key Structure Rules:**

```typescript
// 1. Use array format (required in TanStack Query v5)
['posts'] // ✅
'posts' // ❌ Deprecated in v5

// 2. Be specific and hierarchical
['posts', 'list'] // General list
['posts', 'detail', postId] // Specific post
['posts', 'list', { status: 'draft' }] // Filtered list

// 3. Include all variables that affect the query
['posts', { authorId, page, limit }] // ✅ All params
['posts'] // ❌ Missing params → wrong cache hits
```

**Pulwave Query Key Patterns:**

```typescript
// Organized in packages/data/domains/*/keys/

// 1. Lists (collections)
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: PropertyFilters) =>
    [...propertyKeys.lists(), filters] as const,

  // 2. Details (individual items)
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
};

// Usage
useQuery({
  queryKey: propertyKeys.list({ status: 'active' }),
  queryFn: () => fetchProperties({ status: 'active' }),
});

useQuery({
  queryKey: propertyKeys.detail(propertyId),
  queryFn: () => fetchProperty(propertyId),
});
```

**Why hierarchical keys matter:**

```typescript
// Invalidate ALL property queries
queryClient.invalidateQueries({ queryKey: propertyKeys.all });

// Invalidate ALL property lists (not details)
queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });

// Invalidate only specific filtered list
queryClient.invalidateQueries({
  queryKey: propertyKeys.list({ status: 'active' }),
});

// Invalidate specific property detail
queryClient.invalidateQueries({ queryKey: propertyKeys.detail('123') });
```

**Pulwave-Specific Notes:**
- All query keys defined in `packages/data/domains/*/keys/`
- Use factory pattern (see example above)
- Export typed constants
- Never inline query keys

---

### 2.2 useQuery: Fetching Data

**Impact: CRITICAL** (the most common hook)

`useQuery` fetches and caches data. Understand all its options.

**Basic Pattern:**

```typescript
const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});
```

**Complete Options:**

```typescript
const query = useQuery({
  queryKey: ['user', userId],
  queryFn: async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },

  // When to fetch
  enabled: !!userId, // Only fetch if userId exists
  staleTime: 5 * 60 * 1000, // 5 minutes (data fresh for 5 min)
  gcTime: 10 * 60 * 1000, // 10 minutes (cache for 10 min)

  // Retries
  retry: 3, // Retry 3 times on failure
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

  // Refetch behavior
  refetchOnWindowFocus: true, // Refetch when window focused
  refetchOnMount: true, // Refetch on component mount
  refetchOnReconnect: true, // Refetch when online

  // Callbacks
  onSuccess: (data) => {
    console.log('Data fetched:', data);
  },
  onError: (error) => {
    console.error('Fetch failed:', error);
  },
});

// All available fields
const {
  data, // The data from queryFn
  error, // Error if queryFn threw
  isLoading, // Initial loading (no cached data)
  isFetching, // Any fetch (including background refetch)
  isSuccess, // Query succeeded
  isError, // Query failed
  status, // 'pending' | 'error' | 'success'
  refetch, // Manually trigger refetch
  fetchStatus, // 'fetching' | 'paused' | 'idle'
} = query;
```

**Loading State Patterns:**

```typescript
// Pattern 1: Initial load only
if (isLoading) return <Skeleton />;

// Pattern 2: Show cached data while refetching
if (isLoading && !data) return <Skeleton />;
if (isFetching && data) return <><Data /><RefreshIndicator /></>;

// Pattern 3: Differentiate initial vs background
const isInitialLoading = isLoading && !data;
const isBackgroundFetching = isFetching && data;
```

**Error Handling:**

```typescript
if (isError) {
  return (
    <ErrorState
      error={error}
      retry={refetch}
    />
  );
}
```

**Pulwave-Specific Notes:**
- Create hooks in `packages/data/domains/*/hooks/`
- Export typed hooks: `useProfile()`, `useProperties()`
- Set default `staleTime` in QueryClient config
- Use `enabled` for dependent queries

---

### 2.3 useMutation: Changing Data

**Impact: HIGH** (create, update, delete operations)

`useMutation` handles server mutations (POST, PUT, DELETE). It provides loading state, error handling, and optimistic updates.

**Basic Pattern:**

```typescript
const mutation = useMutation({
  mutationFn: (data) => updateProfile(data),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  },
});

// Trigger mutation
mutation.mutate({ name: 'New Name' });
```

**Complete Pattern:**

```typescript
const updateProfileMutation = useMutation({
  mutationFn: async (data: UpdateProfileData) => {
    return profileService.update(data);
  },

  // Callbacks
  onMutate: async (variables) => {
    // Optimistic update (see section 6)
    await queryClient.cancelQueries({ queryKey: ['profile'] });
    const previous = queryClient.getQueryData(['profile']);
    queryClient.setQueryData(['profile'], variables);
    return { previous };
  },

  onSuccess: (data, variables, context) => {
    // Success: invalidate to refetch fresh data
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    toast.success('Profile updated');
  },

  onError: (error, variables, context) => {
    // Error: rollback optimistic update
    if (context?.previous) {
      queryClient.setQueryData(['profile'], context.previous);
    }
    toast.error('Failed to update profile');
  },

  onSettled: () => {
    // Always runs (success or error)
    // Cleanup code here
  },
});

// Usage in component
const { mutate, isPending, isError, error } = updateProfileMutation;

<Button
  onClick={() => mutate({ name: 'New Name' })}
  disabled={isPending}
  isLoading={isPending}
>
  Save
</Button>
```

**Mutation with Async/Await:**

```typescript
const handleSubmit = async (data) => {
  try {
    await mutation.mutateAsync(data);
    navigate('/success');
  } catch (error) {
    console.error('Failed:', error);
  }
};
```

**Invalidation Strategies:**

```typescript
// 1. Invalidate specific query
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['profile', userId] });
};

// 2. Invalidate all related queries
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['properties'] });
};

// 3. Update cache directly (no refetch)
onSuccess: (newData) => {
  queryClient.setQueryData(['profile', userId], newData);
};

// 4. Update list after creating item
onSuccess: (newProperty) => {
  queryClient.setQueryData(['properties', 'list'], (old) => [
    ...old,
    newProperty,
  ]);
};
```

**Pulwave-Specific Notes:**
- Create mutation hooks: `useUpdateProfile()`, `useCreateProperty()`
- Always invalidate related queries
- Use optimistic updates for instant UX
- Show loading state on buttons

---

### 2.4 Dependent Queries

**Impact: MEDIUM** (sequential data loading)

Some queries depend on data from previous queries. Use `enabled` option to control execution.

**Incorrect: Conditional hook calls**

```typescript
// WRONG - Violates rules of hooks
function Component({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // ❌ Conditional hook call!
  if (user) {
    const { data: posts } = useQuery({
      queryKey: ['posts', user.id],
      queryFn: () => fetchPosts(user.id),
    });
  }
}
```

**Correct: enabled option**

```typescript
// CORRECT
function Component({ userId }: { userId: string }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchPosts(user!.id),
    enabled: !!user, // Only fetch when user exists
  });

  // Both hooks called unconditionally ✅
}
```

**Multiple Dependencies:**

```typescript
function PropertyDetails({ propertyId }: { propertyId: string }) {
  const { data: property } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => fetchProperty(propertyId),
  });

  const { data: owner } = useQuery({
    queryKey: ['user', property?.ownerId],
    queryFn: () => fetchUser(property!.ownerId),
    enabled: !!property?.ownerId,
  });

  const { data: tenants } = useQuery({
    queryKey: ['tenants', propertyId],
    queryFn: () => fetchTenants(propertyId),
    enabled: !!property && property.status === 'occupied',
  });
}
```

**Pulwave-Specific Notes:**
- Use `enabled` for dependent queries
- Check `!!variable` to ensure it exists
- TypeScript: use non-null assertion `variable!` in queryFn (safe because of enabled)

---

### 2.5 Pagination Patterns

**Impact: MEDIUM-HIGH** (common pattern in lists)

TanStack Query provides built-in pagination support with `usePaginationQuery` and cursor-based patterns.

**Offset-Based Pagination:**

```typescript
function PropertyList() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['properties', 'list', { page, pageSize }],
    queryFn: () => fetchProperties({ page, limit: pageSize }),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Keep old data while fetching
  });

  return (
    <>
      <PropertyGrid properties={data?.items} />
      <Pagination
        currentPage={page}
        totalPages={data?.totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
```

**Infinite Scroll (useInfiniteQuery):**

```typescript
function PropertyInfiniteList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['properties', 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      fetchProperties({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    initialPageParam: 1,
  });

  // Flatten pages
  const properties = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <>
      <PropertyGrid properties={properties} />
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
        >
          Load More
        </Button>
      )}
    </>
  );
}
```

**Pulwave-Specific Notes:**
- Use `placeholderData` to keep old data visible during pagination
- Pagination state belongs in URL (use nuqs)
- Infinite scroll for mobile, pagination for desktop

---

### 2.6 Prefetching Data

**Impact: MEDIUM** (perceived performance)

Prefetch data before it's needed for instant UX.

**Prefetch on Hover:**

```typescript
function PropertyCard({ property }: { property: Property }) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['property', property.id],
      queryFn: () => fetchProperty(property.id),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <Card
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onClick={() => navigate(`/properties/${property.id}`)}
    >
      {property.name}
    </Card>
  );
}
// When user hovers, detail page data is prefetched
// When they click, data is instant (cached)
```

**Prefetch Next Page:**

```typescript
useEffect(() => {
  // Prefetch next page in background
  if (hasNextPage) {
    queryClient.prefetchQuery({
      queryKey: ['properties', 'list', { page: page + 1 }],
      queryFn: () => fetchProperties({ page: page + 1 }),
    });
  }
}, [page, hasNextPage, queryClient]);
```

**Pulwave-Specific Notes:**
- Prefetch on hover for detail pages
- Prefetch next page for pagination
- Don't prefetch too aggressively (wastes bandwidth)

---

## 3. React Context Patterns

**Impact: MEDIUM**

Use Context sparingly for truly global client state.

### 3.1 When to Use Context

**Impact: MEDIUM** (prevents over-engineering or under-engineering)

**Use Context for:**
- Theme (dark/light mode)
- Authenticated user (session state, not profile data)
- Locale/language
- UI preferences (sidebar collapsed, notifications enabled)

**Don't use Context for:**
- Server data (use TanStack Query)
- URL state (use nuqs)
- Local component state (use useState)
- Frequently changing values (causes all consumers to re-render)

**Pulwave Context Usage:**

```typescript
// ✅ Good use of Context
ThemeContext  // Theme preference
AuthContext   // Auth session (not user profile!)
TranslationContext  // Current locale

// ❌ Bad use of Context
ProfileContext  // Use TanStack Query instead
FiltersContext  // Use URL state instead
FormContext  // Use local state or form library
```

---

### 3.2 Optimized Context Pattern

**Impact: MEDIUM** (prevents unnecessary re-renders)

Memoize context value to prevent re-creating on every render.

**Incorrect: Value recreated every render**

```typescript
// WRONG
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
// { theme, setTheme } is new object every render
// → All consumers re-render
```

**Correct: Memoized value**

```typescript
// CORRECT
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme] // Only recreate when theme changes
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
// value only changes when theme changes
// → Consumers only re-render when needed
```

**Pulwave-Specific Notes:**
- All contexts in `packages/features/*/contexts/`
- Always memoize context value
- Export custom hook: `useTheme()`, `useAuth()`

---

## 4. URL State Management

**Impact: HIGH**

URL state makes UI state shareable and bookmarkable.

### 4.1 nuqs for URL State

**Impact: HIGH** (better than raw URL manipulation)

Use `nuqs` library for type-safe URL state management.

**Basic Pattern:**

```typescript
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';

function PropertyList() {
  const [search, setSearch] = useQueryState('search', parseAsString);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  // URL: /properties?search=apartment&page=2
  // search = "apartment"
  // page = 2
}
```

**All Parser Types:**

```typescript
import {
  parseAsString,
  parseAsInteger,
  parseAsFloat,
  parseAsBoolean,
  parseAsArrayOf,
  parseAsStringEnum,
  parseAsJson,
} from 'nuqs';

// String
const [name, setName] = useQueryState('name', parseAsString);

// Integer with default
const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

// Boolean
const [active, setActive] = useQueryState('active', parseAsBoolean);

// Array
const [tags, setTags] = useQueryState('tags', parseAsArrayOf(parseAsString));

// Enum
const [status, setStatus] = useQueryState('status',
  parseAsStringEnum(['active', 'pending', 'sold'])
);

// JSON object
const [filters, setFilters] = useQueryState('filters', parseAsJson());
```

**Integration with TanStack Query:**

```typescript
function PropertyList() {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [status, setStatus] = useQueryState('status', parseAsString);

  const { data } = useQuery({
    queryKey: ['properties', 'list', { search, status }],
    queryFn: () => fetchProperties({ search, status }),
  });

  // URL changes → query key changes → refetch
  // Shareable URL: /properties?search=apartment&status=active
}
```

**Pulwave-Specific Notes:**
- Use for: filters, sorting, search, pagination, selected tabs
- URL state automatically syncs with browser history
- Shareable URLs improve UX (bookmark, share link)

---

## Appendix: State Decision Matrix

| Scenario | Tool | Reason |
|----------|------|--------|
| User profile from API | TanStack Query | Server data |
| List of properties | TanStack Query | Server data |
| Dark mode toggle | Context | Global UI state |
| Search query | URL (nuqs) | Shareable, history |
| Page number | URL (nuqs) | Shareable, history |
| Form field value | useState | Local, temporary |
| Modal open/closed | useState | Local, temporary |
| Sidebar collapsed | Context or localStorage | UI preference |
| Selected table rows | useState | Local selection |
| Shopping cart | TanStack Query + Optimistic | Server truth + optimism |

---

**Last Updated**: 2026-01-17
**Version**: 1.0.0
**Maintained By**: Pulwave Engineering
