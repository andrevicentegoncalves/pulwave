# Real-World Examples & Comparisons

---

## 1. Similar Multi-Tenant SaaS Architectures

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REAL-WORLD MULTI-TENANT EXAMPLES                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. SHOPIFY                                                                 │
│  ═══════════                                                                │
│                                                                              │
│  Multi-tenant e-commerce platform:                                          │
│  • Each store = one tenant (org)                                           │
│  • Shared infrastructure, isolated data                                    │
│  • Apps = Shopify apps (installable modules)                               │
│  • Billing = per-store subscription + app fees                             │
│                                                                              │
│  Similar to Pulwave:                                                        │
│  • Stores ≈ Organizations                                                  │
│  • Shopify Apps ≈ Platform apps (real-estate, restaurant)                  │
│  • Staff accounts ≈ org_members with roles                                 │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  2. NOTION                                                                  │
│  ══════════                                                                 │
│                                                                              │
│  Multi-workspace, multi-app (docs, databases, wikis):                       │
│  • Workspaces = tenants (orgs)                                             │
│  • Users can belong to multiple workspaces                                 │
│  • Permissions at workspace + page level                                   │
│  • URL: notion.so/{workspace}/{page}                                       │
│                                                                              │
│  Similar to Pulwave:                                                        │
│  • Workspace switcher ≈ Org switcher                                       │
│  • Member roles ≈ org_app_members                                          │
│  • Shared infrastructure ≈ platform layer                                  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  3. HUBSPOT                                                                 │
│  ══════════                                                                 │
│                                                                              │
│  Multi-app CRM platform:                                                    │
│  • Hubs = Apps (Marketing, Sales, Service, CMS)                            │
│  • Portals = Tenants (orgs)                                                │
│  • Users can have different permissions per hub                            │
│  • Billing = per-hub per-portal                                            │
│                                                                              │
│  Similar to Pulwave:                                                        │
│  • Hubs ≈ Apps (real-estate, restaurant)                                   │
│  • Hub permissions ≈ per-org-per-app permissions                           │
│  • Portal switching ≈ org switcher                                         │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  4. ATLASSIAN (Jira, Confluence, etc.)                                      │
│  ═════════════════════════════════════                                      │
│                                                                              │
│  Multi-product platform:                                                    │
│  • Products = Jira, Confluence, Bitbucket, Trello                          │
│  • Sites = Tenants (yourcompany.atlassian.net)                             │
│  • Users can access multiple products in a site                            │
│  • Billing = per-product per-site per-user                                 │
│                                                                              │
│  Similar to Pulwave:                                                        │
│  • Products ≈ Apps                                                         │
│  • Sites ≈ Organizations                                                   │
│  • Product permissions ≈ per-org-per-app roles                             │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  5. SUPABASE ITSELF                                                         │
│  ══════════════════                                                         │
│                                                                              │
│  Multi-org, multi-project:                                                  │
│  • Organizations = teams                                                   │
│  • Projects = individual Supabase instances                                │
│  • Members can have roles per org                                          │
│  • Billing = per-project within org                                        │
│                                                                              │
│  Similar to Pulwave:                                                        │
│  • Projects ≈ Apps (but we use one project with schemas)                  │
│  • Org roles ≈ org_members                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Comparison Table

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ARCHITECTURE COMPARISON TABLE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┬────────────┬────────────┬────────────┬───────────────┐    │
│  │   Aspect    │  Shopify   │   Notion   │  HubSpot   │   Pulwave     │    │
│  ├─────────────┼────────────┼────────────┼────────────┼───────────────┤    │
│  │ Tenancy     │ Store-based│ Workspace  │ Portal     │ Organization  │    │
│  │ Multi-user  │    ✅      │    ✅      │    ✅      │     ✅        │    │
│  │ Multi-app   │ App Store  │ Templates  │ Hubs       │ Platform apps │    │
│  │ Cross-tenant│    ❌      │    ❌      │    ❌      │     ✅        │    │
│  │ URL pattern │/admin/...  │/{ws}/{pg}  │/{portal}/  │/{app}/{org}/  │    │
│  │ DB isolation│ Sharded    │ RLS        │ Sharded    │ Schema + RLS  │    │
│  │ Billing     │ Per-store  │ Per-ws     │ Per-portal │ Per-org-app   │    │
│  │ Roles       │ Store-level│ WS-level   │ Hub-level  │ Org-App-level │    │
│  │ Extractable │    ❌      │    ❌      │    ❌      │     ✅        │    │
│  └─────────────┴────────────┴────────────┴────────────┴───────────────┘    │
│                                                                              │
│  KEY DIFFERENTIATORS FOR PULWAVE:                                           │
│                                                                              │
│  1. Cross-tenant membership: User can be in multiple orgs across apps      │
│  2. Extraction-ready: Apps can be sold/separated as standalone products    │
│  3. Per-org-per-app billing: Flexible subscription model                   │
│  4. Schema isolation: Clean separation for extraction                      │
│  5. Family business focus: Multiple verticals (real-estate, restaurant)    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Key Takeaways

| Platform | Strength | Pulwave Learns From |
|----------|----------|---------------------|
| Shopify | Clean tenant isolation | Store-level data boundaries |
| Notion | Flexible workspace model | Workspace/org switching UX |
| HubSpot | Multi-hub permissions | Per-app role granularity |
| Atlassian | Product bundles | App bundles per org |
| Supabase | Project-based billing | Org-based billing model |

---

## 4. Pulwave Unique Advantages

1. **Cross-Tenant Access**: Unlike competitors, users can belong to multiple orgs across different apps
2. **Extraction-Ready**: Architecture supports selling apps as standalone products
3. **Flexible Billing**: Per-org-per-app model supports various business scenarios
4. **Schema Isolation**: Clean separation makes extraction simpler
5. **Family Business Focus**: Designed for real-world multi-business families

