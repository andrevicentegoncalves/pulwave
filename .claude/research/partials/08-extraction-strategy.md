# Extraction Strategy

---

## 1. Extraction Decision Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXTRACTION DECISION MATRIX                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  When extracting a product (e.g., selling Pulwave real-estate):             │
│                                                                              │
│  ┌────────────────────────┬─────────────────────┬───────────────────┐       │
│  │      Component         │  Include by Default │  Configurable     │       │
│  ├────────────────────────┼─────────────────────┼───────────────────┤       │
│  │  platform/ui           │         ✅          │        -          │       │
│  │  platform/foundation   │         ✅          │        -          │       │
│  │  platform/patterns     │         ✅          │        -          │       │
│  │  platform/data-core    │         ✅          │        -          │       │
│  ├────────────────────────┼─────────────────────┼───────────────────┤       │
│  │  shared/auth           │         ✅          │   Can swap        │       │
│  │  shared/billing        │         ⚙️          │   Include/Exclude │       │
│  │  shared/i18n           │         ✅          │   Can simplify    │       │
│  │  shared/geography      │         ✅          │   Can subset      │       │
│  │  shared/admin          │         ✅          │   App sections    │       │
│  │  shared/style-guide    │         ⚙️          │   Include/Exclude │       │
│  ├────────────────────────┼─────────────────────┼───────────────────┤       │
│  │  products/real-estate  │         ✅          │   Target product  │       │
│  │  products/restaurant   │         ❌          │   Not included    │       │
│  │  products/retail       │         ❌          │   Not included    │       │
│  ├────────────────────────┼─────────────────────┼───────────────────┤       │
│  │  Database: global.*    │         ✅          │   Copy structure  │       │
│  │  Database: platform.*  │         ✅          │   Filter to org   │       │
│  │  Database: real_estate │         ✅          │   Filter to org   │       │
│  │  Database: restaurant  │         ❌          │   Not included    │       │
│  │  Database: retail      │         ❌          │   Not included    │       │
│  └────────────────────────┴─────────────────────┴───────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Extraction Process Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXTRACTION PROCESS FLOW                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Step 1: ANALYZE                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  $ npm run extract:analyze -- --product=real-estate                │     │
│  │                                                                     │     │
│  │  Output:                                                           │     │
│  │  - Dependencies: platform/*, shared/auth, shared/i18n, ...        │     │
│  │  - Database schemas: global, platform, real_estate                 │     │
│  │  - Total files: 342                                                │     │
│  │  - Estimated bundle size: 1.2MB                                   │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                      │                                       │
│                                      ▼                                       │
│  Step 2: CONFIGURE                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  Edit: extraction-config.json                                      │     │
│  │  {                                                                  │     │
│  │    "product": "real-estate",                                       │     │
│  │    "target": "../pulwave-standalone",                              │     │
│  │    "shared": ["auth", "i18n", "geography", "admin"],              │     │
│  │    "database": {                                                    │     │
│  │      "exportData": true,                                           │     │
│  │      "orgId": "uuid-of-org-to-export"                             │     │
│  │    }                                                                │     │
│  │  }                                                                  │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                      │                                       │
│                                      ▼                                       │
│  Step 3: EXTRACT                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  $ npm run extract:run                                             │     │
│  │                                                                     │     │
│  │  [1/6] Copying platform packages...                    ✓           │     │
│  │  [2/6] Copying shared packages...                      ✓           │     │
│  │  [3/6] Copying product packages...                     ✓           │     │
│  │  [4/6] Generating package.json and configs...          ✓           │     │
│  │  [5/6] Exporting database migrations...                ✓           │     │
│  │  [6/6] Exporting data (optional)...                    ✓           │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                      │                                       │
│                                      ▼                                       │
│  Step 4: VERIFY                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  $ cd ../pulwave-standalone                                        │     │
│  │  $ npm install                                                      │     │
│  │  $ npm run typecheck                    ✓ No errors                │     │
│  │  $ npm run lint                         ✓ No errors                │     │
│  │  $ npm run build                        ✓ Build successful         │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                      │                                       │
│                                      ▼                                       │
│  Step 5: DEPLOY (Buyer's responsibility)                                    │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  1. Create new Supabase project                                    │     │
│  │  2. Run migrations: supabase db push                               │     │
│  │  3. Import data (if exported)                                      │     │
│  │  4. Configure environment variables                                │     │
│  │  5. Deploy to Vercel/Netlify/etc.                                 │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Export Commands

```bash
# Dump only the schemas needed for extraction
pg_dump --schema=global --schema=platform --schema=real_estate \
  --no-owner --no-privileges \
  -f pulwave_export.sql

# What gets exported:
# global.*        → profiles, countries, regions, cities, translations
# platform.*      → organizations, apps, subscriptions, permissions
# real_estate.*   → properties, units, leases, tenants, etc.

# What stays behind:
# restaurant.*    → NOT exported
# retail.*        → NOT exported

# Data export for specific org:
COPY (SELECT * FROM real_estate.properties WHERE org_id = 'sold-org-uuid')
  TO '/export/properties.csv' CSV HEADER;
```

---

## 4. Post-Extraction Considerations

| Aspect | Platform (Original) | Extracted Product |
|--------|---------------------|-------------------|
| Updates | Continues development | Fork - buyer maintains |
| Auth | Shared Supabase Auth | Own Supabase project |
| Billing | Platform billing | Own Stripe setup |
| Support | Platform support | Buyer provides own |
| Branding | Platform branding | Can be rebranded |
