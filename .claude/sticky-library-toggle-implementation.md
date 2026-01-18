# Sticky Library Toggle - Implementation Complete

## Overview

The data-visualization section now has a **sticky library toggle** that allows users to switch between Recharts and visx for all chart demos in the section.

---

## ✅ What Was Implemented

### 1. **ChartLibraryContext** - Section-Wide State Management
**Files**:
- `packages/features/style-guide/src/contexts/ChartLibraryContext.tsx`
- `packages/features/style-guide/src/contexts/index.ts`

Provides shared state for library selection across the entire data-visualization section:

```tsx
export const ChartLibraryProvider: React.FC<ChartLibraryProviderProps> = ({
    children,
    defaultLibrary = 'recharts',
}) => {
    const [library, setLibrary] = useState<ChartLibraryType>(defaultLibrary);

    return (
        <ChartLibraryContext.Provider value={{ library, setLibrary }}>
            {children}
        </ChartLibraryContext.Provider>
    );
};
```

### 2. **StickyLibraryToggle** - Persistent Toggle Component
**Files**:
- `packages/features/style-guide/src/components/StickyLibraryToggle/StickyLibraryToggle.tsx`
- `packages/features/style-guide/src/components/StickyLibraryToggle/styles.scss`
- `packages/features/style-guide/src/components/StickyLibraryToggle/index.ts`

A sticky toggle that remains visible at the top of the data-visualization section:

```tsx
export const StickyLibraryToggle: React.FC = () => {
    const { library, setLibrary } = useChartLibrarySelection();

    return (
        <div className="sticky-library-toggle">
            <LibraryToggle value={library} onChange={setLibrary} />
        </div>
    );
};
```

**CSS Features**:
- `position: sticky; top: 0;` - Stays visible while scrolling
- `z-index: 100;` - Above content
- `box-shadow` - Visual separation
- Dark mode support

### 3. **Updated ChartLibraryDemo** - Uses Context Instead of Local State
**File**: `packages/features/style-guide/src/components/ChartLibraryDemo/ChartLibraryDemo.tsx`

Now reads library selection from context instead of managing its own state:

```tsx
export const ChartLibraryDemo: React.FC<ChartLibraryDemoProps> = ({
    children,
    className = '',
}) => {
    const { library } = useChartLibrarySelection(); // ← From context

    const adapter = library === 'visx' ? VISXAdapter : RechartsAdapter;

    return (
        <div className="chart-library-demo">
            <ChartProvider adapter={adapter}>
                {children}
            </ChartProvider>
        </div>
    );
};
```

**Changes**:
- ❌ Removed local `useState` for library
- ❌ Removed `showToggle` prop (toggle is now sticky at section level)
- ❌ Removed `defaultLibrary` prop (controlled by section context)
- ✅ Now uses `useChartLibrarySelection()` hook

### 4. **Updated StyleGuideShell** - Wraps Data-Visualization Section
**File**: `packages/features/style-guide/src/pages/StyleGuideShell.tsx`

Added conditional wrapper for the data-visualization section:

```tsx
// Added imports
import {
    ComponentDocPage,
    FoundationDocPage,
    RegistryContext,
    DemoCard,
    ChartLibraryProvider,      // ← NEW
    StickyLibraryToggle,       // ← NEW
    useStyleGuideNavigation,
    type ComponentRegistry,
    type ComponentRegistration
} from '../index';

// Added wrapper function
const wrapContentWithProvider = (content: React.ReactNode) => {
    if (activeSection === 'data-visualization') {
        return (
            <ChartLibraryProvider>
                <StickyLibraryToggle />
                {content}
            </ChartLibraryProvider>
        );
    }
    return <>{content}</>;
};

// Updated content rendering
{wrapContentWithProvider(renderContent())}
```

**Applied to both**:
- Desktop layout (line ~290)
- Mobile layout (line ~220)

---

## 🎯 User Experience

### Before
- Each chart demo had its own toggle
- Toggling one chart didn't affect others
- Repetitive UI

### After
- **One sticky toggle** at the top of the data-visualization section
- Toggling affects **all charts** in the section simultaneously
- Toggle **stays visible** while scrolling
- **Cleaner UI** - no toggle clutter in individual demos

---

## 🏗️ Architecture

```
StyleGuideShell (when activeSection === 'data-visualization')
└── ChartLibraryProvider (provides library state)
    ├── StickyLibraryToggle (sticky at top)
    └── Content
        └── BarChart Demos
            └── ChartLibraryDemo
                └── ChartProvider (uses library from context)
                    └── BarChart (uses adapter from provider)
```

### State Flow

1. **User clicks toggle** → `StickyLibraryToggle`
2. **Updates context** → `ChartLibraryContext`
3. **All demos react** → `ChartLibraryDemo` components
4. **Charts re-render** → With new adapter (Recharts ↔ visx)

---

## 📁 Files Changed

### New Files
```
packages/features/style-guide/src/
├── contexts/
│   ├── ChartLibraryContext.tsx  # NEW
│   └── index.ts                  # NEW
└── components/
    └── StickyLibraryToggle/
        ├── StickyLibraryToggle.tsx  # NEW
        ├── styles.scss               # NEW
        └── index.ts                  # NEW
```

### Modified Files
```
packages/features/style-guide/src/
├── index.ts                                # Added exports
├── pages/StyleGuideShell.tsx               # Added provider wrapper
└── components/ChartLibraryDemo/
    └── ChartLibraryDemo.tsx                # Uses context instead of state
```

---

## 🎨 Styling

### Sticky Toggle CSS
```scss
.sticky-library-toggle {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-surface-default);
    border-bottom: 1px solid var(--color-border-default);
    box-shadow: var(--shadow-sm);
    margin: 0 calc(-1 * var(--spacing-6)) var(--spacing-6);
    padding: var(--spacing-4) var(--spacing-6);
}
```

**Features**:
- Full-width (negative margin to extend beyond container)
- Subtle shadow for depth
- Matches design system colors
- Responsive to theme changes

---

## 🔄 Migration Guide

### For Existing Demos

**Before**:
```tsx
<ChartLibraryDemo showToggle={true}>
  <BarChart data={data} />
</ChartLibraryDemo>
```

**After**:
```tsx
<ChartLibraryDemo>
  <BarChart data={data} />
</ChartLibraryDemo>
```

**Changes**:
- ❌ Remove `showToggle` prop (no longer exists)
- ❌ Remove `defaultLibrary` prop (controlled by section)
- ✅ Component automatically uses context

---

## 🧪 Testing

### Manual Test Steps

1. Navigate to data-visualization section in style guide
2. Observe sticky toggle at top of page
3. Scroll down - toggle should remain visible
4. Click toggle to switch to visx
5. **All charts should update simultaneously**
6. Scroll to different chart - verify it uses selected library
7. Switch back to Recharts - all charts update
8. Navigate to different section - no toggle visible
9. Return to data-visualization - toggle reappears

---

## 💡 Key Benefits

### 1. **Unified Control**
- One toggle controls all charts
- Consistent library selection across section

### 2. **Better UX**
- Sticky positioning keeps toggle accessible
- No need to scroll back to toggle
- Less UI clutter

### 3. **Performance**
- Single state instance (not per-demo)
- Context prevents unnecessary re-renders

### 4. **Maintainability**
- Centralized library selection logic
- Easier to add new chart demos
- Consistent behavior across section

---

## 🔧 Technical Details

### Context API Pattern

**Provider Hierarchy**:
```tsx
<ChartLibraryProvider>          // Section-level
  <StickyLibraryToggle />        // Controls state
  <ChartLibraryDemo>             // Reads state
    <ChartProvider adapter={...}> // Uses state
      <Chart />                  // Renders with adapter
    </ChartProvider>
  </ChartLibraryDemo>
</ChartLibraryProvider>
```

### Conditional Wrapping

Only data-visualization section gets the provider:

```tsx
const wrapContentWithProvider = (content: React.ReactNode) => {
    if (activeSection === 'data-visualization') {
        return (
            <ChartLibraryProvider>
                <StickyLibraryToggle />
                {content}
            </ChartLibraryProvider>
        );
    }
    return <>{content}</>; // Other sections unchanged
};
```

---

## 🎉 Summary

### What Changed

- ✅ Added `ChartLibraryContext` for shared state
- ✅ Created `StickyLibraryToggle` component with sticky positioning
- ✅ Updated `ChartLibraryDemo` to use context
- ✅ Modified `StyleGuideShell` to wrap data-visualization section
- ✅ Exported all new components in main index

### User Impact

- **Better UX**: One sticky toggle for entire section
- **Cleaner UI**: No individual toggles per demo
- **Easier comparison**: Switch all charts at once
- **Always accessible**: Sticky positioning

### Developer Impact

- **Simpler demos**: No toggle management in demos
- **Consistent**: All charts use same library
- **Maintainable**: Centralized state management

---

## 🚀 Next Steps

### Optional Enhancements

1. **Add transition animations** when switching libraries
2. **Save preference** to localStorage
3. **Add keyboard shortcut** for toggle (e.g., Shift+L)
4. **Show library info** tooltip (features, use cases)
5. **Add performance metrics** comparison

### Extending to Other Sections

This pattern can be reused for other sections needing shared state:

```tsx
// Example: Theme preview section
const wrapContentWithProvider = (content: React.ReactNode) => {
    if (activeSection === 'data-visualization') {
        return (
            <ChartLibraryProvider>
                <StickyLibraryToggle />
                {content}
            </ChartLibraryProvider>
        );
    }

    if (activeSection === 'theme-preview') {
        return (
            <ThemeVariantProvider>
                <StickyThemeToggle />
                {content}
            </ThemeVariantProvider>
        );
    }

    return <>{content}</>;
};
```

---

**Implementation Status**: ✅ Complete
**Testing Status**: ⏳ Pending manual testing
**Documentation**: ✅ Complete
