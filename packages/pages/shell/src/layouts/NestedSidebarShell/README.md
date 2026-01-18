# NestedSidebarShell

Out-of-the-box secondary sidebar shell with toggle functionality and white variant styling.

> **For AI/Claude Integration**: See [CLAUDE.md](./CLAUDE.md) for comprehensive integration guide with NestedMenu and SectionLayout.

## Features

- Drop-in wrapper for Menu components
- Built-in collapse/expand toggle
- Controlled or uncontrolled mode
- White/Neutral/Primary variants
- Works seamlessly with existing Menu components

## Usage

### Basic Example

```tsx
import { NestedSidebarShell } from '@pulwave/pages-shell';
import { Menu } from '@pulwave/features-layout';

const MENU_ITEMS = [
  { id: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { id: '/admin/users', icon: Users, label: 'Users' },
  { id: '/admin/settings', icon: Settings, label: 'Settings' }
];

function MyComponent() {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <NestedSidebarShell
      variant="white"
      isExpanded={isExpanded}
      onExpandedChange={setIsExpanded}
      showToggle={true}
    >
      <Menu
        items={MENU_ITEMS}
        activeItem={location.pathname}
        onItemClick={(path) => navigate(path)}
        isCollapsed={false}
      />
    </NestedSidebarShell>
  );
}
```

### Replace Existing Pattern

**Before (manual toggle button):**

```tsx
<div className="admin-shell__nav-sidebar">
  <button
    className="admin-shell__nav-toggle"
    onClick={() => setIsExpanded(!isExpanded)}
  >
    {isExpanded ? <ChevronLeft /> : <ChevronRight />}
  </button>
  <Menu
    items={ADMIN_NAV_ITEMS}
    activeItem={location.pathname}
    onItemClick={handleMenuClick}
    isCollapsed={false}
  />
</div>
```

**After (with NestedSidebarShell):**

```tsx
<NestedSidebarShell
  isExpanded={isExpanded}
  onExpandedChange={setIsExpanded}
>
  <Menu
    items={ADMIN_NAV_ITEMS}
    activeItem={location.pathname}
    onItemClick={handleMenuClick}
    isCollapsed={false}
  />
</NestedSidebarShell>
```

### In SectionLayout Sidebar Prop

```tsx
<SectionLayout
  stickySidebar
  sidebarVariant="white"
  isExpanded={isSecondarySidebarExpanded}
  onExpandedChange={setIsSecondarySidebarExpanded}
  sidebar={
    <NestedSidebarShell
      isExpanded={isSecondarySidebarExpanded}
      onExpandedChange={setIsSecondarySidebarExpanded}
    >
      <Menu
        items={navigationItems}
        activeItem={activeItem}
        onItemClick={onNavigate}
      />
    </NestedSidebarShell>
  }
>
  {/* Your content */}
</SectionLayout>
```

### Uncontrolled Mode

```tsx
<NestedSidebarShell>
  <Menu items={items} activeItem={activeItem} onItemClick={handleClick} />
</NestedSidebarShell>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Menu component or custom content |
| `isExpanded` | `boolean` | `undefined` | Controlled expanded state |
| `onExpandedChange` | `(expanded: boolean) => void` | `undefined` | Callback when expanded state changes |
| `showToggle` | `boolean` | `true` | Show/hide toggle button |
| `variant` | `'white' \| 'neutral' \| 'primary'` | `'white'` | Color variant |
| `className` | `string` | - | Additional CSS classes |

## Variants

### White (Default)
```tsx
<NestedSidebarShell variant="white">
  <Menu items={items} />
</NestedSidebarShell>
```

### Neutral
```tsx
<NestedSidebarShell variant="neutral">
  <Menu items={items} />
</NestedSidebarShell>
```

### Primary
```tsx
<NestedSidebarShell variant="primary">
  <Menu items={items} />
</NestedSidebarShell>
```

## Styling

The component uses BEM-style classes:

- `.nested-sidebar-shell` - Root container
- `.nested-sidebar-shell__toggle` - Toggle button
- `.nested-sidebar-shell__content` - Content wrapper
- `.nested-sidebar-shell--white` - White variant
- `.nested-sidebar-shell--neutral` - Neutral variant
- `.nested-sidebar-shell--primary` - Primary variant
- `.nested-sidebar-shell--collapsed` - Collapsed state

## With Custom Content

You can pass any content, not just Menu components:

```tsx
<NestedSidebarShell>
  <CustomNavigationTree data={treeData} />
</NestedSidebarShell>
```

## Accessibility

- Toggle button includes `aria-label` and `title` attributes
- Keyboard accessible (button can be focused and activated)
- Proper focus management with `:focus-visible`
