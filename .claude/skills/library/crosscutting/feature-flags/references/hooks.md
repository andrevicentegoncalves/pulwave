# Feature Flag Hooks

## useFeatureFlag

Full evaluation with detailed results.

```typescript
const { data, isLoading, error } = useFeatureFlag('new-feature', {
  userId: user.id,
  userRoles: user.roles,
});

// data: { flagKey, enabled, reason, variant }
if (data?.enabled) {
  return <NewFeature />;
}
```

### Options

```typescript
interface UseFeatureFlagOptions {
  userId?: string;      // User context
  userRoles?: string[]; // Role targeting
  enabled?: boolean;    // Conditional execution
}
```

## useIsFeatureEnabled

Simple boolean check.

```typescript
const showNewDashboard = useIsFeatureEnabled('new-dashboard', {
  userId: user.id,
});

return showNewDashboard ? <NewDashboard /> : <OldDashboard />;
```

**Loading Behavior:** Returns `false` while loading (safe default).

## useFeatureFlags

Batch evaluation for multiple flags.

```typescript
const { data: flags } = useFeatureFlags(
  ['feature-a', 'feature-b', 'feature-c'],
  { userId: user.id }
);

// flags = { 'feature-a': true, 'feature-b': false, ... }

if (flags?.['feature-a']) {
  // Show feature A
}
```

## Conditional Execution

Skip query until ready:

```typescript
const { data } = useFeatureFlag('premium-feature', {
  userId: user?.id,
  enabled: !!user,  // Don't fetch until user loaded
});
```

## Pattern: Feature Gate Component

```tsx
function FeatureGate({
  flag,
  children,
  fallback = null
}: {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const isEnabled = useIsFeatureEnabled(flag);
  return isEnabled ? children : fallback;
}

// Usage
<FeatureGate flag="new-sidebar" fallback={<OldSidebar />}>
  <NewSidebar />
</FeatureGate>
```
