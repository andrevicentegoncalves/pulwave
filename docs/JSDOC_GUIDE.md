# JSDoc Documentation Guide

> Guidelines and examples for writing effective JSDoc comments in the Pulwave codebase

---

## Why JSDoc?

- **IntelliSense**: Powers autocomplete and inline documentation in IDEs
- **Type Safety**: Complements TypeScript type definitions
- **Documentation**: Self-documents code for future developers
- **Examples**: Provides usage patterns directly in the code

---

## JSDoc Standards

### 1. All Public APIs Must Have JSDoc

✅ **Required for:**
- Exported functions and classes
- Public methods in services
- React hooks
- Repository interfaces
- Utility functions

❌ **Optional for:**
- Private/internal functions
- Test files
- Type-only exports

### 2. JSDoc Format

```typescript
/**
 * Brief one-line summary of what the function does
 * 
 * Optional longer description providing more context about when and how
 * to use this function. Can span multiple lines.
 * 
 * @param paramName - Description of parameter
 * @param optionalParam - Description (optional)
 * @returns Description of return value
 * 
 * @example
 * ```typescript
 * // Example usage
 * const result = myFunction('value');
 * ```
 * 
 * @throws {ErrorType} When this error occurs
 * @see {@link RelatedFunction} For related functionality
 */
export function myFunction(paramName: string, optionalParam?: number): ReturnType {
  // Implementation
}
```

### 3. Required Elements

#### Summary (Required)
- First line: Brief description (one sentence)
- Should complete the sentence: "This function..."

#### Parameters (@param)
- Document all parameters
- Use dash format: `@param paramName - Description`
- Indicate if optional
- Describe what values are valid

#### Return Value (@returns)
- Always document what the function returns
- Describe the structure if returning an object
- Mention if async (returns Promise)

#### Examples (@example)
- Provide at least one realistic example
- Show common use cases
- Include complete, runnable code when possible

### 4. Optional Elements

#### @template
For generic functions:
```typescript
/**
 * @template T - Type of the data being processed
 */
function process<T>(data: T): T { }
```

#### @throws
Document errors the function might throw:
```typescript
/**
 * @throws {ValidationError} When input is invalid
 * @throws {NetworkError} When API call fails
 */
```

#### @see
Link to related functions or documentation:
```typescript
/**
 * @see {@link sanitizeInput} For basic input sanitization
 * @see [Security Guide](../docs/SECURITY.md)
 */
```

#### @deprecated
Mark deprecated functions:
```typescript
/**
 * @deprecated Use {@link newFunction} instead. Will be removed in v2.0
 */
```

---

## Examples by Category

### Services

```typescript
/**
 * Track a user action (button clicks, form submissions, etc.)
 * 
 * Automatically captures browser context (URL, user agent) and session ID.
 * Events are batched and sent to the configured analytics provider.
 * 
 * @param actionName - Name of the action (e.g., 'button_click', 'form_submit')
 * @param properties - Optional additional properties about the action
 * @param userId - Optional user ID to associate with the event
 * 
 * @example
 * ```typescript
 * // Track a button click
 * await analyticsService.trackAction('button_click', { 
 *   buttonId: 'submit',
 *   formName: 'contact' 
 * }, userId);
 * ```
 */
async trackAction(
    actionName: string,
    properties?: Record<string, unknown>,
    userId?: string
): Promise<void>
```

### React Hooks

```typescript
/**
 * Hook to access user profile data
 * 
 * Automatically handles loading states, error handling, and caching via React Query.
 * Data is cached for 5 minutes by default.
 * 
 * @param userId - ID of the user whose profile to fetch
 * @param options - Optional React Query configuration
 * @returns Query result with profile data, loading state, and error
 * 
 * @example
 * ```typescript
 * function UserProfile({ userId }: { userId: string }) {
 *   const { data: profile, isLoading, error } = useProfile(userId);
 *   
 *   if (isLoading) return <Spinner />;
 *   if (error) return <Error error={error} />;
 *   
 *   return <div>{profile.name}</div>;
 * }
 * ```
 */
export const useProfile = (userId: string, options?: UseQueryOptions)
```

### Repository Interfaces

```typescript
/**
 * Repository interface for user profile operations
 * 
 * Provides provider-agnostic methods for CRUD operations on user profiles.
 * All implementations must support these methods regardless of backend (Supabase, Firebase, etc.).
 * 
 * @interface
 */
export interface IProfileRepository extends IVersionedRepository {
    readonly version: '1.0.0';
    
    /**
     * Find a profile by its ID
     * 
     * @param id - Profile ID (UUID)
     * @returns Profile object if found, null otherwise
     */
    findById(id: string): Promise<Profile | null>;
}
```

### Utility Functions

```typescript
/**
 * Escape HTML entities to prevent XSS attacks
 * 
 * Converts dangerous characters (&, <, >, ", ', etc.) to their HTML entity equivalents.
 * Use this before inserting user-generated content into HTML.
 * 
 * @param str - String to escape
 * @returns Escaped string safe for HTML insertion
 * 
 * @example
 * ```typescript
 * const userInput = '<script>alert("xss")</script>';
 * const safe = escapeHtml(userInput);
 * // Result: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export const escapeHtml = (str: string): string
```

---

## Best Practices

### ✅ DO:

1. **Be Specific**
   ```typescript
   // ✅ Good
   @param userId - UUID of the user (obtained from authentication)
   
   // ❌ Bad
   @param userId - The user ID
   ```

2. **Provide Context**
   ```typescript
   // ✅ Good
   /**
    * Validates email format and checks for common typos
    * Does NOT verify email existence or deliverability
    */
   
   // ❌ Bad
   /**
    * Validates email
    */
   ```

3. **Show Real Examples**
   ```typescript
   // ✅ Good
   @example
   ```typescript
   const result = await securityService.validateCsrf(
     formData.csrf_token
   );
   if (!result) throw new Error('Invalid token');
   ```
   
   // ❌ Bad
   @example
   ```typescript
   validateCsrf(token)
   ```
   ```

4. **Document Side Effects**
   ```typescript
   /**
    * Initialize CSRF protection
    * 
    * Generates a new token and stores it in session storage.
    * ⚠️ Overwrites any existing token.
    */
   ```

5. **Link Related Functionality**
   ```typescript
   /**
    * @see {@link sanitizeInput} For individual field sanitization
    * @see {@link validateFormData} To check for malicious content
    */
   ```

### ❌ DON'T:

1. **Repeat the Code**
   ```typescript
   // ❌ Bad - just repeats the function signature
   /**
    * Get user by ID
    * @param id - The ID
    * @returns User
    */
   function getUserById(id: string): User
   ```

2. **Be Vague**
   ```typescript
   // ❌ Bad
   /**
    * Does stuff with data
    */
   ```

3. **Skip Examples for Complex APIs**
   ```typescript
   // ❌ Bad - no example for complex hook
   /**
    * Hook for data fetching
    */
   export const useComplexDataFetching = (...)
   ```

---

## Current Documentation Status

### ✅ Fully Documented

**Analytics Layer**
- `analyticsService` - All methods with examples
- `useAnalytics`, `usePageView`, `usePerformanceTracking`, `useErrorCapture`

**Security Layer**  
- `securityService` - All methods with examples
- CSRF utilities with security warnings
- Sanitization utilities

**Context/DI**
- `DataProviderContext` with integration examples
- All repository hooks

**Versioning**
- `IVersionedRepository` with compatibility examples
- Version helper functions

### 🔄 Needs Documentation

**Existing Services**
- User/Auth services
- Profile services
- Payment services
- Property services

**Hooks**
- Most domain-specific hooks need examples
- Loading state patterns
- Error handling patterns

---

## Documentation Checklist

When writing JSDoc for a new function:

- [ ] One-line summary that completes "This function..."
- [ ] All parameters documented with `@param`
- [ ] Return value documented with `@returns`
- [ ] At least one `@example` showing realistic usage
- [ ] Async functions mention they return Promise
- [ ] Side effects documented (API calls, storage, state changes)
- [ ] Errors documented with `@throws` (if applicable)
- [ ] Related functions linked with `@see` (if applicable)

---

## Tools

### VSCode Extensions
- **Better Comments** - Highlights JSDoc blocks
- **Document This** - Auto-generates JSDoc templates
- **TypeScript JSDoc** - IntelliSense for JSDoc tags

### Linting
```bash
# Check for missing JSDoc (future enhancement)
npm run lint:docs
```

---

*For questions about JSDoc standards, consult this guide or ask the architecture team.*
