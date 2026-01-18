# Evaluation Strategies

## Priority Order

Evaluation checks in this order (first match wins):

1. **User Targeting** → `user_targeted`
2. **Role Targeting** → `role_targeted`
3. **Percentage Rollout** → `percentage_rollout`
4. **Default State** → `default`
5. **Not Found** → `not_found`

## Evaluation Reasons

```typescript
type EvaluationReason =
  | 'default'           // Flag's base enabled state
  | 'user_targeted'     // User in targetUserIds
  | 'role_targeted'     // User role in targetRoles
  | 'percentage_rollout'// Within rollout percentage
  | 'not_found'         // Flag doesn't exist
```

## User Targeting

Target specific users by ID:

```typescript
{
  key: 'beta-feature',
  enabled: false,
  targetUserIds: ['user-123', 'user-456']
}
```

**Use Cases:**
- Beta testers
- Internal users
- VIP customers

## Role Targeting

Target by user role:

```typescript
{
  key: 'admin-tools',
  enabled: false,
  targetRoles: ['admin', 'super-admin']
}
```

**Use Cases:**
- Admin-only features
- Premium tier features
- Role-specific functionality

## Percentage Rollout

Gradual rollout to percentage of users:

```typescript
{
  key: 'new-checkout',
  enabled: true,
  rolloutPercentage: 25  // 25% of users
}
```

**Rollout Strategy:**
1. Start at 5-10%
2. Monitor errors/metrics
3. Increase to 25%, 50%, 75%
4. Full rollout at 100%
5. Remove flag code

## Kill Switch Pattern

Emergency disable:

```typescript
// Flag with targeting but can be killed
{
  key: 'risky-feature',
  enabled: false,  // Toggle this to kill
  targetRoles: ['beta']
}
```

Set `enabled: false` to immediately disable for everyone.
