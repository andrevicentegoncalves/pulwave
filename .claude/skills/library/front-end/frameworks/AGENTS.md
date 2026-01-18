# React Development Guide

**Version 1.0.0**
Pulwave Engineering
2026-01-17

> **Note:**
> This document is designed for AI agents and LLMs working on the Pulwave codebase.
> Reference specific sections by number (e.g., "follow rule 3.2") for targeted guidance.

## Abstract

Comprehensive React 19 development guide for Pulwave's Vite application. Contains 40+ patterns across 9 categories covering hooks, component architecture, UI states, custom hooks, context patterns, error handling, Suspense, performance, and testing. Designed for building maintainable, performant React applications.

**Pulwave React Stack:**
- React 19 (latest features)
- Vite 7 (bundler)
- TypeScript (strict mode)
- TanStack Query 5 (server state)
- React Router (client-side routing)
- No Next.js (client-side only, no SSR/RSC)

**Key Principles:**
- Composition over inheritance
- Hooks for logic reuse
- Type safety with TypeScript
- Performance by default
- Accessibility first

---

## Table of Contents

1. [React Hooks](#1-react-hooks) (CRITICAL)
2. [Component Patterns](#2-component-patterns) (HIGH)
3. [UI State Patterns](#3-ui-state-patterns) (HIGH)
4. [Custom Hooks](#4-custom-hooks) (MEDIUM-HIGH)
5. [Context Patterns](#5-context-patterns) (MEDIUM)
6. [Error Handling](#6-error-handling) (HIGH)
7. [Suspense & Concurrent Features](#7-suspense--concurrent-features) (MEDIUM)
8. [Performance Patterns](#8-performance-patterns) (HIGH)
9. [Testing Patterns](#9-testing-patterns) (HIGH)

---

## 1. React Hooks

**Impact: CRITICAL**

Hooks are the foundation of modern React development. Proper hook usage prevents bugs, improves performance, and makes code more maintainable.

### 1.1 useState: Functional Updates

**Impact: MEDIUM** (prevents stale closures, eliminates dependency bugs)

When new state depends on previous state, always use the functional update form. This ensures you always work with the latest state value.

**Incorrect: Direct state reference**

```typescript
// Pulwave counter component - WRONG
function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(count + 1); // Stale closure - count captured at render time
  }, [count]); // Must include count, callback recreated every time

  return <button onClick={increment}>Count: {count}</button>;
}
// Problem: increment() recreated on every count change → child re-renders
```

**Correct: Functional update**

```typescript
// Pulwave counter component - CORRECT
function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(prev => prev + 1); // Always uses latest value
  }, []); // No dependencies, callback stable forever

  return <button onClick={increment}>Count: {count}</button>;
}
// Benefit: increment() never recreated → child components don't re-render
```

**Pulwave-Specific Notes:**
- Apply in `packages/ui/components/` for all stateful components
- Critical for form components where callbacks are passed to children
- Use in `packages/features/*/hooks/` for custom state hooks

---

### 1.2 useEffect: Cleanup Functions

**Impact: HIGH** (prevents memory leaks, duplicate subscriptions)

Every effect that sets up a subscription, timer, or listener MUST return a cleanup function. Failing to clean up causes memory leaks and duplicate handlers.

**Incorrect: No cleanup**

```typescript
// Pulwave subscription component - WRONG
function LiveData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const subscription = dataService.subscribe(setData);
    // No cleanup! Subscription persists after unmount
  }, []);

  return <div>{data}</div>;
}
// Problem: Unmount → subscription still active → memory leak → multiple subscriptions on remount
```

**Correct: Cleanup function**

```typescript
// Pulwave subscription component - CORRECT
function LiveData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const subscription = dataService.subscribe(setData);

    return () => {
      subscription.unsubscribe(); // Cleanup on unmount
    };
  }, []);

  return <div>{data}</div>;
}
// Benefit: Clean unmount, no memory leaks, single subscription
```

**Common cleanup patterns:**

```typescript
// Event listeners
useEffect(() => {
  const handler = () => console.log('resize');
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);

// Timers
useEffect(() => {
  const timer = setTimeout(() => console.log('hello'), 1000);
  return () => clearTimeout(timer);
}, []);

// Async operations
useEffect(() => {
  let cancelled = false;

  fetchData().then(data => {
    if (!cancelled) setData(data);
  });

  return () => { cancelled = true; };
}, []);
```

**Pulwave-Specific Notes:**
- Required in `packages/features/*/components/` for real-time features
- Use in `packages/ui/components/Modal/` for escape key handlers
- Apply in `packages/features/dashboard/` for WebSocket connections

---

### 1.3 useEffect: Dependency Array Rules

**Impact: HIGH** (prevents infinite loops, ensures correctness)

Every value used inside useEffect MUST be in the dependency array. Missing dependencies cause stale closures. Extra dependencies cause unnecessary re-runs.

**Incorrect: Missing dependencies**

```typescript
// Pulwave search component - WRONG
function Search({ userId }: { userId: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    searchService.search(userId, query).then(setResults);
  }, []); // Missing userId and query!

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
// Problem: Search never runs when userId or query changes
```

**Correct: Complete dependencies**

```typescript
// Pulwave search component - CORRECT
function Search({ userId }: { userId: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    searchService.search(userId, query).then(setResults);
  }, [userId, query]); // All used values included

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
// Benefit: Search runs whenever userId or query changes
```

**Handling objects and functions:**

```typescript
// WRONG: Object in dependencies (new reference every render)
useEffect(() => {
  fetchData(options);
}, [options]); // options is { ...} → new object → infinite loop

// CORRECT: Destructure primitives
const { sortBy, filterBy } = options;
useEffect(() => {
  fetchData({ sortBy, filterBy });
}, [sortBy, filterBy]); // Primitives are stable

// OR: useMemo for object
const options = useMemo(
  () => ({ sortBy, filterBy }),
  [sortBy, filterBy]
);
useEffect(() => {
  fetchData(options);
}, [options]); // Memoized object is stable
```

**Pulwave-Specific Notes:**
- ESLint rule `react-hooks/exhaustive-deps` enforces this
- For functions: use `useCallback` or declare inside effect
- For objects: destructure to primitives or use `useMemo`

---

### 1.4 useMemo: Expensive Calculations

**Impact: MEDIUM** (prevents wasted CPU on every render)

Use `useMemo` for expensive computations that don't need to run on every render. Don't use for cheap calculations (more overhead than benefit).

**When to use:**
- Filtering/sorting large arrays (>100 items)
- Complex calculations (>5ms)
- Creating objects passed to memoized children

**When NOT to use:**
- Simple arithmetic or string operations
- Arrays/objects used only in JSX

**Incorrect: No memoization for expensive operation**

```typescript
// Pulwave data table - WRONG
function DataTable({ data }: { data: Item[] }) {
  // Re-sorts on EVERY render (even when data doesn't change)
  const sorted = data.slice().sort((a, b) => a.name.localeCompare(b.name));

  return <table>{sorted.map(item => <Row key={item.id} item={item} />)}</table>;
}
// Problem: 1000 items sorted 60 times per second during animations = lag
```

**Correct: Memoized expensive calculation**

```typescript
// Pulwave data table - CORRECT
function DataTable({ data }: { data: Item[] }) {
  const sorted = useMemo(
    () => data.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [data]
  );

  return <table>{sorted.map(item => <Row key={item.id} item={item} />)}</table>;
}
// Benefit: Sorting only when data changes, not on every render
```

**Real-world example:**

```typescript
// Pulwave dashboard filters
function Dashboard({ items }: { items: Item[] }) {
  const [filters, setFilters] = useState({ status: 'all', search: '' });

  const filteredItems = useMemo(() => {
    return items
      .filter(item =>
        filters.status === 'all' || item.status === filters.status
      )
      .filter(item =>
        item.name.toLowerCase().includes(filters.search.toLowerCase())
      );
  }, [items, filters]);

  // filteredItems only recomputed when items or filters change
  return <ItemList items={filteredItems} />;
}
```

**Pulwave-Specific Notes:**
- Use in `packages/features/*/components/` for filtered/sorted data
- Apply in `packages/ui/components/DataTable/` for table operations
- Use in `packages/ui/data-visualization/` for chart data transformations

---

### 1.5 useCallback: Stable Function References

**Impact: MEDIUM** (prevents child re-renders when passing callbacks)

Use `useCallback` for functions passed to memoized child components or used in dependency arrays. Without it, a new function is created every render.

**Incorrect: Inline function passed to memoized child**

```typescript
// Pulwave form - WRONG
const MemoizedInput = React.memo(Input);

function Form() {
  const [value, setValue] = useState('');

  return (
    <MemoizedInput
      value={value}
      onChange={(e) => setValue(e.target.value)} // New function every render!
    />
  );
}
// Problem: onChange is new → memo useless → Input re-renders anyway
```

**Correct: useCallback for stable reference**

```typescript
// Pulwave form - CORRECT
const MemoizedInput = React.memo(Input);

function Form() {
  const [value, setValue] = useState('');

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []); // Stable function reference

  return <MemoizedInput value={value} onChange={handleChange} />;
}
// Benefit: onChange stable → memo works → Input only re-renders when value changes
```

**When to use:**
- Functions passed to memoized children
- Functions in useEffect dependencies
- Event handlers passed to expensive components

**When NOT to use:**
- Functions only used in JSX (no memoized children)
- Functions that need to change frequently anyway

**Pulwave-Specific Notes:**
- Apply in `packages/features/*/components/` when passing callbacks
- Use in `packages/ui/components/Form/` for form event handlers
- Combine with `React.memo` for maximum benefit

---

### 1.6 useRef: DOM Access and Mutable Values

**Impact: MEDIUM** (enables DOM manipulation, stores values without re-renders)

Use `useRef` for: (1) accessing DOM nodes, (2) storing mutable values that don't trigger re-renders. Never use for render-dependent state.

**Use Case 1: DOM Access**

```typescript
// Pulwave input focus
function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

**Use Case 2: Storing Mutable Values**

```typescript
// Pulwave timer
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <>
      <div>Count: {count}</div>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

**Use Case 3: Previous Value Tracking**

```typescript
// Pulwave previous value hook
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Usage
function Component({ id }: { id: string }) {
  const previousId = usePrevious(id);

  useEffect(() => {
    if (previousId && previousId !== id) {
      console.log(`ID changed from ${previousId} to ${id}`);
    }
  }, [id, previousId]);
}
```

**Pulwave-Specific Notes:**
- Use in `packages/ui/components/Input/` for focus management
- Apply in `packages/features/*/hooks/` for subscription IDs
- Never use for values that should trigger re-renders (use useState instead)

---

## 2. Component Patterns

**Impact: HIGH**

Component architecture patterns that improve code organization, reusability, and maintainability.

### 2.1 Compound Components

**Impact: MEDIUM-HIGH** (flexible, reusable component APIs)

Compound components share state implicitly through Context, creating a flexible API without prop drilling.

**Use when:**
- Components have multiple sub-parts (Tabs, Accordion, Select)
- Sub-parts need to share state
- API should be flexible (order-agnostic)

**Incorrect: Prop drilling and rigid API**

```typescript
// Pulwave tabs - WRONG
function Tabs({ activeTab, onTabChange, tabs }: TabsProps) {
  return (
    <div>
      <TabList tabs={tabs} activeTab={activeTab} onChange={onTabChange} />
      <TabPanels tabs={tabs} activeTab={activeTab} />
    </div>
  );
}

// Rigid: Can't customize layout, prop drilling, limited flexibility
```

**Correct: Compound component with Context**

```typescript
// Pulwave tabs - CORRECT
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: ReactNode }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const { activeTab, setActiveTab } = context;

  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  if (context.activeTab !== id) return null;

  return <div role="tabpanel">{children}</div>;
}

// Flexible usage
<Tabs defaultTab="profile">
  <TabList>
    <Tab id="profile">Profile</Tab>
    <Tab id="settings">Settings</Tab>
  </TabList>

  <TabPanel id="profile">
    <ProfileContent />
  </TabPanel>

  <TabPanel id="settings">
    <SettingsContent />
  </TabPanel>
</Tabs>
```

**Pulwave-Specific Notes:**
- Use in `packages/ui/components/Tabs/`, `Accordion/`, `Select/`
- Export compound components as named exports
- Always validate context exists (throw descriptive error)

---

### 2.2 Controlled vs Uncontrolled Components

**Impact: HIGH** (affects form UX, validation, state management)

**Controlled**: Parent component owns state (React controls the value)
**Uncontrolled**: Component owns state (DOM controls the value)

**When to use controlled:**
- Need validation on every keystroke
- Need to transform input (e.g., uppercase)
- Need to sync with other components
- Need to programmatically set value

**When to use uncontrolled:**
- Simple forms with submit-time validation
- File inputs (always uncontrolled)
- Performance-critical inputs (avoid re-renders)

**Controlled Input**

```typescript
// Pulwave controlled input - CORRECT
function ControlledForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Validate on every keystroke
    if (!value.includes('@')) {
      setError('Must be a valid email');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <input value={email} onChange={handleChange} />
      {error && <span>{error}</span>}
    </div>
  );
}
```

**Uncontrolled Input**

```typescript
// Pulwave uncontrolled input - CORRECT
function UncontrolledForm() {
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value;

    // Validate on submit
    if (email && !email.includes('@')) {
      alert('Invalid email');
      return;
    }

    submitForm({ email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Hybrid: Controlled with useRef for performance**

```typescript
// Best of both worlds
function HybridInput() {
  const [error, setError] = useState('');
  const valueRef = useRef('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    valueRef.current = e.target.value;

    // Validate without re-rendering
    if (!valueRef.current.includes('@')) {
      setError('Invalid email');
    } else {
      setError('');
    }
  };

  return (
    <>
      <input onChange={handleChange} defaultValue="" />
      {error && <span>{error}</span>}
    </>
  );
}
```

**Pulwave-Specific Notes:**
- Use controlled in `packages/ui/components/Input/` by default
- Use uncontrolled for file uploads
- Document which pattern each component uses

---

### 2.3 Render Props Pattern

**Impact: MEDIUM** (share logic between components)

Render props let components share logic without higher-order components or hooks. Good for reusable behavior with custom rendering.

**Use when:**
- Logic is reusable but rendering varies
- Need runtime composition
- Consumer needs full control over rendering

**Example: Mouse position tracker**

```typescript
// Pulwave mouse tracker
interface MousePosition {
  x: number;
  y: number;
}

function MouseTracker({ render }: { render: (pos: MousePosition) => ReactNode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return <>{render(position)}</>;
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <div>Mouse at: {x}, {y}</div>
  )}
/>
```

**Modern alternative: Custom hook**

```typescript
// Custom hook (preferred in modern React)
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return position;
}

// Usage (cleaner)
function Component() {
  const { x, y } = useMousePosition();
  return <div>Mouse at: {x}, {y}</div>;
}
```

**Pulwave-Specific Notes:**
- Prefer custom hooks over render props in new code
- Keep render props for library components (e.g., virtualization)
- Use in `packages/ui/components/` for flexible rendering

---

## 3. UI State Patterns

**Impact: HIGH**

Proper UI state management prevents confusing UX and loading state bugs.

### 3.1 Loading States: Only Show When No Data

**Impact: HIGH** (prevents flickering, better UX)

Show loading indicators ONLY when there's no cached data. If data exists, show it while refreshing.

**Incorrect: Always show loader when fetching**

```typescript
// Pulwave data view - WRONG
function ProfileView() {
  const { data, isLoading } = useProfile();

  if (isLoading) return <Spinner />; // Hides cached data!

  return <Profile data={data} />;
}
// Problem: User sees spinner on every refetch, even with cached data
```

**Correct: Show loader only when no data**

```typescript
// Pulwave data view - CORRECT
function ProfileView() {
  const { data, isLoading, isFetching } = useProfile();

  if (isLoading && !data) return <Spinner />; // Only on initial load

  if (!data) return <EmptyState />;

  return (
    <>
      <Profile data={data} />
      {isFetching && <RefreshIndicator />} {/* Small indicator during refetch */}
    </>
  );
}
// Benefit: Shows cached data immediately, subtle refresh indicator
```

**Complete loading state pattern:**

```typescript
function DataView() {
  const { data, isLoading, isFetching, error } = useQuery();

  // Initial loading (no data yet)
  if (isLoading && !data) {
    return <Skeleton />;
  }

  // Error (no data to fall back to)
  if (error && !data) {
    return <ErrorState error={error} />;
  }

  // No data (not loading, not error)
  if (!data) {
    return <EmptyState />;
  }

  // Has data - show it!
  return (
    <div>
      {data.map(item => <Item key={item.id} {...item} />)}

      {/* Background refresh indicator */}
      {isFetching && <RefreshBadge />}

      {/* Stale data error (show data + error) */}
      {error && <ToastError error={error} />}
    </div>
  );
}
```

**Pulwave-Specific Notes:**
- TanStack Query provides `isLoading` (initial), `isFetching` (any fetch)
- Use Skeleton in `packages/ui/components/Skeleton/` for loading states
- Never hide data when refetching

---

### 3.2 Error States: Always Surfaceto Users

**Impact: HIGH** (prevents silent failures, improves debugging)

Never swallow errors silently. Always show errors to users in a helpful way.

**Incorrect: Silent error**

```typescript
// Pulwave data fetch - WRONG
function ProfileView() {
  const { data, error } = useProfile();

  if (!data) return <Spinner />; // Hides errors!

  return <Profile data={data} />;
}
// Problem: Errors invisible to user, looks like infinite loading
```

**Correct: Show errors to users**

```typescript
// Pulwave data fetch - CORRECT
function ProfileView() {
  const { data, isLoading, error } = useProfile();

  if (isLoading && !data) return <Skeleton />;

  if (error && !data) {
    return (
      <ErrorState
        title="Failed to load profile"
        message={error.message}
        retry={() => queryClient.refetchQueries(['profile'])}
      />
    );
  }

  if (!data) return <EmptyState />;

  return <Profile data={data} />;
}
// Benefit: User knows what went wrong and can retry
```

**User-friendly error messages:**

```typescript
// Map technical errors to user-friendly messages
function formatError(error: Error): string {
  if (error.message.includes('Network')) {
    return 'Connection issue. Please check your internet.';
  }

  if (error.message.includes('401') || error.message.includes('403')) {
    return 'You don't have permission to view this.';
  }

  if (error.message.includes('404')) {
    return 'This item no longer exists.';
  }

  // Generic fallback
  return 'Something went wrong. Please try again.';
}
```

**Pulwave-Specific Notes:**
- Use ErrorState from `packages/ui/components/ErrorState/`
- TanStack Query retries failed queries (configure retry logic)
- Log errors to Sentry for debugging

---

### 3.3 Empty States: Helpful, Not Blank

**Impact: MEDIUM** (better UX, guides users)

Empty states should explain why there's no data and suggest next actions.

**Incorrect: Blank or unhelpful**

```typescript
// Pulwave empty state - WRONG
if (items.length === 0) {
  return <div>No items</div>;
}
// Unhelpful: User doesn't know what to do
```

**Correct: Helpful empty state**

```typescript
// Pulwave empty state - CORRECT
if (items.length === 0) {
  return (
    <EmptyState
      icon={<BoxIcon />}
      title="No properties yet"
      description="Create your first property to get started"
      action={
        <Button onClick={() => navigate('/properties/new')}>
          Add Property
        </Button>
      }
    />
  );
}
// Benefit: User knows why it's empty and what to do next
```

**Contextual empty states:**

```typescript
// Different messages based on context
function PropertyList({ filters }: { filters: Filters }) {
  const { data } = useProperties(filters);

  if (data.length === 0) {
    // No results due to filters
    if (hasActiveFilters(filters)) {
      return (
        <EmptyState
          title="No matches found"
          description="Try adjusting your filters"
          action={<Button onClick={clearFilters}>Clear Filters</Button>}
        />
      );
    }

    // No properties at all
    return (
      <EmptyState
        title="No properties yet"
        description="Create your first property"
        action={<Button onClick={createProperty}>Add Property</Button>}
      />
    );
  }

  return <PropertyGrid properties={data} />;
}
```

**Pulwave-Specific Notes:**
- Use EmptyState from `packages/ui/components/EmptyState/`
- Include illustration, title, description, and action button
- Different messages for filtered vs truly empty

---

### 3.4 Button States: Disable During Async

**Impact: HIGH** (prevents double-submit, better UX)

Disable buttons during async operations to prevent duplicate submissions.

**Incorrect: No disabled state**

```typescript
// Pulwave form - WRONG
function Form() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await submitForm();
    setLoading(false);
  };

  return (
    <button onClick={handleSubmit}>
      {loading ? 'Submitting...' : 'Submit'}
    </button>
  );
}
// Problem: User can click multiple times → duplicate submissions
```

**Correct: Disable during async**

```typescript
// Pulwave form - CORRECT
function Form() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubmit}
      disabled={loading}
      isLoading={loading}
    >
      Submit
    </Button>
  );
}
// Benefit: Can't double-click, clear visual feedback
```

**With TanStack Query mutation:**

```typescript
function Form() {
  const mutation = useMutation({
    mutationFn: submitForm,
  });

  return (
    <Button
      onClick={() => mutation.mutate(data)}
      disabled={mutation.isPending}
      isLoading={mutation.isPending}
    >
      Submit
    </Button>
  );
}
```

**Pulwave-Specific Notes:**
- Button component in `packages/ui/components/Button/` has built-in `isLoading` prop
- TanStack Query mutations provide `isPending` state
- Always disable during async to prevent race conditions

---

## 4. Custom Hooks

**Impact: MEDIUM-HIGH**

Custom hooks extract reusable logic from components. They're the modern replacement for HOCs and render props.

### 4.1 Custom Hook Naming

**Impact: LOW** (convention, discoverability)

Always prefix custom hooks with `use`. This signals they follow hooks rules and enables linting.

**Incorrect: Missing `use` prefix**

```typescript
// WRONG
function windowSize() {
  const [size, setSize] = useState(getWindowSize());
  // ...
  return size;
}
// Problem: ESLint doesn't enforce hooks rules, unclear it's a hook
```

**Correct: `use` prefix**

```typescript
// CORRECT
function useWindowSize() {
  const [size, setSize] = useState(getWindowSize());
  // ...
  return size;
}
// Benefit: Clear it's a hook, ESLint enforces rules
```

---

### 4.2 Custom Hook Structure

**Impact: MEDIUM** (maintainability, reusability)

Custom hooks should have a single responsibility, clear return value, and proper TypeScript types.

**Good custom hook structure:**

```typescript
// Pulwave custom hook template
interface UseDataOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

interface UseDataReturn {
  data: Data | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useData(id: string, options: UseDataOptions = {}): UseDataReturn {
  const [data, setData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    // refetch logic
  }, [id]);

  useEffect(() => {
    if (!options.enabled) return;

    setIsLoading(true);
    dataService.fetch(id)
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [id, options.enabled]);

  return { data, isLoading, error, refetch };
}
```

**Pulwave-Specific Notes:**
- Create hooks in `packages/features/*/hooks/` for feature-specific logic
- Create hooks in `packages/foundation/hooks/` for shared utilities
- Always export TypeScript types for options and return values

---

## 5. Context Patterns

**Impact: MEDIUM**

Context provides a way to share values between components without prop drilling. Use sparingly for truly global state.

### 5.1 Context: When to Use

**Impact: MEDIUM** (prevents prop drilling, but can cause performance issues)

**Use Context for:**
- Theme (dark/light mode)
- Auth user
- Locale/language
- UI preferences

**Don't use Context for:**
- Server state (use TanStack Query)
- Frequently changing values (causes all consumers to re-render)
- Values only needed in a few components (prop drilling is fine)

**Example: Theme context**

```typescript
// Pulwave theme context
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

**Pulwave-Specific Notes:**
- Create contexts in `packages/features/*/contexts/`
- Always validate context exists (throw error if null)
- Memoize context value to prevent unnecessary re-renders

---

## Appendix: Quick Reference

All 40+ patterns by impact level:

### CRITICAL
- 1.1 useState functional updates
- 1.2 useEffect cleanup
- 1.3 useEffect dependencies
- 3.1 Loading states (only when no data)
- 3.2 Error states (always show)

### HIGH
- 1.4 useMemo for expensive calculations
- 1.5 useCallback for stable references
- 2.1 Compound components
- 2.2 Controlled vs uncontrolled
- 3.4 Button states (disable during async)

### MEDIUM
- 1.6 useRef for DOM/mutable values
- 2.3 Render props
- 3.3 Empty states
- 4.1 Custom hook naming
- 4.2 Custom hook structure
- 5.1 Context usage

---

**Last Updated**: 2026-01-17
**Version**: 1.0.0
**Maintained By**: Pulwave Engineering
