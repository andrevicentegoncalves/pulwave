---
name: caching
description: Implement caching strategies across frontend, backend, and API layers.
version: 1.0.0
tags: [Caching, Performance, React Query, HTTP, Redis]
---

# Caching Strategies

Implement caching at every layer: browser, API, server, and database.

## When to Use

- Reduce API calls and latency
- Improve user experience
- Lower server/database load
- Offline-first applications

## Quick Reference

### React Query (Client)
```typescript
const { data } = useQuery({
  queryKey: ['profile', userId],
  queryFn: () => fetchProfile(userId),
  staleTime: 5 * 60 * 1000,     // 5 min before refetch
  gcTime: 10 * 60 * 1000,       // 10 min in cache
});

// Invalidate on mutation
queryClient.invalidateQueries({ queryKey: ['profile'] });
```

### HTTP Caching
```typescript
// Cache-Control headers
res.setHeader('Cache-Control', 'public, max-age=3600');
res.setHeader('ETag', contentHash);
```

### Service Worker
```javascript
// Cache-first strategy
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
```

## Caching Layers

| Layer | Tool | TTL |
|-------|------|-----|
| Browser | Service Worker | Long (static) |
| HTTP | Cache-Control | Minutes-hours |
| Client State | React Query | 5-30 min |
| API Gateway | CDN/Edge | Minutes |
| Server | Redis/Memcached | Minutes-hours |
| Database | Query cache | Seconds |

## Cache Invalidation

| Strategy | When |
|----------|------|
| TTL | Data can be stale briefly |
| Event-based | On mutations |
| Tag-based | Related data groups |
| Manual | Admin actions |

## Workflow

1. **Identify Hot Paths**: Profile slow requests
2. **Choose Layer**: Client vs server caching
3. **Set TTL**: Balance freshness vs performance
4. **Invalidate**: Clear on data changes
5. **Monitor**: Track hit rates

## Scoring (0-10)

- **10**: Multi-layer caching, proper invalidation, monitoring
- **7**: React Query + HTTP headers
- **3**: Basic browser caching only
- **0**: No caching strategy

## Full Compiled Guide

**Category Guide**: [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Complete crosscutting category with all patterns and examples

**Individual AGENTS.md**: [AGENTS.md](./AGENTS.md) - Comprehensive caching strategies guide (40+ patterns)

### What's in AGENTS.md

**Caching Fundamentals** (CRITICAL):
- Multi-layer caching hierarchy (browser → CDN → Redis → database)
- Cache key structuring with hierarchical patterns
- TTL and expiration strategies for different data types
- Cache invalidation patterns (time-based, event-based, tag-based)

**TanStack Query Caching** (CRITICAL):
- Query configuration with proper defaults
- staleTime vs gcTime explained with examples
- Query keys with centralized key factories
- Cache invalidation on mutations
- Optimistic updates for better UX
- Prefetching strategies (hover, pagination)

**HTTP Caching** (CRITICAL):
- Cache-Control headers for different resource types
- ETags for conditional requests
- Last-Modified headers for time-based validation
- Vary header for multi-variant caching

**Service Worker Caching** (HIGH):
- Cache strategies (cache-first, network-first, stale-while-revalidate)
- Offline-first patterns
- Static asset caching

**CDN and Edge Caching** (HIGH):
- CDN configuration for global distribution
- Edge caching strategies
- Cache purging patterns

**Server-Side Caching** (HIGH):
- Redis patterns for application caching
- Cache-aside pattern
- Write-through caching
- Cache warming strategies

**Cache Invalidation Strategies** (CRITICAL):
- Time-based invalidation with TTL
- Event-based invalidation on mutations
- Tag-based invalidation for related data
- Manual invalidation for admin actions

**Advanced Patterns** (HIGH):
- Normalized cache for relational data
- Partial cache updates
- Background refresh patterns
- Cache stampede prevention

**Monitoring and Metrics** (CRITICAL/HIGH):
- Cache hit rate tracking
- Performance metrics
- Cache size monitoring

**Pulwave Integration** (CRITICAL):
- TanStack Query setup in monorepo
- Query keys pattern with domain organization
- Data layer caching integration with hooks

**Appendices**:
- Complete TanStack Query configuration reference
- HTTP cache headers reference
- Redis commands cheat sheet
- Cache decision tree

## Additional Resources

- `references/react-query.md` - Client-side caching
- `references/http-caching.md` - HTTP cache headers
- `references/redis.md` - Server-side caching
