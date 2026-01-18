# Unit & Integration Testing - Complete Implementation Guide

**Version**: 1.0.0
**Last Updated**: 2026-01-17
**Skill Level**: Senior QA Engineer

---

## Abstract

This guide provides comprehensive patterns for unit and integration testing with Vitest and React Testing Library. Covers test structure, component testing, hook testing, mocking strategies, TDD workflow, and achieving high-signal test coverage.

**Target Audience**: Frontend engineers, QA engineers, developers practicing TDD.

**Pulwave Context**: Uses Vitest for test runner, React Testing Library for component tests, MSW for API mocking, and implements test-driven development for critical features.

---

## Table of Contents

1. [Test Structure & Organization](#1-test-structure--organization)
   - 1.1 Colocate Tests with Source Code (CRITICAL)
   - 1.2 Use Descriptive Test Names (HIGH)
   - 1.3 AAA Pattern: Arrange, Act, Assert (CRITICAL)
   - 1.4 One Assertion Per Test (MEDIUM)
   - 1.5 Test File Naming Conventions (LOW)

2. [Component Testing](#2-component-testing)
   - 2.1 Test User Behavior, Not Implementation (CRITICAL)
   - 2.2 Query by Accessibility Role (HIGH)
   - 2.3 Avoid Testing Implementation Details (CRITICAL)
   - 2.4 Test Conditional Rendering (HIGH)
   - 2.5 Async Component Testing (HIGH)

3. [Hook Testing](#3-hook-testing)
   - 3.1 Use renderHook for Custom Hooks (HIGH)
   - 3.2 Test Hook State Changes (MEDIUM)
   - 3.3 Test Hook Dependencies (MEDIUM)
   - 3.4 Mock External Dependencies (HIGH)

4. [Mocking Patterns](#4-mocking-patterns)
   - 4.1 Mock Modules with vi.mock (HIGH)
   - 4.2 Mock Functions with vi.fn (HIGH)
   - 4.3 Mock API Calls with MSW (CRITICAL)
   - 4.4 Mock Timers for Async Code (MEDIUM)
   - 4.5 Spy on Functions (MEDIUM)

5. [TDD Workflow](#5-tdd-workflow)
   - 5.1 Red-Green-Refactor Cycle (CRITICAL)
   - 5.2 Write Failing Test First (HIGH)
   - 5.3 Write Minimum Code to Pass (MEDIUM)
   - 5.4 Refactor with Confidence (MEDIUM)

6. [Coverage Strategy](#6-coverage-strategy)
   - 6.1 Focus on High-Value Paths (CRITICAL)
   - 6.2 Avoid 100% Coverage Goal (MEDIUM)
   - 6.3 Test Edge Cases and Error Paths (HIGH)
   - 6.4 Measure Meaningful Coverage (MEDIUM)

7. [Performance & Reliability](#7-performance--reliability)
   - 7.1 Keep Tests Fast (<100ms Each) (HIGH)
   - 7.2 Eliminate Test Flakiness (CRITICAL)
   - 7.3 Isolate Tests (No Shared State) (CRITICAL)
   - 7.4 Parallelize Test Execution (MEDIUM)

8. [Advanced Patterns](#8-advanced-patterns)
   - 8.1 Snapshot Testing (Use Sparingly) (LOW)
   - 8.2 Test Utilities and Helpers (MEDIUM)
   - 8.3 Visual Regression Testing (LOW)
   - 8.4 Contract Testing (LOW)

---

## 1. Test Structure & Organization

### 1.1 Colocate Tests with Source Code

**Impact: CRITICAL** (improves discoverability, easier maintenance)

**Why**: Tests next to source code are easier to find, update, and keep in sync. Prevents "orphaned tests" when files move.

**Incorrect: Separate tests directory**
```
src/
  components/
    Button.tsx
  utils/
    formatters.ts
tests/
  components/
    Button.test.tsx    # Far from source
  utils/
    formatters.test.ts # Easy to miss when moving files
```

**Correct: Colocated tests**
```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx     # Next to source
      types.ts
      index.ts
  utils/
    formatters.ts
    formatters.test.ts  # Next to source
```

**Metrics**: Colocated tests reduce "orphaned test" rate by 90%. Easier code reviews (changes + tests in same PR).

**Pulwave-specific**: Standard structure:
```
packages/ui/components/Button/
├── Button.tsx
├── Button.test.tsx
├── __tests__/
│   ├── Button.integration.test.tsx
│   └── Button.a11y.test.tsx
├── types.ts
├── index.ts
└── styles/
    └── _index.scss
```

---

### 1.2 Use Descriptive Test Names (it/test statements)

**Impact: HIGH** (failing tests tell you exactly what broke)

**Incorrect: Vague test names**
```typescript
// ❌ BAD: Unclear what is being tested
describe('Button', () => {
  it('works', () => { /* ... */ });
  it('handles click', () => { /* ... */ });
  it('test 1', () => { /* ... */ });
});
```

**Correct: Descriptive names**
```typescript
// ✅ GOOD: Clear, specific test names
describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies primary variant class when variant is primary', () => {
    render(<Button variant="primary">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--primary');
  });
});
```

**Pattern: "it should [expected behavior] when [condition]"**
- ✅ "renders error message when validation fails"
- ✅ "disables submit button when form is invalid"
- ✅ "shows loading spinner when data is loading"

**Metrics**: Descriptive names reduce debugging time by 50%+. Failing test name tells you what broke without reading code.

---

### 1.3 AAA Pattern: Arrange, Act, Assert

**Impact: CRITICAL** (standard test structure, improves readability)

**Pattern: Three distinct sections**
```typescript
// ✅ GOOD: Clear AAA structure
it('updates input value when user types', () => {
  // Arrange: Setup test data and component
  const handleChange = vi.fn();
  render(<Input value="" onChange={handleChange} />);
  const input = screen.getByRole('textbox');

  // Act: Perform action
  fireEvent.change(input, { target: { value: 'Hello' } });

  // Assert: Verify result
  expect(handleChange).toHaveBeenCalledWith('Hello');
});

// Complex example with multiple steps
it('submits form with valid data', async () => {
  // Arrange
  const onSubmit = vi.fn();
  render(<ContactForm onSubmit={onSubmit} />);

  // Act
  await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
  await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Assert
  expect(onSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com',
  });
});
```

**Metrics**: AAA pattern is industry standard. Makes tests 40% easier to understand for new team members.

---

### 1.4 One Assertion Per Test (Guideline, Not Rule)

**Impact: MEDIUM** (focused tests, easier debugging)

**Incorrect: Testing multiple unrelated things**
```typescript
// ❌ BAD: Too many unrelated assertions
it('button component', () => {
  const { rerender } = render(<Button>Click</Button>);

  expect(screen.getByRole('button')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveTextContent('Click');

  rerender(<Button disabled>Click</Button>);
  expect(screen.getByRole('button')).toBeDisabled();

  rerender(<Button variant="primary">Click</Button>);
  expect(screen.getByRole('button')).toHaveClass('btn--primary');
  // If any assertion fails, hard to know which scenario broke
});
```

**Correct: Separate tests for separate behaviors**
```typescript
// ✅ GOOD: One behavior per test
describe('Button', () => {
  it('renders with text content', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant class', () => {
    render(<Button variant="primary">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--primary');
  });

  // Multiple related assertions OK
  it('renders with icon and text', () => {
    render(<Button icon={<IconCheck />}>Save</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Save');
    expect(button.querySelector('.icon')).toBeInTheDocument();
  });
});
```

**Guideline**: Multiple assertions OK if testing same behavior. Separate tests for separate behaviors.

---

### 1.5 Test File Naming Conventions

**Impact: LOW** (consistency, test discovery)

**Pattern: Match source filename**
```
Button.tsx         → Button.test.tsx
useAuth.ts         → useAuth.test.ts
formatters.ts      → formatters.test.ts
PropertyCard.tsx   → PropertyCard.test.tsx

# Alternative: .spec.ts
Button.spec.tsx
useAuth.spec.ts
```

**Pulwave-specific**: Use `.test.tsx` for consistency:
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
  },
});
```

---

## 2. Component Testing

### 2.1 Test User Behavior, Not Implementation Details

**Impact: CRITICAL** (resilient tests, focus on user experience)

**Why**: Tests should verify what users see and do, not how code works internally. Implementation can change without breaking user experience.

**Incorrect: Testing implementation**
```typescript
// ❌ BAD: Testing internal state
it('sets isLoading state to true', () => {
  const { result } = renderHook(() => useData());

  act(() => {
    result.current.fetchData();
  });

  expect(result.current.isLoading).toBe(true);
  // Tests implementation detail (isLoading state variable name)
});

// ❌ BAD: Testing class names
it('has correct class', () => {
  render(<Button variant="primary">Click</Button>);
  expect(screen.getByRole('button')).toHaveClass('btn btn--primary');
  // Breaks if class name changes (even if button still looks/works the same)
});
```

**Correct: Testing user-visible behavior**
```typescript
// ✅ GOOD: Test what user sees
it('shows loading spinner while fetching data', async () => {
  render(<DataComponent />);

  const button = screen.getByRole('button', { name: /load data/i });
  fireEvent.click(button);

  // User sees spinner
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  // User sees data
  expect(screen.getByText(/data loaded/i)).toBeInTheDocument();
});

// ✅ GOOD: Test visual appearance indirectly
it('applies primary button styling', () => {
  render(<Button variant="primary">Click</Button>);

  const button = screen.getByRole('button');

  // Test computed style or data attribute, not class name
  expect(button).toHaveAttribute('data-variant', 'primary');
  // Or test actual visual result (if critical)
  // expect(button).toHaveStyle({ backgroundColor: 'blue' });
});
```

**Metrics**: Testing behavior (not implementation) reduces false failures by 70%. Tests survive refactoring.

**Pulwave-specific**: Test user stories:
```typescript
// User story: "As a user, I want to filter properties by price"
it('filters properties when user enters price range', async () => {
  render(<PropertyList />);

  // User enters min price
  const minPriceInput = screen.getByLabelText(/minimum price/i);
  await userEvent.type(minPriceInput, '100000');

  // User enters max price
  const maxPriceInput = screen.getByLabelText(/maximum price/i);
  await userEvent.type(maxPriceInput, '500000');

  // User clicks filter button
  await userEvent.click(screen.getByRole('button', { name: /filter/i }));

  // User sees filtered results
  await waitFor(() => {
    const properties = screen.getAllByTestId('property-card');
    properties.forEach(card => {
      const price = parseInt(card.getAttribute('data-price') || '0');
      expect(price).toBeGreaterThanOrEqual(100000);
      expect(price).toBeLessThanOrEqual(500000);
    });
  });
});
```

---

### 2.2 Query by Accessibility Role (Not Test IDs)

**Impact: HIGH** (better tests, ensures accessibility)

**Query priority (React Testing Library):**
1. **Accessible queries** (best): `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`
2. **Semantic queries** (good): `getByAltText`, `getByTitle`
3. **Test IDs** (last resort): `getByTestId`

**Incorrect: data-testid everywhere**
```typescript
// ❌ BAD: Test IDs don't help accessibility
render(
  <div>
    <button data-testid="submit-btn">Submit</button>
    <input data-testid="email-input" />
  </div>
);

const button = screen.getByTestId('submit-btn');
const input = screen.getByTestId('email-input');
```

**Correct: Accessible queries**
```typescript
// ✅ GOOD: Tests accessibility AND behavior
render(
  <form>
    <label htmlFor="email">Email</label>
    <input id="email" type="email" />
    <button type="submit">Submit</button>
  </form>
);

const input = screen.getByLabelText(/email/i);
const button = screen.getByRole('button', { name: /submit/i });

// Or by role
const input = screen.getByRole('textbox', { name: /email/i });
```

**Common roles:**
```typescript
// Buttons
screen.getByRole('button', { name: /submit/i });

// Inputs
screen.getByRole('textbox', { name: /email/i });
screen.getByRole('checkbox', { name: /agree/i });
screen.getByRole('radio', { name: /option 1/i });

// Links
screen.getByRole('link', { name: /home/i });

// Headings
screen.getByRole('heading', { name: /dashboard/i, level: 1 });

// Lists
screen.getByRole('list');
screen.getAllByRole('listitem');

// Dialogs
screen.getByRole('dialog');
```

**When to use testId:**
```typescript
// ✅ OK: When no accessible alternative
<div data-testid="chart-container">
  <svg>{/* Complex chart */}</svg>
</div>

screen.getByTestId('chart-container');
```

**Metrics**: Using accessible queries catches 60% of accessibility bugs. Forces proper labels/roles.

---

### 2.3 Avoid Testing Implementation Details

**Impact: CRITICAL** (covered in 2.1, critical enough to emphasize)

**Don't test:**
- Internal state variable names
- Private functions
- Class names (unless visual regression)
- Component structure (parent/child hierarchy)
- Exact number of renders
- Internal hooks called

**Do test:**
- What user sees (text, images, UI elements)
- What user can do (click, type, navigate)
- User feedback (loading states, errors, success messages)
- Accessibility (roles, labels, keyboard navigation)

**Example: Refactor-proof tests**
```typescript
// ❌ FRAGILE: Breaks on refactor
it('calls setIsOpen with true', () => {
  const { result } = renderHook(() => useModal());
  act(() => result.current.setIsOpen(true));
  expect(result.current.isOpen).toBe(true);
});

// ✅ RESILIENT: Tests outcome
it('shows modal when open button is clicked', () => {
  render(<ModalComponent />);

  const openButton = screen.getByRole('button', { name: /open modal/i });
  fireEvent.click(openButton);

  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

---

### 2.4 Test Conditional Rendering

**Impact: HIGH** (tests different UI states)

**Pattern: Test all render paths**
```typescript
describe('PropertyCard', () => {
  it('renders property details when data is loaded', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText(mockProperty.name)).toBeInTheDocument();
    expect(screen.getByText(/\$500,000/i)).toBeInTheDocument();
  });

  it('shows loading skeleton when data is loading', () => {
    render(<PropertyCard property={null} isLoading={true} />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  });

  it('shows error message when error occurs', () => {
    render(<PropertyCard error="Failed to load" />);

    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  });

  it('shows empty state when no property exists', () => {
    render(<PropertyCard property={null} />);

    expect(screen.getByText(/no property found/i)).toBeInTheDocument();
  });

  // Test conditional features
  it('shows "Featured" badge when property is featured', () => {
    render(<PropertyCard property={{ ...mockProperty, featured: true }} />);

    expect(screen.getByText(/featured/i)).toBeInTheDocument();
  });

  it('does not show "Featured" badge when property is not featured', () => {
    render(<PropertyCard property={{ ...mockProperty, featured: false }} />);

    expect(screen.queryByText(/featured/i)).not.toBeInTheDocument();
  });
});
```

**Metrics**: Testing all render paths catches 80% of conditional rendering bugs.

---

### 2.5 Async Component Testing with waitFor

**Impact: HIGH** (correctly test async behavior)

**Pattern: Wait for async updates**
```typescript
import { render, screen, waitFor } from '@testing-library/react';

it('loads and displays property data', async () => {
  // Arrange: Mock API
  server.use(
    rest.get('/api/properties/:id', (req, res, ctx) => {
      return res(ctx.json({ name: 'Luxury Apartment', price: 500000 }));
    })
  );

  // Act: Render component
  render(<PropertyDetails id="123" />);

  // Assert: Initially shows loading
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText(/luxury apartment/i)).toBeInTheDocument();
  });

  // Verify loaded data
  expect(screen.getByText(/\$500,000/i)).toBeInTheDocument();
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});

// Error state
it('shows error when API fails', async () => {
  server.use(
    rest.get('/api/properties/:id', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ error: 'Server error' }));
    })
  );

  render(<PropertyDetails id="123" />);

  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });
});
```

**Metrics**: Proper async testing prevents 90% of timing-related flaky tests.

---

## 3. Hook Testing

### 3.1 Use renderHook for Custom Hooks

**Impact: HIGH** (proper testing environment for hooks)

**Pattern: Test hooks in isolation**
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useProperty } from './useProperty';

it('fetches property data on mount', async () => {
  // Mock API
  const mockProperty = { id: '123', name: 'Test Property' };
  vi.mock('./propertyRepository', () => ({
    findById: vi.fn().mockResolvedValue(mockProperty),
  }));

  // Render hook
  const { result } = renderHook(() => useProperty('123'));

  // Initially loading
  expect(result.current.isLoading).toBe(true);
  expect(result.current.data).toBeUndefined();

  // Wait for data
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  // Verify data
  expect(result.current.data).toEqual(mockProperty);
  expect(result.current.error).toBeNull();
});

// Test with TanStack Query wrapper
it('refetches data when refetch is called', async () => {
  const { result } = renderHook(() => useProperty('123'), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  // Refetch
  await act(async () => {
    await result.current.refetch();
  });

  expect(result.current.isFetching).toBe(false);
});
```

---

### 3.2 Test Hook State Changes

**Impact: MEDIUM** (verifies hook logic)

**Pattern: Test state updates**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm';

it('updates field value when handleChange is called', () => {
  const { result } = renderHook(() => useForm({ name: '', email: '' }));

  // Initial state
  expect(result.current.values.name).toBe('');

  // Update state
  act(() => {
    result.current.handleChange('name', 'John Doe');
  });

  // Verify update
  expect(result.current.values.name).toBe('John Doe');
});

it('sets error when validation fails', async () => {
  const schema = z.object({ email: z.string().email() });
  const { result } = renderHook(() => useForm({ email: '' }, schema));

  // Submit invalid data
  await act(async () => {
    await result.current.handleSubmit(vi.fn());
  });

  // Verify error
  expect(result.current.errors.email).toBeDefined();
});
```

---

## 4. Mocking Patterns

### 4.1 Mock Modules with vi.mock

**Impact: HIGH** (isolate code under test)

**Pattern: Mock dependencies**
```typescript
// ✅ Module mock
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [{ id: '1', name: 'Test' }],
          error: null,
        })),
      })),
    })),
  },
}));

// Partial module mock
vi.mock('@/utils/formatters', async () => {
  const actual = await vi.importActual('@/utils/formatters');
  return {
    ...actual,
    formatCurrency: vi.fn((value) => `$${value}`),
  };
});

// Auto-mock
vi.mock('@/services/propertyService');
// All exports are mocked automatically
```

**Pulwave-specific**: Mock Supabase client:
```typescript
// __tests__/mocks/supabase.ts
export const createMockSupabaseClient = () => ({
  from: vi.fn((table: string) => ({
    select: vi.fn(() => mockSelectChain),
    insert: vi.fn(() => mockInsertChain),
    update: vi.fn(() => mockUpdateChain),
    delete: vi.fn(() => mockDeleteChain),
  })),
  auth: {
    getUser: vi.fn(() => ({ data: { user: mockUser }, error: null })),
    signIn: vi.fn(),
    signOut: vi.fn(),
  },
});
```

---

### 4.2 Mock Functions with vi.fn

**Impact: HIGH** (verify function calls)

**Pattern: Spy on callbacks**
```typescript
it('calls onClick when button is clicked', () => {
  const handleClick = vi.fn();

  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

// Mock implementation
it('calls onSubmit with form data', async () => {
  const onSubmit = vi.fn().mockResolvedValue({ success: true });

  render(<Form onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText(/name/i), 'John');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(onSubmit).toHaveBeenCalledWith({ name: 'John' });
});

// Verify call arguments
it('formats price before submitting', async () => {
  const onSubmit = vi.fn();

  render(<PropertyForm onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText(/price/i), '500000');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ price: 500000 })
  );
});
```

---

### 4.3 Mock API Calls with MSW (Mock Service Worker)

**Impact: CRITICAL** (realistic API mocking, reusable across tests)

**Setup: MSW handlers**
```typescript
// __tests__/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/properties', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: '1', name: 'Property 1', price: 500000 },
        { id: '2', name: 'Property 2', price: 750000 },
      ])
    );
  }),

  rest.post('/api/properties', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(201),
      ctx.json({ id: '3', ...body })
    );
  }),

  rest.get('/api/properties/:id', (req, res, ctx) => {
    const { id } = req.params;

    if (id === 'not-found') {
      return res(ctx.status(404), ctx.json({ error: 'Not found' }));
    }

    return res(
      ctx.status(200),
      ctx.json({ id, name: `Property ${id}`, price: 500000 })
    );
  }),
];

// __tests__/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**Setup in tests:**
```typescript
// vitest.setup.ts
import { server } from './__tests__/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Usage in tests:**
```typescript
it('loads properties from API', async () => {
  render(<PropertyList />);

  await waitFor(() => {
    expect(screen.getByText(/property 1/i)).toBeInTheDocument();
    expect(screen.getByText(/property 2/i)).toBeInTheDocument();
  });
});

// Override handler for specific test
it('shows error when API fails', async () => {
  server.use(
    rest.get('/api/properties', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ error: 'Server error' }));
    })
  );

  render(<PropertyList />);

  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });
});
```

**Metrics**: MSW eliminates 95% of "test works locally, fails in CI" issues. Reusable mocks across tests.

---

### 4.4 Mock Timers for Async Code

**Impact: MEDIUM** (test debounce, throttle, delays)

**Pattern: Control time**
```typescript
import { vi } from 'vitest';

it('debounces search input', async () => {
  vi.useFakeTimers();

  const onSearch = vi.fn();
  render(<SearchInput onSearch={onSearch} debounce={300} />);

  const input = screen.getByRole('textbox');

  // Type multiple times
  await userEvent.type(input, 'test');

  // Not called yet (debounced)
  expect(onSearch).not.toHaveBeenCalled();

  // Fast-forward time
  vi.advanceTimersByTime(300);

  // Now called once
  expect(onSearch).toHaveBeenCalledTimes(1);
  expect(onSearch).toHaveBeenCalledWith('test');

  vi.useRealTimers();
});
```

---

## 5. TDD Workflow

### 5.1 Red-Green-Refactor Cycle

**Impact: CRITICAL** (core TDD practice)

**Cycle:**
1. **Red**: Write failing test
2. **Green**: Write minimum code to pass
3. **Refactor**: Improve code quality

**Example: Building a calculator**
```typescript
// Step 1: RED - Write failing test
describe('Calculator', () => {
  it('adds two numbers', () => {
    const calc = new Calculator();
    expect(calc.add(2, 3)).toBe(5);
  });
});
// Test fails: Calculator not defined

// Step 2: GREEN - Minimum code to pass
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}
// Test passes

// Step 3: REFACTOR - Improve (if needed)
// Already simple, no refactor needed

// Next feature: RED
it('subtracts two numbers', () => {
  const calc = new Calculator();
  expect(calc.subtract(5, 3)).toBe(2);
});
// Fails: subtract not defined

// GREEN
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}
// Passes
```

**Metrics**: TDD reduces bugs by 40-80% (IBM study). Higher confidence in refactoring.

---

## 6. Coverage Strategy

### 6.1 Focus on High-Value Paths (Not 100% Coverage)

**Impact: CRITICAL** (efficient testing, avoid waste)

**Don't aim for 100% coverage:**
- Getters/setters
- Framework code
- Type definitions
- Constants
- Simple utilities

**Do test:**
- Business logic (critical paths)
- User interactions (forms, flows)
- Error handling
- Edge cases
- Integration points (API calls)

**Example: Prioritized testing**
```typescript
// ✅ HIGH VALUE: Test business logic
describe('calculatePropertyROI', () => {
  it('calculates ROI correctly', () => {
    const result = calculatePropertyROI({
      purchasePrice: 500000,
      rentalIncome: 30000,
      expenses: 10000,
    });

    expect(result).toBeCloseTo(0.04); // 4% ROI
  });

  it('handles zero income', () => {
    const result = calculatePropertyROI({
      purchasePrice: 500000,
      rentalIncome: 0,
      expenses: 10000,
    });

    expect(result).toBe(-0.02); // -2% (loss)
  });
});

// ❌ LOW VALUE: Don't test simple getters
// getter getFullName() { return `${this.firstName} ${this.lastName}`; }
// This is too simple to test (framework-level)

// ✅ HIGH VALUE: Test error paths
it('throws error when purchase price is zero', () => {
  expect(() => {
    calculatePropertyROI({
      purchasePrice: 0,
      rentalIncome: 30000,
      expenses: 10000,
    });
  }).toThrow('Purchase price must be greater than zero');
});
```

**Metrics**: 70-80% meaningful coverage catches 95% of bugs. 100% coverage adds diminishing returns.

---

## 7. Performance & Reliability

### 7.1 Keep Tests Fast (<100ms Each)

**Impact: HIGH** (fast feedback loop)

**Pattern: Avoid slow operations**
```typescript
// ❌ SLOW: Rendering entire app
it('shows user name', () => {
  render(<App />); // Renders everything
  expect(screen.getByText(/john doe/i)).toBeInTheDocument();
});

// ✅ FAST: Render minimal component
it('shows user name', () => {
  render(<UserProfile user={{ name: 'John Doe' }} />);
  expect(screen.getByText(/john doe/i)).toBeInTheDocument();
});

// ✅ FAST: Mock expensive operations
vi.mock('@/lib/supabase', () => ({
  supabase: createMockSupabaseClient(),
}));
```

**Metrics**: Tests <100ms = instant feedback. 1000 tests run in <2 minutes.

---

### 7.2 Eliminate Flakiness (No Random Failures)

**Impact: CRITICAL** (reliable CI/CD, team trust)

**Common causes:**
- Race conditions (async timing)
- Shared state between tests
- External dependencies (real API calls)
- Random data (Math.random)
- Timers

**Solutions:**
```typescript
// ✅ Use waitFor for async
await waitFor(() => {
  expect(screen.getByText(/loaded/i)).toBeInTheDocument();
});

// ✅ Reset mocks between tests
afterEach(() => {
  vi.clearAllMocks();
});

// ✅ Seed random data
const mockData = {
  id: '123', // Fixed, not random
  createdAt: '2024-01-01T00:00:00Z', // Fixed
};

// ✅ Use MSW for network
// No real network calls
```

**Metrics**: Zero tolerance for flaky tests. 1 flaky test breaks CI/CD trust.

---

### 7.3 Isolate Tests (No Shared State)

**Impact: CRITICAL** (tests can run in any order)

**Incorrect: Shared state**
```typescript
// ❌ BAD: Tests depend on each other
let user: User;

it('creates user', () => {
  user = createUser({ name: 'John' });
  expect(user.name).toBe('John');
});

it('updates user', () => {
  user.name = 'Jane'; // Depends on previous test!
  expect(user.name).toBe('Jane');
});
```

**Correct: Independent tests**
```typescript
// ✅ GOOD: Each test is independent
describe('User', () => {
  it('creates user with name', () => {
    const user = createUser({ name: 'John' });
    expect(user.name).toBe('John');
  });

  it('updates user name', () => {
    const user = createUser({ name: 'John' });
    user.name = 'Jane';
    expect(user.name).toBe('Jane');
  });
});

// Use beforeEach for shared setup
describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
    // Fresh instance for each test
  });

  it('finds user by id', async () => {
    const user = await repository.findById('123');
    expect(user).toBeDefined();
  });

  it('deletes user', async () => {
    await repository.delete('123');
    const user = await repository.findById('123');
    expect(user).toBeNull();
  });
});
```

---

## Appendix

### Testing Checklist

- [ ] Tests colocated with source code
- [ ] Descriptive test names (what + when)
- [ ] AAA pattern (Arrange, Act, Assert)
- [ ] Query by role/label (not testId)
- [ ] Test user behavior (not implementation)
- [ ] All conditional render paths tested
- [ ] Async behavior tested with waitFor
- [ ] API calls mocked with MSW
- [ ] Custom hooks tested with renderHook
- [ ] Mocks reset between tests (afterEach)
- [ ] No flaky tests (100% reliable)
- [ ] Tests run fast (<100ms each)
- [ ] 70-80% meaningful coverage
- [ ] High-value paths prioritized

### Common Testing Library Queries

```typescript
// By Role (preferred)
screen.getByRole('button', { name: /submit/i });
screen.getByRole('textbox', { name: /email/i });
screen.getByRole('checkbox', { name: /agree/i });

// By Label
screen.getByLabelText(/email/i);

// By Text
screen.getByText(/welcome/i);

// By Placeholder
screen.getByPlaceholderText(/enter email/i);

// Multiple elements
screen.getAllByRole('listitem');

// Query variants
getBy...    // Throws if not found
queryBy...  // Returns null if not found
findBy...   // Async, waits for element
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: ['**/*.test.{ts,tsx}', '**/types.ts', '**/__tests__/**'],
    },
  },
});
```

---

**End of Unit & Integration Testing Guide**

For questions or improvements, consult the testing team or update this document following the contribution guidelines.
