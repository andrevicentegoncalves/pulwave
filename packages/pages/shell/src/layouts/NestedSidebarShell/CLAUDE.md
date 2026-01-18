# NestedSidebarShell - Claude Integration Guide

> Complete guide for implementing nested sidebar navigation with NestedSidebarShell, NestedMenu, and SectionLayout.

## Quick Start (TL;DR)

```tsx
import { SectionLayout } from '@pulwave/widgets';
import { NestedSidebarShell } from '@pulwave/pages-shell';
import { NestedMenu, type NavigationItem } from '@pulwave/features-layout';

const [isExpanded, setIsExpanded] = useState(true);

<SectionLayout
    isExpanded={isExpanded}
    onExpandedChange={setIsExpanded}
    sidebar={
        <NestedSidebarShell isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
            <NestedMenu
                sections={NAV_SECTIONS}
                activeSection={activeSection}
                activeCategory={activeCategory}
                activeItem={activeItem}
                onSelect={handleSelect}
                isCollapsed={!isExpanded}  // CRITICAL: Must pass explicitly!
            />
        </NestedSidebarShell>
    }
>
    {children}
</SectionLayout>
```

---

## Architecture Overview

```
Parent Component (owns state: isExpanded, activeSection, activeCategory, activeItem)
    |
    +-- SectionLayout (controls grid layout width)
    |       |-- injects props via cloneElement
    |       +-- applies sidebar width CSS variables
    |
    +-- NestedSidebarShell (provides toggle UI)
    |       |-- filters SectionLayout-injected props
    |       +-- renders toggle button + scrollable content
    |
    +-- NestedMenu (renders navigation hierarchy)
            |-- needs explicit isCollapsed prop
            +-- handles section -> category -> item hierarchy
```

### Why State Must Be Shared

The same `isExpanded` state must be passed to **three** places:
1. **SectionLayout** - Controls the CSS grid column width
2. **NestedSidebarShell** - Controls the toggle button icon direction
3. **NestedMenu** - Controls icon-only vs full label display (`isCollapsed`)

If these are out of sync, the UI will misbehave (e.g., wide sidebar with icons only).

---

## Navigation Data Structure

### Type Definition

```typescript
import { type NavigationItem } from '@pulwave/features-layout';

// NavigationItem interface:
interface NavigationItem {
    id: string;                    // Unique ID (for flat items, use full path like '/admin')
    label: string;                 // Display label
    icon?: React.ElementType;      // Lucide-react style icon component
    categories?: {                 // Optional nested categories
        id: string;                // Category ID (e.g., 'geography')
        label: string;             // Display label (e.g., 'Geography')
        icon?: React.ElementType;  // Category icon
        items?: string[];          // Array of item IDs (strings)
    }[];
}
```

### Flat Items (No Nesting)

For simple navigation items without subcategories:

```typescript
const NAV_SECTIONS: NavigationItem[] = [
    { id: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { id: '/admin/users', icon: Users, label: 'Users' },
    { id: '/admin/settings', icon: Settings, label: 'Settings' },
];
```

### Nested Items (With Categories)

For items with subcategories:

```typescript
const NAV_SECTIONS: NavigationItem[] = [
    { id: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { id: '/admin/users', icon: Users, label: 'Users' },
    {
        id: '/admin/master-data',
        icon: Database,
        label: 'Master Data',
        categories: [
            {
                id: 'geography',
                label: 'Geography',
                icon: Globe,
                items: ['countries', 'admin_divisions', 'localities']
            },
            {
                id: 'system',
                label: 'System',
                icon: Settings,
                items: ['locales', 'timezones', 'currencies']
            }
        ]
    },
    { id: '/admin/audit-logs', icon: ScrollText, label: 'Audit Logs' },
];
```

### Item ID to Label Formatting

Item IDs (strings in `items` array) are auto-formatted to labels:
- `'countries'` → `'Countries'`
- `'admin_divisions'` → `'Admin Divisions'`
- `'user-roles'` → `'User Roles'`

The formatting converts kebab-case and snake_case to Title Case.

---

## Creating a Navigation Hook

For complex navigation with URL-based routing, create a dedicated hook.

### Pattern: useAdminNavigation

```typescript
// packages/pages/admin/src/hooks/useAdminNavigation.ts
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface AdminNavigation {
    activeSection: string;
    activeCategory: string;
    activeItem: string;
    handleSelect: (itemId: string, categoryId?: string, sectionId?: string) => void;
}

export function useAdminNavigation(): AdminNavigation {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [activeItem, setActiveItem] = useState('');

    // Parse URL to determine active states
    useEffect(() => {
        const pathname = location.pathname;

        // Handle nested routes: /admin/master-data/{itemKey}
        if (pathname.startsWith('/admin/master-data/')) {
            const itemKey = pathname.split('/admin/master-data/')[1];
            setActiveSection('/admin/master-data');
            setActiveItem(itemKey || '');

            // Map item to category
            const categoryMap: Record<string, string> = {
                'countries': 'geography',
                'admin_divisions': 'geography',
                'localities': 'geography',
                'locales': 'system',
                'timezones': 'system',
                'currencies': 'system',
            };
            setActiveCategory(categoryMap[itemKey] || '');

        } else if (pathname === '/admin/master-data') {
            setActiveSection('/admin/master-data');
            setActiveCategory('');
            setActiveItem('');

        } else {
            // Flat routes (Dashboard, Users, etc.)
            setActiveSection(pathname);
            setActiveCategory('');
            setActiveItem(pathname);  // For flat items, item ID equals section ID
        }
    }, [location.pathname]);

    // Handle navigation
    const handleSelect = useCallback((itemId: string, categoryId?: string, sectionId?: string) => {
        if (itemId.startsWith('/admin/')) {
            // Flat item - navigate directly
            navigate(itemId);
        } else {
            // Nested item - construct path
            navigate(`/admin/master-data/${itemId}`);
        }
    }, [navigate]);

    return { activeSection, activeCategory, activeItem, handleSelect };
}
```

---

## Complete Integration Examples

### Example 1: Admin Dashboard (URL-based Routing)

```tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { AppShell, BaseSidebarLayout, HeaderShell, SidebarShell, NestedSidebarShell } from '@pulwave/pages-shell';
import { SectionLayout } from '@pulwave/widgets';
import { NestedMenu, Sidebar, type NavigationItem } from '@pulwave/features-layout';
import { LayoutDashboard, Users, Database, Globe, Settings } from '@pulwave/ui';
import { useAdminNavigation } from '../hooks';

const ADMIN_NAV_SECTIONS: NavigationItem[] = [
    { id: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { id: '/admin/users', icon: Users, label: 'Users' },
    {
        id: '/admin/master-data',
        icon: Database,
        label: 'Master Data',
        categories: [
            { id: 'geography', label: 'Geography', icon: Globe, items: ['countries', 'localities'] },
            { id: 'system', label: 'System', icon: Settings, items: ['locales', 'timezones'] }
        ]
    },
];

export const AdminShell: React.FC<{ user?: UserData; onLogout?: () => void }> = ({ user, onLogout }) => {
    // Navigation state from hook
    const { activeSection, activeCategory, activeItem, handleSelect } = useAdminNavigation();

    // UI state
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isSecondarySidebarExpanded, setIsSecondarySidebarExpanded] = useState(true);

    return (
        <AppShell>
            <BaseSidebarLayout
                sidebarCollapsed={!isSidebarExpanded}
                sidebar={
                    <SidebarShell isCollapsed={!isSidebarExpanded}>
                        <Sidebar
                            variant="primary"
                            isExpanded={isSidebarExpanded}
                            toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
                            items={[{ id: '/', icon: Home, label: 'Home', path: '/' }]}
                            user={user}
                            onLogout={onLogout}
                        />
                    </SidebarShell>
                }
            >
                <HeaderShell title="Admin" />
                <SectionLayout
                    stickySidebar
                    sidebarVariant="white"
                    isExpanded={isSecondarySidebarExpanded}
                    onExpandedChange={setIsSecondarySidebarExpanded}
                    sidebar={
                        <NestedSidebarShell
                            variant="white"
                            isExpanded={isSecondarySidebarExpanded}
                            onExpandedChange={setIsSecondarySidebarExpanded}
                        >
                            <NestedMenu
                                sections={ADMIN_NAV_SECTIONS}
                                activeItem={activeItem}
                                activeCategory={activeCategory}
                                activeSection={activeSection}
                                onSelect={handleSelect}
                                size="md"
                                spacing="normal"
                                isCollapsed={!isSecondarySidebarExpanded}
                                variant="white"
                            />
                        </NestedSidebarShell>
                    }
                >
                    <Outlet />
                </SectionLayout>
            </BaseSidebarLayout>
        </AppShell>
    );
};
```

### Example 2: Style Guide (Hash-based Routing)

For apps using hash-based navigation instead of React Router:

```tsx
const { activeSection, activeCategory, activeItem, handleSelect } = useStyleGuideNavigation(navigationData);

// In useStyleGuideNavigation:
const handleSelect = useCallback((itemId: string, categoryId: string, sectionId: string) => {
    setActiveSection(sectionId);
    setActiveCategory(categoryId);
    setActiveItem(itemId);
    window.location.hash = `#/${sectionId}/${categoryId}/${itemId}`;
}, []);
```

---

## Common Pitfalls

### 1. Forgetting `isCollapsed` on NestedMenu

**WRONG:**
```tsx
<NestedMenu
    sections={sections}
    activeItem={activeItem}
    onSelect={handleSelect}
    // Missing isCollapsed!
/>
```

**CORRECT:**
```tsx
<NestedMenu
    sections={sections}
    activeItem={activeItem}
    onSelect={handleSelect}
    isCollapsed={!isExpanded}  // REQUIRED for icon-only mode
/>
```

### 2. State Out of Sync

**WRONG:**
```tsx
<SectionLayout isExpanded={sectionExpanded}>
    <NestedSidebarShell isExpanded={shellExpanded}>  {/* Different state! */}
        <NestedMenu isCollapsed={!menuCollapsed} />  {/* Another different state! */}
    </NestedSidebarShell>
</SectionLayout>
```

**CORRECT:**
```tsx
const [isExpanded, setIsExpanded] = useState(true);

<SectionLayout isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
    <NestedSidebarShell isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
        <NestedMenu isCollapsed={!isExpanded} />
    </NestedSidebarShell>
</SectionLayout>
```

### 3. Expecting Variants to Style Background

The `variant` prop on NestedSidebarShell is **cosmetic** - the parent SectionLayout's `sidebarVariant` controls the actual background color.

**Use both:**
```tsx
<SectionLayout sidebarVariant="white">
    <NestedSidebarShell variant="white">
        <NestedMenu variant="white" />
    </NestedSidebarShell>
</SectionLayout>
```

### 4. Flat Items Need Full Path as ID

For flat navigation items (no nested categories), the `id` should be the full route path:

**WRONG:**
```tsx
{ id: 'dashboard', label: 'Dashboard' }  // Won't work with URL matching
```

**CORRECT:**
```tsx
{ id: '/admin', label: 'Dashboard' }  // Matches location.pathname
{ id: '/admin/users', label: 'Users' }
```

### 5. Nested Item IDs Should NOT Have Full Path

For nested items inside categories, use just the key name:

**WRONG:**
```tsx
categories: [
    { id: 'geo', items: ['/admin/master-data/countries'] }  // Wrong!
]
```

**CORRECT:**
```tsx
categories: [
    { id: 'geo', items: ['countries', 'localities'] }  // Just the key
]
```

Then in your `handleSelect`, construct the full path:
```tsx
navigate(`/admin/master-data/${itemId}`);
```

---

## Props Reference

### NestedSidebarShell Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Menu component or custom content |
| `isExpanded` | `boolean` | `undefined` | Controlled expanded state |
| `onExpandedChange` | `(expanded: boolean) => void` | - | Callback when state changes |
| `showToggle` | `boolean` | `true` | Show/hide toggle button |
| `variant` | `'white' \| 'neutral' \| 'primary'` | `'white'` | Color variant |
| `className` | `string` | - | Additional CSS classes |

### NestedMenu Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | `NavigationItem[]` | `[]` | Navigation structure |
| `activeItem` | `string` | `''` | Currently active item ID |
| `activeCategory` | `string` | `''` | Currently active category ID |
| `activeSection` | `string` | `''` | Currently active section ID |
| `onSelect` | `(itemId, categoryId, sectionId) => void` | - | Selection callback |
| `isCollapsed` | `boolean` | `false` | Icon-only mode |
| `variant` | `'primary' \| 'neutral' \| 'white'` | `'neutral'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Icon size |
| `spacing` | `'tight' \| 'normal' \| 'relaxed'` | `'tight'` | Gap between items |

### SectionLayout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sidebar` | `ReactNode` | - | Sidebar content |
| `isExpanded` | `boolean` | `undefined` | Controlled sidebar width |
| `onExpandedChange` | `(expanded: boolean) => void` | - | Callback when width changes |
| `sidebarVariant` | `'white' \| 'neutral'` | `'white'` | Sidebar background |
| `stickySidebar` | `boolean` | `false` | Sticky positioning |
| `defaultExpanded` | `boolean` | `true` | Initial state (uncontrolled) |

---

## File Locations

| Component | Package | Import |
|-----------|---------|--------|
| NestedSidebarShell | `@pulwave/pages-shell` | `import { NestedSidebarShell } from '@pulwave/pages-shell'` |
| NestedMenu | `@pulwave/features-layout` | `import { NestedMenu, type NavigationItem } from '@pulwave/features-layout'` |
| SectionLayout | `@pulwave/widgets` | `import { SectionLayout } from '@pulwave/widgets'` |

---

## Reference Implementations

- **AdminShell**: `packages/pages/admin/src/pages/AdminShell.tsx`
- **StyleGuideShell**: `packages/features/style-guide/src/pages/StyleGuideShell.tsx`
- **useAdminNavigation**: `packages/pages/admin/src/hooks/useAdminNavigation.ts`
- **useStyleGuideNavigation**: `packages/features/style-guide/src/hooks/useStyleGuideNavigation.ts`
