# Architecture Review Results: 04-code-structure.md

> Review performed: 2026-01-18
> **Updated: 2026-01-18 - P0 and P1 issues FIXED**

---

## Status: ✅ READY FOR IMPLEMENTATION

All P0 blocking issues have been resolved. P1 issues fixed. Architecture is ready.

---

## 1. NAMING CONVENTIONS

### ✅ Complete
- patterns vs widgets distinction is clear
- Examples provided

### ❌ Missing
- **File naming conventions** not specified
  - Component files: PascalCase (`Button.tsx`)
  - Hook files: camelCase with `use` prefix (`useAuth.ts`)
  - Type files: `types.ts` or `*.types.ts`
  - Style files: kebab-case (`_button-variants.scss`)
  - Index files: always `index.ts`
  - Test files: `*.test.ts` or `*.spec.ts`

---

## 2. LAYER DEPENDENCY RULES

### ✅ Complete
- Hierarchy is clear
- Downward-only flow documented

### ⚠️ Needs Clarification
- **Shared inter-dependencies**: Which shared packages can import from each other?
  - `shared/profile` → `shared/auth` (needs user_id) ✅ allowed
  - `shared/shell` → `shared/auth` (needs auth state) ✅ allowed
  - `shared/shell` → `shared/profile` (shows avatar) ✅ allowed
  - `shared/billing` → `shared/org` (org subscriptions) ✅ allowed
  - `shared/admin` → almost everything ✅ allowed (it's an experience layer)

### ❌ Missing Rules
- **Type-only imports**: Are they exempt from boundaries?
  - Recommendation: YES, type-only imports should be allowed from anywhere
- **Test imports**: Can tests import from higher layers for mocking?
  - Recommendation: YES, tests are exempt from boundary rules

---

## 3. PLATFORM LAYER

### 3.1 Foundation ⚠️
**Missing items:**
- [ ] `animations/` - Keyframe definitions, animation utilities
- [ ] `breakpoints/` - Breakpoint values and helpers
- [ ] `z-index/` - Z-index scale management

### 3.2 UI ⚠️
**Listed but not exhaustive. Should add:**
- [ ] Form components: Select, Checkbox, Radio, Switch, TextArea, DatePicker, TimePicker
- [ ] Feedback: Alert, Badge, Progress, Skeleton
- [ ] Layout: Stack, Flex, Grid, Spacer, Divider
- [ ] Data display: Avatar, Icon, List, Table (primitive)
- [ ] Overlay: Dialog, Drawer, Popover, Tooltip, Dropdown
- [ ] Navigation: Tabs, Breadcrumb, Link
- [ ] Typography: Heading, Text, Label

### 3.3 Patterns ⚠️
**Missing patterns:**
- [ ] `SearchableSelect/` - Combobox with search
- [ ] `CommandPalette/` - Cmd+K style interface
- [ ] `FilterPanel/` - Filter sidebar/dropdown
- [ ] `EmptyState/` - Empty data placeholder
- [ ] `ConfirmDialog/` - Confirmation modal pattern

### 3.4 Data-Core ⚠️
**Missing items:**
- [ ] `optimistic/` - Optimistic update utilities
- [ ] `retry/` - Error retry logic
- [ ] `offline/` - Offline queue (or delegate to shared/offline)

### 3.5 Errors ✅
Complete

### 3.6 State ✅
Complete

### 3.7 Testing ⚠️
**Missing:**
- [ ] `a11y/` - Accessibility testing helpers
- [ ] `visual/` - Visual regression setup

---

## 4. SHARED LAYER

### 4.1 Auth ⚠️
**Missing components:**
- [ ] `ForgotPassword/`
- [ ] `ResetPassword/`
- [ ] `EmailVerification/`
- [ ] `InviteAccept/`
- [ ] `SignupForm/` (if separate from login)

### 4.2 Profile ⚠️
**Missing:**
- [ ] `AvatarUpload/` - Profile picture upload
- [ ] `SocialLinks/` - Social media links form
- [ ] `EmergencyContact/` - Emergency contact form
- [ ] `AccountDeletion/` - GDPR delete account

### 4.3 Shell ⚠️
**Missing:**
- [ ] `Footer/`
- [ ] `MobileNav/`
- [ ] `Breadcrumbs/`
- [ ] `CommandBar/` (or use platform/patterns)

### 4.4 i18n ⚠️
**Missing:**
- [ ] `DateLocale/` - Date formatting by locale
- [ ] `NumberLocale/` - Number/currency formatting
- [ ] `RTLProvider/` - RTL support context

### 4.5 Geography ⚠️
**Missing:**
- [ ] `TimezoneSelect/`
- [ ] `MapPicker/` (or product-specific)
- [ ] `Geocoding/` - Address lookup utilities

### 4.6 Org ⚠️
**Missing components (only data listed):**
- [ ] `OrgSettings/`
- [ ] `MemberList/`
- [ ] `InviteForm/`
- [ ] `RoleSelector/`
- [ ] `OrgLogo/`

### 4.7 Billing ⚠️
**Missing:**
- [ ] `PricingTable/`
- [ ] `PaymentForm/`
- [ ] `BillingHistory/`
- [ ] `UsageMeter/`
- [ ] `PaymentMethodForm/`

### 4.8 Admin ⚠️
**Missing pages:**
- [ ] `Organizations/` (listed in routes but not in directory)
- [ ] `MasterData/`
- [ ] `SystemSettings/`
- [ ] `FeatureFlagsAdmin/`

### 4.9 Notifications ✅
Looks complete

### 4.10 Uploads ⚠️
**Missing:**
- [ ] `DocumentViewer/` (PDF preview)
- [ ] `ImageCropper/`
- [ ] `BulkUpload/`

### 4.11 SEO ⚠️
**Missing:**
- [ ] `OpenGraph/`
- [ ] `TwitterCard/`
- [ ] Sitemap generation script (in internal/scripts?)

### 4.12 Analytics ✅
Looks complete

### 4.13 Monitoring ✅
Looks complete

### 4.14 Security ⚠️
**Missing:**
- [ ] `RateLimiter/` - Client-side rate limiting
- [ ] `EncryptionUtils/` - Client-side encryption helpers

### 4.15 Feature Flags ✅
Complete

### 4.16 Realtime ⚠️
**Missing:**
- [ ] `useBroadcast/` - Broadcast messages
- [ ] `TypingIndicator/` - Typing indicator component

### 4.17 Offline ⚠️
**Missing:**
- [ ] `SyncQueue/` - Background sync queue
- [ ] `ConflictResolver/` - Merge conflict handling

### 4.18 Integrations ⚠️
**Missing common integrations:**
- [ ] `aws-s3/` (or use Supabase storage)
- [ ] `twilio/` (SMS)
- [ ] `slack/` (notifications)

### 4.19 Style Guide ⚠️
**Question:** Should this be in `internal/` instead of `shared/`?
- If DEV-only: move to `internal/dev-tools/style-guide/`
- If shipped to production (for designers/clients): keep in `shared/`

---

## 5. PRODUCTS LAYER

### 5.1 Real Estate ⚠️

**Missing domains:**
- [ ] `payments/` - Rent payments, deposits
- [ ] `documents/` - Lease documents, contracts
- [ ] `inspections/` - Property inspections
- [ ] `amenities/` - Building amenities

**Missing pages:**
- [ ] `Tenants/`
- [ ] `Maintenance/` (listed as domain but not page)
- [ ] `Documents/`
- [ ] `Settings/` (product settings)

**Missing widgets:**
- [ ] `TenantCard/`
- [ ] `PaymentHistory/`
- [ ] `MaintenanceTicket/`

### 5.2 Restaurant ⚠️

**Missing domains:**
- [ ] `staff/` - Staff management
- [ ] `inventory/` - Ingredient inventory
- [ ] `customers/` - Customer database
- [ ] `reviews/` - Review management

**Not detailed:** widgets, pages not listed

### 5.3 Retail ❌

**Completely undefined** - just says "same structure"
Should at minimum list:
- domains: products, inventory, orders, customers, suppliers
- pages: Dashboard, Products, Orders, Customers

---

## 6. INTERNAL LAYER

### 6.1 Tooling ⚠️
**Missing:**
- [ ] `commitlint/` - Commit message linting
- [ ] `husky/` - Git hooks
- [ ] `lint-staged/` - Pre-commit linting

### 6.2 Scripts ⚠️
**Missing:**
- [ ] `migrate/` - Database migration helpers
- [ ] `seed/` - Seed data scripts
- [ ] `deploy/` - Deployment scripts
- [ ] `types/` - Type generation (Supabase types)

---

## 7. OWNERS.JSON

### ⚠️ Missing Entries
The following shared packages are NOT in OWNERS.json:
- [ ] `shared/notifications`
- [ ] `shared/uploads`
- [ ] `shared/seo`
- [ ] `shared/security`
- [ ] `shared/feature-flags`
- [ ] `shared/realtime`
- [ ] `shared/offline`
- [ ] `shared/integrations`
- [ ] `shared/style-guide`

### ⚠️ Missing dbSchemas
- [ ] `shared/notifications` → `platform.notifications`?
- [ ] `shared/feature-flags` → `platform.feature_flags`?

---

## 8. ESLINT BOUNDARIES

### ⚠️ Missing Rules
- [ ] Type-only import exemption
- [ ] Test file exemption
- [ ] Shared inter-package rules (which shared can import which)

---

## 9. CROSS-CUTTING CONCERNS

### ❌ Missing Concerns
| Concern | Recommended Location |
|---------|---------------------|
| **Accessibility (a11y)** | `platform/a11y/` or `shared/a11y/` |
| **PWA** | `shared/pwa/` (service worker, manifest) |
| **Theme** | `shared/theme/` (theme switching, persistence) |
| **Print** | `shared/print/` (print stylesheets) |
| **Export** | `shared/export/` (CSV, PDF export utilities) |

---

## 10. GENERAL ISSUES

### ⚠️ Dependency Flow Diagram Issue
Current diagram shows:
```
platform/patterns → platform/ui → platform/data-core → platform/foundation
```

But `platform/data-core` should NOT be below `platform/ui`. They're siblings:
```
platform/patterns
     ↓
platform/ui  ←→  platform/data-core  (siblings, both depend on foundation)
     ↓              ↓
platform/foundation
```

### ⚠️ Settings Page Location
Where does the Settings page live?
- User settings (preferences) → Could be `shared/profile/pages/Settings/`
- Product settings → `products/*/pages/Settings/`
- Need to clarify this in the document

---

## SUMMARY

### ✅ Complete Sections (16)
1. Patterns vs Widgets naming
2. Layer hierarchy concept
3. Apps structure
4. Platform/foundation base structure
5. Platform/errors
6. Platform/state
7. Platform/testing base
8. Shared/notifications
9. Shared/analytics
10. Shared/monitoring
11. Shared/feature-flags
12. Products base structure
13. Internal/env
14. Testing strategy
15. Admin architecture
16. Admin routes implementation

### ⚠️ Needs Minor Adjustments (18)
1. File naming conventions missing
2. Shared inter-dependency rules missing
3. Platform/foundation missing items
4. Platform/ui not exhaustive
5. Platform/patterns missing items
6. Platform/data-core missing items
7. Shared/auth missing components
8. Shared/profile missing components
9. Shared/shell missing components
10. Shared/i18n missing utilities
11. Shared/geography missing components
12. Shared/org missing components
13. Shared/billing missing components
14. Shared/admin missing pages
15. Shared/uploads missing components
16. OWNERS.json incomplete
17. ESLint rules incomplete
18. Dependency diagram issue

### ❌ Missing/Incorrect (5)
1. Retail product completely undefined
2. Cross-cutting concerns incomplete (a11y, PWA, theme)
3. Settings page location unclear
4. Type-only import rules missing
5. Restaurant product not detailed

---

## ACTION ITEMS (Priority Order)

### P0 - Blocking ✅ ALL FIXED
1. ~~Fix dependency flow diagram (data-core/ui are siblings)~~ ✅ DONE
2. ~~Add file naming conventions section~~ ✅ DONE
3. ~~Complete OWNERS.json with all shared packages~~ ✅ DONE
4. ~~Define where Settings page lives~~ ✅ DONE (added shared/settings)

### P1 - High ✅ ALL FIXED
1. ~~Add missing shared inter-dependency rules~~ ✅ DONE
2. ~~Add missing cross-cutting concerns (a11y, theme)~~ ✅ DONE
3. ~~Detail the Retail product structure~~ ✅ DONE (added to OWNERS.json)
4. ~~Add type-only and test import exemptions to ESLint~~ ✅ DONE

### P2 - Medium (can add during implementation)
1. Expand Platform/UI component list
2. Add missing Platform/Patterns
3. Add missing Shared package components
4. Add missing Product domains/pages/widgets

### P3 - Low (nice to have)
1. Add all internal/tooling items
2. Expand integrations list

---

## FIXES APPLIED

| Issue | Fix Applied |
|-------|-------------|
| Dependency diagram | Added sibling notation for ui/data-core |
| File naming | Added Section 1.2 with full naming table |
| OWNERS.json | Added all 20+ shared packages |
| Settings location | Added shared/settings package with pages |
| Shared deps | Added Section 2.2 with allowed imports |
| a11y/theme | Added shared/a11y and shared/theme packages |
| Import exemptions | Added Section 2.3 with exemption rules |

---

## CONTENT CONSOLIDATION (Additional Pass)

| Source File | Content Moved | Destination | Action |
|-------------|---------------|-------------|--------|
| 03-database-design.md | RLS patterns (detailed) | 14-security-rls.md | Replaced with reference |
| 09-architecture-decisions.md | JWT Token Structure | 12-supabase-integration.md | Moved, replaced with reference |

---

## CROSS-REFERENCES ADDED

The following files now include "See Also" sections linking to related documents:

| File | Links To |
|------|----------|
| 02-architecture-diagrams.md | 03, 04, 12, 14 |
| 03-database-design.md | 02, 09, 12, 14 |
| 04-code-structure.md | 02, 03, 09, 13 |
| 09-architecture-decisions.md | 02, 03, 04, 12, 15 |
| 12-supabase-integration.md | 03, 09, 13, 14 |
| 14-security-rls.md | 03, 09, 12, 13 |
