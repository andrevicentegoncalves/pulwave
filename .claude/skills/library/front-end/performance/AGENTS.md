# Web Performance & Optimization

**Abstract**: Comprehensive guide to building high-performance web applications with React, focusing on eliminating waterfalls, optimizing bundle size, preventing unnecessary re-renders, and achieving excellent Core Web Vitals. Covers server-side rendering, client-side data fetching, and advanced optimization techniques for modern web apps.

---

## Table of Contents

1. [Performance Fundamentals](#1-performance-fundamentals)
   - 1.1 [Core Web Vitals](#11-core-web-vitals) (CRITICAL)
   - 1.2 [Performance Budget](#12-performance-budget) (CRITICAL)
   - 1.3 [Measurement Tools](#13-measurement-tools) (CRITICAL)
   - 1.4 [80/20 Rule](#14-8020-rule) (CRITICAL)

2. [Eliminating Waterfalls](#2-eliminating-waterfalls)
   - 2.1 [Parallel Data Fetching](#21-parallel-data-fetching) (CRITICAL)
   - 2.2 [Deferred Awaits](#22-deferred-awaits) (CRITICAL)
   - 2.3 [Request Deduplication](#23-request-deduplication) (CRITICAL)
   - 2.4 [Prefetching](#24-prefetching) (HIGH)

3. [Bundle Size Optimization](#3-bundle-size-optimization)
   - 3.1 [Avoid Barrel Imports](#31-avoid-barrel-imports) (CRITICAL)
   - 3.2 [Dynamic Imports](#32-dynamic-imports) (CRITICAL)
   - 3.3 [Tree Shaking](#33-tree-shaking) (CRITICAL)
   - 3.4 [Bundle Analysis](#34-bundle-analysis) (HIGH)

4. [Re-render Optimization](#4-re-render-optimization)
   - 4.1 [React.memo](#41-reactmemo) (HIGH)
   - 4.2 [useMemo and useCallback](#42-usememo-and-usecallback) (HIGH)
   - 4.3 [State Colocation](#43-state-colocation) (CRITICAL)
   - 4.4 [Component Composition](#44-component-composition) (HIGH)
   - 4.5 [Context Optimization](#45-context-optimization) (HIGH)
   - 4.6 [Ref Usage](#46-ref-usage) (MEDIUM)
   - 4.7 [Key Optimization](#47-key-optimization) (MEDIUM)

5. [Rendering Performance](#5-rendering-performance)
   - 5.1 [Virtual Scrolling](#51-virtual-scrolling) (HIGH)
   - 5.2 [Debouncing and Throttling](#52-debouncing-and-throttling) (HIGH)
   - 5.3 [CSS Animations](#53-css-animations) (HIGH)
   - 5.4 [will-change Property](#54-will-change-property) (MEDIUM)
   - 5.5 [Layout Thrashing](#55-layout-thrashing) (HIGH)
   - 5.6 [requestAnimationFrame](#56-requestanimationframe) (MEDIUM)

6. [JavaScript Performance](#6-javascript-performance)
   - 6.1 [Array Operations](#61-array-operations) (MEDIUM)
   - 6.2 [Object Operations](#62-object-operations) (MEDIUM)
   - 6.3 [String Operations](#63-string-operations) (LOW)
   - 6.4 [Web Workers](#64-web-workers) (HIGH)
   - 6.5 [Async Iterators](#65-async-iterators) (LOW)
   - 6.6 [Memory Leaks](#66-memory-leaks) (HIGH)

7. [Client-Side Data Fetching](#7-client-side-data-fetching)
   - 7.1 [TanStack Query Optimization](#71-tanstack-query-optimization) (CRITICAL)
   - 7.2 [Prefetching Strategies](#72-prefetching-strategies) (HIGH)
   - 7.3 [Optimistic Updates](#73-optimistic-updates) (MEDIUM)

8. [Image Optimization](#8-image-optimization)
   - 8.1 [Next.js Image Component](#81-nextjs-image-component) (CRITICAL)
   - 8.2 [Lazy Loading](#82-lazy-loading) (HIGH)
   - 8.3 [Format Selection](#83-format-selection) (HIGH)
   - 8.4 [Responsive Images](#84-responsive-images) (MEDIUM)

9. [Advanced Patterns](#9-advanced-patterns)
   - 9.1 [Suspense and Streaming](#91-suspense-and-streaming) (HIGH)
   - 9.2 [Server Components](#92-server-components) (CRITICAL)
   - 9.3 [Edge Runtime](#93-edge-runtime) (HIGH)

10. [Pulwave Integration](#10-pulwave-integration)
    - 10.1 [Monorepo Performance](#101-monorepo-performance) (CRITICAL)
    - 10.2 [TanStack Query Setup](#102-tanstack-query-setup) (CRITICAL)
    - 10.3 [Build Optimization](#103-build-optimization) (HIGH)

**Appendix**
- [A. Performance Checklist](#appendix-a-performance-checklist)
- [B. Bundle Analysis Guide](#appendix-b-bundle-analysis-guide)
- [C. Profiling Guide](#appendix-c-profiling-guide)
- [D. Core Web Vitals Targets](#appendix-d-core-web-vitals-targets)

---

## 1. Performance Fundamentals

### 1.1 Core Web Vitals (CRITICAL)

Understand and optimize for the three Core Web Vitals metrics.

**Core Web Vitals**:
```
1. LCP (Largest Contentful Paint)
   - Measures: Loading performance
   - Target: < 2.5 seconds
   - Affects: How quickly main content appears
   - Improvements:
     * Optimize images
     * Remove render-blocking resources
     * Improve server response times

2. INP (Interaction to Next Paint)
   - Measures: Responsiveness
   - Target: < 200ms
   - Affects: How quickly UI responds to clicks
   - Improvements:
     * Debounce expensive operations
     * Use Web Workers for heavy tasks
     * Optimize JavaScript execution

3. CLS (Cumulative Layout Shift)
   - Measures: Visual stability
   - Target: < 0.1
   - Affects: Unexpected layout shifts
   - Improvements:
     * Set image/video dimensions
     * Reserve space for dynamic content
     * Avoid inserting content above existing content
```

**Measuring Core Web Vitals**:
```typescript
// Use web-vitals library
import { onCLS, onINP, onLCP } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating,
  });

  // Send to your analytics endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', body);
  } else {
    fetch('/analytics', { body, method: 'POST', keepalive: true });
  }
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
```

### 1.2 Performance Budget (CRITICAL)

Set and enforce performance budgets.

**Pulwave Performance Budget**:
```json
// lighthouse-budget.json
{
  "path": "/*",
  "timings": [
    {
      "metric": "first-contentful-paint",
      "budget": 1500
    },
    {
      "metric": "largest-contentful-paint",
      "budget": 2500
    },
    {
      "metric": "interactive",
      "budget": 3500
    }
  ],
  "resourceSizes": [
    {
      "resourceType": "script",
      "budget": 300
    },
    {
      "resourceType": "stylesheet",
      "budget": 50
    },
    {
      "resourceType": "image",
      "budget": 200
    },
    {
      "resourceType": "total",
      "budget": 600
    }
  ]
}
```

### 1.3 Measurement Tools (CRITICAL)

Use the right tools to measure performance.

**Performance Measurement Stack**:
```bash
# 1. Lighthouse CI (automated performance checks)
npm install -g @lhci/cli

lhci autorun --config=lighthouserc.json

# 2. Bundle analysis
npm run build
npx vite-bundle-visualizer

# 3. React DevTools Profiler
# Enable in development mode
# Record user interactions and analyze re-renders

# 4. Chrome DevTools Performance tab
# Record runtime performance
# Analyze long tasks, layout shifts

# 5. Web Vitals monitoring
npm install web-vitals
```

### 1.4 80/20 Rule (CRITICAL)

Focus on high-impact optimizations first.

**Performance Impact Hierarchy**:
```
CRITICAL (80% of wins):
1. Eliminate network waterfalls
2. Reduce bundle size (code splitting)
3. Optimize images (next/image)
4. Fix state colocation issues

HIGH (15% of wins):
5. Prevent unnecessary re-renders
6. Virtual scrolling for long lists
7. Debounce expensive operations

MEDIUM (4% of wins):
8. Use React.memo selectively
9. Optimize CSS animations
10. Web Workers for heavy computations

LOW (1% of wins):
11. Micro-optimize array operations
12. Use for loops instead of forEach
13. Optimize string concatenation
```

---

## 2. Eliminating Waterfalls

### 2.1 Parallel Data Fetching (CRITICAL)

Fetch data in parallel, not sequentially.

**Incorrect** - Sequential waterfall (67% slower):
```typescript
// Waterfall: 900ms total (300ms × 3)
async function getData() {
  const user = await fetch('/api/user').then(r => r.json());        // 300ms
  const posts = await fetch('/api/posts').then(r => r.json());      // 300ms
  const comments = await fetch('/api/comments').then(r => r.json()); // 300ms

  return { user, posts, comments };
}
```

**Correct** - Parallel fetching (67% faster):
```typescript
// Parallel: 300ms total (all at once)
async function getData() {
  const [user, posts, comments] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json()),
  ]);

  return { user, posts, comments };
}

// Even better: Use Promise.allSettled to handle failures
async function getData() {
  const results = await Promise.allSettled([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json()),
  ]);

  return {
    user: results[0].status === 'fulfilled' ? results[0].value : null,
    posts: results[1].status === 'fulfilled' ? results[1].value : [],
    comments: results[2].status === 'fulfilled' ? results[2].value : [],
  };
}
```

### 2.2 Deferred Awaits (CRITICAL)

Only await when you need the value.

**Incorrect** - Await too early:
```typescript
async function processOrder(orderId: string, notify: boolean) {
  // Blocks for 200ms even if notify is false
  const email = await getUserEmail(orderId);  // 200ms

  if (notify) {
    await sendEmail(email);
  }

  // More code...
}
```

**Correct** - Defer await:
```typescript
async function processOrder(orderId: string, notify: boolean) {
  // Start the promise but don't await yet
  const emailPromise = getUserEmail(orderId);

  // Do other work first...

  // Only await when needed
  if (notify) {
    const email = await emailPromise;
    await sendEmail(email);
  }
}

// Even better: Conditional fetching
async function processOrder(orderId: string, notify: boolean) {
  if (notify) {
    const email = await getUserEmail(orderId);
    await sendEmail(email);
  }

  // No delay if notify is false
}
```

### 2.3 Request Deduplication (CRITICAL)

Avoid making the same request multiple times simultaneously.

**Pulwave Deduplication Pattern**:
```typescript
// packages/data/cache/deduplication.ts

const pendingRequests = new Map<string, Promise<any>>();

export function dedupe<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  // Return existing promise if request is in-flight
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  // Start new request
  const promise = fn().finally(() => {
    // Clean up when done
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

// Usage
export const propertyService = {
  async getById(id: string) {
    return dedupe(`property-${id}`, () =>
      fetch(`/api/properties/${id}`).then(r => r.json())
    );
  },
};

// TanStack Query automatically deduplicates
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getById(id),
    // Multiple components can call this hook
    // Only one request will be made
  });
};
```

### 2.4 Prefetching (HIGH)

Prefetch data before it's needed.

**Pulwave Prefetch Patterns**:
```typescript
// Pattern 1: Hover prefetch
export const PropertyCard = ({ property }: Props) => {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['property', property.id],
      queryFn: () => propertyService.getById(property.id),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <Link
      to={`/properties/${property.id}`}
      onMouseEnter={prefetch}      // Prefetch on hover
      onFocus={prefetch}            // Prefetch on keyboard focus
    >
      {property.name}
    </Link>
  );
};

// Pattern 2: Next page prefetch
export const PropertyList = ({ page }: Props) => {
  const queryClient = useQueryClient();

  // Prefetch next page automatically
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['properties', { page: page + 1 }],
      queryFn: () => propertyService.list({ page: page + 1 }),
    });
  }, [page, queryClient]);

  return <>{/* ... */}</>;
};
```

---

## 3. Bundle Size Optimization

### 3.1 Avoid Barrel Imports (CRITICAL)

Import directly from source files to enable tree shaking.

**Incorrect** - Barrel import (imports entire library):
```typescript
// Imports ALL icons (500KB+)
import { CheckIcon, XIcon, AlertIcon } from '@icons';
import { Button, Input, Modal } from '@components';

// Problem: Bundler includes entire @icons and @components packages
```

**Correct** - Direct imports (only what you need):
```typescript
// Imports only CheckIcon (2KB)
import CheckIcon from '@icons/Check';
import XIcon from '@icons/X';
import AlertIcon from '@icons/Alert';

// Or use path imports
import { CheckIcon } from '@icons/Check';
import { Button } from '@components/Button';
import { Input } from '@components/Input';

// Saves 498KB in this example
```

**Pulwave Path Aliases**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@pulwave/ui/*": ["./packages/ui/components/*/index.ts"],
      "@pulwave/icons/*": ["./packages/ui/icons/*/index.ts"]
    }
  }
}
```

### 3.2 Dynamic Imports (CRITICAL)

Lazy-load heavy components to reduce initial bundle size.

**Incorrect** - Everything eagerly loaded:
```typescript
import RichTextEditor from './RichTextEditor';  // 300KB
import ChartComponent from './ChartComponent';  // 200KB
import PDFViewer from './PDFViewer';            // 150KB

export const Dashboard = () => {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div>
      <h1>Dashboard</h1>
      {showEditor && <RichTextEditor />}  // Loaded even when hidden
    </div>
  );
};

// Initial bundle: 650KB (editor, chart, PDF always loaded)
```

**Correct** - Dynamic imports (lazy loading):
```typescript
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const RichTextEditor = lazy(() => import('./RichTextEditor'));
const ChartComponent = lazy(() => import('./ChartComponent'));
const PDFViewer = lazy(() => import('./PDFViewer'));

export const Dashboard = () => {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div>
      <h1>Dashboard</h1>
      {showEditor && (
        <Suspense fallback={<Skeleton />}>
          <RichTextEditor />  // Only loaded when shown
        </Suspense>
      )}
    </div>
  );
};

// Initial bundle: 50KB
// Editor loaded on-demand: +300KB (only when needed)
// Saves 600KB on initial load
```

### 3.3 Tree Shaking (CRITICAL)

Ensure your code is tree-shakeable.

**Incorrect** - Side effects prevent tree shaking:
```typescript
// utils/index.ts
export { formatDate } from './date';
export { formatCurrency } from './currency';
export { debounce } from './timing';

// Side effect at module level (prevents tree shaking)
console.log('Utils loaded');

// When you import one function, you get all of them + side effect
import { formatDate } from './utils';
```

**Correct** - No side effects, pure exports:
```typescript
// utils/index.ts
export { formatDate } from './date';
export { formatCurrency } from './currency';
export { debounce } from './timing';

// No side effects

// package.json
{
  "sideEffects": false  // Tell bundler it's safe to tree shake
}

// Now only formatDate is bundled
import { formatDate } from './utils';
```

### 3.4 Bundle Analysis (HIGH)

Analyze and monitor bundle size.

**Pulwave Bundle Analysis**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          react: ['react', 'react-dom'],
          'react-query': ['@tanstack/react-query'],
          ui: ['@pulwave/ui'],
        },
      },
    },
  },
});

// Run build and analyze
// npm run build
// Open dist/stats.html to see bundle composition
```

---

## 4. Re-render Optimization

### 4.1 React.memo (HIGH)

Prevent re-renders when props haven't changed.

**Incorrect** - Expensive child re-renders on every parent update:
```typescript
const ExpensiveChild = ({ data }: Props) => {
  // Expensive computation
  const processed = data.map(item => expensiveTransform(item));

  return <div>{processed.map(p => <Item key={p.id} {...p} />)}</div>;
};

const Parent = () => {
  const [count, setCount] = useState(0);
  const data = useMemo(() => fetchData(), []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild data={data} />  // Re-renders on every count change
    </div>
  );
};
```

**Correct** - Memoize component:
```typescript
const ExpensiveChild = memo(({ data }: Props) => {
  const processed = data.map(item => expensiveTransform(item));

  return <div>{processed.map(p => <Item key={p.id} {...p} />)}</div>;
});

const Parent = () => {
  const [count, setCount] = useState(0);
  const data = useMemo(() => fetchData(), []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild data={data} />  // Only re-renders when data changes
    </div>
  );
};

// 90% fewer re-renders when count changes
```

### 4.2 useMemo and useCallback (HIGH)

Memoize expensive computations and callbacks.

**Incorrect** - Recreating values and functions on every render:
```typescript
const Component = ({ items }: Props) => {
  // Recomputed on every render (expensive!)
  const sortedItems = items.slice().sort((a, b) => a.name.localeCompare(b.name));

  // New function on every render (breaks memo)
  const handleClick = (id: string) => {
    console.log(id);
  };

  return (
    <div>
      {sortedItems.map(item => (
        <Item key={item.id} item={item} onClick={handleClick} />
      ))}
    </div>
  );
};
```

**Correct** - Memoize values and callbacks:
```typescript
const Component = ({ items }: Props) => {
  // Only recompute when items change
  const sortedItems = useMemo(
    () => items.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  // Stable function reference
  const handleClick = useCallback((id: string) => {
    console.log(id);
  }, []);

  return (
    <div>
      {sortedItems.map(item => (
        <Item key={item.id} item={item} onClick={handleClick} />
      ))}
    </div>
  );
};

// 60% fewer re-renders
```

### 4.3 State Colocation (CRITICAL)

Keep state as close as possible to where it's used.

**Incorrect** - State too high in tree:
```typescript
const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');  // Used only in sidebar

  return (
    <div>
      <Header />  {/* Re-renders when searchTerm changes */}
      <Sidebar searchTerm={searchTerm} onSearch={setSearchTerm} />
      <MainContent />  {/* Re-renders when searchTerm changes */}
      <Footer />  {/* Re-renders when searchTerm changes */}
    </div>
  );
};
```

**Correct** - Colocate state:
```typescript
const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');  // Only affects Sidebar

  return (
    <div>
      <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      {/* search UI */}
    </div>
  );
};

const Dashboard = () => {
  return (
    <div>
      <Header />  {/* Never re-renders when searching */}
      <Sidebar />
      <MainContent />  {/* Never re-renders when searching */}
      <Footer />  {/* Never re-renders when searching */}
    </div>
  );
};

// 75% fewer re-renders
```

### 4.4 Component Composition (HIGH)

Use children prop to prevent re-renders.

**Incorrect** - Wrapper causes child re-renders:
```typescript
const Wrapper = ({ theme }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={theme}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      <ExpensiveChild />  {/* Re-renders when isOpen changes */}
    </div>
  );
};
```

**Correct** - Pass children to isolate re-renders:
```typescript
const Wrapper = ({ theme, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={theme}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {children}  {/* Does NOT re-render when isOpen changes */}
    </div>
  );
};

// Usage
<Wrapper theme="dark">
  <ExpensiveChild />  {/* Isolated from Wrapper state */}
</Wrapper>
```

---

## 10. Pulwave Integration

### 10.1 Monorepo Performance (CRITICAL)

Optimize Pulwave monorepo for performance.

**Turborepo Configuration**:
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "env": ["NODE_ENV"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  },
  "remoteCache": {
    "signature": true
  }
}
```

### 10.2 TanStack Query Setup (CRITICAL)

Configure TanStack Query for optimal performance.

**packages/data/cache/queryClient.ts**:
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 min - reduce refetches
      gcTime: 30 * 60 * 1000,        // 30 min - keep in cache
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,   // Disable aggressive refetching
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});
```

### 10.3 Build Optimization (HIGH)

Optimize Vite build for production.

**apps/web/real-estate/vite.config.ts**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: 'dist/stats.html' }),
  ],

  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.log in production
        drop_debugger: true,
      },
    },

    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          'react-query': ['@tanstack/react-query'],
          ui: ['@pulwave/ui'],
          data: ['@pulwave/data'],
        },
      },
    },

    chunkSizeWarningLimit: 500,  // Warn on chunks > 500KB
  },

  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query'],
  },
});
```

---

## Appendix A: Performance Checklist

```markdown
# Performance Checklist

## Critical (Must Do)
- [ ] All data fetching is parallel (no sequential awaits)
- [ ] Large components are lazy loaded (dynamic imports)
- [ ] Images use next/image or optimized formats
- [ ] State is colocated (not in global state unless needed)
- [ ] Bundle size < 300KB (initial JS)
- [ ] LCP < 2.5s on 3G

## High Priority (Should Do)
- [ ] TanStack Query configured with proper staleTime
- [ ] Expensive list renders use virtual scrolling
- [ ] Input handlers are debounced
- [ ] Animations use CSS transforms/opacity only
- [ ] Web Vitals monitored in production

## Medium Priority (Nice to Have)
- [ ] React.memo used on expensive components
- [ ] useMemo/useCallback used appropriately
- [ ] Long tasks broken up with setTimeout/requestIdleCallback
- [ ] Service worker for offline support

## Low Priority (Micro-optimizations)
- [ ] for loops instead of forEach/map
- [ ] Object.assign instead of spread
- [ ] Specific transition properties instead of `all`
```

## Appendix B: Bundle Analysis Guide

```bash
# 1. Build and analyze
npm run build
npx vite-bundle-visualizer

# 2. Look for:
# - Large dependencies (> 100KB)
# - Duplicate dependencies
# - Unused code

# 3. Common culprits:
# - moment.js (use date-fns instead)
# - lodash (use lodash-es)
# - chart.js (lazy load)
# - Full icon libraries (use selective imports)

# 4. Fix:
# - Replace large deps with smaller alternatives
# - Dynamic import heavy components
# - Fix barrel imports
# - Enable tree shaking (sideEffects: false)
```

## Appendix C: Profiling Guide

```markdown
# React DevTools Profiler

1. Install React DevTools extension
2. Open DevTools → Profiler tab
3. Click Record
4. Interact with your app
5. Stop recording
6. Analyze:
   - Which components re-rendered?
   - Why did they re-render? (props, state, context)
   - How long did renders take?

# Chrome DevTools Performance

1. Open DevTools → Performance tab
2. Click Record
3. Interact with your app (3-10 seconds)
4. Stop recording
5. Analyze:
   - Long tasks (> 50ms)
   - Layout shifts
   - Paint operations
   - JavaScript execution time
```

## Appendix D: Core Web Vitals Targets

```
Metric    | Good    | Needs Improvement | Poor
----------|---------|-------------------|------
LCP       | < 2.5s  | 2.5s - 4.0s      | > 4.0s
INP       | < 200ms | 200ms - 500ms    | > 500ms
CLS       | < 0.1   | 0.1 - 0.25       | > 0.25

Testing Conditions:
- Device: Moto G4 or equivalent
- Network: Slow 3G (1.6 Mbps down, 750 Kbps up, 150ms RTT)
- Location: 75th percentile of real user data
```

---

**Impact Levels Summary**:
- **CRITICAL** (19): Waterfalls, bundle size, state colocation, web vitals, TanStack Query
- **HIGH** (15): Re-render optimization, prefetching, image optimization, virtual scrolling
- **MEDIUM** (8): useMemo/useCallback, CSS animations, responsive images
- **LOW** (3): Micro-optimizations, string operations, async iterators

**Total Patterns**: 45+ comprehensive performance optimization patterns
