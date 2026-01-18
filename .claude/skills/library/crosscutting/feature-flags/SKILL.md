---
name: feature-flags
description: Implement feature flag systems with targeting, gradual rollout, and runtime evaluation.
version: 1.0.0
tags: [Feature Flags, Rollout, A/B Testing, Targeting]
---

# Feature Flags

Implement feature flag systems for controlled feature rollout, A/B testing, and runtime configuration.

## When to Use

- Gradual feature rollout to users
- A/B testing and experimentation
- Kill switches for production features
- Role-based or user-specific feature access
- Decoupling deployment from release

## Quick Reference

### Evaluation Priority
1. User targeting (specific user IDs)
2. Role targeting (user roles)
3. Percentage rollout (gradual)
4. Default enabled state

### Hook Usage
```tsx
// Simple boolean check
const isEnabled = useIsFeatureEnabled('new-dashboard');

// Full evaluation with reason
const { data } = useFeatureFlag('new-dashboard', { userId, userRoles });
// data.enabled, data.reason

// Multiple flags at once
const flags = useFeatureFlags(['feature-a', 'feature-b']);
// flags.data = { 'feature-a': true, 'feature-b': false }
```

### Flag Structure
```typescript
interface FeatureFlag {
  key: string;                    // Unique identifier
  enabled: boolean;               // Base state
  rolloutPercentage?: number;     // 0-100 gradual rollout
  targetUserIds?: string[];       // Specific user targeting
  targetRoles?: string[];         // Role-based targeting
}
```

## Workflow

1. **Define Flag**: Create with unique key, default disabled
2. **Configure Targeting**: Set user/role targeting or percentage
3. **Evaluate in Code**: Use hooks to check flag state
4. **Monitor**: Track adoption and issues
5. **Clean Up**: Remove flag code once fully rolled out

## Scoring (0-10)

- **10**: Targeting strategies, percentage rollout, proper cleanup, evaluation caching
- **7**: Basic flag checks, admin UI, no targeting
- **3**: Hardcoded flags, no evaluation API
- **0**: No feature flags, all features always on

## Full Compiled Guide

**Category Guide**: [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Complete crosscutting category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

- `references/architecture.md` - System architecture
- `references/evaluation-strategies.md` - Targeting and rollout
- `references/hooks.md` - React hooks API
- `references/admin.md` - Flag management
