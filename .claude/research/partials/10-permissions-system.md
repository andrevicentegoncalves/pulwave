# Permissions System

---

## 1. Roles vs Permissions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ROLES vs PERMISSIONS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ROLE = A named group of permissions (owner, admin, member, viewer)        │
│  PERMISSION = A specific action on a resource (properties:write)           │
│                                                                              │
│  ┌─────────────┐                  ┌─────────────────────────────────┐       │
│  │    ROLE     │  ─── grants ───► │         PERMISSIONS             │       │
│  │   "admin"   │                  │  properties:read                │       │
│  └─────────────┘                  │  properties:write               │       │
│                                   │  properties:delete              │       │
│                                   │  units:read                     │       │
│                                   │  units:write                    │       │
│                                   │  users:invite                   │       │
│                                   │  settings:read                  │       │
│                                   │  settings:write                 │       │
│                                   └─────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Permission Format

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PERMISSION SYSTEM ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PERMISSION FORMAT: {resource}:{action}                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  RESOURCES (per app)              ACTIONS                           │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  REAL-ESTATE APP:                 • read    - View resource         │   │
│  │  • properties                     • write   - Create/Update         │   │
│  │  • units                          • delete  - Remove                │   │
│  │  • leases                         • export  - Download/Export       │   │
│  │  • tenants                        • import  - Upload/Import         │   │
│  │  • maintenance                    • assign  - Assign to others      │   │
│  │  • payments                       • approve - Approve workflows     │   │
│  │                                   • *       - All actions           │   │
│  │  RESTAURANT APP:                                                     │   │
│  │  • locations                      SPECIAL PERMISSIONS:              │   │
│  │  • menus                          • admin:access                    │   │
│  │  • orders                         • admin:users                     │   │
│  │  • reservations                   • admin:billing                   │   │
│  │  • inventory                      • admin:settings                  │   │
│  │                                   • org:delete                      │   │
│  │  PLATFORM-WIDE:                   • org:transfer                    │   │
│  │  • users                                                             │   │
│  │  • settings                                                          │   │
│  │  • audit                                                             │   │
│  │  • translations                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  PERMISSION EXAMPLES:                                                       │
│                                                                              │
│  properties:read      → Can view properties                                │
│  properties:write     → Can create/edit properties                         │
│  properties:delete    → Can delete properties                              │
│  properties:*         → All property actions                               │
│  *:read               → Read-only access to everything                     │
│  *:*                  → Full access (owner/superadmin)                     │
│  admin:access         → Can access admin panel                             │
│  admin:users          → Can manage org users                               │
│  admin:billing        → Can manage billing/subscriptions                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema for Permissions

```sql
-- platform.permissions (master list of all permissions)
CREATE TABLE platform.permissions (
  id           UUID PRIMARY KEY,
  app_id       UUID REFERENCES platform.apps(id),  -- NULL = platform-wide
  code         TEXT NOT NULL,                      -- 'properties:read'
  resource     TEXT NOT NULL,                      -- 'properties'
  action       TEXT NOT NULL,                      -- 'read'
  name         TEXT NOT NULL,                      -- 'View Properties'
  description  TEXT,
  category     TEXT,                               -- 'Content', 'Admin'
  is_sensitive BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(app_id, code)
);

-- platform.roles (predefined roles)
CREATE TABLE platform.roles (
  id           UUID PRIMARY KEY,
  app_id       UUID REFERENCES platform.apps(id),  -- NULL = global role
  code         TEXT NOT NULL,                      -- 'admin'
  name         TEXT NOT NULL,                      -- 'Administrator'
  description  TEXT,
  hierarchy    INT NOT NULL,                       -- 1=owner, 2=admin, etc.
  is_system    BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(app_id, code)
);

-- platform.role_permissions (junction table)
CREATE TABLE platform.role_permissions (
  id            UUID PRIMARY KEY,
  role_id       UUID REFERENCES platform.roles(id),
  permission_id UUID REFERENCES platform.permissions(id),
  UNIQUE(role_id, permission_id)
);

-- platform.org_app_members (user membership with role)
CREATE TABLE platform.org_app_members (
  id           UUID PRIMARY KEY,
  org_id       UUID REFERENCES platform.organizations(id),
  app_id       UUID REFERENCES platform.apps(id),
  user_id      UUID REFERENCES global.profiles(id),
  role_id      UUID REFERENCES platform.roles(id),
  custom_perms JSONB,  -- { "add": [...], "remove": [...] }
  invited_by   UUID REFERENCES global.profiles(id),
  invited_at   TIMESTAMPTZ,
  joined_at    TIMESTAMPTZ,
  UNIQUE(org_id, app_id, user_id)
);
```

---

## 4. Default Roles and Permissions Matrix

### Platform-Wide Permissions

| Permission | Owner | Admin | Member | Viewer |
|------------|-------|-------|--------|--------|
| admin:access | ✓ | ✓ | - | - |
| admin:users | ✓ | ✓ | - | - |
| admin:billing | ✓ | - | - | - |
| admin:settings | ✓ | ✓ | - | - |
| org:delete | ✓ | - | - | - |
| org:transfer | ✓ | - | - | - |
| users:invite | ✓ | ✓ | - | - |
| users:remove | ✓ | ✓ | - | - |

### Real-Estate App Permissions

| Permission | Owner | Admin | Member | Viewer |
|------------|-------|-------|--------|--------|
| properties:read | ✓ | ✓ | ✓ | ✓ |
| properties:write | ✓ | ✓ | ✓ | - |
| properties:delete | ✓ | ✓ | - | - |
| units:read | ✓ | ✓ | ✓ | ✓ |
| units:write | ✓ | ✓ | ✓ | - |
| units:delete | ✓ | ✓ | - | - |
| leases:read | ✓ | ✓ | ✓ | ✓ |
| leases:write | ✓ | ✓ | ✓ | - |
| leases:approve | ✓ | ✓ | - | - |
| payments:read | ✓ | ✓ | ✓ | - |
| payments:write | ✓ | ✓ | - | - |

---

## 5. Permission Resolution Flow

```
Step 1: GET MEMBERSHIP
  SELECT role_id, custom_perms
  FROM org_app_members
  WHERE user_id = $1 AND org_id = $2 AND app_id = $3

Step 2: GET ROLE PERMISSIONS
  SELECT p.code
  FROM role_permissions rp
  JOIN permissions p ON p.id = rp.permission_id
  WHERE rp.role_id = $role_id

Step 3: APPLY CUSTOM OVERRIDES
  custom_perms: {
    "add": ["reports:export"],     // Extra permissions
    "remove": ["properties:delete"] // Revoked permissions
  }

  Final = [...base_perms, ...add].filter(p => !remove.includes(p))

Step 4: BUILD JWT CLAIMS
  {
    "org_id": "org-uuid",
    "app_id": "app-uuid",
    "role": "admin",
    "permissions": ["properties:read", "properties:write", ...]
  }
```

---

## 6. Frontend Permission Hook

```typescript
export function usePermissions() {
  const { session } = useAuth();
  const permissions = session?.user?.permissions ?? [];

  // Check single permission
  const hasPermission = (permission: string): boolean => {
    // Check for wildcards
    if (permissions.includes('*:*')) return true;

    const [resource, action] = permission.split(':');

    // Check resource wildcard (properties:*)
    if (permissions.includes(`${resource}:*`)) return true;

    // Check action wildcard (*:read)
    if (permissions.includes(`*:${action}`)) return true;

    // Check exact match
    return permissions.includes(permission);
  };

  // Check role level
  const hasRole = (minRole: 'owner' | 'admin' | 'member' | 'viewer'): boolean => {
    const hierarchy = { owner: 1, admin: 2, member: 3, viewer: 4 };
    return hierarchy[session?.user?.role] <= hierarchy[minRole];
  };

  return { permissions, hasPermission, hasRole };
}

// Usage
function PropertyActions({ property }) {
  const { hasPermission } = usePermissions();

  return (
    <div>
      {hasPermission('properties:write') && <Button>Edit</Button>}
      {hasPermission('properties:delete') && <Button variant="danger">Delete</Button>}
    </div>
  );
}

// Permission-gated component
<RequirePermission permission="admin:access">
  <AdminPanel />
</RequirePermission>
```
