# Architecture Decisions

---

## Finalized Decisions Table

| # | Question | Decision | Implications |
|---|----------|----------|--------------|
| 1 | Can a user belong to multiple orgs across different apps? | **Yes, cross-app access** | Single profile can be member of orgs in any app |
| 2 | Can an org have access to multiple apps? | **Yes, app bundles** | org_apps junction table tracks which apps each org uses |
| 3 | Should billing be per-app or per-org? | **Per-app per-org** | Subscriptions table needs (org_id, app_id) composite |
| 4 | Where does the style-guide app live? | **Shared package** | Accessed via /{app-slug}/style-guide route |
| 5 | How to handle app-specific translations? | **Namespaced** | translations.namespace = 'real-estate.properties.title' |
| 6 | Should extracted products get platform updates? | **Fork** | Extracted products are standalone, buyer maintains |

---

## User-Org-App Relationship Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     USER-ORG-APP RELATIONSHIP MODEL                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  EXAMPLE SCENARIO:                                                          │
│                                                                              │
│  User: John (john@example.com)                                              │
│  ├── Member of: Org "ABC Properties" (real-estate app)                      │
│  │   └── Role: admin                                                        │
│  ├── Member of: Org "XYZ Restaurant" (restaurant app)                       │
│  │   └── Role: manager                                                      │
│  └── Member of: Org "Family Holdings" (real-estate + retail apps)           │
│      └── Role: owner                                                        │
│                                                                              │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐           │
│  │   Profile   │         │    Org      │         │    App      │           │
│  │   (John)    │         │  (ABC Prop) │         │(real-estate)│           │
│  └──────┬──────┘         └──────┬──────┘         └──────┬──────┘           │
│         │                       │                       │                   │
│         │    ┌──────────────────┴───────────────────────┘                   │
│         │    │                                                              │
│         ▼    ▼                                                              │
│  ┌─────────────────┐                                                        │
│  │   org_members   │  (user_id, org_id, role)                              │
│  └─────────────────┘                                                        │
│         │                                                                   │
│         │    ┌──────────────────────────────────────────┐                   │
│         │    │                                          │                   │
│         ▼    ▼                                          ▼                   │
│  ┌─────────────────┐                           ┌─────────────────┐         │
│  │    org_apps     │  (org_id, app_id)         │  subscriptions  │         │
│  │                 │                           │ (org_id, app_id)│         │
│  │ ABC Prop → RE   │                           │ ABC → RE → Pro  │         │
│  │ XYZ Rest → Rest │                           │ XYZ → Resto→Std │         │
│  │ Family → RE     │                           │ Family→RE→Ent   │         │
│  │ Family → Retail │                           │ Family→Retail→$ │         │
│  └─────────────────┘                           └─────────────────┘         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## JWT Token Structure

> **See [12-supabase-integration.md](./12-supabase-integration.md#1-jwt-token-structure-multi-tenant)** for the complete JWT structure with custom claims.

---

## App + Org Switcher UI Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        APP + ORG SWITCHER UI FLOW                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  HEADER BAR:                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [Logo]  [App▾]  [Org▾]  ──────────────────────  [?] [🔔] [👤▾]  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│              │        │                                                     │
│              │        │                                                     │
│              ▼        │                                                     │
│  ┌──────────────────┐ │                                                     │
│  │ APP SWITCHER     │ │                                                     │
│  ├──────────────────┤ │                                                     │
│  │ ✓ Real Estate    │ │  ← Current app (highlighted)                       │
│  │   Restaurant     │ │  ← Available (org has access)                      │
│  │   Retail         │ │  ← Available (org has access)                      │
│  │ ─────────────────│ │                                                     │
│  │ + Add App        │ │  ← Opens subscription flow                         │
│  └──────────────────┘ │                                                     │
│                       │                                                     │
│                       ▼                                                     │
│              ┌──────────────────┐                                          │
│              │ ORG SWITCHER     │                                          │
│              ├──────────────────┤                                          │
│              │ ✓ ABC Properties │ ← Current org                            │
│              │   XYZ Restaurant │ ← Different org (may switch app too)     │
│              │   Family Holdings│ ← Different org                          │
│              │ ─────────────────│                                          │
│              │ + Create Org     │                                          │
│              │ ⚙ Manage Orgs    │                                          │
│              └──────────────────┘                                          │
│                                                                              │
│  SWITCHING LOGIC:                                                           │
│                                                                              │
│  1. User clicks "XYZ Restaurant" in org switcher                           │
│  2. System checks: does XYZ have current app (real-estate)?                │
│     - YES → Switch org, keep app                                           │
│     - NO  → Switch org, auto-select first available app                    │
│  3. Update JWT with new org_id, app_id                                     │
│  4. Redirect to new context: /restaurant/xyz-restaurant/dashboard          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## See Also

| Related Topic | Document |
|---------------|----------|
| Architecture diagrams | [02-architecture-diagrams.md](./02-architecture-diagrams.md) |
| Database design | [03-database-design.md](./03-database-design.md) |
| Code structure | [04-code-structure.md](./04-code-structure.md) |
| Supabase integration | [12-supabase-integration.md](./12-supabase-integration.md) |
| Real-world examples | [15-examples.md](./15-examples.md) |
