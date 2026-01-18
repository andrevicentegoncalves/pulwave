# Architecture Diagrams

---

## 1. High-Level Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PLATFORM LAYER                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         SHARED SERVICES                              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │   Auth   │ │ Billing  │ │  i18n    │ │Geography │ │  Admin   │  │   │
│  │  │ Profiles │ │Subscript.│ │  Trans.  │ │Countries │ │  Panel   │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                    ┌────────────────┼────────────────┐                     │
│                    ▼                ▼                ▼                     │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐  │
│  │     APP: REAL       │ │    APP: RESTAURANT  │ │     APP: RETAIL     │  │
│  │      ESTATE         │ │                     │ │                     │  │
│  │  ┌───────────────┐  │ │  ┌───────────────┐  │ │  ┌───────────────┐  │  │
│  │  │   Tenant A    │  │ │  │   Tenant X    │  │ │  │   Tenant M    │  │  │
│  │  │  (Org: ABC)   │  │ │  │  (Org: XYZ)   │  │ │  │  (Org: MNO)   │  │  │
│  │  └───────────────┘  │ │  └───────────────┘  │ │  └───────────────┘  │  │
│  │  ┌───────────────┐  │ │  ┌───────────────┐  │ │  ┌───────────────┐  │  │
│  │  │   Tenant B    │  │ │  │   Tenant Y    │  │ │  │   Tenant N    │  │  │
│  │  │  (Org: DEF)   │  │ │  │  (Org: UVW)   │  │ │  │  (Org: PQR)   │  │  │
│  │  └───────────────┘  │ │  └───────────────┘  │ │  └───────────────┘  │  │
│  │         ...         │ │         ...         │ │         ...         │  │
│  └─────────────────────┘ └─────────────────────┘ └─────────────────────┘  │
│                                     │                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      PLATFORM FOUNDATION                             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │    UI    │ │Foundation│ │ Patterns │ │Data Core │ │ Tooling  │  │   │
│  │  │Components│ │  Tokens  │ │ Layouts  │ │Providers │ │  Config  │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Tenant Data Flow

```
                         ┌─────────────────┐
                         │    User Login   │
                         └────────┬────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │  Auth (Supabase Auth)   │
                    │  + Profile Lookup       │
                    └────────────┬────────────┘
                                 │
                                 ▼
              ┌──────────────────────────────────┐
              │  Get User's Organizations        │
              │  (org_members table)             │
              └────────────────┬─────────────────┘
                               │
                               ▼
         ┌─────────────────────────────────────────┐
         │  User selects Organization (Tenant)     │
         │  + App context (real-estate, resto...) │
         └────────────────────┬────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  JWT Token includes:          │
              │  - user_id                    │
              │  - org_id (current tenant)    │
              │  - app_id (current app)       │
              │  - role (admin, member, etc.) │
              └───────────────┬───────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  All queries filtered by:     │
              │  - org_id (RLS)               │
              │  - app_id (if applicable)     │
              └───────────────────────────────┘
```

---

## 3. Shared vs App-Specific Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        SHARED ACROSS ALL APPS                    │
├─────────────────────────────────────────────────────────────────┤
│  PLATFORM/UI                                                     │
│  ├── Button, Card, Input, Modal, etc.                           │
│  ├── DataTable, Form, Select, etc.                              │
│  └── All design system components                                │
│                                                                  │
│  PLATFORM/FOUNDATION                                             │
│  ├── Design tokens (colors, spacing, typography)                │
│  ├── Shared hooks (useDebounce, useLocalStorage, etc.)          │
│  └── Utilities (formatters, validators)                         │
│                                                                  │
│  SHARED/AUTH                                                     │
│  ├── Login/Logout flows                                         │
│  ├── Profile management                                         │
│  └── Organization switching                                      │
│                                                                  │
│  SHARED/ADMIN                                                    │
│  ├── Admin shell/layout                                         │
│  ├── User management                                            │
│  ├── Translations management                                     │
│  ├── Master data management                                     │
│  └── App-specific sections (dynamically loaded)                 │
│                                                                  │
│  SHARED/STYLE-GUIDE                                              │
│  └── Interactive component documentation                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        APP-SPECIFIC                              │
├─────────────────────────────────────────────────────────────────┤
│  PRODUCTS/REAL-ESTATE         PRODUCTS/RESTAURANT                │
│  ├── PropertyCard             ├── MenuItemCard                  │
│  ├── LeaseWizard              ├── OrderFlow                     │
│  ├── TenantProfile            ├── ReservationCalendar           │
│  └── MaintenanceBoard         └── KitchenDisplay                │
│                                                                  │
│  DATA/REAL-ESTATE             DATA/RESTAURANT                   │
│  ├── useProperties()          ├── useMenuItems()                │
│  ├── useLeases()              ├── useOrders()                   │
│  └── useTenants()             └── useReservations()             │
└─────────────────────────────────────────────────────────────────┘
```

---

## See Also

| Related Topic | Document |
|---------------|----------|
| Database schema details | [03-database-design.md](./03-database-design.md) |
| Code structure & packages | [04-code-structure.md](./04-code-structure.md) |
| JWT token structure | [12-supabase-integration.md](./12-supabase-integration.md#1-jwt-token-structure-multi-tenant) |
| RLS security patterns | [14-security-rls.md](./14-security-rls.md) |
