# TypeScript & Data Layer Patterns

---

## 1. Multi-Tenant Data Provider

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MULTI-TENANT DATA PROVIDER                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  // packages/platform/data-core/providers/supabase/client.ts       │     │
│  │                                                                     │     │
│  │  import { createClient } from '@supabase/supabase-js';             │     │
│  │  import type { Database } from './types';                          │     │
│  │                                                                     │     │
│  │  // Base client                                                     │     │
│  │  export const supabase = createClient<Database>(                   │     │
│  │    env.VITE_SUPABASE_URL,                                          │     │
│  │    env.VITE_SUPABASE_ANON_KEY                                      │     │
│  │  );                                                                 │     │
│  │                                                                     │     │
│  │  // Schema-aware query builders                                     │     │
│  │  export const db = {                                                │     │
│  │    global: supabase.schema('global'),                              │     │
│  │    platform: supabase.schema('platform'),                          │     │
│  │    realEstate: supabase.schema('real_estate'),                     │     │
│  │    restaurant: supabase.schema('restaurant'),                      │     │
│  │    retail: supabase.schema('retail'),                              │     │
│  │  };                                                                 │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  // Dynamic schema selector based on current app                    │     │
│  │  export function useAppSchema() {                                   │     │
│  │    const { appSlug } = useAppContext();                            │     │
│  │                                                                     │     │
│  │    const schemaMap = {                                              │     │
│  │      'real-estate': db.realEstate,                                 │     │
│  │      'restaurant': db.restaurant,                                  │     │
│  │      'retail': db.retail,                                          │     │
│  │    };                                                               │     │
│  │                                                                     │     │
│  │    return schemaMap[appSlug];                                      │     │
│  │  }                                                                  │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Repository Pattern with Multi-Tenancy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  REPOSITORY PATTERN WITH MULTI-TENANCY                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  // packages/products/real-estate/data/repositories/               │     │
│  │  // propertyRepository.ts                                          │     │
│  │                                                                     │     │
│  │  import { db } from '@pulwave/data-core';                          │     │
│  │  import type { Property, CreatePropertyDTO } from '../types';      │     │
│  │                                                                     │     │
│  │  export const propertyRepository = {                                │     │
│  │    // RLS handles org filtering automatically via JWT              │     │
│  │    async findAll(): Promise<Property[]> {                          │     │
│  │      const { data, error } = await db.realEstate                   │     │
│  │        .from('properties')                                          │     │
│  │        .select(`                                                    │     │
│  │          *,                                                         │     │
│  │          units:units(count),                                        │     │
│  │          created_by:global.profiles!created_by(full_name)          │     │
│  │        `)                                                           │     │
│  │        .order('created_at', { ascending: false });                 │     │
│  │                                                                     │     │
│  │      if (error) throw error;                                       │     │
│  │      return data;                                                   │     │
│  │    },                                                               │     │
│  │                                                                     │     │
│  │    async findById(id: string): Promise<Property | null> {          │     │
│  │      const { data, error } = await db.realEstate                   │     │
│  │        .from('properties')                                          │     │
│  │        .select('*')                                                 │     │
│  │        .eq('id', id)                                                │     │
│  │        .single();                                                   │     │
│  │                                                                     │     │
│  │      if (error) throw error;                                       │     │
│  │      return data;                                                   │     │
│  │    },                                                               │     │
│  │                                                                     │     │
│  │    // org_id is automatically set via RLS default                  │     │
│  │    async create(dto: CreatePropertyDTO): Promise<Property> {       │     │
│  │      const { data, error } = await db.realEstate                   │     │
│  │        .from('properties')                                          │     │
│  │        .insert(dto)                                                 │     │
│  │        .select()                                                    │     │
│  │        .single();                                                   │     │
│  │                                                                     │     │
│  │      if (error) throw error;                                       │     │
│  │      return data;                                                   │     │
│  │    },                                                               │     │
│  │  };                                                                 │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. React Query Hooks with Context

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REACT QUERY HOOKS WITH CONTEXT                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  // packages/products/real-estate/data/hooks/useProperties.ts      │     │
│  │                                                                     │     │
│  │  import { useQuery, useMutation, useQueryClient } from            │     │
│  │    '@tanstack/react-query';                                        │     │
│  │  import { propertyRepository } from '../repositories';             │     │
│  │  import { useAppContext } from '@pulwave/shared-auth';             │     │
│  │                                                                     │     │
│  │  // Query keys include org context for proper cache isolation      │     │
│  │  const keys = {                                                     │     │
│  │    all: (orgId: string) => ['properties', orgId] as const,        │     │
│  │    detail: (orgId: string, id: string) =>                         │     │
│  │      ['properties', orgId, id] as const,                          │     │
│  │  };                                                                 │     │
│  │                                                                     │     │
│  │  export function useProperties() {                                  │     │
│  │    const { orgId } = useAppContext();                              │     │
│  │                                                                     │     │
│  │    return useQuery({                                                │     │
│  │      queryKey: keys.all(orgId),                                    │     │
│  │      queryFn: () => propertyRepository.findAll(),                  │     │
│  │    });                                                              │     │
│  │  }                                                                  │     │
│  │                                                                     │     │
│  │  export function useProperty(id: string) {                         │     │
│  │    const { orgId } = useAppContext();                              │     │
│  │                                                                     │     │
│  │    return useQuery({                                                │     │
│  │      queryKey: keys.detail(orgId, id),                             │     │
│  │      queryFn: () => propertyRepository.findById(id),               │     │
│  │    });                                                              │     │
│  │  }                                                                  │     │
│  │                                                                     │     │
│  │  export function useCreateProperty() {                              │     │
│  │    const { orgId } = useAppContext();                              │     │
│  │    const queryClient = useQueryClient();                           │     │
│  │                                                                     │     │
│  │    return useMutation({                                             │     │
│  │      mutationFn: propertyRepository.create,                        │     │
│  │      onSuccess: () => {                                             │     │
│  │        queryClient.invalidateQueries({                             │     │
│  │          queryKey: keys.all(orgId)                                 │     │
│  │        });                                                          │     │
│  │      },                                                             │     │
│  │    });                                                              │     │
│  │  }                                                                  │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. App Context Provider

```tsx
┌─────────────────────────────────────────────────────────────────────────────┐
│                          APP CONTEXT PROVIDER                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  // packages/shared/auth/context/AppContext.tsx                             │
│                                                                              │
│  interface AppContextValue {                                                │
│    // Current context from JWT                                              │
│    userId: string;                                                          │
│    orgId: string;                                                           │
│    orgSlug: string;                                                         │
│    appId: string;                                                           │
│    appSlug: string;                                                         │
│    role: string;                                                            │
│    permissions: string[];                                                   │
│                                                                              │
│    // Available contexts for switcher                                       │
│    availableContexts: Array<{                                               │
│      orgId: string;                                                         │
│      orgName: string;                                                       │
│      apps: string[];                                                        │
│    }>;                                                                      │
│                                                                              │
│    // Actions                                                               │
│    switchContext: (orgId: string, appId: string) => Promise<void>;         │
│    refreshPermissions: () => Promise<void>;                                 │
│  }                                                                          │
│                                                                              │
│  export function AppProvider({ children }: PropsWithChildren) {             │
│    const { session } = useAuth();                                           │
│    const router = useRouter();                                              │
│                                                                              │
│    const value = useMemo(() => ({                                           │
│      userId: session?.user?.id,                                             │
│      orgId: session?.user?.app_metadata?.org_id,                           │
│      orgSlug: session?.user?.app_metadata?.org_slug,                       │
│      appId: session?.user?.app_metadata?.app_id,                           │
│      appSlug: session?.user?.app_metadata?.app_slug,                       │
│      role: session?.user?.app_metadata?.role,                              │
│      permissions: session?.user?.app_metadata?.permissions ?? [],          │
│      availableContexts: session?.user?.app_metadata?.available_contexts,   │
│                                                                              │
│      switchContext: async (orgId: string, appId: string) => {              │
│        await supabase.functions.invoke('switch-context', {                 │
│          body: { org_id: orgId, app_id: appId }                            │
│        });                                                                  │
│        await supabase.auth.refreshSession();                               │
│        const { data } = await supabase.auth.getSession();                  │
│        const newAppSlug = data.session?.user?.app_metadata?.app_slug;      │
│        const newOrgSlug = data.session?.user?.app_metadata?.org_slug;      │
│        router.push(`/${newAppSlug}/${newOrgSlug}/dashboard`);             │
│      },                                                                     │
│    }), [session, router]);                                                  │
│                                                                              │
│    return (                                                                  │
│      <AppContext.Provider value={value}>                                    │
│        {children}                                                           │
│      </AppContext.Provider>                                                 │
│    );                                                                       │
│  }                                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

