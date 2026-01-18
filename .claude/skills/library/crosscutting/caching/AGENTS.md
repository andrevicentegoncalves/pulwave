# Caching Strategies

**Abstract**: Comprehensive guide to implementing multi-layer caching strategies across browser, client state, HTTP, API gateway, and server layers. Covers TanStack Query for client-side state management, HTTP caching headers, service workers, CDN/edge caching, Redis for server-side caching, and cache invalidation patterns for optimal performance.

---

## Table of Contents

1. [Caching Fundamentals](#1-caching-fundamentals)
   - 1.1 [Caching Layers](#11-caching-layers) (CRITICAL)
   - 1.2 [Cache Keys](#12-cache-keys) (CRITICAL)
   - 1.3 [TTL and Expiration](#13-ttl-and-expiration) (CRITICAL)
   - 1.4 [Cache Invalidation](#14-cache-invalidation) (CRITICAL)

2. [TanStack Query Caching](#2-tanstack-query-caching)
   - 2.1 [Query Configuration](#21-query-configuration) (CRITICAL)
   - 2.2 [staleTime vs gcTime](#22-staletime-vs-gctime) (CRITICAL)
   - 2.3 [Query Keys](#23-query-keys) (CRITICAL)
   - 2.4 [Cache Invalidation](#24-cache-invalidation) (CRITICAL)
   - 2.5 [Optimistic Updates](#25-optimistic-updates) (HIGH)
   - 2.6 [Prefetching](#26-prefetching) (HIGH)

3. [HTTP Caching](#3-http-caching)
   - 3.1 [Cache-Control Headers](#31-cache-control-headers) (CRITICAL)
   - 3.2 [ETags](#32-etags) (CRITICAL)
   - 3.3 [Last-Modified](#33-last-modified) (HIGH)
   - 3.4 [Vary Header](#34-vary-header) (HIGH)

4. [Service Worker Caching](#4-service-worker-caching)
   - 4.1 [Cache Strategies](#41-cache-strategies) (HIGH)
   - 4.2 [Cache-First Pattern](#42-cache-first-pattern) (HIGH)
   - 4.3 [Network-First Pattern](#43-network-first-pattern) (HIGH)
   - 4.4 [Stale-While-Revalidate](#44-stale-while-revalidate) (HIGH)

5. [CDN and Edge Caching](#5-cdn-and-edge-caching)
   - 5.1 [CDN Configuration](#51-cdn-configuration) (HIGH)
   - 5.2 [Edge Caching](#52-edge-caching) (HIGH)
   - 5.3 [Cache Purging](#53-cache-purging) (MEDIUM)

6. [Server-Side Caching](#6-server-side-caching)
   - 6.1 [Redis Patterns](#61-redis-patterns) (HIGH)
   - 6.2 [Cache Aside](#62-cache-aside) (HIGH)
   - 6.3 [Write-Through](#63-write-through) (MEDIUM)
   - 6.4 [Cache Warming](#64-cache-warming) (MEDIUM)

7. [Cache Invalidation Strategies](#7-cache-invalidation-strategies)
   - 7.1 [Time-Based Invalidation](#71-time-based-invalidation) (CRITICAL)
   - 7.2 [Event-Based Invalidation](#72-event-based-invalidation) (CRITICAL)
   - 7.3 [Tag-Based Invalidation](#73-tag-based-invalidation) (HIGH)
   - 7.4 [Manual Invalidation](#74-manual-invalidation) (MEDIUM)

8. [Advanced Patterns](#8-advanced-patterns)
   - 8.1 [Normalized Cache](#81-normalized-cache) (HIGH)
   - 8.2 [Partial Cache Updates](#82-partial-cache-updates) (HIGH)
   - 8.3 [Background Refresh](#83-background-refresh) (HIGH)
   - 8.4 [Cache Stampede Prevention](#84-cache-stampede-prevention) (HIGH)

9. [Monitoring and Metrics](#9-monitoring-and-metrics)
   - 9.1 [Cache Hit Rates](#91-cache-hit-rates) (CRITICAL)
   - 9.2 [Performance Metrics](#92-performance-metrics) (HIGH)
   - 9.3 [Cache Size Monitoring](#93-cache-size-monitoring) (MEDIUM)

10. [Pulwave Integration](#10-pulwave-integration)
    - 10.1 [TanStack Query Setup](#101-tanstack-query-setup) (CRITICAL)
    - 10.2 [Query Keys Pattern](#102-query-keys-pattern) (CRITICAL)
    - 10.3 [Data Layer Caching](#103-data-layer-caching) (CRITICAL)

**Appendix**
- [A. TanStack Query Configuration](#appendix-a-tanstack-query-configuration)
- [B. HTTP Cache Headers Reference](#appendix-b-http-cache-headers-reference)
- [C. Redis Commands](#appendix-c-redis-commands)
- [D. Cache Decision Tree](#appendix-d-cache-decision-tree)

---

## 1. Caching Fundamentals

### 1.1 Caching Layers (CRITICAL)

Understand the different caching layers and when to use each.

**Caching Hierarchy** (closest to furthest from user):
```
1. Browser Memory (milliseconds)
   ↓
2. Service Worker Cache (milliseconds)
   ↓
3. HTTP Cache (milliseconds)
   ↓
4. TanStack Query Cache (milliseconds)
   ↓
5. CDN/Edge Cache (10-100ms)
   ↓
6. Application Server Memory (10-50ms)
   ↓
7. Redis/Memcached (1-10ms)
   ↓
8. Database Query Cache (10-100ms)
   ↓
9. Database (100ms+)
```

**Layer Selection**:
```typescript
// packages/data/cache/cacheStrategy.ts

export const CacheStrategy = {
  // Static assets (images, fonts, CSS, JS)
  STATIC: {
    layer: 'Service Worker + HTTP',
    ttl: '1 year',
    strategy: 'cache-first',
  },

  // User-specific data that changes rarely
  USER_PROFILE: {
    layer: 'TanStack Query + HTTP',
    ttl: '5 minutes',
    strategy: 'stale-while-revalidate',
  },

  // Frequently accessed, shared data
  LOOKUP_DATA: {
    layer: 'TanStack Query + Redis',
    ttl: '1 hour',
    strategy: 'cache-aside',
  },

  // Real-time data
  REALTIME: {
    layer: 'None or very short TTL',
    ttl: '0-30 seconds',
    strategy: 'network-first',
  },

  // Expensive computations
  COMPUTED: {
    layer: 'Redis',
    ttl: '10 minutes',
    strategy: 'cache-aside with background refresh',
  },
} as const;
```

### 1.2 Cache Keys (CRITICAL)

Create consistent, hierarchical cache keys.

**Incorrect** - Inconsistent keys:
```typescript
// Different developers creating different key formats
useQuery({ queryKey: ['user', id] });
useQuery({ queryKey: ['users', id] });
useQuery({ queryKey: [id, 'user'] });
useQuery({ queryKey: [`user-${id}`] });
```

**Correct** - Structured key pattern:
```typescript
// packages/data/cache/keys/index.ts

// Centralized key factory
export const cacheKeys = {
  // Hierarchical structure: [domain, id?, filter?, sort?]

  profile: {
    all: ['profiles'] as const,
    lists: () => [...cacheKeys.profile.all, 'list'] as const,
    list: (filters: ProfileFilters) =>
      [...cacheKeys.profile.lists(), filters] as const,
    details: () => [...cacheKeys.profile.all, 'detail'] as const,
    detail: (id: string) =>
      [...cacheKeys.profile.details(), id] as const,
  },

  property: {
    all: ['properties'] as const,
    lists: () => [...cacheKeys.property.all, 'list'] as const,
    list: (filters: PropertyFilters) =>
      [...cacheKeys.property.lists(), filters] as const,
    details: () => [...cacheKeys.property.all, 'detail'] as const,
    detail: (id: string) =>
      [...cacheKeys.property.details(), id] as const,
  },
} as const;

// Usage
useQuery({
  queryKey: cacheKeys.profile.detail(userId),
  queryFn: () => fetchProfile(userId),
});

// Invalidate all profile queries
queryClient.invalidateQueries({ queryKey: cacheKeys.profile.all });

// Invalidate specific profile
queryClient.invalidateQueries({ queryKey: cacheKeys.profile.detail(userId) });
```

### 1.3 TTL and Expiration (CRITICAL)

Set appropriate Time-To-Live values based on data characteristics.

**TTL Guidelines**:
```typescript
// packages/data/cache/config.ts

export const CacheTTL = {
  // Static/rarely changing data
  STATIC: Infinity,
  LONG: 60 * 60 * 1000,        // 1 hour

  // Semi-static data (lookups, reference data)
  MEDIUM: 30 * 60 * 1000,      // 30 minutes

  // User-specific data
  SHORT: 5 * 60 * 1000,        // 5 minutes

  // Frequently changing data
  VERY_SHORT: 60 * 1000,       // 1 minute

  // Real-time data
  REALTIME: 0,                 // No caching
} as const;

// Usage with TanStack Query
export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: cacheKeys.profile.detail(userId),
    queryFn: () => profileService.getById(userId),
    staleTime: CacheTTL.SHORT,      // 5 min before considered stale
    gcTime: CacheTTL.MEDIUM,        // 30 min before garbage collected
  });
};

export const useCountries = () => {
  return useQuery({
    queryKey: cacheKeys.lookup.countries(),
    queryFn: () => lookupService.getCountries(),
    staleTime: CacheTTL.LONG,       // 1 hour - rarely changes
    gcTime: Infinity,                // Keep forever
  });
};
```

### 1.4 Cache Invalidation (CRITICAL)

Implement proper cache invalidation strategies.

**Invalidation Patterns**:
```typescript
// packages/data/mutations/useUpdateProfile.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cacheKeys } from '../cache/keys';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      profileService.update(data),

    onSuccess: (updatedProfile, variables) => {
      // Pattern 1: Invalidate specific query
      queryClient.invalidateQueries({
        queryKey: cacheKeys.profile.detail(updatedProfile.id),
      });

      // Pattern 2: Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: cacheKeys.profile.lists(),
      });

      // Pattern 3: Optimistically update cache
      queryClient.setQueryData(
        cacheKeys.profile.detail(updatedProfile.id),
        updatedProfile
      );
    },
  });
};
```

---

## 2. TanStack Query Caching

### 2.1 Query Configuration (CRITICAL)

Configure TanStack Query with proper defaults for Pulwave.

**Incorrect** - Default configuration:
```typescript
// No custom configuration
const queryClient = new QueryClient();
```

**Correct** - Pulwave query client:
```typescript
// packages/data/cache/queryClient.ts

import { QueryClient } from '@tanstack/react-query';
import { CacheTTL } from './config';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global defaults
      staleTime: CacheTTL.SHORT,       // 5 minutes
      gcTime: CacheTTL.MEDIUM,         // 30 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Network mode
      networkMode: 'online',

      // Refetch settings
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
});

// App setup
// apps/web/real-estate/App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@pulwave/data';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* app content */}
    </QueryClientProvider>
  );
};
```

### 2.2 staleTime vs gcTime (CRITICAL)

Understand the difference between staleTime and gcTime.

**Explanation**:
```typescript
// staleTime: How long until data is considered stale
// - Data is "fresh" for this duration
// - Fresh data won't trigger a background refetch
// - Default: 0 (immediately stale)

// gcTime (formerly cacheTime): How long to keep unused data in cache
// - After last component unmounts, data stays in cache for this duration
// - Prevents refetching if component remounts quickly
// - Default: 5 minutes

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: cacheKeys.profile.detail(userId),
    queryFn: () => profileService.getById(userId),

    staleTime: 5 * 60 * 1000,    // 5 min - data is fresh
    // Within 5 minutes: use cached data, no refetch
    // After 5 minutes: data is stale, refetch in background

    gcTime: 30 * 60 * 1000,      // 30 min - keep in memory
    // After component unmounts, keep data for 30 minutes
    // If component remounts within 30 min, use cached data
    // After 30 min of being unused, garbage collect
  });
};

// Timeline example:
// T=0:   Component mounts → fetch from server → cache data
// T=1m:  Component remounts → use cached data (fresh, no refetch)
// T=6m:  Component remounts → use cached data but refetch in background (stale)
// T=40m: Component remounts → fetch from server (garbage collected)
```

### 2.3 Query Keys (CRITICAL)

Structure query keys for efficient invalidation.

**Pulwave Query Key Pattern**:
```typescript
// packages/data/cache/keys/index.ts

export const cacheKeys = {
  // Properties domain
  property: {
    all: ['properties'] as const,

    lists: () => [...cacheKeys.property.all, 'list'] as const,
    list: (filters: PropertyFilters) =>
      [...cacheKeys.property.lists(), filters] as const,

    details: () => [...cacheKeys.property.all, 'detail'] as const,
    detail: (id: string) =>
      [...cacheKeys.property.details(), id] as const,

    units: (propertyId: string) =>
      [...cacheKeys.property.detail(propertyId), 'units'] as const,
    unit: (propertyId: string, unitId: string) =>
      [...cacheKeys.property.units(propertyId), unitId] as const,
  },
} as const;

// Key hierarchy:
// ['properties']                              // All property queries
// ['properties', 'list']                      // All property lists
// ['properties', 'list', { status: 'active' }] // Filtered list
// ['properties', 'detail']                    // All property details
// ['properties', 'detail', 'prop-123']        // Specific property
// ['properties', 'detail', 'prop-123', 'units'] // Property's units

// Invalidation examples:
// Invalidate ALL property-related queries
queryClient.invalidateQueries({ queryKey: cacheKeys.property.all });

// Invalidate ALL property lists (but not details)
queryClient.invalidateQueries({ queryKey: cacheKeys.property.lists() });

// Invalidate specific property detail
queryClient.invalidateQueries({ queryKey: cacheKeys.property.detail('prop-123') });
```

### 2.4 Cache Invalidation (CRITICAL)

Invalidate cache on mutations with proper granularity.

**Pulwave Mutation Pattern**:
```typescript
// packages/data/domains/property/hooks/useCreateProperty.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cacheKeys } from '../../../cache/keys';
import { propertyService } from '../services/propertyService';

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyInput) =>
      propertyService.create(data),

    onMutate: async (newProperty) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cacheKeys.property.lists() });

      // Snapshot previous value
      const previousProperties = queryClient.getQueryData(
        cacheKeys.property.lists()
      );

      // Optimistically update lists
      queryClient.setQueriesData(
        { queryKey: cacheKeys.property.lists() },
        (old: Property[] | undefined) => {
          if (!old) return old;
          return [{ ...newProperty, id: 'temp-id' }, ...old];
        }
      );

      return { previousProperties };
    },

    onError: (err, newProperty, context) => {
      // Rollback on error
      if (context?.previousProperties) {
        queryClient.setQueriesData(
          { queryKey: cacheKeys.property.lists() },
          context.previousProperties
        );
      }
    },

    onSuccess: (createdProperty) => {
      // Set the detail cache
      queryClient.setQueryData(
        cacheKeys.property.detail(createdProperty.id),
        createdProperty
      );

      // Invalidate lists to refetch with real data
      queryClient.invalidateQueries({
        queryKey: cacheKeys.property.lists(),
      });
    },
  });
};
```

### 2.5 Optimistic Updates (HIGH)

Implement optimistic updates for better UX.

**Pulwave Optimistic Update Pattern**:
```typescript
// packages/data/domains/profile/hooks/useUpdateProfile.ts

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      profileService.update(data.id, data),

    onMutate: async (updatedProfile) => {
      const queryKey = cacheKeys.profile.detail(updatedProfile.id);

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<Profile>(queryKey);

      // Optimistically update
      queryClient.setQueryData<Profile>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, ...updatedProfile };
      });

      return { previousProfile };
    },

    onError: (err, updatedProfile, context) => {
      // Rollback optimistic update
      if (context?.previousProfile) {
        queryClient.setQueryData(
          cacheKeys.profile.detail(updatedProfile.id),
          context.previousProfile
        );
      }

      // Show error toast
      toast.error('Failed to update profile');
    },

    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: cacheKeys.profile.lists(),
      });

      toast.success('Profile updated successfully');
    },
  });
};
```

### 2.6 Prefetching (HIGH)

Prefetch data for anticipated navigation.

**Pulwave Prefetch Patterns**:
```typescript
// packages/data/domains/property/hooks/usePrefetchProperty.ts

import { useQueryClient } from '@tanstack/react-query';
import { cacheKeys } from '../../../cache/keys';
import { propertyService } from '../services/propertyService';

export const usePrefetchProperty = () => {
  const queryClient = useQueryClient();

  return {
    // Prefetch on hover
    prefetchOnHover: (propertyId: string) => {
      queryClient.prefetchQuery({
        queryKey: cacheKeys.property.detail(propertyId),
        queryFn: () => propertyService.getById(propertyId),
        staleTime: 5 * 60 * 1000,
      });
    },

    // Prefetch on mount (for pagination)
    prefetchNextPage: (currentPage: number, filters: PropertyFilters) => {
      const nextPageFilters = { ...filters, page: currentPage + 1 };

      queryClient.prefetchQuery({
        queryKey: cacheKeys.property.list(nextPageFilters),
        queryFn: () => propertyService.list(nextPageFilters),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
};

// Usage in component
const PropertyCard = ({ property }: Props) => {
  const { prefetchOnHover } = usePrefetchProperty();

  return (
    <Link
      to={`/properties/${property.id}`}
      onMouseEnter={() => prefetchOnHover(property.id)}
    >
      {property.name}
    </Link>
  );
};
```

---

## 3. HTTP Caching

### 3.1 Cache-Control Headers (CRITICAL)

Set appropriate Cache-Control headers for different resource types.

**Incorrect** - No cache headers:
```typescript
// API endpoint without cache headers
app.get('/api/properties/:id', async (req, res) => {
  const property = await getProperty(req.params.id);
  res.json(property);  // No caching!
});
```

**Correct** - Cache-Control headers:
```typescript
// API with proper cache headers
app.get('/api/properties/:id', async (req, res) => {
  const property = await getProperty(req.params.id);

  // Public cacheable resource
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
  // public: can be cached by CDN/proxies
  // max-age=300: browser caches for 5 minutes
  // s-maxage=600: CDN caches for 10 minutes

  res.json(property);
});

// User-specific data
app.get('/api/profile', authenticate, async (req, res) => {
  const profile = await getProfile(req.user.id);

  // Private, but cacheable by browser
  res.setHeader('Cache-Control', 'private, max-age=300');
  // private: only browser can cache (not CDN)
  // max-age=300: cache for 5 minutes

  res.json(profile);
});

// Static assets
app.use('/static', express.static('public', {
  maxAge: '1y',  // Cache for 1 year
  immutable: true,  // Content will never change
}));

// Real-time data
app.get('/api/live-stats', async (req, res) => {
  const stats = await getLiveStats();

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  // no-cache: must revalidate with server
  // no-store: don't cache at all
  // must-revalidate: strict validation

  res.json(stats);
});
```

### 3.2 ETags (CRITICAL)

Use ETags for conditional requests.

**Pulwave ETag Implementation**:
```typescript
// Backend API
import crypto from 'crypto';

function generateETag(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}

app.get('/api/properties/:id', async (req, res) => {
  const property = await getProperty(req.params.id);
  const content = JSON.stringify(property);
  const etag = generateETag(content);

  // Check If-None-Match header from client
  const clientETag = req.headers['if-none-match'];

  if (clientETag === etag) {
    // Content hasn't changed
    return res.status(304).end();  // Not Modified
  }

  // Content changed, send new data
  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json(property);
});

// Frontend automatic handling
// Browsers automatically send If-None-Match on subsequent requests
fetch('/api/properties/123');  // First request
// Server responds with ETag: "abc123"

fetch('/api/properties/123');  // Second request
// Browser sends If-None-Match: "abc123"
// Server responds with 304 if unchanged (saves bandwidth)
```

### 3.3 Last-Modified (HIGH)

Use Last-Modified for time-based conditional requests.

**Implementation**:
```typescript
app.get('/api/properties/:id', async (req, res) => {
  const property = await getProperty(req.params.id);
  const lastModified = new Date(property.updated_at);

  // Check If-Modified-Since header
  const ifModifiedSince = req.headers['if-modified-since'];

  if (ifModifiedSince && new Date(ifModifiedSince) >= lastModified) {
    return res.status(304).end();  // Not Modified
  }

  res.setHeader('Last-Modified', lastModified.toUTCString());
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json(property);
});
```

### 3.4 Vary Header (HIGH)

Use Vary header to cache different versions based on request headers.

**Pulwave Vary Header**:
```typescript
app.get('/api/properties', async (req, res) => {
  const language = req.headers['accept-language'];
  const properties = await getProperties({ language });

  // Cache different versions per language
  res.setHeader('Vary', 'Accept-Language');
  res.setHeader('Cache-Control', 'public, max-age=600');

  res.json(properties);
});

// With authentication
app.get('/api/dashboard', authenticate, async (req, res) => {
  const data = await getDashboard(req.user.id);

  // Different cache per user
  res.setHeader('Vary', 'Authorization');
  res.setHeader('Cache-Control', 'private, max-age=300');

  res.json(data);
});
```

---

## 10. Pulwave Integration

### 10.1 TanStack Query Setup (CRITICAL)

Configure TanStack Query for Pulwave monorepo.

**packages/data/cache/queryClient.ts**:
```typescript
import { QueryClient } from '@tanstack/react-query';
import { CacheTTL } from './config';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CacheTTL.SHORT,
      gcTime: CacheTTL.MEDIUM,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### 10.2 Query Keys Pattern (CRITICAL)

Centralize query keys for consistency.

**packages/data/cache/keys/index.ts**:
```typescript
// Export all domain keys
export { profileKeys } from './profileKeys';
export { propertyKeys } from './propertyKeys';
export { tenantKeys } from './tenantKeys';
export { financeKeys } from './financeKeys';

// Aggregate all keys
export const cacheKeys = {
  profile: profileKeys,
  property: propertyKeys,
  tenant: tenantKeys,
  finance: financeKeys,
} as const;
```

**packages/data/cache/keys/propertyKeys.ts**:
```typescript
import type { PropertyFilters, UnitFilters } from '../../domains/property/interfaces/types';

export const propertyKeys = {
  all: ['properties'] as const,

  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: PropertyFilters) =>
    [...propertyKeys.lists(), filters] as const,

  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) =>
    [...propertyKeys.details(), id] as const,

  units: (propertyId: string) =>
    [...propertyKeys.detail(propertyId), 'units'] as const,
  unit: (propertyId: string, unitId: string) =>
    [...propertyKeys.units(propertyId), unitId] as const,
} as const;
```

### 10.3 Data Layer Caching (CRITICAL)

Integrate caching into Pulwave data layer.

**packages/data/domains/property/hooks/useProperty.ts**:
```typescript
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { cacheKeys } from '../../../cache/keys';
import { CacheTTL } from '../../../cache/config';
import { propertyService } from '../services/propertyService';
import type { Property } from '../interfaces/types';

export const useProperty = (
  propertyId: string,
  options?: Omit<UseQueryOptions<Property>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: cacheKeys.property.detail(propertyId),
    queryFn: () => propertyService.getById(propertyId),
    staleTime: CacheTTL.SHORT,
    gcTime: CacheTTL.MEDIUM,
    ...options,
  });
};

export const useProperties = (
  filters: PropertyFilters,
  options?: Omit<UseQueryOptions<Property[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: cacheKeys.property.list(filters),
    queryFn: () => propertyService.list(filters),
    staleTime: CacheTTL.SHORT,
    gcTime: CacheTTL.MEDIUM,
    ...options,
  });
};
```

---

## Appendix A: TanStack Query Configuration

```typescript
// Complete configuration reference
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Timing
      staleTime: 0,           // How long until data is stale
      gcTime: 5 * 60 * 1000,  // How long to keep unused data

      // Retries
      retry: 3,               // Number of retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetching
      refetchOnMount: true,           // Refetch on component mount
      refetchOnWindowFocus: true,     // Refetch on window focus
      refetchOnReconnect: true,       // Refetch on reconnect
      refetchInterval: false,         // Auto-refetch interval
      refetchIntervalInBackground: false,

      // Network
      networkMode: 'online',  // online | always | offlineFirst

      // Suspense
      suspense: false,
      useErrorBoundary: false,
    },
    mutations: {
      retry: 0,
      networkMode: 'online',
      useErrorBoundary: false,
    },
  },
});
```

## Appendix B: HTTP Cache Headers Reference

```typescript
// Cache-Control directives
'Cache-Control': 'public'              // Can be cached by any cache
'Cache-Control': 'private'             // Only browser cache
'Cache-Control': 'no-cache'            // Must revalidate before use
'Cache-Control': 'no-store'            // Don't cache at all
'Cache-Control': 'max-age=3600'        // Fresh for 3600 seconds
'Cache-Control': 's-maxage=7200'       // CDN cache for 7200 seconds
'Cache-Control': 'immutable'           // Never changes
'Cache-Control': 'must-revalidate'     // Strict revalidation

// Combined examples
'Cache-Control': 'public, max-age=31536000, immutable'  // Static assets
'Cache-Control': 'private, max-age=300, must-revalidate'  // User data
'Cache-Control': 'public, max-age=60, s-maxage=300'  // API data (browser 1m, CDN 5m)
```

## Appendix C: Redis Commands

```bash
# Set with expiration
SET key value EX 3600  # Expires in 1 hour
SETEX key 3600 value   # Same as above

# Get
GET key

# Delete
DEL key

# Check if exists
EXISTS key

# Set multiple
MSET key1 value1 key2 value2

# Get multiple
MGET key1 key2

# Increment
INCR counter
INCRBY counter 5

# Hash operations
HSET user:123 name "John" email "john@example.com"
HGET user:123 name
HGETALL user:123

# List operations (for caching lists)
LPUSH list:properties property1
LRANGE list:properties 0 -1

# Set operations (for tags)
SADD tags:property:123 "residential" "available"
SMEMBERS tags:property:123
```

## Appendix D: Cache Decision Tree

```
Is the data user-specific?
├─ Yes → private, TanStack Query + short TTL
└─ No
    ├─ Does it change frequently?
    │   ├─ Yes (< 1 min) → no-cache or very short TTL
    │   ├─ Sometimes (1-30 min) → TanStack Query + medium TTL
    │   └─ Rarely (> 30 min) → CDN + long TTL
    │
    └─ Is it expensive to compute?
        ├─ Yes → Redis cache + background refresh
        └─ No → TanStack Query only

Is it static content?
└─ Yes → Service Worker + immutable + 1 year TTL

Does it need to be real-time?
└─ Yes → WebSocket or no caching

Can it be stale briefly?
└─ Yes → stale-while-revalidate
```

---

**Impact Levels Summary**:
- **CRITICAL** (16): Caching layers, query keys, TTL, invalidation, TanStack Query config, HTTP headers
- **HIGH** (18): Service worker, CDN, Redis patterns, prefetching, monitoring, advanced patterns
- **MEDIUM** (6): Cache warming, CDN purging, write-through, monitoring
- **LOW** (0): None

**Total Patterns**: 40+ comprehensive caching patterns across all layers
