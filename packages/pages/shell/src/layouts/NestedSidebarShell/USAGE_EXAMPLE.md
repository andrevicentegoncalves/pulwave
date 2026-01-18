# NestedSidebarShell - Complete Usage Example

## AdminShell Example

### Before (Manual Implementation)

```tsx
<SectionLayout
  sidebar={
    <div className="admin-shell__nav-sidebar">
      <button
        className="admin-shell__nav-toggle"
        onClick={() => setIsSecondarySidebarExpanded(!isSecondarySidebarExpanded)}
      >
        {isSecondarySidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
      </button>
      <Menu
        items={ADMIN_NAV_ITEMS}
        activeItem={location.pathname}
        onItemClick={handleMenuClick}
      />
    </div>
  }
>
  {children}
</SectionLayout>
```

### After (With NestedSidebarShell)

```tsx
import { NestedSidebarShell } from '@pulwave/pages-shell';

<SectionLayout
  isExpanded={isSecondarySidebarExpanded}
  onExpandedChange={setIsSecondarySidebarExpanded}
  sidebar={
    <NestedSidebarShell
      variant="white"
      isExpanded={isSecondarySidebarExpanded}
      onExpandedChange={setIsSecondarySidebarExpanded}
    >
      <Menu
        items={ADMIN_NAV_ITEMS}
        activeItem={location.pathname}
        onItemClick={handleMenuClick}
      />
    </NestedSidebarShell>
  }
>
  {children}
</SectionLayout>
```

## Complete AdminShell Integration

```tsx
/**
 * AdminShell with NestedSidebarShell
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    AppShell,
    BaseSidebarLayout,
    HeaderShell,
    SidebarShell,
    NestedSidebarShell, // NEW: Import NestedSidebarShell
} from '@pulwave/pages-shell';
import { SectionLayout } from '@pulwave/widgets';
import { Menu, Sidebar } from '@pulwave/features-layout';

const ADMIN_NAV_ITEMS = [
    { id: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { id: '/admin/users', icon: Users, label: 'Users' },
    { id: '/admin/settings', icon: Settings, label: 'Settings' },
];

export const AdminShell: React.FC<AdminShellProps> = ({ user, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSecondarySidebarExpanded, setIsSecondarySidebarExpanded] = useState(true);

    const handleMenuClick = useCallback((path: string) => {
        navigate(path);
    }, [navigate]);

    return (
        <AppShell>
            <BaseSidebarLayout
                sidebar={
                    <SidebarShell>
                        <Sidebar
                            variant="primary"
                            items={PRIMARY_SIDEBAR_ITEMS}
                            user={user}
                            onLogout={onLogout}
                        />
                    </SidebarShell>
                }
            >
                <HeaderShell title="Admin Dashboard" />

                <SectionLayout
                    sidebarVariant="white"
                    isExpanded={isSecondarySidebarExpanded}
                    onExpandedChange={setIsSecondarySidebarExpanded}
                    sidebar={
                        <NestedSidebarShell
                            variant="white"
                            isExpanded={isSecondarySidebarExpanded}
                            onExpandedChange={setIsSecondarySidebarExpanded}
                        >
                            <Menu
                                items={ADMIN_NAV_ITEMS}
                                activeItem={location.pathname}
                                onItemClick={handleMenuClick}
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

## Benefits

1. **Cleaner Code**: No manual toggle button implementation
2. **Consistent UX**: Standardized toggle behavior across all sidebars
3. **Maintainable**: Styling and behavior centralized in one component
4. **Reusable**: Works with any Menu implementation
5. **Accessible**: Built-in aria labels and keyboard support

## Custom Styling

You can override styles if needed:

```tsx
<NestedSidebarShell
  className="my-custom-sidebar"
  variant="white"
>
  <Menu items={items} />
</NestedSidebarShell>
```

```scss
.my-custom-sidebar {
  // Override default styles
  .nested-sidebar-shell__toggle {
    background: var(--color-brand-primary);
    color: white;
  }
}
```

## Without Toggle Button

```tsx
<NestedSidebarShell showToggle={false}>
  <Menu items={items} />
</NestedSidebarShell>
```

## Uncontrolled Mode (Internal State)

```tsx
// Component manages its own expanded state
<NestedSidebarShell>
  <Menu items={items} />
</NestedSidebarShell>
```
