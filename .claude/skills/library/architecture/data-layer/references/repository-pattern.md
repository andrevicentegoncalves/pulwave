# Repository Pattern

## Structure

```
domains/[domain]/
├── interfaces/
│   ├── I[Domain]Repository.ts    # Port (contract)
│   └── types/
│       └── [Domain].ts           # Type definitions
├── repositories/
│   └── [domain]Repository.ts     # Proxy to provider
├── services/
│   └── [domain]Service.ts        # Business logic
├── hooks/
│   └── use[Domain].ts            # React Query hooks
└── keys/
    └── index.ts                  # Query cache keys
```

## Interface (Port)

```typescript
// IProfileRepository.ts
import type { IVersionedRepository } from '../../../../interfaces';
import type { Profile, ProfileUpdate } from './types';

export interface IProfileRepository extends IVersionedRepository {
  readonly version: '1.0.0';

  findById(id: string): Promise<Profile | null>;
  findByAuthId(authId: string): Promise<Profile | null>;
  update(id: string, data: ProfileUpdate): Promise<Profile>;
  delete(id: string): Promise<void>;
}
```

## Repository (Proxy)

```typescript
// profileRepository.ts
import { dataProvider } from '../../../../infrastructure';
import type { IProfileRepository } from '../interfaces';

// Simple proxy - delegates all calls to provider
export const profileRepository: IProfileRepository = dataProvider.profile;

export default profileRepository;
```

## Provider Implementation

```typescript
// providers/supabase/profile/profileProvider.ts
import type { IProfileRepository } from '../../../domains/global/profile/interfaces';
import { supabaseClient } from '../client';

export const profileProvider: IProfileRepository = {
  version: '1.0.0',

  async findById(id: string) {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: ProfileUpdate) {
    const { data, error } = await supabaseClient
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
```

## Why This Pattern

| Benefit | How |
|---------|-----|
| **Testable** | Mock repository in tests |
| **Swappable** | Change provider, keep interface |
| **Clean** | No Supabase in business logic |
| **Typed** | Interface enforces contract |
| **Versioned** | Track breaking changes |
