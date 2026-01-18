# Data Layer Architecture - Implementation Guide

**Version 1.0.0**
Pulwave Engineering
2026-01-17

> **Note:**
> This is the detailed implementation guide for data layer architecture in Pulwave.
> For quick reference, see [SKILL.md](SKILL.md). For category overview, see [../AGENTS.md](../AGENTS.md).

## Abstract

Comprehensive guide to implementing provider-agnostic data layers using hexagonal architecture (ports & adapters pattern). Covers repository pattern, service layer, provider abstraction, React Query integration, and testing strategies. Essential for building maintainable, testable, and swappable data access layers.

**Key Concepts:**
- Hexagonal architecture (ports & adapters)
- Repository pattern for data access abstraction
- Service layer for business logic
- Provider pattern for swappable backends
- React Query hooks for UI integration

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Repository Pattern](#2-repository-pattern)
3. [Service Layer](#3-service-layer)
4. [Provider Implementation](#4-provider-implementation)
5. [React Query Integration](#5-react-query-integration)
6. [Testing Strategies](#6-testing-strategies)

---

## 1. Architecture Overview

### Layer Flow

```
Component → Hook → Service → Repository → Provider
```

1. **Component** - UI component (Features/Experience layer)
2. **Hook** - React Query hook (`useProfile`, `useProperties`)
3. **Service** - Business logic, transformations, validation
4. **Repository** - Data access abstraction (port)
5. **Provider** - Implementation (adapter) - currently Supabase

### Benefits

- **Provider-agnostic** - Swap Supabase for Firebase without changing business logic
- **Testable** - Mock providers easily
- **Maintainable** - Clear separation of concerns
- **Type-safe** - Full TypeScript support
- **Cacheable** - React Query handles caching

---

## 2. Repository Pattern

### Interface Definition (Port)

```typescript
// packages/data/domains/profile/interfaces/types/index.ts
export interface IProfileRepository {
  readonly version: '1.0.0';
  findById(id: string): Promise<Profile | null>;
  update(id: string, data: Partial<Profile>): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### Repository Implementation (Proxy)

```typescript
// packages/data/domains/profile/repositories/profileRepository.ts
import { dataProvider } from '../../../providers';
import type { IProfileRepository } from '../interfaces/types';

export const profileRepository: IProfileRepository = dataProvider.profile;
```

### Domain Structure

```
packages/data/domains/profile/
├── hooks/
│   └── useProfile.ts
├── services/
│   └── profileService.ts
├── repositories/
│   └── profileRepository.ts
├── interfaces/
│   └── types/
│       └── index.ts
├── keys/
│   └── index.ts
└── __tests__/
```

---

## 3. Service Layer

### Service Implementation

```typescript
// packages/data/domains/profile/services/profileService.ts
import { profileRepository } from '../repositories/profileRepository';
import type { Profile } from '../interfaces/types';

export const profileService = {
  async getFullProfile(userId: string): Promise<Profile> {
    const profile = await profileRepository.findById(userId);

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Business logic, enrichment
    return {
      ...profile,
      fullName: `${profile.firstName} ${profile.lastName}`,
    };
  },

  async updateProfile(userId: string, data: Partial<Profile>): Promise<void> {
    // Validation
    if (data.email && !isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Update
    await profileRepository.update(userId, data);
  },
};
```

---

## 4. Provider Implementation

### Provider Interface

```typescript
// packages/data/providers/interfaces.ts
export interface DataProvider {
  profile: IProfileRepository;
  property: IPropertyRepository;
  // ... other domains
}
```

### Supabase Provider

```typescript
// packages/data/providers/supabase/profileProvider.ts
import { supabase } from './client';
import type { IProfileRepository, Profile } from '../../domains/profile/interfaces/types';

export const supabaseProfileProvider: IProfileRepository = {
  version: '1.0.0',

  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, data: Partial<Profile>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id);

    if (error) throw error;
  },
};
```

### Provider Factory

```typescript
// packages/data/providers/index.ts
import { supabaseProfileProvider } from './supabase/profileProvider';
import type { DataProvider } from './interfaces';

export const dataProvider: DataProvider = {
  profile: supabaseProfileProvider,
  // ... other domains
};
```

---

## 5. React Query Integration

### Query Keys

```typescript
// packages/data/domains/profile/keys/index.ts
export const profileKeys = {
  all: ['profile'] as const,
  detail: (id: string) => [...profileKeys.all, id] as const,
  list: () => [...profileKeys.all, 'list'] as const,
};
```

### Hooks

```typescript
// packages/data/domains/profile/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import { profileService } from '../services/profileService';
import { profileKeys } from '../keys';

export function useProfile(userId: string) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => profileService.getFullProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Mutations

```typescript
// packages/data/domains/profile/hooks/useUpdateProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profileService';
import { profileKeys } from '../keys';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<Profile> }) =>
      profileService.updateProfile(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
    },
  });
}
```

---

## 6. Testing Strategies

### Mock Provider

```typescript
// packages/data/providers/__tests__/mockProvider.ts
import type { IProfileRepository } from '../../domains/profile/interfaces/types';

export const mockProfileProvider: IProfileRepository = {
  version: '1.0.0',

  async findById(id: string) {
    return {
      id,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    };
  },

  async update() {
    return Promise.resolve();
  },
};
```

### Service Tests

```typescript
// packages/data/domains/profile/services/__tests__/profileService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { profileService } from '../profileService';
import * as repository from '../../repositories/profileRepository';

vi.mock('../../repositories/profileRepository');

describe('profileService', () => {
  it('should get full profile', async () => {
    vi.spyOn(repository, 'profileRepository').mockResolvedValue({
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
    });

    const profile = await profileService.getFullProfile('1');

    expect(profile.fullName).toBe('John Doe');
  });
});
```

---

## Best Practices

1. **Always use repository abstraction** - Never access provider directly
2. **Keep services pure** - No UI concerns in services
3. **Versioned interfaces** - Include version field for compatibility
4. **Consistent naming** - `use[Domain]`, `[domain]Service`, `[domain]Repository`
5. **Error handling** - Handle provider errors in repository layer
6. **Type safety** - Full TypeScript coverage
7. **Query keys** - Consistent key structure for cache management

---

**Last Updated**: 2026-01-17
**Version**: 1.0.0
**Maintained By**: Pulwave Engineering
