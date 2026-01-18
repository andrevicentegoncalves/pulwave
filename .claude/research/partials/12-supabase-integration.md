# Supabase Integration

---

## 1. JWT Token Structure (Multi-Tenant)

> **Primary Source**: This is the authoritative reference for JWT structure

```json
{
  // Standard Supabase claims
  "sub": "user-uuid",
  "email": "john@example.com",
  "aud": "authenticated",

  // Custom claims (set via Supabase auth hook)
  "user_metadata": {
    "full_name": "John Doe",
    "avatar_url": "https://..."
  },

  // Session context (set when user selects org/app)
  "org_id": "org-uuid",
  "org_slug": "abc-properties",
  "app_id": "app-uuid",
  "app_slug": "real-estate",
  "role": "admin",

  // Permissions (derived from role + app)
  "permissions": [
    "properties:read",
    "properties:write",
    "leases:read",
    "leases:write",
    "admin:access"
  ],

  // Available orgs/apps for switcher UI
  "available_contexts": [
    { "org_id": "...", "org_name": "ABC Properties", "apps": ["real-estate"] },
    { "org_id": "...", "org_name": "XYZ Restaurant", "apps": ["restaurant"] },
    { "org_id": "...", "org_name": "Family Holdings", "apps": ["real-estate", "retail"] }
  ]
}
```

---

## 2. Auth Hooks for Multi-Tenant Context

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUPABASE AUTH HOOKS FOR MULTI-TENANT                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Supabase Auth Hooks allow injecting custom claims into JWT tokens.         │
│  We use this to add org_id, app_id, role, and permissions.                  │
│                                                                              │
│  HOOK LOCATION: supabase/functions/auth-hook/index.ts                       │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  export default async function authHook(req: Request) {            │     │
│  │    const { event, user } = await req.json();                       │     │
│  │                                                                     │     │
│  │    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {    │     │
│  │      // Get user's default org and app context                     │     │
│  │      const context = await getUserDefaultContext(user.id);         │     │
│  │                                                                     │     │
│  │      // Get permissions for this org+app combo                     │     │
│  │      const permissions = await resolvePermissions(                 │     │
│  │        user.id, context.org_id, context.app_id                     │     │
│  │      );                                                             │     │
│  │                                                                     │     │
│  │      return {                                                       │     │
│  │        claims: {                                                    │     │
│  │          org_id: context.org_id,                                   │     │
│  │          org_slug: context.org_slug,                               │     │
│  │          app_id: context.app_id,                                   │     │
│  │          app_slug: context.app_slug,                               │     │
│  │          role: context.role,                                       │     │
│  │          permissions: permissions,                                 │     │
│  │          available_contexts: context.available                     │     │
│  │        }                                                            │     │
│  │      };                                                             │     │
│  │    }                                                                │     │
│  │  }                                                                  │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  SWITCHING CONTEXT (when user changes org/app):                             │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  // Client-side: Switch organization or app                        │     │
│  │  async function switchContext(orgId: string, appId: string) {      │     │
│  │    // Call edge function to update session                         │     │
│  │    const { data, error } = await supabase.functions.invoke(        │     │
│  │      'switch-context',                                              │     │
│  │      { body: { org_id: orgId, app_id: appId } }                    │     │
│  │    );                                                               │     │
│  │                                                                     │     │
│  │    // Refresh the session to get new JWT with updated claims       │     │
│  │    await supabase.auth.refreshSession();                           │     │
│  │                                                                     │     │
│  │    // Redirect to new context                                       │     │
│  │    router.push(`/${data.app_slug}/${data.org_slug}/dashboard`);   │     │
│  │  }                                                                  │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Edge Functions Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EDGE FUNCTIONS ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PLATFORM EDGE FUNCTIONS (shared across all apps):                          │
│                                                                              │
│  supabase/functions/                                                        │
│  ├── auth-hook/          # Custom JWT claims (org, app, permissions)        │
│  ├── switch-context/     # Change org/app context                           │
│  ├── billing-webhook/    # Stripe webhook handler                           │
│  ├── invite-member/      # Send org invitations                             │
│  ├── export-data/        # GDPR data export                                 │
│  └── _shared/            # Shared utilities                                 │
│      ├── permissions.ts  # Permission resolution logic                      │
│      ├── database.ts     # Supabase client factory                         │
│      └── email.ts        # Email sending utilities                         │
│                                                                              │
│  APP-SPECIFIC EDGE FUNCTIONS:                                               │
│                                                                              │
│  supabase/functions/                                                        │
│  ├── real-estate/                                                           │
│  │   ├── generate-lease-pdf/                                               │
│  │   ├── rent-reminder/                                                    │
│  │   └── maintenance-notify/                                               │
│  ├── restaurant/                                                            │
│  │   ├── order-confirmation/                                               │
│  │   ├── reservation-reminder/                                             │
│  │   └── kitchen-notify/                                                   │
│  └── retail/                                                                │
│      ├── inventory-alert/                                                  │
│      └── order-shipped/                                                    │
│                                                                              │
│  MULTI-TENANT EDGE FUNCTION PATTERN:                                        │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  // Every edge function validates org/app context                   │     │
│  │  export default async function handler(req: Request) {             │     │
│  │    const supabase = createClient(req);                              │     │
│  │                                                                     │     │
│  │    // Get claims from JWT                                           │     │
│  │    const { data: { user } } = await supabase.auth.getUser();       │     │
│  │    const orgId = user?.app_metadata?.org_id;                       │     │
│  │    const appId = user?.app_metadata?.app_id;                       │     │
│  │                                                                     │     │
│  │    if (!orgId || !appId) {                                         │     │
│  │      return new Response('Missing context', { status: 401 });      │     │
│  │    }                                                                │     │
│  │                                                                     │     │
│  │    // All queries automatically scoped to org                       │     │
│  │    const { data } = await supabase                                  │     │
│  │      .schema('real_estate')                                         │     │
│  │      .from('properties')                                            │     │
│  │      .select('*');  // RLS handles org filtering                   │     │
│  │  }                                                                  │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Realtime Subscriptions (Multi-Tenant)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   REALTIME SUBSCRIPTIONS (MULTI-TENANT)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Supabase Realtime respects RLS policies, so subscriptions are              │
│  automatically scoped to the user's org.                                    │
│                                                                              │
│  CHANNEL NAMING CONVENTION:                                                 │
│                                                                              │
│  {app}:{org}:{resource}:{id?}                                               │
│                                                                              │
│  Examples:                                                                   │
│  • real-estate:abc-properties:properties      (all properties)             │
│  • real-estate:abc-properties:properties:123  (specific property)          │
│  • restaurant:xyz-resto:orders                (all orders)                 │
│  • restaurant:xyz-resto:orders:456            (specific order)             │
│                                                                              │
│  IMPLEMENTATION:                                                            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  // hooks/useRealtimeProperties.ts                                  │     │
│  │  export function useRealtimeProperties() {                          │     │
│  │    const { orgId, appSlug, orgSlug } = useAppContext();            │     │
│  │                                                                     │     │
│  │    useEffect(() => {                                                │     │
│  │      const channel = supabase                                       │     │
│  │        .channel(`${appSlug}:${orgSlug}:properties`)                │     │
│  │        .on(                                                         │     │
│  │          'postgres_changes',                                        │     │
│  │          {                                                          │     │
│  │            event: '*',                                              │     │
│  │            schema: 'real_estate',                                   │     │
│  │            table: 'properties',                                     │     │
│  │            filter: `org_id=eq.${orgId}`  // Additional safety       │     │
│  │          },                                                         │     │
│  │          (payload) => {                                             │     │
│  │            // Handle INSERT, UPDATE, DELETE                        │     │
│  │            queryClient.invalidateQueries(['properties']);          │     │
│  │          }                                                          │     │
│  │        )                                                            │     │
│  │        .subscribe();                                                │     │
│  │                                                                     │     │
│  │      return () => supabase.removeChannel(channel);                 │     │
│  │    }, [orgId, appSlug, orgSlug]);                                  │     │
│  │  }                                                                  │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  PRESENCE (Live Users):                                                     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  // Show who's online in this org                                   │     │
│  │  const channel = supabase.channel(`presence:${orgId}:${appId}`);   │     │
│  │                                                                     │     │
│  │  channel                                                            │     │
│  │    .on('presence', { event: 'sync' }, () => {                      │     │
│  │      const state = channel.presenceState();                         │     │
│  │      setOnlineUsers(Object.values(state).flat());                  │     │
│  │    })                                                               │     │
│  │    .subscribe(async (status) => {                                   │     │
│  │      if (status === 'SUBSCRIBED') {                                │     │
│  │        await channel.track({                                        │     │
│  │          user_id: userId,                                           │     │
│  │          user_name: userName,                                       │     │
│  │          online_at: new Date().toISOString()                       │     │
│  │        });                                                          │     │
│  │      }                                                              │     │
│  │    });                                                              │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Storage Buckets (Multi-Tenant)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STORAGE BUCKETS (MULTI-TENANT)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BUCKET STRUCTURE:                                                          │
│                                                                              │
│  storage/                                                                   │
│  ├── avatars/                    # User profile pictures (global)          │
│  │   └── {user_id}/avatar.jpg                                              │
│  │                                                                          │
│  ├── org-assets/                 # Organization-level assets               │
│  │   └── {org_id}/                                                         │
│  │       ├── logo.png                                                      │
│  │       └── branding/                                                     │
│  │                                                                          │
│  ├── real-estate/                # App-specific storage                    │
│  │   └── {org_id}/                                                         │
│  │       └── properties/                                                   │
│  │           └── {property_id}/                                            │
│  │               ├── photos/                                               │
│  │               └── documents/                                            │
│  │                                                                          │
│  ├── restaurant/                                                           │
│  │   └── {org_id}/                                                         │
│  │       └── menu-items/                                                   │
│  │           └── {item_id}/                                                │
│  │               └── photo.jpg                                             │
│  │                                                                          │
│  └── retail/                                                               │
│      └── {org_id}/                                                         │
│          └── products/                                                     │
│              └── {product_id}/                                             │
│                  └── images/                                               │
│                                                                              │
│  STORAGE POLICIES:                                                          │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  -- Avatars: Users can manage their own                             │     │
│  │  CREATE POLICY "Users manage own avatars" ON storage.objects       │     │
│  │  FOR ALL USING (                                                    │     │
│  │    bucket_id = 'avatars'                                            │     │
│  │    AND (storage.foldername(name))[1] = auth.uid()::text            │     │
│  │  );                                                                 │     │
│  │                                                                     │     │
│  │  -- Org assets: Members can read, admins can write                 │     │
│  │  CREATE POLICY "Org members read org assets" ON storage.objects    │     │
│  │  FOR SELECT USING (                                                 │     │
│  │    bucket_id = 'org-assets'                                         │     │
│  │    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')   │     │
│  │  );                                                                 │     │
│  │                                                                     │     │
│  │  -- App storage: Org members with app access                       │     │
│  │  CREATE POLICY "App storage access" ON storage.objects             │     │
│  │  FOR ALL USING (                                                    │     │
│  │    bucket_id IN ('real-estate', 'restaurant', 'retail')            │     │
│  │    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')   │     │
│  │    AND bucket_id = (auth.jwt() ->> 'app_slug')                     │     │
│  │  );                                                                 │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## See Also

| Related Topic | Document |
|---------------|----------|
| Database design | [03-database-design.md](./03-database-design.md) |
| Architecture decisions | [09-architecture-decisions.md](./09-architecture-decisions.md) |
| RLS security patterns | [14-security-rls.md](./14-security-rls.md) |
| TypeScript patterns | [13-typescript-patterns.md](./13-typescript-patterns.md) |

