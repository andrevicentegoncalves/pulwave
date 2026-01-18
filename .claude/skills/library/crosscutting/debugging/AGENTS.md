# Systematic Debugging Guide

> **Abstract**: This guide provides comprehensive debugging strategies, tools, and patterns for React applications. Covers systematic approaches to bug hunting, browser DevTools, VS Code debugging, React-specific debugging, error tracking, and production debugging. Includes 40+ concrete patterns with incorrect vs correct examples, Pulwave monorepo integration, and practical checklists. Stop guessing, start measuring.

---

## Table of Contents

1. [Debugging Fundamentals](#1-debugging-fundamentals)
   - 1.1 [The Scientific Method](#11-the-scientific-method)
   - 1.2 [Reproduction Steps](#12-reproduction-steps)
   - 1.3 [Root Cause Analysis](#13-root-cause-analysis)
   - 1.4 [Debugging Mindset](#14-debugging-mindset)

2. [Debugging Strategies](#2-debugging-strategies)
   - 2.1 [Wolf Fence Algorithm (Bisection)](#21-wolf-fence-algorithm-bisection)
   - 2.2 [Rubber Duck Debugging](#22-rubber-duck-debugging)
   - 2.3 [Git Bisect for Regressions](#23-git-bisect-for-regressions)
   - 2.4 [Binary Search Approach](#24-binary-search-approach)
   - 2.5 [Trace-Driven Debugging](#25-trace-driven-debugging)

3. [Browser DevTools](#3-browser-devtools)
   - 3.1 [Console Debugging](#31-console-debugging)
   - 3.2 [Breakpoints](#32-breakpoints)
   - 3.3 [Network Tab Analysis](#33-network-tab-analysis)
   - 3.4 [Performance Profiling](#34-performance-profiling)
   - 3.5 [Memory Leak Detection](#35-memory-leak-detection)

4. [VS Code Debugging](#4-vs-code-debugging)
   - 4.1 [Launch Configurations](#41-launch-configurations)
   - 4.2 [Breakpoints and Watch](#42-breakpoints-and-watch)
   - 4.3 [Call Stack Navigation](#43-call-stack-navigation)
   - 4.4 [Debug Console](#44-debug-console)

5. [React DevTools](#5-react-devtools)
   - 5.1 [Component Tree Inspection](#51-component-tree-inspection)
   - 5.2 [Props and State Inspection](#52-props-and-state-inspection)
   - 5.3 [Profiler for Performance](#53-profiler-for-performance)
   - 5.4 [Hooks Debugging](#54-hooks-debugging)

6. [Network Debugging](#6-network-debugging)
   - 6.1 [Request/Response Inspection](#61-requestresponse-inspection)
   - 6.2 [CORS Errors](#62-cors-errors)
   - 6.3 [WebSocket Debugging](#63-websocket-debugging)
   - 6.4 [API Error Handling](#64-api-error-handling)

7. [Console Debugging Patterns](#7-console-debugging-patterns)
   - 7.1 [Strategic Log Placement](#71-strategic-log-placement)
   - 7.2 [Console Methods](#72-console-methods)
   - 7.3 [Custom Formatters](#73-custom-formatters)
   - 7.4 [Removing Debug Logs](#74-removing-debug-logs)

8. [Error Tracking](#8-error-tracking)
   - 8.1 [Sentry Integration](#81-sentry-integration)
   - 8.2 [Error Boundaries](#82-error-boundaries)
   - 8.3 [Context Enrichment](#83-context-enrichment)
   - 8.4 [Stack Trace Analysis](#84-stack-trace-analysis)

9. [Production Debugging](#9-production-debugging)
   - 9.1 [Source Maps](#91-source-maps)
   - 9.2 [Session Replay Tools](#92-session-replay-tools)
   - 9.3 [Remote Logging](#93-remote-logging)
   - 9.4 [Feature Flags for Rollback](#94-feature-flags-for-rollback)

10. [Pulwave Integration](#10-pulwave-integration)
    - 10.1 [Debugging in Monorepo](#101-debugging-in-monorepo)
    - 10.2 [TanStack Query DevTools](#102-tanstack-query-devtools)
    - 10.3 [Supabase Debugging](#103-supabase-debugging)
    - 10.4 [Vite Debug Configuration](#104-vite-debug-configuration)

11. [Appendices](#11-appendices)
    - 11.1 [Debugging Checklist](#111-debugging-checklist)
    - 11.2 [Common Bug Patterns](#112-common-bug-patterns)
    - 11.3 [DevTools Shortcuts](#113-devtools-shortcuts)
    - 11.4 [Git Bisect Reference](#114-git-bisect-reference)

---

## 1. Debugging Fundamentals

### 1.1 The Scientific Method
**Impact: CRITICAL**

Apply the scientific method to debugging:

**Incorrect - Guessing and Random Changes:**
```typescript
// ❌ Bug: User data not loading
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try changing this?
    fetch('/api/user')
      .then(r => r.json())
      .then(setUser);

    // Maybe add a timeout?
    // setTimeout(() => {
    //   fetch('/api/user').then(r => r.json()).then(setUser);
    // }, 1000);
  }, []);

  // Why is user null?
  return <div>{user?.name}</div>;
}
```

**Correct - Systematic Investigation:**
```typescript
// ✅ Apply scientific method
function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('1. Effect running');

    fetch('/api/user')
      .then(r => {
        console.log('2. Response received:', r.status);
        return r.json();
      })
      .then(data => {
        console.log('3. Data parsed:', data);
        setUser(data);
      })
      .catch(err => {
        console.error('4. Error caught:', err);
        setError(err);
      });
  }, []);

  // Hypothesis: API is failing
  // Test: Check console for error
  // Result: 401 Unauthorized
  // Root cause: Missing auth token

  if (error) return <div>Error: {error.message}</div>;
  return <div>{user?.name}</div>;
}
```

**Why This Matters**: Random changes waste time. Systematic observation identifies root causes.

---

### 1.2 Reproduction Steps
**Impact: CRITICAL**

Create a minimal reproduction case.

**Incorrect - Vague Bug Report:**
```typescript
// ❌ Bug report: "Form doesn't work sometimes"
// No reproduction steps
// No error messages
// No environment details

function ContactForm() {
  const [data, setData] = useState({});

  const handleSubmit = async () => {
    await api.post('/contact', data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Complex form with 20 fields */}
    </form>
  );
}
```

**Correct - Minimal Repro:**
```typescript
// ✅ Minimal reproduction case
/**
 * BUG: Form submission fails with 400 Bad Request
 *
 * Steps to reproduce:
 * 1. Navigate to /contact
 * 2. Fill in email field with "test@example.com"
 * 3. Leave name field empty
 * 4. Click Submit
 *
 * Expected: Validation error shown
 * Actual: 400 Bad Request, no error shown
 *
 * Environment:
 * - Browser: Chrome 120
 * - OS: Windows 11
 * - Build: main@abc123
 *
 * Error message:
 * POST /contact 400 (Bad Request)
 * {error: "name is required"}
 */

function ContactForm() {
  const [data, setData] = useState({ email: '', name: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/contact', data);
    } catch (err) {
      // Root cause: Not catching 400 errors
      setError(err.response?.data?.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={data.email}
        onChange={e => setData({ ...data, email: e.target.value })}
      />
      <input
        value={data.name}
        onChange={e => setData({ ...data, name: e.target.value })}
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Why This Matters**: Clear reproduction steps make bugs fixable. Vague reports waste time.

---

### 1.3 Root Cause Analysis
**Impact: CRITICAL**

Find the "why", not just the "what".

**Incorrect - Symptom Fix:**
```typescript
// ❌ Fixing symptoms, not root cause
function UserList() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Bug: users is sometimes undefined, causing crash
  // "Fix": Add null check
  return (
    <div>
      {users?.map(user => (  // Band-aid fix
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

**Correct - Root Cause Fix:**
```typescript
// ✅ Fix root cause
function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    // Root cause: No initial data, causing undefined
    // Solution: Provide initial value and handle states
    initialData: [],
  });

  // Proper state handling
  if (isLoading) return <Spinner />;
  if (error) return <ErrorState error={error} />;

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// Ask "5 Whys":
// 1. Why did it crash? - users was undefined
// 2. Why was it undefined? - No initial data
// 3. Why no initial data? - Query hasn't resolved yet
// 4. Why no loading state? - Didn't handle isLoading
// 5. Root cause: Missing proper state handling
```

**Why This Matters**: Symptom fixes create technical debt. Root cause fixes prevent recurrence.

---

### 1.4 Debugging Mindset
**Impact: CRITICAL**

Debugging is detective work, not guesswork.

**Incorrect - Emotional Debugging:**
```typescript
// ❌ Frustrated, random changes
function BuggyComponent() {
  // "I tried everything! Nothing works!"
  // *Makes random changes*
  // *Adds console.logs everywhere*
  // *Copies code from Stack Overflow*
  // *Gives up and asks for help without investigation*

  const [state, setState] = useState(initialState);

  useEffect(() => {
    // Is this the problem?
    doSomething();

    // Maybe this?
    // doSomethingElse();

    // What if I remove this?
    // cleanup();
  }, []); // Or should this be [state]? [state, other]?

  return null;
}
```

**Correct - Methodical Debugging:**
```typescript
// ✅ Calm, systematic approach
function DebuggableComponent() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    // Step 1: Understand what SHOULD happen
    console.log('Effect running. State:', state);

    // Step 2: Observe what DOES happen
    const result = doSomething();
    console.log('doSomething result:', result);

    // Step 3: Form hypothesis
    // Hypothesis: Effect runs too often because dependency array is wrong

    // Step 4: Test hypothesis
    // Test: Add state to deps and verify effect runs once

    // Step 5: Validate fix
    // Validation: Effect runs only when state changes

    return () => {
      console.log('Cleanup running');
    };
  }, [state]);

  return null;
}

// Debugging checklist:
// ✅ Can I reproduce it?
// ✅ What is the expected behavior?
// ✅ What is the actual behavior?
// ✅ What changed recently?
// ✅ Is this a regression?
// ✅ What are the error messages?
// ✅ What does the stack trace show?
```

**Why This Matters**: Emotion wastes time. Method finds bugs.

---

## 2. Debugging Strategies

### 2.1 Wolf Fence Algorithm (Bisection)
**Impact: CRITICAL**

Divide and conquer to trap the bug.

**Incorrect - Linear Search:**
```typescript
// ❌ Testing every line sequentially
function complexFunction(data: Data[]) {
  console.log('Line 1'); // Is bug here?
  const step1 = processStep1(data);

  console.log('Line 2'); // Is bug here?
  const step2 = processStep2(step1);

  console.log('Line 3'); // Is bug here?
  const step3 = processStep3(step2);

  console.log('Line 4'); // Is bug here?
  const step4 = processStep4(step3);

  console.log('Line 5'); // Is bug here?
  const step5 = processStep5(step4);

  console.log('Line 6'); // Is bug here?
  return finalizeResult(step5);
}
// Time: O(n) - testing 6 steps linearly
```

**Correct - Binary Search:**
```typescript
// ✅ Bisection approach
function complexFunction(data: Data[]) {
  const step1 = processStep1(data);
  const step2 = processStep2(step1);
  const step3 = processStep3(step2);

  // First: Check middle
  console.log('Checkpoint: Middle (step3):', step3);
  // Result: step3 is correct
  // Bug is in second half (step4, step5, or step6)

  const step4 = processStep4(step3);
  const step5 = processStep5(step4);

  // Second: Check 3/4 point
  console.log('Checkpoint: 3/4 (step5):', step5);
  // Result: step5 is incorrect
  // Bug is between step4 and step5

  const step6 = finalizeResult(step5);

  return step6;
}
// Time: O(log n) - found bug in 2 checks instead of 6
```

**Why This Matters**: Bisection finds bugs exponentially faster than linear search.

---

### 2.2 Rubber Duck Debugging
**Impact: HIGH**

Explain the code to find the bug.

**Incorrect - Silent Confusion:**
```typescript
// ❌ Staring at code in silence
function calculateDiscount(price: number, coupon: string) {
  // Why doesn't this work?
  const discount = price * 0.1;
  if (coupon === 'SAVE20') {
    discount = price * 0.2;  // Bug: reassigning const
  }
  return price - discount;
}
```

**Correct - Explain Out Loud:**
```typescript
// ✅ Rubber duck explanation
function calculateDiscount(price: number, coupon: string) {
  // "Okay duck, let me explain this function..."
  // "First, we calculate a 10% discount..."
  let discount = price * 0.1;

  // "Then, if the coupon is SAVE20..."
  // "We override the discount to 20%..."
  // "Wait, I declared discount as const!"
  // "That's the bug - should be let!"

  if (coupon === 'SAVE20') {
    discount = price * 0.2;
  }

  return price - discount;
}

// The act of explaining reveals the bug
// No duck? Explain to:
// - A colleague
// - A comment
// - Yourself in a note
```

**Why This Matters**: Articulating logic reveals assumptions and errors.

---

### 2.3 Git Bisect for Regressions
**Impact: CRITICAL**

Find the commit that introduced a bug.

**Incorrect - Manual Commit Checking:**
```bash
# ❌ Manually checking commits one by one
git checkout abc123
npm test  # Does it fail?

git checkout def456
npm test  # Does it fail?

git checkout ghi789
npm test  # Does it fail?

# Takes hours to find the bad commit
```

**Correct - Git Bisect:**
```bash
# ✅ Automated binary search through commits
# Start bisect
git bisect start

# Mark current commit as bad
git bisect bad

# Mark last known good commit
git bisect good v1.2.0

# Git automatically checks out middle commit
# Test it
npm test

# If test fails:
git bisect bad

# If test passes:
git bisect good

# Git narrows down until it finds the exact commit
# "abc123 is the first bad commit"

# Reset when done
git bisect reset
```

**Automated Bisect:**
```bash
# ✅ Fully automated with test script
git bisect start HEAD v1.2.0
git bisect run npm test

# Git automatically finds the bad commit
# Output: "abc123 introduced the bug"
```

**Why This Matters**: Bisect finds regressions in O(log n) time instead of O(n).

---

### 2.4 Binary Search Approach
**Impact: HIGH**

Narrow down problem space by halves.

**Incorrect - Testing Everything:**
```typescript
// ❌ Bug: Data not showing in table
// Testing every component in the chain

// Is DataTable broken?
<DataTable data={users} />

// Is the data fetching broken?
const { data: users } = useUsers();

// Is the API broken?
export const fetchUsers = () => fetch('/api/users');

// Is the backend broken?
// ... checking 10+ layers
```

**Correct - Bisect the Chain:**
```typescript
// ✅ Start in the middle
function UserManagement() {
  const { data: users } = useUsers();

  // Checkpoint 1: Is data reaching the component?
  console.log('Users received:', users);
  // Result: users = undefined
  // Bug is BEFORE this point (in data fetching)

  return <DataTable data={users ?? []} />;
}

// Now bisect the data fetching half
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    // Checkpoint 2: Is queryFn being called?
    onSuccess: (data) => console.log('Query success:', data),
    onError: (err) => console.error('Query error:', err),
  });
  // Result: onError called with 401
  // Bug found: Missing authentication
}
```

**Why This Matters**: Each checkpoint eliminates half the problem space.

---

### 2.5 Trace-Driven Debugging
**Impact: HIGH**

Follow execution flow with strategic logging.

**Incorrect - Logs Everywhere:**
```typescript
// ❌ Noisy, unfocused logging
function processOrder(order: Order) {
  console.log('processOrder called');
  console.log('order:', order);

  const validated = validateOrder(order);
  console.log('validated:', validated);

  const priced = calculatePrice(validated);
  console.log('priced:', priced);

  const charged = chargePayment(priced);
  console.log('charged:', charged);

  const confirmed = confirmOrder(charged);
  console.log('confirmed:', confirmed);

  return confirmed;
}
// Console: Hundreds of logs, hard to find the bug
```

**Correct - Focused Trace:**
```typescript
// ✅ Strategic trace points with context
function processOrder(order: Order) {
  const traceId = `order-${order.id}-${Date.now()}`;

  console.group(`🔍 [${traceId}] Processing order`);
  console.log('Input:', { orderId: order.id, total: order.total });

  try {
    const validated = validateOrder(order);
    console.log('✓ Validation passed');

    const priced = calculatePrice(validated);
    console.log('✓ Pricing calculated:', priced.total);

    const charged = chargePayment(priced);
    console.log('✓ Payment charged:', charged.transactionId);

    const confirmed = confirmOrder(charged);
    console.log('✓ Order confirmed:', confirmed.confirmationNumber);

    return confirmed;
  } catch (error) {
    console.error('✗ Failed at:', error.step, error);
    throw error;
  } finally {
    console.groupEnd();
  }
}

// Console output:
// 🔍 [order-123-1234567890] Processing order
//   Input: {orderId: 123, total: 99.99}
//   ✓ Validation passed
//   ✓ Pricing calculated: 109.99
//   ✗ Failed at: payment Error: Insufficient funds
```

**Why This Matters**: Focused traces reveal execution flow without noise.

---

## 3. Browser DevTools

### 3.1 Console Debugging
**Impact: CRITICAL**

Use console methods effectively.

**Incorrect - Basic console.log:**
```typescript
// ❌ Unhelpful console.log
function updateUser(userId: string, updates: UserUpdates) {
  console.log('updateUser');
  console.log(userId);
  console.log(updates);

  // Console output:
  // updateUser
  // 123
  // {name: 'John'}
  // Hard to parse, no context
}
```

**Correct - Descriptive Logging:**
```typescript
// ✅ Clear, contextual logging
function updateUser(userId: string, updates: UserUpdates) {
  console.log('Updating user:', { userId, updates });

  // Better: Use console.table for objects
  console.table({ userId, ...updates });

  // Better: Use console.group for related logs
  console.group('User Update');
  console.log('User ID:', userId);
  console.log('Updates:', updates);
  console.trace('Call stack');
  console.groupEnd();

  // Console output:
  // ▼ User Update
  //   User ID: 123
  //   Updates: {name: 'John'}
  //   Call stack: updateUser @ app.js:42
  //              handleSubmit @ Form.jsx:15
}
```

**Why This Matters**: Good logging saves debugging time.

---

### 3.2 Breakpoints
**Impact: CRITICAL**

Use breakpoints instead of console.log.

**Incorrect - Console.log Debugging:**
```typescript
// ❌ Adding console.logs everywhere
function calculateTotal(items: CartItem[]) {
  console.log('items:', items);

  let total = 0;
  for (const item of items) {
    console.log('item:', item);
    console.log('total before:', total);
    total += item.price * item.quantity;
    console.log('total after:', total);
  }

  console.log('final total:', total);
  return total;
}
// Problem: Must add logs, save, refresh, remove logs
```

**Correct - Breakpoint Debugging:**
```typescript
// ✅ Use DevTools breakpoints
function calculateTotal(items: CartItem[]) {
  let total = 0;

  for (const item of items) {
    // Set breakpoint here (click line number in DevTools)
    total += item.price * item.quantity;
    // Inspect variables in DevTools:
    // - item: {price: 10, quantity: 2}
    // - total: 20
    // Step through with F10 (Step Over)
  }

  return total;
}

// Advanced: Conditional breakpoint
// Right-click line number → "Add conditional breakpoint"
// Condition: item.price > 100
// Breakpoint only triggers when condition is true
```

**Logpoints (No Code Changes):**
```typescript
// ✅ DevTools logpoints (Chrome/Edge)
function calculateTotal(items: CartItem[]) {
  let total = 0;

  for (const item of items) {
    total += item.price * item.quantity;
    // Right-click line number → "Add logpoint"
    // Message: 'Item:', item, 'Total:', total
    // Logs to console without editing code
  }

  return total;
}
```

**Why This Matters**: Breakpoints are faster and more powerful than console.log.

---

### 3.3 Network Tab Analysis
**Impact: CRITICAL**

Debug API calls and network issues.

**Incorrect - Blind API Calls:**
```typescript
// ❌ No visibility into network failures
async function fetchUserProfile() {
  try {
    const response = await fetch('/api/user/profile');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch profile');
    // What failed? Network? Auth? Server error?
  }
}
```

**Correct - Network Tab Debugging:**
```typescript
// ✅ Inspect in Network tab
async function fetchUserProfile() {
  try {
    const response = await fetch('/api/user/profile');

    // In Network tab:
    // 1. Find the request: "profile"
    // 2. Check Status: 401 Unauthorized
    // 3. Check Request Headers: Missing "Authorization"
    // 4. Check Response: {error: "Token expired"}
    // 5. Root cause identified: Need to refresh token

    if (!response.ok) {
      const error = await response.json();
      console.error('API error:', {
        status: response.status,
        statusText: response.statusText,
        error,
      });
      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('Network failure:', error);
    throw error;
  }
}

// Network tab columns to check:
// - Name: Request URL
// - Status: HTTP status code
// - Type: Resource type (XHR, fetch)
// - Initiator: What triggered the request
// - Size: Response size
// - Time: Request duration
// - Waterfall: Visual timeline
```

**Why This Matters**: Network tab reveals API failures instantly.

---

### 3.4 Performance Profiling
**Impact: HIGH**

Find performance bottlenecks.

**Incorrect - Guessing at Performance:**
```typescript
// ❌ "This function feels slow, let me optimize it randomly"
function processItems(items: Item[]) {
  // Is this slow?
  const filtered = items.filter(item => item.active);

  // Or this?
  const mapped = filtered.map(item => ({
    ...item,
    displayName: formatName(item),
  }));

  // Or this?
  return mapped.sort((a, b) => a.name.localeCompare(b.name));
}
```

**Correct - Profile Before Optimizing:**
```typescript
// ✅ Use Performance Profiler
function processItems(items: Item[]) {
  // 1. Open DevTools → Performance tab
  // 2. Click Record
  // 3. Trigger the slow operation
  // 4. Click Stop

  // Profiler shows:
  // - formatName: 800ms (80% of time) ← Bottleneck!
  // - filter: 50ms
  // - map: 100ms
  // - sort: 50ms

  const filtered = items.filter(item => item.active);

  const mapped = filtered.map(item => ({
    ...item,
    displayName: formatName(item), // Optimize THIS
  }));

  return mapped.sort((a, b) => a.name.localeCompare(b.name));
}

// After profiling, optimize the bottleneck:
const nameCache = new Map<string, string>();

function formatName(item: Item): string {
  if (nameCache.has(item.id)) {
    return nameCache.get(item.id)!;
  }

  const formatted = expensiveFormatting(item);
  nameCache.set(item.id, formatted);
  return formatted;
}
// New profile: 100ms total (8x faster)
```

**Why This Matters**: Profile first, optimize second. Don't guess.

---

### 3.5 Memory Leak Detection
**Impact: HIGH**

Find and fix memory leaks.

**Incorrect - Ignoring Memory Growth:**
```typescript
// ❌ Memory leak: Event listeners not cleaned up
function ImageGallery() {
  useEffect(() => {
    const handleResize = () => {
      // Update layout
    };

    window.addEventListener('resize', handleResize);
    // Missing cleanup!
  }, []);

  return <div>{/* Gallery */}</div>;
}
// Every mount adds a new listener
// Memory usage grows indefinitely
```

**Correct - Memory Profiling:**
```typescript
// ✅ Detect leak with Memory Profiler
function ImageGallery() {
  useEffect(() => {
    const handleResize = () => {
      // Update layout
    };

    window.addEventListener('resize', handleResize);

    // Cleanup prevents leak
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div>{/* Gallery */}</div>;
}

// Memory leak detection steps:
// 1. Open DevTools → Memory tab
// 2. Take Heap Snapshot
// 3. Perform actions (mount/unmount component 10 times)
// 4. Take another Heap Snapshot
// 5. Compare snapshots
// 6. Look for growing objects (Detached DOM nodes, event listeners)
```

**Why This Matters**: Memory leaks crash production apps.

---

## 4. VS Code Debugging

### 4.1 Launch Configurations
**Impact: CRITICAL**

Configure VS Code debugger for React.

**Incorrect - No Debug Configuration:**
```json
// ❌ No .vscode/launch.json
// Debugging with console.log only
```

**Correct - Launch Configuration:**
```json
// ✅ .vscode/launch.json for Vite + React
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug in Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      },
      "preLaunchTask": "npm: dev"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

**Why This Matters**: Proper configuration enables powerful debugging.

---

### 4.2 Breakpoints and Watch
**Impact: CRITICAL**

Use breakpoints and watch expressions.

**Incorrect - Console.log Debugging:**
```typescript
// ❌ Manual logging
function calculateDiscount(price: number, quantity: number) {
  console.log('price:', price);
  console.log('quantity:', quantity);

  const subtotal = price * quantity;
  console.log('subtotal:', subtotal);

  const discount = subtotal > 100 ? 0.1 : 0;
  console.log('discount:', discount);

  return subtotal * (1 - discount);
}
```

**Correct - VS Code Breakpoints:**
```typescript
// ✅ Set breakpoint, inspect variables
function calculateDiscount(price: number, quantity: number) {
  const subtotal = price * quantity;

  // Set breakpoint here (click gutter)
  const discount = subtotal > 100 ? 0.1 : 0;
  // In Debug pane, add Watch expressions:
  // - subtotal > 100
  // - discount
  // - subtotal * (1 - discount)

  return subtotal * (1 - discount);
}

// Watch expressions evaluate in real-time
// No code changes needed
// Can modify variables while debugging
```

**Why This Matters**: Breakpoints + watch = interactive debugging.

---

### 4.3 Call Stack Navigation
**Impact: HIGH**

Navigate call stack to find root cause.

**Incorrect - Only Looking at Error Line:**
```typescript
// ❌ Error thrown, only checking the error line
function formatUser(user: User) {
  return user.name.toUpperCase(); // TypeError: Cannot read 'toUpperCase' of undefined
  // Only looking here doesn't show WHY user.name is undefined
}
```

**Correct - Inspect Call Stack:**
```typescript
// ✅ Navigate up the call stack
function formatUser(user: User) {
  return user.name.toUpperCase();
  // Error occurs here, but let's check the call stack:
}

function displayUser(userId: string) {
  const user = fetchUser(userId);
  return formatUser(user); // Stack frame #2
}

function handleClick() {
  displayUser('invalid-id'); // Stack frame #3 (root cause)
}

// In VS Code Call Stack pane:
// 1. formatUser (user.name is undefined)
// 2. displayUser (user is undefined)
// 3. handleClick (passing 'invalid-id')
// Root cause: Invalid ID passed to handleClick
```

**Why This Matters**: Call stack shows the path to the bug.

---

### 4.4 Debug Console
**Impact: HIGH**

Execute code while debugging.

**Incorrect - Restart to Test Changes:**
```typescript
// ❌ Making changes, restarting debugger
function processData(data: Data[]) {
  // Want to test: data.filter(d => d.active)
  // Must: Edit code → Save → Restart debugger
  const filtered = data.filter(d => d.enabled); // Wrong property
  return filtered;
}
```

**Correct - Debug Console:**
```typescript
// ✅ Test expressions in Debug Console
function processData(data: Data[]) {
  // Set breakpoint here
  const filtered = data.filter(d => d.enabled);

  // In Debug Console, type:
  // > data.filter(d => d.active)
  // > data.filter(d => d.enabled)
  // > data.map(d => d.status)
  // Test different expressions without restarting

  return filtered;
}
```

**Why This Matters**: Debug Console enables rapid experimentation.

---

## 5. React DevTools

### 5.1 Component Tree Inspection
**Impact: CRITICAL**

Inspect React component hierarchy.

**Incorrect - Blind Component Debugging:**
```typescript
// ❌ Not sure which component is rendering
function App() {
  return (
    <Layout>
      <Sidebar />
      <Content>
        <UserProfile /> {/* Is this rendering? */}
      </Content>
    </Layout>
  );
}
// "Why isn't UserProfile showing?"
```

**Correct - React DevTools Tree:**
```typescript
// ✅ Use React DevTools to inspect tree
function App() {
  return (
    <Layout>
      <Sidebar />
      <Content>
        <UserProfile />
      </Content>
    </Layout>
  );
}

// In React DevTools:
// ▼ App
//   ▼ Layout
//     • Sidebar
//     ▼ Content
//       • UserProfile ← Found it, but why not visible?
//         Props: {user: null} ← Ah, user is null!
```

**Why This Matters**: Tree inspection reveals component structure instantly.

---

### 5.2 Props and State Inspection
**Impact: CRITICAL**

Inspect component props and state in real-time.

**Incorrect - Console.log Props:**
```typescript
// ❌ Adding console.logs to inspect props
function UserCard({ user, onEdit }: UserCardProps) {
  console.log('user:', user);
  console.log('onEdit:', onEdit);

  return (
    <div>
      <h3>{user.name}</h3>
    </div>
  );
}
```

**Correct - React DevTools Inspection:**
```typescript
// ✅ Inspect in React DevTools
function UserCard({ user, onEdit }: UserCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <h3>{user.name}</h3>
    </div>
  );
}

// In React DevTools:
// 1. Select UserCard component
// 2. Right pane shows:
//    Props:
//      user: {id: 1, name: 'John', email: 'john@example.com'}
//      onEdit: ƒ onEdit()
//    State:
//      isEditing: false
// 3. Can edit props/state live to test behavior
```

**Why This Matters**: Live props/state inspection without code changes.

---

### 5.3 Profiler for Performance
**Impact: HIGH**

Find React re-render performance issues.

**Incorrect - Guessing at Re-renders:**
```typescript
// ❌ "This component feels slow, let me add React.memo randomly"
const UserCard = React.memo(function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
});
// Did this help? No idea.
```

**Correct - React Profiler:**
```typescript
// ✅ Profile before optimizing
function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
}

// Profiling steps:
// 1. Open React DevTools → Profiler tab
// 2. Click Record
// 3. Perform slow action
// 4. Click Stop
// 5. Analyze:
//    - UserCard rendered 47 times (why?)
//    - Render duration: 0.2ms each
//    - Total: 9.4ms (bottleneck!)
//    - Reason: Parent re-renders with new object reference

// Optimization based on profile data:
const UserCard = React.memo(
  function UserCard({ user }: UserCardProps) {
    return <div>{user.name}</div>;
  },
  (prev, next) => prev.user.id === next.user.id
);
// New profile: 1 render, 0.2ms (47x faster)
```

**Why This Matters**: Profile before optimizing. Data beats guesses.

---

### 5.4 Hooks Debugging
**Impact: CRITICAL**

Debug React hooks state and dependencies.

**Incorrect - Confusing Hook Behavior:**
```typescript
// ❌ Hook dependencies causing bugs
function UserProfile({ userId }: Props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // Bug: Missing userId dependency

  // Why doesn't user update when userId changes?
  return <div>{user?.name}</div>;
}
```

**Correct - React DevTools Hooks:**
```typescript
// ✅ Inspect hooks in React DevTools
function UserProfile({ userId }: Props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // Fixed dependency

  return <div>{user?.name}</div>;
}

// In React DevTools:
// 1. Select UserProfile component
// 2. Right pane → Hooks section shows:
//    State (0): null
//    Effect (0): [userId: '123']
// 3. When userId changes, Effect deps update
// 4. Can verify effect re-runs
```

**Why This Matters**: Hooks pane reveals dependency issues instantly.

---

## 6. Network Debugging

### 6.1 Request/Response Inspection
**Impact: CRITICAL**

Inspect API requests and responses.

**Incorrect - Blind API Calls:**
```typescript
// ❌ No visibility into API failures
async function loginUser(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data; // Failed, but why?
}
```

**Correct - Network Tab Inspection:**
```typescript
// ✅ Inspect in Network tab
async function loginUser(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  // Network tab reveals:
  // Request Headers:
  //   Content-Type: text/plain ← Wrong! Should be application/json
  // Request Payload:
  //   {"email":"test@example.com","password":"pass123"}
  // Response:
  //   415 Unsupported Media Type
  //   {error: "Expected application/json"}

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Login failed: ${error.message}`);
  }

  return await response.json();
}
```

**Why This Matters**: Network tab shows request/response details instantly.

---

### 6.2 CORS Errors
**Impact: CRITICAL**

Debug CORS errors.

**Incorrect - Ignoring CORS:**
```typescript
// ❌ CORS error, no investigation
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    return await response.json();
  } catch (error) {
    console.error('Failed'); // No details
  }
}
// Console: "Access to fetch... has been blocked by CORS policy"
```

**Correct - CORS Debugging:**
```typescript
// ✅ Investigate CORS error
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

// Network tab shows:
// Request Headers:
//   Origin: http://localhost:5173
// Response Headers:
//   (missing) Access-Control-Allow-Origin
// Error: No 'Access-Control-Allow-Origin' header

// Solutions:
// 1. Backend: Add CORS headers
//    Access-Control-Allow-Origin: http://localhost:5173
//    Access-Control-Allow-Methods: GET, POST
//    Access-Control-Allow-Headers: Content-Type
//
// 2. Development: Use Vite proxy
//    // vite.config.ts
//    server: {
//      proxy: {
//        '/api': 'https://api.example.com'
//      }
//    }
```

**Why This Matters**: CORS errors require specific headers. Network tab shows missing headers.

---

### 6.3 WebSocket Debugging
**Impact: HIGH**

Debug WebSocket connections.

**Incorrect - No WebSocket Visibility:**
```typescript
// ❌ WebSocket failing, no debugging
function useWebSocket() {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => console.log('Connected');
    ws.onerror = (err) => console.error('Error'); // What error?
  }, []);
}
```

**Correct - WebSocket Debugging:**
```typescript
// ✅ Debug in Network tab → WS
function useWebSocket() {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Network tab → WS → Status: 101 Switching Protocols
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      // Network tab → WS → Messages shows all messages
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Network tab → WS → Status: Failed
      // Check: Connection refused? Auth failure?
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      // Network tab → WS → Close code: 1006 (Abnormal closure)
    };

    return () => ws.close();
  }, []);
}

// Network tab → WS filter shows:
// - Connection status
// - Sent/received messages
// - Close codes
// - Timing
```

**Why This Matters**: WebSocket debugging requires Network tab → WS filter.

---

### 6.4 API Error Handling
**Impact: CRITICAL**

Handle and debug API errors properly.

**Incorrect - Swallowing Errors:**
```typescript
// ❌ Poor error handling
async function fetchUser(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`);
    return await response.json();
  } catch (error) {
    return null; // Swallowed error, no debugging info
  }
}
```

**Correct - Comprehensive Error Handling:**
```typescript
// ✅ Detailed error handling
async function fetchUser(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      // Extract error details
      const contentType = response.headers.get('content-type');
      const errorBody = contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

      // Log comprehensive error info
      console.error('API Error:', {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorBody,
      });

      throw new Error(
        `Failed to fetch user: ${response.status} ${errorBody.message || errorBody}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error (offline, DNS failure, etc.)
      console.error('Network error:', error.message);
    }
    throw error;
  }
}
```

**Why This Matters**: Detailed errors speed up debugging.

---

## 7. Console Debugging Patterns

### 7.1 Strategic Log Placement
**Impact: HIGH**

Place logs strategically, not everywhere.

**Incorrect - Logs Everywhere:**
```typescript
// ❌ Excessive, unfocused logging
function processCheckout(cart: Cart) {
  console.log('processCheckout start');
  console.log('cart:', cart);

  const validated = validateCart(cart);
  console.log('validated:', validated);

  const priced = calculatePrice(validated);
  console.log('priced:', priced);

  const taxed = addTax(priced);
  console.log('taxed:', taxed);

  const charged = chargePayment(taxed);
  console.log('charged:', charged);

  console.log('processCheckout end');
  return charged;
}
// Console: Flooded with logs, hard to find bugs
```

**Correct - Strategic Logging:**
```typescript
// ✅ Focused, meaningful logs
function processCheckout(cart: Cart) {
  console.group(`🛒 Processing checkout: ${cart.id}`);

  try {
    const validated = validateCart(cart);
    console.log('✓ Cart validated:', {
      itemCount: validated.items.length,
      total: validated.total,
    });

    const priced = calculatePrice(validated);
    // Only log if unexpected
    if (priced.total !== validated.total) {
      console.warn('⚠️ Price changed:', {
        before: validated.total,
        after: priced.total,
        diff: priced.total - validated.total,
      });
    }

    const charged = chargePayment(priced);
    console.log('✓ Payment charged:', charged.transactionId);

    return charged;
  } catch (error) {
    console.error('✗ Checkout failed:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}
```

**Why This Matters**: Strategic logs highlight problems without noise.

---

### 7.2 Console Methods
**Impact: HIGH**

Use the right console method for the job.

**Incorrect - Only console.log:**
```typescript
// ❌ Using console.log for everything
function analyzeData(data: Data[]) {
  console.log('Data:');
  console.log(data);
  console.log('Warning: Large dataset');
  console.log('Error: Invalid item found');
}
```

**Correct - Appropriate Console Methods:**
```typescript
// ✅ Use specific console methods
function analyzeData(data: Data[]) {
  // Table for arrays/objects
  console.table(data);

  // Group related logs
  console.group('Data Analysis');
  console.log('Total items:', data.length);
  console.log('Valid items:', data.filter(d => d.valid).length);
  console.groupEnd();

  // Warning for warnings
  if (data.length > 1000) {
    console.warn('Large dataset may impact performance');
  }

  // Error for errors
  const invalid = data.find(d => !d.valid);
  if (invalid) {
    console.error('Invalid item found:', invalid);
  }

  // Time performance
  console.time('Processing');
  processData(data);
  console.timeEnd('Processing'); // "Processing: 42ms"

  // Assert conditions
  console.assert(data.length > 0, 'Data array should not be empty');

  // Trace call stack
  console.trace('analyzeData called from');
}
```

**Why This Matters**: Right method = better visibility and filtering.

---

### 7.3 Custom Formatters
**Impact: MEDIUM**

Create custom formatters for complex objects.

**Incorrect - Unreadable Object Logs:**
```typescript
// ❌ Large objects are hard to read
function debugUser(user: User) {
  console.log(user);
  // Output: {id: 1, name: 'John', email: 'john@example.com', preferences: {...}, settings: {...}, ...}
  // Hard to find relevant info
}
```

**Correct - Custom Formatter:**
```typescript
// ✅ Custom formatter for clarity
const formatUser = (user: User) => ({
  ID: user.id,
  Name: user.name,
  Email: user.email,
  Role: user.role,
  Status: user.isActive ? '✓ Active' : '✗ Inactive',
});

function debugUser(user: User) {
  console.table(formatUser(user));
  // Output (table format):
  // ┌────────┬─────────────────┐
  // │ (idx)  │ Values          │
  // ├────────┼─────────────────┤
  // │ ID     │ 1               │
  // │ Name   │ 'John'          │
  // │ Email  │ 'john@...'      │
  // │ Role   │ 'admin'         │
  // │ Status │ '✓ Active'      │
  // └────────┴─────────────────┘
}

// For arrays:
function debugUsers(users: User[]) {
  console.table(
    users.map(formatUser),
    ['ID', 'Name', 'Role', 'Status']
  );
}
```

**Why This Matters**: Custom formatters make complex data readable.

---

### 7.4 Removing Debug Logs
**Impact: CRITICAL**

Remove debug logs before production.

**Incorrect - Manual Removal:**
```typescript
// ❌ Manually removing console.logs
function processData(data: Data[]) {
  // console.log('Processing data:', data);

  const result = transform(data);
  // console.log('Result:', result);

  // Forgot to remove this one:
  console.log('Secret API key:', process.env.API_KEY);

  return result;
}
```

**Correct - Automated Removal:**
```typescript
// ✅ Use build tools to remove logs

// Option 1: ESLint rule
// .eslintrc.js
{
  "rules": {
    "no-console": ["error", { "allow": ["warn", "error"] }]
  }
}

// Option 2: Vite plugin
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});

// Option 3: Custom logger
// utils/logger.ts
export const logger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },
  warn: console.warn, // Always show
  error: console.error, // Always show
};

// Usage:
import { logger } from '@/utils/logger';

function processData(data: Data[]) {
  logger.log('Processing data:', data); // Removed in production
  logger.error('Critical error'); // Kept in production
}
```

**Why This Matters**: Production logs leak secrets and clutter console.

---

## 8. Error Tracking

### 8.1 Sentry Integration
**Impact: CRITICAL**

Track errors in production with Sentry.

**Incorrect - No Error Tracking:**
```typescript
// ❌ Errors happen in production, but you don't know
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
// User encounters error, you have no visibility
```

**Correct - Sentry Integration:**
```typescript
// ✅ Sentry captures errors automatically
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event, hint) {
    // Enrich with context
    if (hint.originalException instanceof Error) {
      event.contexts = {
        ...event.contexts,
        user: getCurrentUser(),
        app: {
          version: __APP_VERSION__,
          buildId: __BUILD_ID__,
        },
      };
    }
    return event;
  },
});

function App() {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorPage />}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </Sentry.ErrorBoundary>
  );
}
```

**Why This Matters**: Can't fix what you can't see. Sentry provides visibility.

---

### 8.2 Error Boundaries
**Impact: CRITICAL**

Catch React errors with Error Boundaries.

**Incorrect - No Error Boundaries:**
```typescript
// ❌ One error crashes the entire app
function App() {
  return (
    <div>
      <Header />
      <BuggyComponent /> {/* Error here crashes everything */}
      <Footer />
    </div>
  );
}
```

**Correct - Error Boundaries:**
```typescript
// ✅ Isolate errors with boundaries
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught:', error, info);
    // Send to error tracking
    Sentry.captureException(error, { contexts: { react: info } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <div>
      <Header />
      <ErrorBoundary>
        <BuggyComponent /> {/* Error isolated here */}
      </ErrorBoundary>
      <Footer /> {/* Still works */}
    </div>
  );
}
```

**Why This Matters**: Error boundaries prevent total app crashes.

---

### 8.3 Context Enrichment
**Impact: HIGH**

Add context to errors for easier debugging.

**Incorrect - Minimal Error Info:**
```typescript
// ❌ Error with no context
async function fetchUserOrders(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}/orders`);
    return await response.json();
  } catch (error) {
    throw error; // No context
  }
}
// Error in Sentry: "Failed to fetch"
// Which user? What API? When?
```

**Correct - Enriched Errors:**
```typescript
// ✅ Add comprehensive context
async function fetchUserOrders(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}/orders`);

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Enrich error with context
    Sentry.captureException(error, {
      tags: {
        operation: 'fetch_orders',
        userId,
      },
      contexts: {
        request: {
          url: `/api/users/${userId}/orders`,
          method: 'GET',
        },
      },
      extra: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      },
    });
    throw error;
  }
}

// Sentry now shows:
// - Which operation failed
// - Which user
// - What API endpoint
// - When it happened
// - User's browser
```

**Why This Matters**: Context transforms "error happened" into "why error happened".

---

### 8.4 Stack Trace Analysis
**Impact: CRITICAL**

Read stack traces to find root cause.

**Incorrect - Only Reading Error Message:**
```typescript
// ❌ Error message: "Cannot read property 'name' of undefined"
// Only looking at message, not stack trace
```

**Correct - Analyze Full Stack Trace:**
```
// ✅ Read the complete stack trace
TypeError: Cannot read property 'name' of undefined
    at formatUser (app.js:42:20)           ← Error occurred here
    at UserCard (app.js:58:15)             ← Called from here
    at renderUsers (app.js:102:10)         ← Called from here
    at App (app.js:200:5)                  ← Root caller

// Analysis:
// 1. Error: Property 'name' is undefined
// 2. Location: formatUser function, line 42
// 3. Call chain: App → renderUsers → UserCard → formatUser
// 4. Root cause: formatUser received undefined user

// Fix:
function formatUser(user: User | undefined) {
  if (!user) {
    return { displayName: 'Unknown User' };
  }
  return { displayName: user.name };
}
```

**Why This Matters**: Stack trace shows the path to the error, not just the error.

---

## 9. Production Debugging

### 9.1 Source Maps
**Impact: CRITICAL**

Enable source maps for production debugging.

**Incorrect - No Source Maps:**
```typescript
// ❌ Production build without source maps
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: false,  // Minified code is unreadable
  },
});

// Error in production:
// at e.t (main.abc123.js:1:4567)  ← Useless
```

**Correct - Source Maps Enabled:**
```typescript
// ✅ Enable source maps for production
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true,  // Generates .map files
    // Or 'hidden' to exclude from bundle:
    // sourcemap: 'hidden',
  },
});

// Error in production with source maps:
// at formatUser (UserCard.tsx:42:20)  ← Readable!
// at UserCard (UserCard.tsx:58:15)
// Shows original source code, not minified

// Security: Upload source maps to Sentry privately
// Don't serve .map files publicly
```

**Why This Matters**: Source maps make production errors debuggable.

---

### 9.2 Session Replay Tools
**Impact: HIGH**

See what users did before the error.

**Incorrect - No Visibility:**
```typescript
// ❌ Error reported, but no idea what user did
// "User got an error on checkout page"
// Can't reproduce it
```

**Correct - Session Replay:**
```typescript
// ✅ Sentry Replay captures user session
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
      // Privacy: Mask sensitive fields
      maskTextSelector: '[data-sensitive]',
    }),
  ],
  replaysSessionSampleRate: 0.1,  // 10% of sessions
  replaysOnErrorSampleRate: 1.0,  // 100% of errors
});

// In Sentry, you can:
// 1. Watch video of user's session
// 2. See clicks, inputs, navigation
// 3. See console logs
// 4. See network requests
// 5. Reproduce the exact bug
```

**Why This Matters**: Replay shows the path to the error, making bugs reproducible.

---

### 9.3 Remote Logging
**Impact: HIGH**

Send logs from production to a central service.

**Incorrect - No Production Logs:**
```typescript
// ❌ Errors in production, but no logs
function processPayment(amount: number) {
  // No logging in production
  // Errors silently fail
}
```

**Correct - Remote Logging:**
```typescript
// ✅ Send logs to remote service
import { logger } from '@/utils/logger';

// utils/logger.ts
import * as Sentry from '@sentry/react';

export const logger = {
  info(message: string, context?: Record<string, any>) {
    if (import.meta.env.DEV) {
      console.log(message, context);
    } else {
      Sentry.addBreadcrumb({
        message,
        level: 'info',
        data: context,
      });
    }
  },

  warn(message: string, context?: Record<string, any>) {
    console.warn(message, context);
    Sentry.captureMessage(message, {
      level: 'warning',
      contexts: { custom: context },
    });
  },

  error(message: string, error?: Error, context?: Record<string, any>) {
    console.error(message, error, context);
    Sentry.captureException(error || new Error(message), {
      contexts: { custom: context },
    });
  },
};

// Usage:
function processPayment(amount: number) {
  logger.info('Processing payment', { amount });

  try {
    const result = chargeCard(amount);
    logger.info('Payment successful', { transactionId: result.id });
  } catch (error) {
    logger.error('Payment failed', error, { amount });
    throw error;
  }
}
```

**Why This Matters**: Remote logs provide visibility into production issues.

---

### 9.4 Feature Flags for Rollback
**Impact: HIGH**

Use feature flags to quickly disable buggy features.

**Incorrect - Deploying Fixes:**
```typescript
// ❌ Bug in production, must deploy fix
// 1. Write fix
// 2. Test fix
// 3. Deploy (20 minutes)
// Users impacted for 20+ minutes
```

**Correct - Feature Flag Rollback:**
```typescript
// ✅ Feature flag for instant rollback
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

function CheckoutPage() {
  const newCheckoutEnabled = useFeatureFlag('new-checkout-flow');

  if (newCheckoutEnabled) {
    return <NewCheckout />;  // Buggy version
  }

  return <LegacyCheckout />;  // Stable version
}

// Bug discovered in production:
// 1. Disable 'new-checkout-flow' flag in admin panel
// 2. Users instantly see stable version
// 3. Fix bug at your own pace
// 4. Re-enable flag when fixed

// Feature flag service:
export function useFeatureFlag(flag: string): boolean {
  const { data: flags } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: () => fetch('/api/feature-flags').then(r => r.json()),
    staleTime: 60_000, // 1 minute
  });

  return flags?.[flag] ?? false;
}
```

**Why This Matters**: Feature flags enable instant rollback without deployment.

---

## 10. Pulwave Integration

### 10.1 Debugging in Monorepo
**Impact: CRITICAL**

Debug across multiple packages in Turborepo.

**Incorrect - Can't Debug Packages:**
```typescript
// ❌ Import from @pulwave/ui, can't step into code
import { Button } from '@pulwave/ui';

function App() {
  return <Button onClick={handleClick}>Click</Button>;
  // Can't debug inside Button component
}
```

**Correct - Source Maps in Monorepo:**
```typescript
// ✅ Configure Vite to use package source maps
// apps/web/real-estate/vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@pulwave/ui',
      '@pulwave/data',
      '@pulwave/foundation',
      '@pulwave/patterns',
    ],
  },
  build: {
    sourcemap: true,
  },
});

// packages/ui/vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
    },
    sourcemap: true,  // Generate source maps
  },
});

// Now you can:
// 1. Set breakpoints in @pulwave/ui code
// 2. Step through package source code
// 3. Inspect package variables
```

**Why This Matters**: Source maps enable debugging across package boundaries.

---

### 10.2 TanStack Query DevTools
**Impact: CRITICAL**

Debug TanStack Query cache and requests.

**Incorrect - No Query Visibility:**
```typescript
// ❌ Query not working, no visibility
import { useProfile } from '@pulwave/data';

function ProfilePage() {
  const { data: profile } = useProfile();
  // Why is profile undefined?
  // Is query loading? Failed? Stale?

  return <div>{profile?.name}</div>;
}
```

**Correct - TanStack Query DevTools:**
```typescript
// ✅ Install DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>

      {/* DevTools panel (only in development) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// DevTools shows:
// 1. All queries with their keys
// 2. Query status (loading, success, error)
// 3. Query data
// 4. Cache age (fresh, stale, inactive)
// 5. Refetch count
// 6. Manual refetch button
// 7. Invalidate cache button

// Debug profile query:
// - Query key: ['profile', userId]
// - Status: success
// - Data: {id: 1, name: 'John'}
// - Data updated: 2s ago
// - Stale in: 5m
```

**Why This Matters**: DevTools reveals query state and cache instantly.

---

### 10.3 Supabase Debugging
**Impact: CRITICAL**

Debug Supabase queries and auth.

**Incorrect - Blind Supabase Queries:**
```typescript
// ❌ Query failing, no visibility
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId);

// What query was sent?
// What error occurred?
// What permissions failed?
```

**Correct - Supabase Debugging:**
```typescript
// ✅ Enable Supabase logging
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      debug: import.meta.env.DEV,  // Log auth events
    },
    global: {
      headers: {
        'x-client-info': 'pulwave-web',
      },
    },
  }
);

// Enhanced query with logging
async function fetchProfile(userId: string) {
  console.group('🔍 Fetching profile');
  console.log('User ID:', userId);

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Supabase error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    // Common errors:
    // - PGRST116: No rows found (404)
    // - 42501: Permission denied (RLS policy)
    // - 23505: Unique constraint violation
  }

  console.log('Result:', data);
  console.groupEnd();

  return { data, error };
}

// Check Supabase Dashboard:
// 1. Table Editor → profiles
// 2. Logs → API logs (see actual SQL queries)
// 3. Auth → Users (verify user session)
// 4. Database → Roles → RLS policies
```

**Why This Matters**: Supabase logs reveal RLS failures and query issues.

---

### 10.4 Vite Debug Configuration
**Impact: HIGH**

Configure Vite for optimal debugging.

**Incorrect - Default Vite Config:**
```typescript
// ❌ Default config, hard to debug
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
});
// Minified dependencies
// No source maps
// Slow HMR
```

**Correct - Debug-Optimized Vite:**
```typescript
// ✅ Optimized for debugging
// apps/web/real-estate/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Add debug info to components
      jsxRuntime: 'automatic',
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Don't pre-bundle monorepo packages (for debugging)
  optimizeDeps: {
    exclude: [
      '@pulwave/ui',
      '@pulwave/data',
      '@pulwave/foundation',
      '@pulwave/patterns',
      '@pulwave/features',
    ],
  },

  build: {
    sourcemap: true,
    minify: false, // Disable in debug builds
  },

  server: {
    port: 5173,
    strictPort: true,
    // Enable network access for mobile debugging
    host: true,
    // Proxy Supabase for CORS
    proxy: {
      '/api': {
        target: import.meta.env.VITE_SUPABASE_URL,
        changeOrigin: true,
      },
    },
  },

  // Clear cache on restart
  cacheDir: '.vite',
});
```

**Why This Matters**: Proper Vite config enables fast, effective debugging.

---

## 11. Appendices

### 11.1 Debugging Checklist

**Before Debugging:**
- [ ] Can you reproduce the bug consistently?
- [ ] What is the expected behavior?
- [ ] What is the actual behavior?
- [ ] What changed recently (git log)?
- [ ] Is this a regression?

**During Debugging:**
- [ ] Have you read the error message completely?
- [ ] Have you checked the stack trace?
- [ ] Have you inspected the network tab?
- [ ] Have you checked React DevTools?
- [ ] Have you used breakpoints instead of console.log?
- [ ] Have you isolated the problem (bisection)?
- [ ] Have you formed a hypothesis?
- [ ] Have you tested your hypothesis?

**After Fixing:**
- [ ] Did you find the root cause (not just symptoms)?
- [ ] Can you prevent this bug class in the future?
- [ ] Did you add tests to prevent regression?
- [ ] Did you remove debug code (console.log)?
- [ ] Did you document the fix?

---

### 11.2 Common Bug Patterns

**"Cannot read property 'X' of undefined"**
```typescript
// Cause: Accessing property on undefined/null
const name = user.name; // user is undefined

// Fix: Optional chaining
const name = user?.name;

// Better: Type guards
if (!user) return null;
const name = user.name;
```

**"Maximum update depth exceeded"**
```typescript
// Cause: setState in render
function BadComponent() {
  const [count, setCount] = useState(0);
  setCount(count + 1); // Infinite loop
  return <div>{count}</div>;
}

// Fix: Move to useEffect or event handler
function GoodComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1);
  }, []); // Or in event handler
}
```

**"Cannot update component while rendering different component"**
```typescript
// Cause: setState during render
function Parent() {
  const [state, setState] = useState(0);
  return <Child setState={setState} />;
}

function Child({ setState }) {
  setState(1); // Update during render
  return null;
}

// Fix: Use callback
function Child({ setState }) {
  const handleClick = () => setState(1);
  return <button onClick={handleClick}>Click</button>;
}
```

**"CORS policy blocked"**
```typescript
// Cause: Missing CORS headers
fetch('https://api.example.com/data');
// Error: No 'Access-Control-Allow-Origin' header

// Fix: Backend adds headers
res.setHeader('Access-Control-Allow-Origin', '*');

// Or: Use proxy in development
// vite.config.ts
server: {
  proxy: {
    '/api': 'https://api.example.com'
  }
}
```

---

### 11.3 DevTools Shortcuts

**Chrome DevTools:**
```
Ctrl + Shift + I / Cmd + Opt + I  → Open DevTools
Ctrl + Shift + C / Cmd + Opt + C  → Inspect element
Ctrl + Shift + J / Cmd + Opt + J  → Console
Ctrl + [ / Cmd + [               → Previous panel
Ctrl + ] / Cmd + ]               → Next panel
Ctrl + Shift + D / Cmd + Opt + D  → Dock position
Esc                              → Toggle drawer
Ctrl + F / Cmd + F               → Search
Ctrl + P / Cmd + P               → Open file
Ctrl + Shift + P / Cmd + Shift + P → Command palette
```

**Debugger Shortcuts:**
```
F8                  → Resume execution
F9                  → Toggle breakpoint
F10                 → Step over
F11                 → Step into
Shift + F11         → Step out
Ctrl + .            → Next call frame
Ctrl + ,            → Previous call frame
```

**Console Shortcuts:**
```
$_                  → Last evaluated expression
$0                  → Last selected element
$1                  → Second-to-last selected element
$$('selector')      → document.querySelectorAll
$x('xpath')         → XPath query
clear()             → Clear console
copy(obj)           → Copy to clipboard
inspect(element)    → Inspect element
```

---

### 11.4 Git Bisect Reference

**Manual Bisect:**
```bash
# Start bisect
git bisect start

# Mark current commit as bad
git bisect bad

# Mark last known good commit (e.g., tag or commit hash)
git bisect good v1.2.0

# Git checks out middle commit
# Test it manually (run app, check bug)

# If bug exists:
git bisect bad

# If bug doesn't exist:
git bisect good

# Repeat until Git identifies the first bad commit
# Output: "abc123 is the first bad commit"

# Reset when done
git bisect reset
```

**Automated Bisect:**
```bash
# Fully automated with test script
git bisect start HEAD v1.2.0
git bisect run npm test

# Git automatically runs test on each commit
# Exits with 0 (good) or 1 (bad)
# Finds the first bad commit automatically

# Reset
git bisect reset
```

**Bisect with Skip:**
```bash
# If a commit can't be tested (won't build):
git bisect skip

# Continue bisecting
```

**Bisect Log:**
```bash
# View bisect log
git bisect log

# Replay bisect from log
git bisect replay bisect-log.txt
```

---

