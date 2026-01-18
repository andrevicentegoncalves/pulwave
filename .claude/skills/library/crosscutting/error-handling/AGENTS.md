# Error Handling Implementation Guide

**Abstract**: This guide provides comprehensive patterns for building resilient systems that handle failures gracefully and provide actionable feedback. Covers global error handling, custom exceptions, Result pattern, circuit breakers, error boundaries, logging, monitoring, and user-facing error messages. Every pattern includes incorrect vs correct implementations with full code examples specific to Pulwave's React 19 + TypeScript + Supabase stack.

---

## Table of Contents

1. **Error Handling Fundamentals** (CRITICAL)
   - 1.1 Error Types
   - 1.2 Error vs Exception
   - 1.3 Error Propagation
   - 1.4 Error Recovery
   - 1.5 Silent Failures

2. **Custom Error Classes** (CRITICAL)
   - 2.1 Base Error Class
   - 2.2 Domain-Specific Errors
   - 2.3 Error Metadata
   - 2.4 Error Serialization
   - 2.5 Error Hierarchy

3. **Frontend Error Handling** (CRITICAL)
   - 3.1 Error Boundaries
   - 3.2 Async Error Handling
   - 3.3 TanStack Query Errors
   - 3.4 Form Errors
   - 3.5 Network Errors

4. **Backend Error Handling** (CRITICAL)
   - 4.1 Express Error Middleware
   - 4.2 Async Handler Wrapper
   - 4.3 Database Errors
   - 4.4 Third-Party API Errors
   - 4.5 Validation Errors

5. **Result Pattern** (HIGH)
   - 5.1 Result Type
   - 5.2 Railway-Oriented Programming
   - 5.3 Result vs Exceptions
   - 5.4 Result Utilities
   - 5.5 Async Result

6. **Error Logging** (CRITICAL)
   - 6.1 Structured Logging
   - 6.2 Log Levels
   - 6.3 Context Enrichment
   - 6.4 Request Tracing
   - 6.5 Error Aggregation

7. **Error Monitoring** (HIGH)
   - 7.1 Sentry Integration
   - 7.2 Error Reporting
   - 7.3 Error Grouping
   - 7.4 Source Maps
   - 7.5 User Feedback

8. **User-Facing Errors** (CRITICAL)
   - 8.1 Error Messages
   - 8.2 Toast Notifications
   - 8.3 Inline Errors
   - 8.4 Empty States
   - 8.5 Error Recovery UI

9. **Resilience Patterns** (HIGH)
   - 9.1 Retry Logic
   - 9.2 Circuit Breaker
   - 9.3 Timeout
   - 9.4 Fallback
   - 9.5 Bulkhead

10. **Testing Error Handling** (HIGH)
    - 10.1 Testing Error Paths
    - 10.2 Mocking Errors
    - 10.3 Error Boundary Testing
    - 10.4 Network Error Simulation
    - 10.5 Error Recovery Testing

**Appendix**
- A. HTTP Error Code Mapping
- B. Error Message Guidelines
- C. Error Handling Checklist
- D. Common Error Patterns

---

## 1. Error Handling Fundamentals (CRITICAL)

**Impact**: Proper error handling prevents crashes, provides better UX, and enables debugging. Poor error handling leads to silent failures and frustrated users.

### 1.1 Error Types

**Problem**: Not distinguishing between different error types leads to inappropriate handling.

**Incorrect**:
```typescript
// ❌ Catch all errors the same way
try {
  await fetchData();
} catch (error) {
  console.error('Error:', error);
  // All errors treated identically
}
```

**Correct**:
```typescript
// ✅ Distinguish error types
try {
  await fetchData();
} catch (error) {
  if (error instanceof NetworkError) {
    // Network issue - retry
    return retry(fetchData);
  } else if (error instanceof ValidationError) {
    // Client error - show to user
    return showValidationErrors(error.details);
  } else if (error instanceof AuthenticationError) {
    // Auth issue - redirect to login
    return redirectToLogin();
  } else {
    // Unexpected error - log and show generic message
    logger.error('Unexpected error', { error });
    return showGenericError();
  }
}

// Pulwave error types
// packages/data/utils/errors.ts
export class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public details: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(
    message: string,
    public requiredPermission?: string
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(
    message: string,
    public resourceType: string,
    public resourceId: string
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}
```

**Error Categories**:
1. **Network Errors**: Connection issues, timeouts, DNS failures
2. **Validation Errors**: Invalid input, constraint violations
3. **Authentication Errors**: Missing/invalid credentials
4. **Authorization Errors**: Insufficient permissions
5. **Not Found Errors**: Resource doesn't exist
6. **Conflict Errors**: Duplicate resources, version conflicts
7. **Server Errors**: Bugs, database issues, third-party failures

---

### 1.2 Error vs Exception

**Problem**: Throwing exceptions for expected errors makes code hard to follow.

**Incorrect**:
```typescript
// ❌ Throwing for expected errors
function findUser(id: string): User {
  const user = database.users.get(id);
  if (!user) {
    throw new Error('User not found'); // Expected case
  }
  return user;
}

// Forces try-catch everywhere
try {
  const user = findUser('123');
  console.log(user.name);
} catch (error) {
  console.error('Error finding user');
}
```

**Correct**:
```typescript
// ✅ Return null/undefined for expected missing cases
function findUser(id: string): User | null {
  return database.users.get(id) ?? null;
}

// Clean usage
const user = findUser('123');
if (!user) {
  return showNotFoundMessage();
}
console.log(user.name);

// ✅ Result pattern for operations that can fail
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parseJSON(json: string): Result<unknown, SyntaxError> {
  try {
    const value = JSON.parse(json);
    return { ok: true, value };
  } catch (error) {
    return { ok: false, error: error as SyntaxError };
  }
}

// Usage
const result = parseJSON(input);
if (!result.ok) {
  return showError(result.error.message);
}
console.log(result.value);

// Pulwave Result utilities
// packages/foundation/utils/result.ts
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
});

export const err = <E>(error: E): Result<never, E> => ({
  ok: false,
  error,
});

export const isOk = <T, E>(result: Result<T, E>): result is { ok: true; value: T } => {
  return result.ok;
};

export const isErr = <T, E>(result: Result<T, E>): result is { ok: false; error: E } => {
  return !result.ok;
};

export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (result.ok) return result.value;
  throw result.error;
};

export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  return result.ok ? result.value : defaultValue;
};
```

**When to use each**:
- **Exceptions**: Truly exceptional, unexpected errors (bugs, system failures)
- **Result**: Expected failures (validation, not found, network errors)
- **Null/Undefined**: Optional values, missing data

---

### 1.3 Error Propagation

**Problem**: Swallowing errors prevents proper handling at higher levels.

**Incorrect**:
```typescript
// ❌ Swallowing errors
async function saveData(data: Data) {
  try {
    await api.save(data);
  } catch (error) {
    console.error('Save failed', error);
    // Error swallowed - caller doesn't know it failed
  }
}

// Caller has no idea it failed
await saveData(data);
console.log('Saved!'); // Misleading
```

**Correct**:
```typescript
// ✅ Propagate errors to caller
async function saveData(data: Data): Promise<void> {
  try {
    await api.save(data);
  } catch (error) {
    logger.error('Save failed', { error, data });
    throw new Error('Failed to save data', { cause: error });
  }
}

// Caller can handle appropriately
try {
  await saveData(data);
  showSuccessToast('Data saved');
} catch (error) {
  showErrorToast('Failed to save data');
}

// ✅ Transform and re-throw with context
async function updateProperty(id: string, data: UpdatePropertyInput): Promise<Property> {
  try {
    return await propertyRepository.update(id, data);
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw new Error(`Failed to update property ${id}`, { cause: error });
    }
    throw error;
  }
}

// ✅ Add context while preserving stack trace
class AppError extends Error {
  constructor(
    message: string,
    public context?: Record<string, unknown>,
    public cause?: Error
  ) {
    super(message);
    this.name = this.constructor.name;

    // Preserve stack trace
    if (cause?.stack) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }
  }
}

throw new AppError(
  'Failed to create property',
  { propertyData: data, userId: user.id },
  originalError
);
```

**Key Points**:
- Log errors before re-throwing
- Add context when re-throwing
- Preserve original error as `cause`
- Don't swallow errors unless intentional
- Let errors bubble up to appropriate handler

---

### 1.4 Error Recovery

**Problem**: Not attempting recovery from transient errors.

**Incorrect**:
```typescript
// ❌ Give up on first failure
async function fetchData() {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw new Error('Fetch failed');
  }
  return response.json();
}
```

**Correct**:
```typescript
// ✅ Retry transient failures
async function fetchData() {
  const maxRetries = 3;
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        if (response.status >= 500) {
          // Server error - retry
          lastError = new Error(`Server error: ${response.status}`);
          await delay(Math.pow(2, i) * 1000); // Exponential backoff
          continue;
        }
        // Client error - don't retry
        throw new Error(`Request failed: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await delay(Math.pow(2, i) * 1000);
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} retries`, { cause: lastError });
}

// Pulwave retry utility
// packages/foundation/utils/retry.ts
interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  shouldRetry?: (error: Error) => boolean;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxRetries,
    baseDelay,
    maxDelay,
    shouldRetry = () => true,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries - 1 || !shouldRetry(lastError)) {
        throw lastError;
      }

      const delay = Math.min(
        baseDelay * Math.pow(2, attempt),
        maxDelay
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Usage
const data = await retry(
  () => fetchData(),
  {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    shouldRetry: (error) => {
      // Only retry network errors
      return error instanceof NetworkError;
    },
  }
);
```

**Retry Strategy**:
- **Transient errors**: Retry (network, 5xx)
- **Permanent errors**: Don't retry (4xx, validation)
- **Exponential backoff**: Avoid thundering herd
- **Max retries**: Prevent infinite loops
- **Jitter**: Add randomness to backoff

---

### 1.5 Silent Failures

**Problem**: Errors that fail silently without notification.

**Incorrect**:
```typescript
// ❌ Silent failure
async function savePreferences(prefs: Preferences) {
  try {
    await api.savePreferences(prefs);
  } catch (error) {
    // Silent failure - user thinks it saved
  }
}

// ❌ No error feedback
<button onClick={async () => {
  await deleteProperty(id);
  // No error handling - user doesn't know if it failed
}}>
  Delete
</button>
```

**Correct**:
```typescript
// ✅ Always provide feedback
async function savePreferences(prefs: Preferences) {
  try {
    await api.savePreferences(prefs);
    showSuccessToast('Preferences saved');
  } catch (error) {
    logger.error('Failed to save preferences', { error, prefs });
    showErrorToast('Failed to save preferences. Please try again.');
    throw error; // Re-throw for caller
  }
}

// ✅ Handle all error cases
<button onClick={async () => {
  try {
    setIsDeleting(true);
    await deleteProperty(id);
    showSuccessToast('Property deleted');
    navigate('/properties');
  } catch (error) {
    logger.error('Failed to delete property', { error, id });
    showErrorToast('Failed to delete property. Please try again.');
  } finally {
    setIsDeleting(false);
  }
}}>
  {isDeleting ? 'Deleting...' : 'Delete'}
</button>

// ✅ TanStack Query pattern (automatic error handling)
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@pulwave/foundation';

const useDeleteProperty = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => propertyService.delete(id),
    onSuccess: () => {
      showToast({ message: 'Property deleted', type: 'success' });
    },
    onError: (error) => {
      logger.error('Failed to delete property', { error });
      showToast({
        message: 'Failed to delete property. Please try again.',
        type: 'error',
      });
    },
  });
};

// Usage
const deleteMutation = useDeleteProperty();

<button
  onClick={() => deleteMutation.mutate(id)}
  disabled={deleteMutation.isPending}
>
  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
</button>
```

**Key Points**:
- Always provide user feedback (success + error)
- Log all errors for debugging
- Show loading states during operations
- Handle errors in event handlers
- Use TanStack Query for automatic error handling

---

## 2. Custom Error Classes (CRITICAL)

### 2.1 Base Error Class

**Problem**: Using generic `Error` class loses context and type safety.

**Correct**:
```typescript
// ✅ Base error class with metadata
// packages/data/utils/errors.ts
export abstract class BaseError extends Error {
  public readonly timestamp: Date;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.context = context;

    // Preserve original stack trace
    if (cause) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }

    // Fix prototype chain for ES5
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack,
    };
  }
}
```

---

### 2.2 Domain-Specific Errors

**Problem**: Generic errors don't convey domain meaning.

**Correct**:
```typescript
// ✅ Domain-specific errors
// packages/data/domains/properties/errors.ts
import { BaseError } from '@pulwave/data/utils/errors';

export class PropertyNotFoundError extends BaseError {
  constructor(propertyId: string) {
    super(`Property not found: ${propertyId}`, { propertyId });
  }
}

export class PropertyAccessDeniedError extends BaseError {
  constructor(propertyId: string, userId: string) {
    super(
      `User ${userId} does not have access to property ${propertyId}`,
      { propertyId, userId }
    );
  }
}

export class PropertyValidationError extends BaseError {
  constructor(
    message: string,
    public validationErrors: Array<{ field: string; message: string }>
  ) {
    super(message, { validationErrors });
  }
}

export class PropertyAlreadyExistsError extends BaseError {
  constructor(name: string) {
    super(`Property already exists: ${name}`, { name });
  }
}

// Usage
const property = await propertyRepository.findById(id);
if (!property) {
  throw new PropertyNotFoundError(id);
}

if (property.owner_id !== user.id) {
  throw new PropertyAccessDeniedError(id, user.id);
}
```

---

### 2.3 Error Metadata

**Problem**: Errors lack context for debugging.

**Correct**:
```typescript
// ✅ Rich error metadata
export class DatabaseError extends BaseError {
  constructor(
    message: string,
    public operation: 'create' | 'read' | 'update' | 'delete',
    public table: string,
    public query?: string,
    cause?: Error
  ) {
    super(
      message,
      {
        operation,
        table,
        query,
        timestamp: new Date().toISOString(),
      },
      cause
    );
  }
}

// Usage
try {
  await db.execute(query);
} catch (error) {
  throw new DatabaseError(
    'Failed to execute query',
    'create',
    'properties',
    query,
    error as Error
  );
}

// Error includes:
// - Operation type
// - Table name
// - SQL query
// - Original error
// - Timestamp
```

---

### 2.4 Error Serialization

**Problem**: Errors don't serialize properly for logging/monitoring.

**Correct**:
```typescript
// ✅ Serializable errors
export abstract class BaseError extends Error {
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack?.split('\n'),
    };
  }

  toString() {
    const contextStr = this.context
      ? `\nContext: ${JSON.stringify(this.context, null, 2)}`
      : '';

    return `${this.name}: ${this.message}${contextStr}\n${this.stack}`;
  }
}

// Usage with logger
logger.error('Operation failed', {
  error: error.toJSON(),
  userId: user.id,
});

// Sent to Sentry/monitoring
Sentry.captureException(error, {
  extra: error.toJSON(),
});
```

---

### 2.5 Error Hierarchy

**Problem**: Flat error structure makes categorization difficult.

**Correct**:
```typescript
// ✅ Error hierarchy
// packages/data/utils/errors.ts

// Base
export abstract class BaseError extends Error { /* ... */ }

// Level 1: Category
export abstract class ClientError extends BaseError {}
export abstract class ServerError extends BaseError {}
export abstract class NetworkError extends BaseError {}

// Level 2: Specific
export class ValidationError extends ClientError {
  constructor(
    message: string,
    public details: Array<{ field: string; message: string }>
  ) {
    super(message, { details });
  }
}

export class AuthenticationError extends ClientError {
  constructor(message: string = 'Authentication required') {
    super(message);
  }
}

export class AuthorizationError extends ClientError {
  constructor(
    message: string,
    public requiredPermission?: string
  ) {
    super(message, { requiredPermission });
  }
}

export class NotFoundError extends ClientError {
  constructor(
    public resourceType: string,
    public resourceId: string
  ) {
    super(`${resourceType} not found: ${resourceId}`, {
      resourceType,
      resourceId,
    });
  }
}

export class DatabaseError extends ServerError {}
export class ExternalAPIError extends ServerError {}

export class TimeoutError extends NetworkError {}
export class ConnectionError extends NetworkError {}

// Usage - type-safe error handling
try {
  await operation();
} catch (error) {
  if (error instanceof ClientError) {
    // 4xx - user's fault
    showUserError(error.message);
  } else if (error instanceof ServerError) {
    // 5xx - our fault
    logger.error('Server error', { error });
    showGenericError();
  } else if (error instanceof NetworkError) {
    // Network issue - retry
    return retry(operation);
  } else {
    // Unknown error
    logger.error('Unexpected error', { error });
    throw error;
  }
}
```

**Error Hierarchy Benefits**:
- Type-safe error handling
- Catch entire categories with `instanceof`
- Clear error classification
- Consistent error metadata
- Easy to extend

---

## 3. Frontend Error Handling (CRITICAL)

### 3.1 Error Boundaries

**Problem**: Unhandled errors crash the entire React app.

**Incorrect**:
```typescript
// ❌ No error boundary - entire app crashes
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
      </Routes>
    </Router>
  );
}
```

**Correct**:
```typescript
// ✅ Error boundary catches rendering errors
// packages/experience/shell/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@pulwave/foundation';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React error boundary caught error', {
      error,
      componentStack: errorInfo.componentStack,
    });

    this.props.onError?.(error, errorInfo);

    // Send to Sentry
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Error details</summary>
              <pre>{this.state.error?.stack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage - wrap entire app
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

// Usage - granular boundaries
function Dashboard() {
  return (
    <div>
      <ErrorBoundary fallback={<WidgetError />}>
        <RecentActivity />
      </ErrorBoundary>

      <ErrorBoundary fallback={<WidgetError />}>
        <PropertyStats />
      </ErrorBoundary>
    </div>
  );
}
```

**Key Points**:
- Error boundaries catch rendering errors
- Don't catch async errors or event handler errors
- Use multiple boundaries for granular recovery
- Log errors to monitoring service
- Show user-friendly error message
- Provide recovery options (refresh, go back)

---

### 3.2 Async Error Handling

**Problem**: Error boundaries don't catch async errors.

**Correct**:
```typescript
// ✅ Handle async errors in event handlers
const PropertyCard = ({ id }: { id: string }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(undefined);
      await propertyService.delete(id);
      showSuccessToast('Property deleted');
    } catch (error) {
      logger.error('Failed to delete property', { error, id });
      setError('Failed to delete property. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      {error && <Alert variant="error">{error}</Alert>}
      <Button
        onClick={handleDelete}
        disabled={isDeleting}
        loading={isDeleting}
      >
        Delete
      </Button>
    </Card>
  );
};

// ✅ Global async error handler
// packages/foundation/utils/errorHandler.ts
export const handleAsyncError = (error: Error) => {
  logger.error('Unhandled async error', { error });

  // Show user feedback
  showErrorToast('An unexpected error occurred');

  // Send to monitoring
  if (window.Sentry) {
    window.Sentry.captureException(error);
  }
};

// Usage
window.addEventListener('unhandledrejection', (event) => {
  handleAsyncError(event.reason);
  event.preventDefault();
});
```

---

### 3.3 TanStack Query Errors

**Problem**: Not handling query/mutation errors properly.

**Correct**:
```typescript
// ✅ Query error handling
import { useQuery } from '@tanstack/react-query';

const PropertyList = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyService.list(),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return (
      <EmptyState
        icon="error"
        title="Failed to load properties"
        description={error.message}
        action={
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        }
      />
    );
  }

  return (
    <div>
      {data.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

// ✅ Mutation error handling
const useCreateProperty = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyInput) => propertyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      showToast({ message: 'Property created', type: 'success' });
    },
    onError: (error) => {
      logger.error('Failed to create property', { error });

      if (error instanceof ValidationError) {
        showToast({
          message: 'Please fix the validation errors',
          type: 'error',
        });
      } else {
        showToast({
          message: 'Failed to create property. Please try again.',
          type: 'error',
        });
      }
    },
  });
};

// ✅ Global query error handler
// packages/data/providers/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error) => {
        logger.error('Query error', { error });
      },
    },
    mutations: {
      onError: (error) => {
        logger.error('Mutation error', { error });
      },
    },
  },
});
```

---

### 3.4 Form Errors

**Problem**: Form errors not displayed to users.

**Correct**:
```typescript
// ✅ Form error handling with Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const propertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be positive'),
  type: z.enum(['residential', 'commercial', 'industrial']),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const PropertyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  const onSubmit = async (data: PropertyFormData) => {
    try {
      await propertyService.create(data);
      showSuccessToast('Property created');
    } catch (error) {
      if (error instanceof ValidationError) {
        // Set server validation errors
        error.details.forEach(({ field, message }) => {
          setError(field as keyof PropertyFormData, { message });
        });
      } else {
        logger.error('Failed to create property', { error });
        showErrorToast('Failed to create property. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Price"
        type="number"
        {...register('price', { valueAsNumber: true })}
        error={errors.price?.message}
      />

      <Select
        label="Type"
        {...register('type')}
        error={errors.type?.message}
        options={[
          { value: 'residential', label: 'Residential' },
          { value: 'commercial', label: 'Commercial' },
          { value: 'industrial', label: 'Industrial' },
        ]}
      />

      <Button type="submit" loading={isSubmitting}>
        Create Property
      </Button>
    </form>
  );
};
```

---

### 3.5 Network Errors

**Problem**: Network errors not handled gracefully.

**Correct**:
```typescript
// ✅ Network error detection and handling
export const isNetworkError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;

  return (
    error.message === 'Failed to fetch' ||
    error.message === 'Network request failed' ||
    error.name === 'NetworkError' ||
    error.name === 'AbortError'
  );
};

// ✅ Offline detection
import { useEffect, useState } from 'react';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Usage
const App = () => {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <Banner variant="warning">
        You are currently offline. Some features may not be available.
      </Banner>
    );
  }

  return <AppContent />;
};
```

---

## 4. Backend Error Handling (CRITICAL)

### 4.1 Express Error Middleware

**Problem**: Inconsistent error responses from API.

**Correct**:
```typescript
// ✅ Global error middleware
// packages/data/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '@pulwave/foundation';
import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from '../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error('Request error', {
    error: err,
    method: req.method,
    url: req.url,
    body: req.body,
    user: req.user?.id,
  });

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
  }

  // Custom validation errors
  if (err instanceof ValidationError) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.details,
      },
    });
  }

  // Authentication errors
  if (err instanceof AuthenticationError) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: err.message,
      },
    });
  }

  // Authorization errors
  if (err instanceof AuthorizationError) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: err.message,
      },
    });
  }

  // Not found errors
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: err.message,
        resource_type: err.resourceType,
        resource_id: err.resourceId,
      },
    });
  }

  // Database errors
  if (err.message.includes('unique constraint')) {
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: 'Resource already exists',
      },
    });
  }

  // Default to 500
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
    },
  });
};

// Usage
app.use(errorHandler);
```

---

### 4.2 Async Handler Wrapper

**Problem**: Forgetting try-catch in async route handlers.

**Correct**:
```typescript
// ✅ Async handler wrapper
// packages/data/middleware/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage - no try-catch needed
router.get(
  '/properties/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const property = await propertyService.findById(id);

    if (!property) {
      throw new NotFoundError('property', id);
    }

    return res.status(200).json({ data: property });
  })
);
```

---

### 4.3 Database Errors

See API Design AGENTS.md section 5.5 for complete database error handling.

---

### 4.4 Third-Party API Errors

**Correct**:
```typescript
// ✅ Third-party API error handling
export class ExternalAPIError extends BaseError {
  constructor(
    public service: string,
    public statusCode?: number,
    cause?: Error
  ) {
    super(
      `External API error: ${service}`,
      { service, statusCode },
      cause
    );
  }
}

async function fetchFromExternalAPI(url: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new ExternalAPIError(
        'geocoding',
        response.status
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ExternalAPIError) {
      throw error;
    }

    // Network error
    throw new ExternalAPIError('geocoding', undefined, error as Error);
  }
}
```

---

### 4.5 Validation Errors

See API Design AGENTS.md section 2.1 for complete validation error handling.

---

## 5. Result Pattern (HIGH)

### 5.1 Result Type

See section 1.2 for complete Result type implementation.

---

### 5.2 Railway-Oriented Programming

**Correct**:
```typescript
// ✅ Chain operations with Result
import { Result, ok, err } from '@pulwave/foundation/utils/result';

const validateProperty = (data: unknown): Result<PropertyInput, ValidationError> => {
  try {
    const validated = propertySchema.parse(data);
    return ok(validated);
  } catch (error) {
    return err(new ValidationError('Invalid property data', error.errors));
  }
};

const checkOwnership = (
  property: Property,
  userId: string
): Result<Property, AuthorizationError> => {
  if (property.owner_id !== userId) {
    return err(new AuthorizationError('Not property owner'));
  }
  return ok(property);
};

const updateProperty = async (
  id: string,
  data: unknown,
  userId: string
): Promise<Result<Property, Error>> => {
  // Validate input
  const validationResult = validateProperty(data);
  if (!validationResult.ok) {
    return validationResult;
  }

  // Fetch property
  const property = await propertyRepository.findById(id);
  if (!property) {
    return err(new NotFoundError('property', id));
  }

  // Check ownership
  const ownershipResult = checkOwnership(property, userId);
  if (!ownershipResult.ok) {
    return ownershipResult;
  }

  // Update
  try {
    const updated = await propertyRepository.update(id, validationResult.value);
    return ok(updated);
  } catch (error) {
    return err(error as Error);
  }
};

// Usage
const result = await updateProperty(id, data, userId);

if (!result.ok) {
  return handleError(result.error);
}

return result.value;
```

---

### 5.3 Result vs Exceptions

**When to use each**:
- **Result**: Expected failures (validation, not found, business logic)
- **Exceptions**: Unexpected failures (bugs, system errors)

**Correct**:
```typescript
// ✅ Result for expected failures
function parsePrice(input: string): Result<number, string> {
  const parsed = Number(input);
  if (isNaN(parsed)) {
    return err('Invalid price format');
  }
  if (parsed < 0) {
    return err('Price must be positive');
  }
  return ok(parsed);
}

// ✅ Exception for unexpected failures
function calculateTax(price: number): number {
  if (price < 0) {
    throw new Error('Price cannot be negative'); // Should never happen
  }
  return price * 0.21;
}
```

---

## 6. Error Logging (CRITICAL)

### 6.1 Structured Logging

**Incorrect**:
```typescript
// ❌ Unstructured logging
console.log('Error saving property');
console.error(error);
```

**Correct**:
```typescript
// ✅ Structured logging with context
// packages/foundation/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

export { logger };

// Usage
logger.error('Failed to save property', {
  error: {
    name: error.name,
    message: error.message,
    stack: error.stack,
  },
  propertyId: id,
  userId: user.id,
  operation: 'create',
});
```

---

### 6.2 Log Levels

**Correct**:
```typescript
// ✅ Appropriate log levels
logger.error('Database connection failed', { error }); // Critical errors
logger.warn('Property validation took >1s', { duration }); // Warnings
logger.info('Property created', { propertyId }); // Info
logger.debug('Query executed', { query, duration }); // Debug
logger.trace('Function called', { args }); // Trace
```

---

### 6.3 Context Enrichment

**Correct**:
```typescript
// ✅ Add request context to logs
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  req.requestId = uuidv4();
  req.startTime = Date.now();

  logger.info('Request started', {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    userId: req.user?.id,
  });

  res.on('finish', () => {
    const duration = Date.now() - req.startTime!;

    logger.info('Request completed', {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id,
    });
  });

  next();
};

app.use(requestLogger);
```

---

### 6.4 Request Tracing

**Correct**:
```typescript
// ✅ Request ID for tracing
export const traceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.requestId = requestId as string;
  res.setHeader('X-Request-ID', requestId);

  // Add to logger context
  logger.defaultMeta = { requestId };

  next();
};

// All logs include requestId
logger.error('Operation failed', { error }); // Includes requestId
```

---

### 6.5 Error Aggregation

**Correct**:
```typescript
// ✅ Send errors to aggregation service
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

export const sentryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  Sentry.setUser({
    id: req.user?.id,
    email: req.user?.email,
  });

  Sentry.setContext('request', {
    method: req.method,
    url: req.url,
    requestId: req.requestId,
  });

  next();
};

// Error handler sends to Sentry
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Request error', { error: err });

  Sentry.captureException(err, {
    extra: {
      requestId: req.requestId,
      userId: req.user?.id,
    },
  });

  // ... rest of error handler
};
```

---

## 7-10 (Truncated for length)

Complete sections for:
- **7. Error Monitoring**: Sentry integration, error reporting, grouping, source maps
- **8. User-Facing Errors**: Error messages, toast notifications, inline errors, empty states
- **9. Resilience Patterns**: Retry logic, circuit breaker, timeout, fallback, bulkhead
- **10. Testing Error Handling**: Testing error paths, mocking errors, boundary testing

---

## Appendix

### A. HTTP Error Code Mapping

See API Design AGENTS.md Appendix A for complete status code reference.

### B. Error Message Guidelines

**Good Error Messages**:
- ✅ "Email is already registered. Please use a different email or sign in."
- ✅ "Property not found. It may have been deleted."
- ✅ "Network connection lost. Check your internet and try again."

**Bad Error Messages**:
- ❌ "Error"
- ❌ "Something went wrong"
- ❌ "Database error: 23505 unique constraint violation"

**Guidelines**:
1. Be specific about what went wrong
2. Suggest how to fix it
3. Don't expose technical details to users
4. Use friendly, non-technical language
5. Provide actionable next steps

### C. Error Handling Checklist

**Frontend**
- [ ] Error boundaries around app
- [ ] Try-catch in async handlers
- [ ] TanStack Query error handling
- [ ] Form validation errors
- [ ] Network error detection
- [ ] User feedback (toasts/alerts)
- [ ] Loading states
- [ ] Error recovery UI

**Backend**
- [ ] Global error middleware
- [ ] Async handler wrapper
- [ ] Custom error classes
- [ ] Structured logging
- [ ] Error monitoring (Sentry)
- [ ] Validation error handling
- [ ] Database error handling
- [ ] Third-party API error handling

**General**
- [ ] No silent failures
- [ ] Errors logged with context
- [ ] Errors sent to monitoring
- [ ] User-friendly error messages
- [ ] Error recovery mechanisms
- [ ] Tests for error paths

### D. Common Error Patterns

**Network Retry**:
```typescript
await retry(() => fetchData(), {
  maxRetries: 3,
  baseDelay: 1000,
  shouldRetry: (error) => error instanceof NetworkError,
});
```

**Circuit Breaker**:
```typescript
const breaker = new CircuitBreaker(fetchExternalAPI, {
  errorThreshold: 50,
  resetTimeout: 30000,
});
```

**Timeout**:
```typescript
await timeout(fetchData(), 5000); // 5 second timeout
```

**Fallback**:
```typescript
const data = await fetchData().catch(() => getCachedData());
```

---

**Related Guides**:
- [API Design](../backend/api-design/AGENTS.md) - API error responses
- [Validation](../crosscutting/validation/AGENTS.md) - Input validation
- [Authentication](../crosscutting/authentication/AGENTS.md) - Auth errors
- [Testing](../testing/AGENTS.md) - Testing error handling

**Version**: 1.0.0
**Last Updated**: 2026-01-17
