# Code Structure (Complete)

---

## 1. Naming Conventions

### 1.1 Patterns vs Widgets

| Term | Level | Contains | Examples |
|------|-------|----------|----------|
| **patterns** | Platform | Abstract, data-agnostic, configurable compositions | DataTable, FormBuilder, Wizard |
| **widgets** | Product | Domain-specific, business-aware UI blocks | PropertyCard, RentChart, LeaseTimeline |

```
platform/patterns/DataTable/              ← Generic, works with ANY data
products/real-estate/widgets/PropertyCard/ ← Knows what a Property is
```

### 1.2 File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Components** | PascalCase | `Button.tsx`, `PropertyCard.tsx` |
| **Hooks** | camelCase with `use` prefix | `useAuth.ts`, `useProperties.ts` |
| **Contexts** | PascalCase with `Context` suffix | `AuthContext.tsx` |
| **Types** | `types.ts` or `*.types.ts` | `types.ts`, `property.types.ts` |
| **Schemas** | `schemas.ts` or `*.schemas.ts` | `schemas.ts`, `lease.schemas.ts` |
| **Services** | camelCase with `Service` suffix | `profileService.ts` |
| **Repositories** | camelCase with `Repository` suffix | `propertyRepository.ts` |
| **Utilities** | camelCase | `formatDate.ts`, `cn.ts` |
| **Constants** | camelCase or UPPER_SNAKE | `apiEndpoints.ts`, `ROUTES.ts` |
| **Styles (SCSS)** | kebab-case with `_` prefix | `_button-variants.scss` |
| **Tests** | Same as source + `.test.ts` | `Button.test.tsx` |
| **Index/Barrel** | Always `index.ts` | `index.ts` |
| **Folders** | kebab-case (features), PascalCase (components) | `property-list/`, `Button/` |

---

## 2. Layer Dependency Rules

### 2.1 Primary Layer Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│  DEPENDENCY FLOW (can only import downward)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  apps/web/{app}              ← Entry points only                │
│       ↓                                                         │
│  products/{app}              ← Product-specific everything      │
│       ↓                                                         │
│  shared/*                    ← Cross-product features           │
│       ↓                                                         │
│  platform/patterns           ← Reusable compositions            │
│       ↓                                                         │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │ platform/ui │  │ data-core   │  ← SIBLINGS (don't import    │
│  └──────┬──────┘  └──────┬──────┘    each other)               │
│         │                │                                      │
│         └───────┬────────┘                                      │
│                 ↓                                                │
│        platform/foundation   ← Tokens, utils, base hooks        │
│                                                                 │
│  internal/*                  ← Build-time only (separate tree)  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Shared Package Inter-Dependencies

```
Allowed shared → shared imports:

  shared/profile    →  shared/auth       (needs user_id)
  shared/shell      →  shared/auth       (needs auth state)
  shared/shell      →  shared/profile    (shows avatar)
  shared/billing    →  shared/org        (org subscriptions)
  shared/admin      →  shared/*          (admin consumes all)
  shared/settings   →  shared/profile    (edits profile)
```

### 2.3 Import Exemptions

| Import Type | Exempt from Boundaries? |
|-------------|------------------------|
| Type-only imports (`import type`) | ✅ Yes - types can be imported from anywhere |
| Test files (`*.test.ts`) | ✅ Yes - tests can import mocks from any layer |
| Internal build tools | ✅ Yes - isolated tree |

---

## 3. Complete Directory Structure

```
pulwave/
│
├── apps/
│   └── web/
│       ├── real-estate/             ← Vite entry for real-estate app
│       │   ├── src/
│       │   │   ├── main.tsx
│       │   │   ├── App.tsx
│       │   │   └── routes.tsx
│       │   ├── public/
│       │   │   ├── robots.txt
│       │   │   ├── sitemap.xml
│       │   │   └── manifest.json
│       │   ├── index.html
│       │   └── vite.config.ts
│       ├── restaurant/
│       ├── boleta/                  ← Goncalvinhos app 1
│       └── molhaqui/                ← Goncalvinhos app 2
│
├── packages/
│   │
│   ├── platform/                    ══════════════════════════════════
│   │   │                            ALWAYS EXTRACTED (core infrastructure)
│   │   │
│   │   ├── foundation/              @pulwave/foundation
│   │   │   ├── tokens/              ← CSS custom properties, scales
│   │   │   ├── hooks/               ← useMediaQuery, useDebounce
│   │   │   ├── utils/               ← cn(), formatDate()
│   │   │   ├── types/               ← Utility types
│   │   │   ├── constants/
│   │   │   └── index.ts
│   │   │
│   │   ├── ui/                      @pulwave/ui
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   ├── Card/
│   │   │   │   ├── Input/
│   │   │   │   ├── Modal/
│   │   │   │   ├── Toast/
│   │   │   │   └── ... (primitives)
│   │   │   ├── styles/
│   │   │   └── index.ts
│   │   │
│   │   ├── patterns/                @pulwave/patterns
│   │   │   ├── DataTable/           ← Table + pagination + sorting
│   │   │   ├── FormBuilder/         ← Dynamic form generation
│   │   │   ├── PageLayout/          ← Header + content + footer
│   │   │   ├── DataView/            ← List/grid/table switcher
│   │   │   ├── Wizard/              ← Multi-step forms
│   │   │   ├── InfiniteScroll/
│   │   │   ├── VirtualList/
│   │   │   └── index.ts
│   │   │
│   │   ├── data-core/               @pulwave/data-core
│   │   │   ├── providers/
│   │   │   │   └── supabase/
│   │   │   │       ├── client.ts
│   │   │   │       └── types.ts     ← Generated DB types
│   │   │   ├── cache/
│   │   │   │   ├── queryClient.ts
│   │   │   │   ├── keys.ts
│   │   │   │   └── invalidation.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useQuery.ts
│   │   │   │   ├── useMutation.ts
│   │   │   │   └── useRealtime.ts
│   │   │   ├── types/
│   │   │   │   ├── base.ts          ← BaseEntity, Timestamps
│   │   │   │   └── pagination.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── state/                   @pulwave/state
│   │   │   ├── context/
│   │   │   │   └── createSafeContext.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useStore.ts
│   │   │   │   └── useSyncedState.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── errors/                  @pulwave/errors
│   │   │   ├── boundaries/
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   └── SuspenseBoundary.tsx
│   │   │   ├── types/
│   │   │   │   └── AppError.ts
│   │   │   ├── handlers/
│   │   │   │   └── globalHandler.ts
│   │   │   ├── components/
│   │   │   │   ├── ErrorFallback.tsx
│   │   │   │   └── NotFound.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── testing/                 @pulwave/testing
│   │       ├── utils/
│   │       │   ├── render.tsx
│   │       │   ├── mockSupabase.ts
│   │       │   └── factories/
│   │       ├── matchers/
│   │       ├── msw/
│   │       └── index.ts
│   │
│   │
│   ├── shared/                      ══════════════════════════════════
│   │   │                            EXTRACTED BASED ON PRODUCT DEPS
│   │   │
│   │   ├── auth/                    @pulwave/shared-auth
│   │   │   ├── components/
│   │   │   │   ├── LoginForm/
│   │   │   │   ├── OAuthButtons/
│   │   │   │   ├── MFASetup/
│   │   │   │   ├── AuthGuard/
│   │   │   │   └── PermissionGuard/
│   │   │   ├── context/
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   └── AppContext.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts       ← Login, logout, session
│   │   │   │   ├── useSession.ts
│   │   │   │   └── usePermissions.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── profile/                 @pulwave/shared-profile
│   │   │   ├── components/
│   │   │   │   ├── Avatar/
│   │   │   │   ├── ProfileCard/
│   │   │   │   ├── ProfileForm/
│   │   │   │   └── PreferencesForm/
│   │   │   ├── context/
│   │   │   │   └── ProfileProvider.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProfile.ts
│   │   │   │   └── usePreferences.ts
│   │   │   ├── data/
│   │   │   │   └── domains/
│   │   │   │       └── profile/
│   │   │   │           ├── types.ts     ← Profile, Preferences types
│   │   │   │           ├── schemas.ts   ← Zod validation
│   │   │   │           ├── hooks.ts
│   │   │   │           ├── repository.ts
│   │   │   │           └── service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── shell/                   @pulwave/shared-shell
│   │   │   ├── components/
│   │   │   │   ├── RootShell/
│   │   │   │   ├── AppShell/
│   │   │   │   ├── OrgShell/
│   │   │   │   ├── Header/
│   │   │   │   ├── Sidebar/
│   │   │   │   ├── AppSwitcher/
│   │   │   │   └── OrgSwitcher/
│   │   │   └── index.ts
│   │   │
│   │   ├── i18n/                    @pulwave/shared-i18n
│   │   │   ├── components/
│   │   │   │   └── LocaleSelector/
│   │   │   ├── context/
│   │   │   ├── hooks/
│   │   │   │   └── useTranslation.ts
│   │   │   ├── data/
│   │   │   │   ├── translations/
│   │   │   │   └── locales/
│   │   │   └── index.ts
│   │   │
│   │   ├── geography/               @pulwave/shared-geography
│   │   │   ├── components/
│   │   │   │   ├── CountrySelect/
│   │   │   │   └── AddressForm/
│   │   │   ├── data/
│   │   │   │   ├── countries/
│   │   │   │   ├── regions/
│   │   │   │   └── cities/
│   │   │   └── index.ts
│   │   │
│   │   ├── org/                     @pulwave/shared-org
│   │   │   ├── components/
│   │   │   ├── data/
│   │   │   │   ├── organizations/
│   │   │   │   ├── members/
│   │   │   │   └── invitations/
│   │   │   └── index.ts
│   │   │
│   │   ├── billing/                 @pulwave/shared-billing
│   │   │   ├── components/
│   │   │   ├── data/
│   │   │   │   ├── subscriptions/
│   │   │   │   └── invoices/
│   │   │   ├── integrations/
│   │   │   │   └── stripe/
│   │   │   └── index.ts
│   │   │
│   │   ├── admin/                   @pulwave/shared-admin
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── Users/
│   │   │   │   ├── Translations/
│   │   │   │   └── AuditLog/
│   │   │   └── index.ts
│   │   │
│   │   ├── notifications/           @pulwave/shared-notifications
│   │   │   ├── components/
│   │   │   │   ├── NotificationBell/
│   │   │   │   └── NotificationList/
│   │   │   ├── context/
│   │   │   ├── hooks/
│   │   │   ├── data/
│   │   │   └── index.ts
│   │   │
│   │   ├── uploads/                 @pulwave/shared-uploads
│   │   │   ├── components/
│   │   │   │   ├── FileUploader/
│   │   │   │   └── ImageUploader/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   │
│   │   ├── seo/                     @pulwave/shared-seo
│   │   │   ├── components/
│   │   │   │   ├── Meta/
│   │   │   │   └── JsonLd/
│   │   │   ├── hooks/
│   │   │   └── index.ts
│   │   │
│   │   ├── analytics/               @pulwave/shared-analytics
│   │   │   ├── providers/
│   │   │   │   ├── google.ts
│   │   │   │   ├── mixpanel.ts
│   │   │   │   └── posthog.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAnalytics.ts
│   │   │   │   └── usePageView.ts
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── monitoring/              @pulwave/shared-monitoring
│   │   │   ├── providers/
│   │   │   │   ├── sentry/
│   │   │   │   └── webVitals.ts
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   │   └── logger.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── security/                @pulwave/shared-security
│   │   │   ├── components/
│   │   │   │   └── SecureForm/
│   │   │   ├── hooks/
│   │   │   │   └── useCSRF.ts
│   │   │   ├── utils/
│   │   │   │   ├── sanitize.ts
│   │   │   │   └── validation.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── feature-flags/           @pulwave/shared-feature-flags
│   │   │   ├── context/
│   │   │   ├── components/
│   │   │   │   └── FeatureGate/
│   │   │   ├── hooks/
│   │   │   │   └── useFeatureFlag.ts
│   │   │   ├── data/
│   │   │   └── index.ts
│   │   │
│   │   ├── realtime/                @pulwave/shared-realtime
│   │   │   ├── context/
│   │   │   ├── hooks/
│   │   │   │   ├── useChannel.ts
│   │   │   │   └── usePresence.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── offline/                 @pulwave/shared-offline
│   │   │   ├── context/
│   │   │   ├── components/
│   │   │   │   └── OfflineBanner/
│   │   │   ├── hooks/
│   │   │   │   └── useOnlineStatus.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── integrations/            @pulwave/shared-integrations
│   │   │   ├── google-maps/
│   │   │   ├── sendgrid/
│   │   │   └── index.ts
│   │   │
│   │   ├── settings/                @pulwave/shared-settings
│   │   │   ├── components/
│   │   │   │   ├── SettingsLayout/
│   │   │   │   ├── SettingsNav/
│   │   │   │   └── SettingsSection/
│   │   │   ├── pages/
│   │   │   │   ├── Account/         ← Profile, preferences, password
│   │   │   │   ├── Billing/         ← Subscription, payment methods
│   │   │   │   ├── Notifications/   ← Notification preferences
│   │   │   │   └── Security/        ← MFA, sessions, privacy
│   │   │   └── index.ts
│   │   │
│   │   ├── theme/                   @pulwave/shared-theme
│   │   │   ├── context/
│   │   │   │   └── ThemeProvider.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useTheme.ts
│   │   │   │   └── useColorScheme.ts
│   │   │   ├── utils/
│   │   │   │   └── themeStorage.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── a11y/                    @pulwave/shared-a11y
│   │   │   ├── components/
│   │   │   │   ├── SkipLink/
│   │   │   │   ├── VisuallyHidden/
│   │   │   │   └── FocusTrap/
│   │   │   ├── hooks/
│   │   │   │   ├── useFocusRing.ts
│   │   │   │   └── useAnnounce.ts
│   │   │   └── index.ts
│   │   │
│   │   └── style-guide/             @pulwave/shared-style-guide (DEV-ONLY)
│   │       ├── pages/
│   │       ├── routes/
│   │       └── index.ts
│   │
│   │
│   ├── products/                    ══════════════════════════════════
│   │   │                            EXTRACTABLE VERTICAL SLICES
│   │   │
│   │   ├── real-estate/             @pulwave/product-real-estate
│   │   │   │
│   │   │   ├── data/                ← Domain data layer
│   │   │   │   └── domains/
│   │   │   │       ├── properties/
│   │   │   │       │   ├── types.ts
│   │   │   │       │   ├── schemas.ts
│   │   │   │       │   ├── hooks.ts
│   │   │   │       │   ├── repository.ts
│   │   │   │       │   ├── service.ts
│   │   │   │       │   └── keys.ts
│   │   │   │       ├── units/
│   │   │   │       ├── leases/
│   │   │   │       ├── tenants/
│   │   │   │       └── maintenance/
│   │   │   │
│   │   │   ├── features/            ← Business logic + UI
│   │   │   │   ├── property-list/
│   │   │   │   ├── property-form/
│   │   │   │   ├── lease-wizard/
│   │   │   │   └── maintenance-tracker/
│   │   │   │
│   │   │   ├── widgets/             ← Product-specific UI blocks
│   │   │   │   ├── PropertyCard/
│   │   │   │   ├── UnitTable/
│   │   │   │   ├── LeaseTimeline/
│   │   │   │   ├── RentChart/
│   │   │   │   └── OccupancyGauge/
│   │   │   │
│   │   │   ├── pages/               ← Route pages
│   │   │   │   ├── Dashboard/
│   │   │   │   ├── Properties/
│   │   │   │   ├── Units/
│   │   │   │   ├── Leases/
│   │   │   │   └── Reports/
│   │   │   │
│   │   │   ├── admin/               ← Product-specific admin
│   │   │   │   ├── PropertySettings/
│   │   │   │   └── LeaseTemplates/
│   │   │   │
│   │   │   ├── integrations/        ← Product-specific integrations
│   │   │   │   ├── zillow/
│   │   │   │   └── docusign/
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   └── events.ts        ← Product-specific events
│   │   │   │
│   │   │   ├── seo/
│   │   │   │   └── meta.ts          ← Product-specific meta
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── index.tsx
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── restaurant/              @pulwave/product-restaurant
│   │   │   ├── data/domains/
│   │   │   │   ├── menu-items/
│   │   │   │   ├── orders/
│   │   │   │   ├── reservations/
│   │   │   │   └── tables/
│   │   │   ├── features/
│   │   │   ├── widgets/
│   │   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── integrations/
│   │   │   └── routes/
│   │   │
│   │   └── goncalvinhos/            ═══════ GONCALVINHOS FAMILY BUSINESS
│   │       │
│   │       ├── _shared/             ← Shared between boleta & molhaqui (NOT a package)
│   │       │   ├── components/
│   │       │   ├── hooks/
│   │       │   ├── types/
│   │       │   └── utils/
│   │       │
│   │       ├── boleta/              @pulwave/product-boleta
│   │       │   ├── data/domains/
│   │       │   ├── features/
│   │       │   ├── widgets/
│   │       │   ├── pages/
│   │       │   ├── admin/
│   │       │   ├── integrations/
│   │       │   └── routes/
│   │       │
│   │       └── molhaqui/            @pulwave/product-molhaqui
│   │           ├── data/domains/
│   │           ├── features/
│   │           ├── widgets/
│   │           ├── pages/
│   │           ├── admin/
│   │           ├── integrations/
│   │           └── routes/
│   │
│   │
│   └── internal/                    ══════════════════════════════════
│       │                            BUILD-TIME ONLY (never shipped)
│       │
│       ├── env/                     @pulwave/internal-env
│       │   ├── client.ts
│       │   ├── server.ts
│       │   └── index.ts
│       │
│       ├── tooling/
│       │   ├── typescript/
│       │   ├── eslint/
│       │   │   └── boundaries.js    ← Import boundary rules
│       │   ├── prettier/
│       │   ├── stylelint/
│       │   └── vitest/
│       │
│       └── scripts/
│           ├── extract/
│           ├── codegen/
│           └── analyze/
│
│
├── supabase/                        ══════════════════════════════════
│   │                                DATABASE & EDGE FUNCTIONS
│   │
│   ├── migrations/
│   │   ├── 000_extensions.sql
│   │   ├── 001_global_schema.sql
│   │   ├── 002_platform_schema.sql
│   │   ├── 003_auth_functions.sql
│   │   ├── 004_real_estate.sql
│   │   ├── 005_restaurant.sql
│   │   ├── 006_boleta.sql
│   │   └── 007_molhaqui.sql
│   │
│   ├── functions/
│   │   ├── _shared/
│   │   ├── auth-hook/
│   │   ├── switch-context/
│   │   └── real-estate/
│   │
│   └── seed/
│
│
├── e2e/                             ══════════════════════════════════
│   │                                END-TO-END TESTS
│   │
│   ├── fixtures/
│   ├── pages/
│   ├── tests/
│   │   ├── auth/
│   │   ├── real-estate/
│   │   └── admin/
│   └── playwright.config.ts
│
│
├── docs/                            ══════════════════════════════════
│   ├── architecture/
│   ├── api/
│   ├── guides/
│   └── adr/                         ← Architecture Decision Records
│
├── .github/
│   ├── workflows/
│   └── CODEOWNERS
│
├── OWNERS.json                      ← Ownership manifest
├── package.json
├── turbo.json
└── tsconfig.json
```

---

## 4. Cross-Cutting Concerns Placement

| Concern | Location | Purpose |
|---------|----------|---------|
| **Caching** | `platform/data-core/cache/` | Query caching, invalidation |
| **Security** | `shared/security/` | CSRF, sanitization, validation |
| **SEO** | `shared/seo/` + `products/*/seo/` | Meta tags, structured data |
| **Analytics** | `shared/analytics/` + `products/*/analytics/` | Tracking, events |
| **Monitoring** | `shared/monitoring/` | Sentry, logging, Web Vitals |
| **Error Handling** | `platform/errors/` | Boundaries, error types |
| **Feature Flags** | `shared/feature-flags/` | Flags, A/B testing |
| **Notifications** | `shared/notifications/` | Push, in-app |
| **Uploads** | `shared/uploads/` | File/image upload |
| **Realtime** | `shared/realtime/` | WebSocket, presence |
| **Offline** | `shared/offline/` | Service worker, sync |
| **Testing** | `platform/testing/` + `e2e/` | Utils, mocks, E2E |
| **State** | `platform/state/` | Context, stores |
| **Theming** | `shared/theme/` | Theme switching, dark mode, persistence |
| **Accessibility** | `shared/a11y/` | Skip links, focus management, announcements |
| **Settings** | `shared/settings/` | User settings pages (profile, billing, security) |

### 4.1 Settings vs Profile Clarification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SETTINGS vs PROFILE DISTINCTION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  shared/profile/              │  shared/settings/                            │
│  ═══════════════              │  ═════════════════                           │
│  DATA + Components            │  PAGES + Layout (consumes profile)           │
│                               │                                              │
│  • Profile entity (types)     │  • Settings pages (routes)                   │
│  • ProfileCard component      │  • SettingsLayout component                  │
│  • Avatar component           │  • SettingsNav component                     │
│  • ProfileForm component      │  • Account page (uses ProfileForm)           │
│  • useProfile hook            │  • Billing page (uses billing data)          │
│  • profileService             │  • Security page (uses auth hooks)           │
│                               │  • Notifications page                        │
│                               │                                              │
│  Used by: Header, Sidebar,    │  Used by: /settings/* routes only           │
│  Comments, Activity logs      │                                              │
│                               │                                              │
└─────────────────────────────────────────────────────────────────────────────┘

URL Structure:
  /{app}/{org}/settings/account      → shared/settings/pages/Account
  /{app}/{org}/settings/billing      → shared/settings/pages/Billing
  /{app}/{org}/settings/security     → shared/settings/pages/Security
  /{app}/{org}/settings/notifications → shared/settings/pages/Notifications
```

---

## 5. Package Internal Structure

Each package follows consistent internal structure:

```
{package}/
├── components/          ← UI pieces (if applicable)
│   └── ComponentName/
│       ├── ComponentName.tsx
│       ├── types.ts
│       ├── styles/
│       └── index.ts
├── hooks/               ← React hooks
├── context/             ← React contexts
├── utils/               ← Pure functions
├── types/               ← TypeScript types
├── data/                ← Data access (if applicable)
│   └── domains/
│       └── {domain}/
│           ├── types.ts
│           ├── schemas.ts
│           ├── hooks.ts
│           ├── repository.ts
│           ├── service.ts
│           └── keys.ts
├── constants/
├── styles/              ← SCSS (if applicable)
├── __tests__/           ← Unit tests (co-located)
└── index.ts             ← Public exports
```

---

## 6. Import Aliases

```json
{
  "@pulwave/foundation": ["packages/platform/foundation"],
  "@pulwave/ui": ["packages/platform/ui"],
  "@pulwave/patterns": ["packages/platform/patterns"],
  "@pulwave/data-core": ["packages/platform/data-core"],
  "@pulwave/state": ["packages/platform/state"],
  "@pulwave/errors": ["packages/platform/errors"],
  "@pulwave/testing": ["packages/platform/testing"],

  "@pulwave/shared-auth": ["packages/shared/auth"],
  "@pulwave/shared-profile": ["packages/shared/profile"],
  "@pulwave/shared-shell": ["packages/shared/shell"],
  "@pulwave/shared-i18n": ["packages/shared/i18n"],
  "@pulwave/shared-geography": ["packages/shared/geography"],
  "@pulwave/shared-org": ["packages/shared/org"],
  "@pulwave/shared-billing": ["packages/shared/billing"],
  "@pulwave/shared-admin": ["packages/shared/admin"],
  "@pulwave/shared-notifications": ["packages/shared/notifications"],
  "@pulwave/shared-uploads": ["packages/shared/uploads"],
  "@pulwave/shared-seo": ["packages/shared/seo"],
  "@pulwave/shared-analytics": ["packages/shared/analytics"],
  "@pulwave/shared-monitoring": ["packages/shared/monitoring"],
  "@pulwave/shared-security": ["packages/shared/security"],
  "@pulwave/shared-feature-flags": ["packages/shared/feature-flags"],
  "@pulwave/shared-realtime": ["packages/shared/realtime"],
  "@pulwave/shared-offline": ["packages/shared/offline"],
  "@pulwave/shared-integrations": ["packages/shared/integrations"],
  "@pulwave/shared-settings": ["packages/shared/settings"],
  "@pulwave/shared-theme": ["packages/shared/theme"],
  "@pulwave/shared-a11y": ["packages/shared/a11y"],
  "@pulwave/shared-style-guide": ["packages/shared/style-guide"],

  "@pulwave/product-real-estate": ["packages/products/real-estate"],
  "@pulwave/product-restaurant": ["packages/products/restaurant"],
  "@pulwave/product-boleta": ["packages/products/goncalvinhos/boleta"],
  "@pulwave/product-molhaqui": ["packages/products/goncalvinhos/molhaqui"],

  "@pulwave/internal-env": ["packages/internal/env"]
}
```

---

## 7. OWNERS.json

```json
{
  "$schema": "./owners.schema.json",
  "packages": {
    "platform/**": {
      "extractable": "always",
      "owner": "core"
    },
    "shared/auth": {
      "extractable": "always",
      "owner": "core",
      "dbSchemas": []
    },
    "shared/profile": {
      "extractable": "always",
      "owner": "core",
      "dbSchemas": ["global.profiles", "global.user_preferences"]
    },
    "shared/shell": {
      "extractable": "always",
      "owner": "core"
    },
    "shared/i18n": {
      "extractable": "always",
      "owner": "core",
      "dbSchemas": ["global.translations", "global.locales"]
    },
    "shared/geography": {
      "extractable": "always",
      "owner": "core",
      "dbSchemas": ["global.countries", "global.regions", "global.cities"]
    },
    "shared/org": {
      "extractable": "always",
      "owner": "core",
      "dbSchemas": ["platform.organizations", "platform.org_members", "platform.invitations"]
    },
    "shared/billing": {
      "extractable": "configurable",
      "owner": "core",
      "dbSchemas": ["platform.subscriptions", "platform.invoices", "platform.payment_methods"]
    },
    "shared/admin": {
      "extractable": "configurable",
      "owner": "core"
    },
    "shared/notifications": {
      "extractable": "configurable",
      "owner": "core",
      "dbSchemas": ["platform.notifications"]
    },
    "shared/uploads": {
      "extractable": "always",
      "owner": "core"
    },
    "shared/seo": {
      "extractable": "always",
      "owner": "core"
    },
    "shared/analytics": {
      "extractable": "configurable",
      "owner": "core"
    },
    "shared/monitoring": {
      "extractable": "configurable",
      "owner": "core"
    },
    "shared/security": {
      "extractable": "always",
      "owner": "core"
    },
    "shared/feature-flags": {
      "extractable": "configurable",
      "owner": "core",
      "dbSchemas": ["platform.feature_flags"]
    },
    "shared/realtime": {
      "extractable": "always",
      "owner": "core"
    },
    "shared/offline": {
      "extractable": "configurable",
      "owner": "core"
    },
    "shared/integrations": {
      "extractable": "configurable",
      "owner": "core"
    },
    "shared/theme": {
      "extractable": "always",
      "owner": "core"
    },
    "shared/a11y": {
      "extractable": "always",
      "owner": "core"
    },
    "shared/settings": {
      "extractable": "always",
      "owner": "core",
      "description": "User settings page (consumes profile, preferences)"
    },
    "shared/style-guide": {
      "extractable": "never",
      "owner": "core",
      "description": "Dev-only style guide"
    },
    "products/real-estate": {
      "extractable": true,
      "owner": "real-estate-team",
      "dependencies": [
        "platform/**",
        "shared/auth",
        "shared/profile",
        "shared/shell",
        "shared/i18n",
        "shared/geography",
        "shared/org",
        "shared/billing"
      ],
      "dbSchemas": ["real_estate.*"],
      "description": "Property management SaaS - Residential, commercial, condominiums, garages, personal assets"
    },
    "products/restaurant": {
      "extractable": true,
      "owner": "restaurant-team",
      "dependencies": [
        "platform/**",
        "shared/auth",
        "shared/profile",
        "shared/shell",
        "shared/i18n",
        "shared/geography",
        "shared/org",
        "shared/billing"
      ],
      "dbSchemas": ["restaurant.*"],
      "description": "Restaurant operations SaaS - Menu, orders, reservations, kitchen, inventory, staff"
    },
    "products/goncalvinhos/boleta": {
      "extractable": true,
      "owner": "goncalvinhos-team",
      "dependencies": [
        "platform/**",
        "shared/auth",
        "shared/profile",
        "shared/shell",
        "shared/i18n",
        "shared/geography",
        "shared/org",
        "shared/billing"
      ],
      "dbSchemas": ["boleta.*"],
      "description": "Boleta de Évora - Regional cake e-commerce and promotion platform (Alentejo, Portugal)"
    },
    "products/goncalvinhos/molhaqui": {
      "extractable": true,
      "owner": "goncalvinhos-team",
      "dependencies": [
        "platform/**",
        "shared/auth",
        "shared/profile",
        "shared/shell",
        "shared/i18n",
        "shared/geography",
        "shared/org"
      ],
      "dbSchemas": ["molhaqui.*"],
      "description": "Molhaqui Restaurant - Marketing, booking and loyalty platform (Évora, Portugal)"
    }
  }
}
```

---

## 8. ESLint Import Boundaries

```javascript
// internal/tooling/eslint/boundaries.js
module.exports = {
  rules: {
    'boundaries/element-types': [2, {
      default: 'disallow',
      rules: [
        // Apps can import from products, shared, platform
        { from: 'apps', allow: ['products', 'shared', 'platform'] },

        // Products can import from shared, platform (NOT other products)
        { from: 'products', allow: ['shared', 'platform'] },

        // Shared can import from platform and other shared
        { from: 'shared', allow: ['platform', 'shared'] },

        // Platform layers (downward only)
        { from: 'platform/patterns', allow: ['platform/ui', 'platform/data-core', 'platform/foundation'] },
        { from: 'platform/ui', allow: ['platform/foundation'] },
        { from: 'platform/data-core', allow: ['platform/foundation'] },
        { from: 'platform/errors', allow: ['platform/foundation', 'platform/ui'] },
        { from: 'platform/state', allow: ['platform/foundation'] },
        { from: 'platform/testing', allow: ['platform/*'] },

        // Internal is isolated
        { from: 'internal', allow: [] },
      ],
    }],
  },
};
```

---

## 9. Testing Strategy

| Test Type | Location | Tool |
|-----------|----------|------|
| **Unit tests** | Co-located `__tests__/` | Vitest |
| **Component tests** | Co-located `__tests__/` | Vitest + Testing Library |
| **Integration tests** | Co-located `__tests__/` | Vitest + MSW |
| **E2E tests** | `/e2e/tests/` | Playwright |

---

## 10. Admin Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ADMIN PANEL ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         SHARED ADMIN SHELL                           │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  Header: Logo | App Switcher | Org Switcher | User Menu     │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │  ┌──────────────┐ ┌────────────────────────────────────────────┐    │   │
│  │  │   Sidebar    │ │              Content Area                   │    │   │
│  │  │              │ │                                             │    │   │
│  │  │  GLOBAL      │ │  Renders based on route + app context      │    │   │
│  │  │  ├─ Users    │ │                                             │    │   │
│  │  │  ├─ Orgs     │ │  /admin/users        → SharedUserMgmt      │    │   │
│  │  │  ├─ Billing  │ │  /admin/translations → SharedTranslations  │    │   │
│  │  │  ├─ i18n     │ │  /admin/master-data  → SharedMasterData    │    │   │
│  │  │  └─ Audit    │ │                                             │    │   │
│  │  │              │ │  APP-SPECIFIC (loaded dynamically)          │    │   │
│  │  │  APP-SPECIFIC│ │  /admin/properties   → PropMgmt            │    │   │
│  │  │  (dynamic)   │ │  /admin/menus        → MenuMgmt            │    │   │
│  │  └──────────────┘ └────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Admin Routes Implementation

```tsx
// packages/shared/admin/routes/adminRoutes.tsx

import { lazy } from 'react';

// Shared admin sections (always available)
const sharedRoutes = [
  { path: 'users', component: lazy(() => import('../pages/Users')) },
  { path: 'organizations', component: lazy(() => import('../pages/Organizations')) },
  { path: 'billing', component: lazy(() => import('../pages/Billing')) },
  { path: 'translations', component: lazy(() => import('../pages/Translations')) },
  { path: 'master-data', component: lazy(() => import('../pages/MasterData')) },
  { path: 'audit-log', component: lazy(() => import('../pages/AuditLog')) },
];

// App-specific admin sections (loaded based on app context)
const appRoutes: Record<string, AdminRoute[]> = {
  'real-estate': [
    { path: 'properties', component: lazy(() => import('@pulwave/product-real-estate/admin/Properties')) },
    { path: 'lease-templates', component: lazy(() => import('@pulwave/product-real-estate/admin/LeaseTemplates')) },
  ],
  'restaurant': [
    { path: 'menu-management', component: lazy(() => import('@pulwave/product-restaurant/admin/MenuManagement')) },
    { path: 'table-layout', component: lazy(() => import('@pulwave/product-restaurant/admin/TableLayout')) },
  ],
  'boleta': [
    { path: 'boleta-admin-1', component: lazy(() => import('@pulwave/product-boleta/admin/AdminPage1')) },
  ],
  'molhaqui': [
    { path: 'molhaqui-admin-1', component: lazy(() => import('@pulwave/product-molhaqui/admin/AdminPage1')) },
  ],
};

export const getAdminRoutes = (appId: string) => [
  ...sharedRoutes,
  ...(appRoutes[appId] || []),
];
```

---

## 12. Summary

| Layer | Purpose | Extracted |
|-------|---------|-----------|
| **platform/** | Core infrastructure (UI, patterns, data-core) | Always |
| **shared/** | Cross-product features (auth, shell, i18n) | Always/Configurable |
| **products/** | Vertical app slices (real-estate, restaurant, goncalvinhos/*) | Per product |
| **internal/** | Build-time tooling | Never |
| **apps/web/** | Entry points | Per product |

---

## See Also

| Related Topic | Document |
|---------------|----------|
| Architecture diagrams | [02-architecture-diagrams.md](./02-architecture-diagrams.md) |
| Database design | [03-database-design.md](./03-database-design.md) |
| Architecture decisions | [09-architecture-decisions.md](./09-architecture-decisions.md) |
| TypeScript patterns | [13-typescript-patterns.md](./13-typescript-patterns.md) |
