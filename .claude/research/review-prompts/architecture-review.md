# Architecture Review Prompt: 04-code-structure.md

> Use this prompt to validate the complete architecture before implementation.

---

## Instructions

Review `04-code-structure.md` against all criteria below. For each section, mark:
- ✅ Complete and correct
- ⚠️ Needs minor adjustment (explain)
- ❌ Missing or incorrect (explain)

---

## 1. NAMING CONVENTIONS

### 1.1 Terminology Consistency
- [ ] Are all naming conventions clearly defined? (patterns, widgets, domains, etc.)
- [ ] Is there a clear distinction between platform-level and product-level terms?
- [ ] Are naming rules consistent throughout the document?
- [ ] Does naming follow industry standards (FSD, atomic design, clean architecture)?

### 1.2 File Naming
- [ ] Are file naming conventions specified? (kebab-case, PascalCase, etc.)
- [ ] Component files: `ComponentName.tsx`
- [ ] Hook files: `useHookName.ts`
- [ ] Type files: `types.ts` or `*.types.ts`
- [ ] Index files for barrel exports

---

## 2. LAYER DEPENDENCY RULES

### 2.1 Dependency Flow Validation
- [ ] Is the dependency hierarchy clearly defined?
- [ ] apps → products → shared → platform (verify order)
- [ ] Are circular dependencies explicitly forbidden?
- [ ] Are cross-product imports explicitly forbidden?

### 2.2 Missing Rules Check
- [ ] Can `platform/ui` import from `platform/patterns`? (should be NO)
- [ ] Can `platform/patterns` import from `platform/ui`? (should be YES)
- [ ] Can `shared/*` packages import from each other? (specify which)
- [ ] What about `shared/profile` → `shared/auth`? (allowed, document it)
- [ ] Is `internal/*` completely isolated?

### 2.3 Edge Cases
- [ ] Where do test utilities import from?
- [ ] Where do type-only imports go? (are they exempt from rules?)
- [ ] How to handle peer dependencies?

---

## 3. PLATFORM LAYER COMPLETENESS

### 3.1 Foundation Package
- [ ] tokens/ - CSS custom properties
- [ ] hooks/ - Utility hooks (useMediaQuery, useDebounce, useLocalStorage, etc.)
- [ ] utils/ - Pure functions (cn, formatDate, formatCurrency, etc.)
- [ ] types/ - Utility types
- [ ] constants/ - App-wide constants
- [ ] Missing anything? (animations, transitions, breakpoints logic?)

### 3.2 UI Package
- [ ] All primitive components listed?
- [ ] Form components: Input, Select, Checkbox, Radio, Switch, TextArea, DatePicker?
- [ ] Feedback components: Toast, Alert, Badge, Spinner, Skeleton, Progress?
- [ ] Layout components: Box, Stack, Grid, Flex, Spacer?
- [ ] Typography: Heading, Text, Label, Link?
- [ ] Data display: Table, List, Avatar, Icon?
- [ ] Overlay: Modal, Dialog, Drawer, Popover, Tooltip, Dropdown?
- [ ] Navigation: Tabs, Breadcrumb, Stepper?

### 3.3 Patterns Package
- [ ] DataTable (sort, filter, pagination)
- [ ] FormBuilder (dynamic forms)
- [ ] Wizard (multi-step)
- [ ] PageLayout
- [ ] DataView (list/grid/table switcher)
- [ ] InfiniteScroll
- [ ] VirtualList
- [ ] Missing: SearchableSelect? Combobox? CommandPalette? FilterPanel?

### 3.4 Data-Core Package
- [ ] Supabase provider setup
- [ ] Query client configuration
- [ ] Cache invalidation strategy
- [ ] Query key factory
- [ ] Base hooks (useQuery, useMutation)
- [ ] Realtime hooks
- [ ] Pagination types/hooks
- [ ] Optimistic updates strategy?
- [ ] Error retry logic?
- [ ] Offline support hooks?

### 3.5 State Package
- [ ] Context creation utilities
- [ ] State synchronization hooks
- [ ] Zustand or Jotai setup? (or just context?)
- [ ] Persist state utilities?

### 3.6 Errors Package
- [ ] ErrorBoundary component
- [ ] SuspenseBoundary component
- [ ] ErrorFallback UI
- [ ] NotFound page
- [ ] AppError types
- [ ] Global error handler
- [ ] Missing: NetworkError? ValidationError? AuthError types?

### 3.7 Testing Package
- [ ] Test render utilities
- [ ] Mock Supabase client
- [ ] Factory functions for test data
- [ ] MSW handlers
- [ ] Custom matchers
- [ ] Missing: Accessibility testing helpers? Visual regression setup?

---

## 4. SHARED LAYER COMPLETENESS

### 4.1 Auth Package
- [ ] LoginForm
- [ ] OAuthButtons (Google, GitHub, etc.)
- [ ] MFASetup
- [ ] AuthGuard (route protection)
- [ ] PermissionGuard (feature protection)
- [ ] AuthContext
- [ ] AppContext (org/app context)
- [ ] useAuth hook
- [ ] useSession hook
- [ ] usePermissions hook
- [ ] Missing: ForgotPassword? ResetPassword? EmailVerification? InviteAccept?

### 4.2 Profile Package
- [ ] Avatar component
- [ ] ProfileCard component
- [ ] ProfileForm component
- [ ] PreferencesForm component
- [ ] ProfileProvider context
- [ ] useProfile hook
- [ ] usePreferences hook
- [ ] Profile types, repository, service
- [ ] Missing: ProfileAvatar uploader? SocialLinks? EmergencyContact?

### 4.3 Shell Package
- [ ] RootShell (app-level)
- [ ] AppShell (product-level)
- [ ] OrgShell (org-level)
- [ ] Header
- [ ] Sidebar
- [ ] AppSwitcher
- [ ] OrgSwitcher
- [ ] Missing: Footer? MobileNav? CommandBar? Breadcrumbs?

### 4.4 i18n Package
- [ ] LocaleSelector component
- [ ] useTranslation hook
- [ ] Translation context
- [ ] Translations data layer
- [ ] Locales data
- [ ] Missing: DateLocale? NumberLocale? RTL support utilities?

### 4.5 Geography Package
- [ ] CountrySelect
- [ ] AddressForm
- [ ] Countries data
- [ ] Regions data
- [ ] Cities data
- [ ] Missing: Map integration? Geocoding? TimezoneSelect?

### 4.6 Org Package
- [ ] Organizations data
- [ ] Members data
- [ ] Invitations data
- [ ] Org components?
- [ ] Missing: OrgSettings? MemberList? InviteForm? RoleSelector?

### 4.7 Billing Package
- [ ] Subscriptions data
- [ ] Invoices data
- [ ] Stripe integration
- [ ] Missing: PricingTable? PaymentForm? BillingHistory? UsageMetrics?

### 4.8 Admin Package
- [ ] Users page
- [ ] Translations page
- [ ] AuditLog page
- [ ] Admin components
- [ ] Missing: OrgManagement? SystemSettings? FeatureFlagsAdmin?

### 4.9 Notifications Package
- [ ] NotificationBell
- [ ] NotificationList
- [ ] Notification context
- [ ] Notification hooks
- [ ] Notification data layer
- [ ] Missing: NotificationPreferences? PushNotification setup?

### 4.10 Uploads Package
- [ ] FileUploader
- [ ] ImageUploader
- [ ] Upload hooks
- [ ] Upload utils
- [ ] Missing: DocumentViewer? ImageCropper? BulkUpload?

### 4.11 SEO Package
- [ ] Meta component
- [ ] JsonLd component
- [ ] SEO hooks
- [ ] Missing: OpenGraph? TwitterCard? Sitemap generation?

### 4.12 Analytics Package
- [ ] Google Analytics provider
- [ ] Mixpanel provider
- [ ] PostHog provider
- [ ] useAnalytics hook
- [ ] usePageView hook
- [ ] Missing: Event types? Conversion tracking? A/B testing?

### 4.13 Monitoring Package
- [ ] Sentry provider
- [ ] Web Vitals tracking
- [ ] Logger utility
- [ ] Monitoring hooks
- [ ] Missing: Performance monitoring? User session recording?

### 4.14 Security Package
- [ ] SecureForm component
- [ ] useCSRF hook
- [ ] Sanitize utility
- [ ] Validation utility
- [ ] Missing: XSS protection? Rate limiting? CORS handling?

### 4.15 Feature Flags Package
- [ ] FeatureGate component
- [ ] useFeatureFlag hook
- [ ] Feature flag context
- [ ] Feature flag data layer
- [ ] Missing: Percentage rollout? User targeting?

### 4.16 Realtime Package
- [ ] useChannel hook
- [ ] usePresence hook
- [ ] Realtime context
- [ ] Missing: Broadcast? Typing indicators?

### 4.17 Offline Package
- [ ] OfflineBanner component
- [ ] useOnlineStatus hook
- [ ] Offline context
- [ ] Missing: Sync queue? Conflict resolution?

### 4.18 Integrations Package
- [ ] Google Maps
- [ ] SendGrid
- [ ] Missing: Other common integrations?

### 4.19 Style Guide Package
- [ ] Style guide pages
- [ ] Style guide routes
- [ ] Is this necessary in shared? (maybe internal?)

---

## 5. PRODUCTS LAYER COMPLETENESS

### 5.1 Product Structure Consistency
- [ ] data/domains/ - All domain entities
- [ ] features/ - Business logic + UI
- [ ] widgets/ - Product-specific UI blocks
- [ ] pages/ - Route pages
- [ ] admin/ - Product-specific admin
- [ ] integrations/ - Product-specific integrations
- [ ] analytics/ - Product events
- [ ] seo/ - Product meta
- [ ] routes/ - Route definitions

### 5.2 Real Estate Product
- [ ] Domains: properties, units, leases, tenants, maintenance
- [ ] Missing domains? (payments, documents, inspections, amenities?)
- [ ] Widgets: PropertyCard, UnitTable, LeaseTimeline, RentChart, OccupancyGauge
- [ ] Missing widgets? (MaintenanceTracker, TenantCard, PaymentHistory?)
- [ ] Pages: Dashboard, Properties, Units, Leases, Reports
- [ ] Missing pages? (Tenants, Maintenance, Documents, Settings?)

### 5.3 Restaurant Product
- [ ] Domains: menu-items, orders, reservations, tables
- [ ] Missing domains? (staff, inventory, customers, reviews?)
- [ ] Are widgets defined?
- [ ] Are pages defined?

### 5.4 Retail Product
- [ ] Is structure defined?
- [ ] Missing domains?

---

## 6. INTERNAL LAYER COMPLETENESS

### 6.1 Env Package
- [ ] Client env validation
- [ ] Server env validation
- [ ] Zod schemas for all env vars

### 6.2 Tooling Package
- [ ] TypeScript configs
- [ ] ESLint configs
- [ ] Boundaries plugin config
- [ ] Prettier config
- [ ] Stylelint config
- [ ] Vitest config
- [ ] Missing: Commitlint? Husky? lint-staged?

### 6.3 Scripts Package
- [ ] Extract scripts
- [ ] Codegen scripts
- [ ] Analyze scripts
- [ ] Missing: Migration scripts? Seed scripts? Deploy scripts?

---

## 7. DATABASE LAYER

### 7.1 Migration Organization
- [ ] Are migrations organized by schema?
- [ ] Is the order correct? (extensions → global → platform → apps)
- [ ] Are RLS policies included?
- [ ] Are triggers included?

### 7.2 Edge Functions
- [ ] _shared utilities
- [ ] auth-hook
- [ ] switch-context
- [ ] Product-specific functions

### 7.3 Seed Data
- [ ] Is seed strategy defined?
- [ ] Development seeds vs production seeds?

---

## 8. TESTING STRUCTURE

### 8.1 Unit Tests
- [ ] Co-located in `__tests__/` folders?
- [ ] Naming convention defined?

### 8.2 E2E Tests
- [ ] Fixtures defined
- [ ] Page objects defined
- [ ] Test organization by feature?

---

## 9. DOCUMENTATION

### 9.1 Docs Structure
- [ ] architecture/ folder
- [ ] api/ folder
- [ ] guides/ folder
- [ ] adr/ (Architecture Decision Records)
- [ ] Missing: Contributing guide? API reference? Component docs?

---

## 10. OWNERS.JSON VALIDATION

### 10.1 Completeness
- [ ] All packages have owners?
- [ ] All extractable flags correct?
- [ ] All dbSchemas mapped correctly?
- [ ] All dependencies listed?

### 10.2 Missing Packages
- [ ] shared/profile listed?
- [ ] shared/integrations listed?
- [ ] shared/style-guide listed?
- [ ] All other shared packages listed?

---

## 11. ESLINT BOUNDARIES

### 11.1 Rules Completeness
- [ ] All layer combinations covered?
- [ ] Internal isolation enforced?
- [ ] Cross-product imports blocked?
- [ ] Shared inter-dependencies defined?

---

## 12. IMPORT ALIASES

### 12.1 Completeness
- [ ] All platform packages have aliases?
- [ ] All shared packages have aliases?
- [ ] All products have aliases?
- [ ] Internal packages have aliases?

---

## 13. CROSS-CUTTING CONCERNS TABLE

### 13.1 Completeness
- [ ] Caching location correct?
- [ ] Security location correct?
- [ ] SEO split (shared + products) correct?
- [ ] Analytics split correct?
- [ ] All concerns mapped?

### 13.2 Missing Concerns
- [ ] Accessibility (a11y)?
- [ ] Internationalization beyond i18n?
- [ ] Performance optimization?
- [ ] PWA setup?
- [ ] Service Worker?

---

## 14. GENERAL ARCHITECTURE QUESTIONS

### 14.1 Scalability
- [ ] Can new products be added easily?
- [ ] Can new shared packages be added easily?
- [ ] Is extraction process clear?

### 14.2 Developer Experience
- [ ] Is it clear where new code goes?
- [ ] Are there ambiguous placements?
- [ ] Is the learning curve reasonable?

### 14.3 Consistency
- [ ] Same structure across all layers?
- [ ] Same naming across all packages?
- [ ] Same patterns for data access?

---

## 15. COMPARISON WITH CURRENT CODEBASE

### 15.1 Gap Analysis
- [ ] What exists in current codebase that's not in the new structure?
- [ ] What's in the new structure that doesn't exist yet?
- [ ] What needs to be moved/renamed?

### 15.2 Migration Path
- [ ] Is the migration path clear?
- [ ] Are breaking changes documented?

---

## SUMMARY TEMPLATE

After review, complete this summary:

```
## Architecture Review Summary

### Status: [READY / NEEDS WORK]

### ✅ Complete Sections:
-

### ⚠️ Minor Adjustments Needed:
-

### ❌ Missing/Incorrect:
-

### Recommendations:
1.
2.
3.

### Questions for Clarification:
1.
2.

### Blocking Issues (must fix before implementation):
1.
2.
```

---

## EXECUTION

To run this review:

1. Read `04-code-structure.md` completely
2. Go through each section above
3. Mark status for each item
4. Fill in the summary template
5. Prioritize blocking issues
6. Create action items for fixes
