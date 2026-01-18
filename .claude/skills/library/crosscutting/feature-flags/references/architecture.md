# Feature Flag Architecture

## Layer Structure

```
Component → Hook → Service → Repository → DataProvider
```

### Hooks Layer
React Query hooks for UI consumption:
- `useFeatureFlag()` - Full evaluation with reason
- `useIsFeatureEnabled()` - Simple boolean
- `useFeatureFlags()` - Batch evaluation

### Service Layer
Business logic and orchestration:
- `featureFlagService.isEnabled()` - Boolean check
- `featureFlagService.evaluate()` - Full evaluation
- CRUD operations for admin

### Repository Layer
Provider-agnostic data access:
- Delegates to `dataProvider.featureFlag`
- Evaluation logic lives in provider

## Query Keys Strategy

```typescript
featureFlagKeys = {
  all: ['feature-flags'],
  list: () => [...all, 'list'],
  byKey: (key) => [...all, 'key', key],
  evaluation: (key, userId) => [...all, 'eval', key, userId ?? 'anonymous'],
}
```

## Cache Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| Stale Time | 5 min | Flags don't change frequently |
| GC Time | 10 min | Reasonable retention |
| Retry | 3x | Default exponential backoff |

## Loading Behavior

`useIsFeatureEnabled()` returns `false` while loading - safe default for feature gates.
