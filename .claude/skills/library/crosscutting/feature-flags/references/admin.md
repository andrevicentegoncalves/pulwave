# Feature Flag Administration

## Service API

### Create Flag

```typescript
await featureFlagService.createFlag({
  key: 'new-feature',
  name: 'New Feature',
  description: 'Enables the new feature',
  enabled: false,  // Start disabled
});
```

### Update Flag

```typescript
await featureFlagService.updateFlag(flagId, {
  rolloutPercentage: 50,
  targetRoles: ['beta', 'premium'],
});
```

### Toggle Flag

```typescript
// Quick enable/disable
await featureFlagService.toggleFlag(flagId, true);  // Enable
await featureFlagService.toggleFlag(flagId, false); // Disable
```

### Delete Flag

```typescript
await featureFlagService.deleteFlag(flagId);
```

## Flag Lifecycle

1. **Create**: New flag, disabled by default
2. **Configure**: Add targeting rules
3. **Test**: Enable for internal users
4. **Rollout**: Gradual percentage increase
5. **Full Release**: 100% or remove flag
6. **Cleanup**: Delete flag and remove code

## Naming Conventions

| Pattern | Example | Use Case |
|---------|---------|----------|
| `feature-*` | `feature-new-checkout` | New features |
| `experiment-*` | `experiment-button-color` | A/B tests |
| `release-*` | `release-v2-api` | Release toggles |
| `ops-*` | `ops-maintenance-mode` | Operational flags |

## Best Practices

- [ ] Start flags disabled
- [ ] Use descriptive names and descriptions
- [ ] Set up monitoring before rollout
- [ ] Document rollout plan
- [ ] Clean up flags after full release
- [ ] Limit active flags (technical debt)
