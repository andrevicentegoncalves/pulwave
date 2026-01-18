# URL Routing & App Shell Strategy

---

## 1. URL Structure & Shell Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      URL STRUCTURE & SHELL HIERARCHY                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SHELL NESTING PRINCIPLE:                                                   │
│  Each route needs a shell/layout to provide consistent navigation & theming │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  RootShell (minimal - just auth provider, no nav)                     │  │
│  │  └── /auth/*                                                          │  │
│  │                                                                        │  │
│  │  AppShell (app branding, top nav, theme tokens)                       │  │
│  │  └── /{app-slug}/*                                                    │  │
│  │      ├── /select-org          ← Choose org within this app            │  │
│  │      ├── /style-guide         ← Design system with app theming        │  │
│  │      ├── /account/*           ← User settings (cross-org)             │  │
│  │      └── OrgShell (sidebar, org context)                              │  │
│  │          └── /{org-slug}/*                                            │  │
│  │              ├── /dashboard                                           │  │
│  │              ├── /admin/*                                             │  │
│  │              └── /{feature}/*                                         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LEVEL 0 - ROOT (no app, no org):                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  /auth/login              Auth pages - minimal shell, no nav         │   │
│  │  /auth/callback                                                      │   │
│  │  /auth/forgot-password                                               │   │
│  │  /                        Landing page OR redirect to /select-app    │   │
│  │  /select-app              After login, choose app (if multi-app)     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  LEVEL 1 - APP CONTEXT (app shell, no org):                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  /{app-slug}/select-org           Choose org within selected app     │   │
│  │  /{app-slug}/style-guide          Design system docs (app themed)    │   │
│  │  /{app-slug}/style-guide/colors   Style guide sub-routes             │   │
│  │  /{app-slug}/account/settings     User profile (uses app shell)      │   │
│  │  /{app-slug}/account/orgs         Manage user's orgs for this app    │   │
│  │  /{app-slug}/account/security     Password, 2FA, sessions            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  LEVEL 2 - FULL CONTEXT (app + org shell):                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  BUSINESS ROUTES:                                                    │   │
│  │  /real-estate/abc-properties/dashboard                               │   │
│  │  /real-estate/abc-properties/properties                              │   │
│  │  /real-estate/abc-properties/properties/123/units                    │   │
│  │  /restaurant/xyz-resto/dashboard                                     │   │
│  │  /restaurant/xyz-resto/menu                                          │   │
│  │  /retail/family-store/inventory                                      │   │
│  │                                                                       │   │
│  │  ADMIN ROUTES (org-level admin):                                     │   │
│  │  /{app-slug}/{org-slug}/admin                   Admin dashboard      │   │
│  │  /{app-slug}/{org-slug}/admin/users             Org user mgmt        │   │
│  │  /{app-slug}/{org-slug}/admin/billing           Subscription         │   │
│  │  /{app-slug}/{org-slug}/admin/translations      i18n overrides       │   │
│  │  /{app-slug}/{org-slug}/admin/settings          Org settings         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Shell Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SHELL COMPONENTS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐ │
│  │    RootShell        │  │     AppShell        │  │     OrgShell        │ │
│  │ ┌─────────────────┐ │  │ ┌─────────────────┐ │  │ ┌─────────────────┐ │ │
│  │ │                 │ │  │ │ [Logo] [AppNav] │ │  │ │    [Sidebar]    │ │ │
│  │ │                 │ │  │ │    [User]       │ │  │ │  - Dashboard    │ │ │
│  │ │    {children}   │ │  │ ├─────────────────┤ │  │ │  - Properties   │ │ │
│  │ │  (auth forms)   │ │  │ │                 │ │  │ │  - Reports      │ │ │
│  │ │                 │ │  │ │   {children}    │ │  │ │  - Admin ▼      │ │ │
│  │ │                 │ │  │ │                 │ │  │ │ ┌─────────────┐ │ │ │
│  │ └─────────────────┘ │  │ └─────────────────┘ │  │ │ │  Content    │ │ │ │
│  └─────────────────────┘  └─────────────────────┘  │ │ │  {children} │ │ │ │
│                                                     │ │ └─────────────┘ │ │ │
│  Used by:                 Used by:                 │ └─────────────────┘ │ │
│  - /auth/*                - /{app}/select-org      └─────────────────────┘ │
│                           - /{app}/style-guide      Used by:               │
│                           - /{app}/account/*        - /{app}/{org}/*       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Login → Org Selection Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LOGIN → ORG SELECTION FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│   │  Login   │───▶│  Select App  │───▶│  Select Org  │───▶│  Dashboard   │ │
│   │  /auth/  │    │  /select-app │    │/{app}/select │    │/{app}/{org}/ │ │
│   │  login   │    │ (if multi)   │    │    -org      │    │  dashboard   │ │
│   └──────────┘    └──────────────┘    └──────────────┘    └──────────────┘ │
│                          │                                                  │
│                          │ Skip if user has only                           │
│                          │ access to 1 app                                  │
│                          ▼                                                  │
│                   ┌──────────────┐                                          │
│                   │ Skip & go    │                                          │
│                   │ directly to  │                                          │
│                   │ select-org   │                                          │
│                   └──────────────┘                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Theme Token Inheritance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        THEME TOKEN INHERITANCE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Foundation tokens  →  App tokens override  →  Org tokens override         │
│  (shared)              (brand colors)           (white-label)              │
│                                                                              │
│  Example:                                                                   │
│  --color-brand-primary: blue     (foundation)                              │
│  --color-brand-primary: green    (real-estate app overrides)               │
│  --color-brand-primary: purple   (abc-properties org white-labels)         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. App Shell Implementation Pattern

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        APP SHELL IMPLEMENTATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ROUTING STRUCTURE (React Router example):                                  │
│                                                                              │
│  <Routes>                                                                   │
│    {/* Level 0: No shell */}                                               │
│    <Route path="/auth/*" element={<RootShell><AuthPages /></RootShell>} /> │
│    <Route path="/select-app" element={<AppSelector />} />                  │
│                                                                              │
│    {/* Level 1: App shell */}                                              │
│    <Route path="/:appSlug" element={<AppShell />}>                         │
│      <Route path="select-org" element={<OrgSelector />} />                 │
│      <Route path="style-guide/*" element={<StyleGuide />} />               │
│      <Route path="account/*" element={<AccountRoutes />} />                │
│                                                                              │
│      {/* Level 2: Org shell (nested) */}                                   │
│      <Route path=":orgSlug" element={<OrgShell />}>                        │
│        <Route path="dashboard" element={<Dashboard />} />                  │
│        <Route path="admin/*" element={<AdminRoutes />} />                  │
│        {/* App-specific routes injected here */}                           │
│        <Route path="*" element={<AppSpecificRoutes />} />                  │
│      </Route>                                                               │
│    </Route>                                                                 │
│  </Routes>                                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. AppShell Component

```tsx
// packages/experience/shell/src/AppShell.tsx
export const AppShell = () => {
  const { appSlug } = useParams();
  const { data: appConfig } = useAppConfig(appSlug);

  return (
    <AppThemeProvider tokens={appConfig?.themeTokens}>
      <AppHeader
        logo={appConfig?.logo}
        appName={appConfig?.name}
        navigation={appConfig?.topNavItems}
      />
      <main className="app-shell__content">
        <Outlet /> {/* OrgShell or level-1 pages */}
      </main>
    </AppThemeProvider>
  );
};
```

---

## 7. OrgShell Component

```tsx
// packages/experience/shell/src/OrgShell.tsx
export const OrgShell = () => {
  const { appSlug, orgSlug } = useParams();
  const { data: orgConfig } = useOrgConfig(orgSlug);
  const { data: appConfig } = useAppConfig(appSlug);

  // Merge app sidebar items with org-specific items
  const sidebarItems = mergeSidebarItems(
    appConfig?.sidebarItems,
    orgConfig?.sidebarOverrides
  );

  return (
    <OrgThemeProvider tokens={orgConfig?.themeOverrides}>
      <div className="org-shell">
        <Sidebar items={sidebarItems} />
        <div className="org-shell__main">
          <Outlet /> {/* Feature pages */}
        </div>
      </div>
    </OrgThemeProvider>
  );
};
```

