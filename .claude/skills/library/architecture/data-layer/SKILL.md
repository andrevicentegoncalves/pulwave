---
name: data-layer
description: Implement provider-agnostic data layers using hexagonal architecture (ports & adapters).
version: 1.0.0
tags: [Architecture, Repository, Provider, Hexagonal, Data Access]
---

# Provider/Repository Pattern

Build provider-agnostic data layers with swappable backends using hexagonal architecture.

## When to Use

- Abstract away database/API specifics
- Enable provider swapping (Supabase → Firebase)
- Clean separation of concerns
- Testable business logic
- Multi-provider support

## Quick Reference

### Layer Flow
```
Component → Hook → Service → Repository → Provider
```

### Interface (Port)
```typescript
export interface IFeatureFlagRepository extends IVersionedRepository {
  readonly version: '1.0.0';
  getAllFlags(): Promise<FeatureFlag[]>;
  getFlagByKey(key: string): Promise<FeatureFlag | null>;
  createFlag(input: CreateInput): Promise<FeatureFlag>;
}
```

### Repository (Proxy)
```typescript
import { dataProvider } from '../../../../infrastructure';
import type { IFeatureFlagRepository } from '../interfaces';

export const featureFlagRepository: IFeatureFlagRepository =
  dataProvider.featureFlag;
```

### Service (Business Logic)
```typescript
export const featureFlagService = {
  async isEnabled(key: string, userId?: string): Promise<boolean> {
    const result = await featureFlagRepository.evaluateFlag(key, userId);
    return result.enabled;
  },
};
```

## Workflow

1. **Define Interface**: Create repository interface (port)
2. **Implement Provider**: Create provider-specific implementation
3. **Create Repository**: Proxy to provider via `dataProvider`
4. **Add Service**: Business logic layer
5. **Create Hooks**: React Query integration

## Scoring (0-10)

- **10**: Full hexagonal, versioned interfaces, provider factory, comprehensive tests
- **7**: Repository pattern, service layer, basic abstraction
- **3**: Direct provider access in components
- **0**: Database calls in UI components

## Full Compiled Guide

**Category Guide**: [../architecture/AGENTS.md](../architecture/AGENTS.md) - Complete architecture category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

- `references/ports-adapters.md` - Hexagonal architecture
- `references/repository-pattern.md` - Repository implementation
- `references/service-composition.md` - Service layer patterns
- `references/testing.md` - Testing with mock providers
