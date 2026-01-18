# Accessibility Implementation Guide

**Abstract**: This guide provides comprehensive patterns for building accessible web applications that comply with WCAG 2.1 AA standards and provide inclusive experiences for all users. Covers semantic HTML, ARIA patterns, keyboard navigation, screen reader support, focus management, color contrast, and testing strategies. Every pattern includes incorrect vs correct implementations with full code examples specific to Pulwave's React 19 + TypeScript stack.

---

## Table of Contents

1. **Semantic HTML** (CRITICAL)
   - 1.1 Button Elements
   - 1.2 Form Controls
   - 1.3 Headings Hierarchy
   - 1.4 Lists and Navigation
   - 1.5 Landmark Regions

2. **ARIA Patterns** (CRITICAL)
   - 2.1 When to Use ARIA
   - 2.2 ARIA Roles
   - 2.3 ARIA States and Properties
   - 2.4 ARIA Live Regions
   - 2.5 Common ARIA Anti-Patterns

3. **Keyboard Navigation** (CRITICAL)
   - 3.1 Focus Order
   - 3.2 Keyboard Event Handlers
   - 3.3 Skip Links
   - 3.4 Focus Traps (Modals)
   - 3.5 Custom Controls

4. **Color Contrast & Visual Design** (CRITICAL)
   - 4.1 Text Contrast Ratios
   - 4.2 Non-Text Contrast
   - 4.3 Color Independence
   - 4.4 Focus Indicators
   - 4.5 Typography

5. **Screen Reader Support** (CRITICAL)
   - 5.1 Descriptive Labels
   - 5.2 Alternative Text
   - 5.3 Visually Hidden Content
   - 5.4 Reading Order
   - 5.5 Screen Reader Testing

6. **Focus Management** (CRITICAL)
   - 6.1 Managing Focus on Route Change
   - 6.2 Managing Focus in Modals
   - 6.3 Managing Focus in Dropdowns
   - 6.4 Restoring Focus
   - 6.5 Focus Styles

7. **Forms & Labels** (CRITICAL)
   - 7.1 Label Association
   - 7.2 Error Identification
   - 7.3 Field Instructions
   - 7.4 Required Fields
   - 7.5 Input Validation

8. **Dynamic Content & Live Regions** (HIGH)
   - 8.1 ARIA Live Regions
   - 8.2 Loading States
   - 8.3 Toast Notifications
   - 8.4 Infinite Scroll
   - 8.5 Dynamic Updates

9. **Testing & Auditing** (HIGH)
   - 9.1 Automated Testing
   - 9.2 Manual Testing
   - 9.3 Screen Reader Testing
   - 9.4 Keyboard Testing
   - 9.5 Continuous Monitoring

10. **Common Patterns** (HIGH)
    - 10.1 Tabs
    - 10.2 Accordions
    - 10.3 Modals/Dialogs
    - 10.4 Tooltips
    - 10.5 Dropdowns/Menus
    - 10.6 Data Tables
    - 10.7 Carousels

**Appendix**
- A. WCAG 2.1 AA Checklist
- B. ARIA Attributes Quick Reference
- C. Screen Reader Keyboard Shortcuts
- D. Testing Tools

---

## 1. Semantic HTML (CRITICAL)

**Impact**: Semantic HTML is the foundation of accessibility. It provides meaning to assistive technologies and ensures content is interpretable without CSS or JavaScript.

### 1.1 Button Elements

**WCAG**: 4.1.2 Name, Role, Value (Level A)

**Problem**: Using `<div>` or `<span>` for interactive elements breaks keyboard navigation and screen reader functionality.

**Incorrect**:
```tsx
// ❌ Not keyboard accessible, no role, requires extra ARIA
<div className="btn" onClick={handleClick}>
  Submit
</div>

// ❌ Wrong semantics - links are for navigation
<a href="#" onClick={(e) => { e.preventDefault(); handleClick(); }}>
  Delete
</a>
```

**Correct**:
```tsx
// ✅ Semantic button with proper accessibility
<button type="button" onClick={handleClick}>
  Submit
</button>

// ✅ For form submission
<button type="submit">
  Submit Form
</button>

// ✅ For navigation, use links
<a href="/dashboard">
  Go to Dashboard
</a>

// ✅ Pulwave Button component (already accessible)
import { Button } from '@pulwave/ui';

<Button variant="primary" onClick={handleClick}>
  Submit
</Button>
```

**Key Points**:
- `<button>` is keyboard accessible by default (Enter and Space)
- Screen readers announce it as "button"
- Use `type="button"` to prevent form submission
- Use `type="submit"` for form submissions
- Never use `<a>` for actions, only navigation

**Metrics**:
- **Keyboard users**: Can activate with Enter/Space
- **Screen readers**: Properly announced with role and state
- **WCAG compliance**: Meets 4.1.2 (Name, Role, Value)

---

### 1.2 Form Controls

**WCAG**: 1.3.1 Info and Relationships (Level A), 3.3.2 Labels or Instructions (Level A)

**Problem**: Form inputs without proper labels are unusable for screen reader users.

**Incorrect**:
```tsx
// ❌ No label association
<div>
  <span>Email</span>
  <input type="email" placeholder="Enter email" />
</div>

// ❌ Placeholder is not a label
<input type="email" placeholder="Email" />

// ❌ Label not associated
<label>Email</label>
<input type="email" />
```

**Correct**:
```tsx
// ✅ Explicit label association
<div>
  <label htmlFor="email">Email</label>
  <input type="email" id="email" name="email" />
</div>

// ✅ Implicit label association
<label>
  Email
  <input type="email" name="email" />
</label>

// ✅ Pulwave Input component pattern
import { Input } from '@pulwave/ui';

<Input
  label="Email"
  type="email"
  name="email"
  required
  aria-describedby="email-hint"
/>
<span id="email-hint" className="field-hint">
  We'll never share your email
</span>

// ✅ Complex input with error
interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormField = ({ label, error, hint, required, children }: FormFieldProps) => {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-label="required">*</span>}
      </label>

      {hint && (
        <span id={hintId} className="field-hint">
          {hint}
        </span>
      )}

      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
      })}

      {error && (
        <span id={errorId} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

// Usage
<FormField
  label="Email"
  required
  hint="We'll never share your email"
  error={emailError}
>
  <input type="email" name="email" />
</FormField>
```

**Key Points**:
- Always associate labels with inputs using `htmlFor`/`id`
- Use `aria-describedby` for hints and errors
- Mark required fields with `required` attribute
- Use `aria-invalid` for invalid fields
- Use `role="alert"` for error messages

---

### 1.3 Headings Hierarchy

**WCAG**: 1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA)

**Problem**: Skipped heading levels or incorrect hierarchy confuses screen reader users navigating by headings.

**Incorrect**:
```tsx
// ❌ Skipped heading level (h1 to h3)
<h1>Dashboard</h1>
<h3>Recent Activity</h3>

// ❌ Using headings for styling
<h4 className="large-text">Welcome</h4>

// ❌ Multiple h1 elements
<h1>Site Title</h1>
<h1>Page Title</h1>
```

**Correct**:
```tsx
// ✅ Proper heading hierarchy
<h1>Dashboard</h1>
<h2>Recent Activity</h2>
<h3>Last 7 Days</h3>

// ✅ Pulwave Heading component with semantic levels
import { Heading, Text } from '@pulwave/ui';

<Heading level={1}>Dashboard</Heading>
<Heading level={2}>Recent Activity</Heading>
<Text size="lg" weight="bold">Welcome</Text> {/* Not a heading */}

// ✅ Dynamic heading level for reusable sections
interface SectionProps {
  title: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

const Section = ({ title, level, children }: SectionProps) => {
  const HeadingTag = `h${level}` as const;

  return (
    <section>
      <HeadingTag>{title}</HeadingTag>
      {children}
    </section>
  );
};

// Usage in nested components
<Section title="Properties" level={2}>
  <Section title="Residential" level={3}>
    {/* Content */}
  </Section>
</Section>
```

**Key Points**:
- One `<h1>` per page (page title)
- Don't skip heading levels (h1 → h2 → h3)
- Use headings for structure, not styling
- Screen readers use headings to navigate
- 69% of screen reader users navigate by headings

**Metrics**:
- **Screen reader navigation**: 69% of users navigate by headings
- **SEO**: Proper heading hierarchy improves search ranking
- **WCAG**: Meets 1.3.1 and 2.4.6

---

### 1.4 Lists and Navigation

**WCAG**: 1.3.1 Info and Relationships (Level A)

**Problem**: Using `<div>` for lists loses semantic meaning and screen reader announcements.

**Incorrect**:
```tsx
// ❌ Div soup - no semantic meaning
<div className="nav">
  <div><a href="/">Home</a></div>
  <div><a href="/about">About</a></div>
  <div><a href="/contact">Contact</a></div>
</div>

// ❌ List without proper markup
<div className="property-list">
  <div>Property 1</div>
  <div>Property 2</div>
</div>
```

**Correct**:
```tsx
// ✅ Semantic navigation with list
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>

// ✅ Unordered list for items
<ul className="property-list">
  <li>Property 1</li>
  <li>Property 2</li>
</ul>

// ✅ Ordered list when sequence matters
<ol>
  <li>Create account</li>
  <li>Verify email</li>
  <li>Complete profile</li>
</ol>

// ✅ Description list for key-value pairs
<dl>
  <dt>Property Type</dt>
  <dd>Residential</dd>

  <dt>Location</dt>
  <dd>Lisbon, Portugal</dd>
</dl>

// ✅ Pulwave navigation pattern
import { Navigation } from '@pulwave/experience/shell';

<Navigation
  items={[
    { label: 'Dashboard', href: '/dashboard', current: true },
    { label: 'Properties', href: '/properties' },
    { label: 'Tenants', href: '/tenants' },
  ]}
  aria-label="Main navigation"
/>
```

**Key Points**:
- Use `<nav>` for navigation regions
- Use `<ul>/<ol>` for lists
- Screen readers announce "list with X items"
- Use `aria-label` to distinguish multiple nav regions
- Use `aria-current="page"` for current page

---

### 1.5 Landmark Regions

**WCAG**: 1.3.1 Info and Relationships (Level A), 2.4.1 Bypass Blocks (Level A)

**Problem**: Missing landmarks make navigation difficult for screen reader users.

**Incorrect**:
```tsx
// ❌ Div soup - no landmarks
<div className="app">
  <div className="header">...</div>
  <div className="sidebar">...</div>
  <div className="content">...</div>
  <div className="footer">...</div>
</div>
```

**Correct**:
```tsx
// ✅ Proper landmark structure
<>
  <a href="#main-content" className="skip-link">
    Skip to main content
  </a>

  <header>
    <nav aria-label="Main navigation">
      {/* Navigation */}
    </nav>
  </header>

  <aside aria-label="Sidebar">
    {/* Sidebar content */}
  </aside>

  <main id="main-content">
    <h1>Page Title</h1>
    {/* Main content */}
  </main>

  <footer>
    <nav aria-label="Footer navigation">
      {/* Footer links */}
    </nav>
  </footer>
</>

// ✅ Multiple regions of same type need labels
<main>
  <section aria-labelledby="properties-heading">
    <h2 id="properties-heading">Properties</h2>
    {/* Properties */}
  </section>

  <section aria-labelledby="tenants-heading">
    <h2 id="tenants-heading">Tenants</h2>
    {/* Tenants */}
  </section>
</main>

// ✅ Pulwave AppShell pattern
import { AppShell } from '@pulwave/experience/shell';

<AppShell
  header={<Header />}
  sidebar={<Sidebar />}
  footer={<Footer />}
>
  <main id="main-content">
    {children}
  </main>
</AppShell>
```

**Landmarks**:
- `<header>` - Banner (site header)
- `<nav>` - Navigation
- `<main>` - Main content (one per page)
- `<aside>` - Complementary content
- `<footer>` - Content info
- `<section>` - Thematic grouping (with label)
- `<article>` - Self-contained content
- `<form>` - Form (with label if multiple)
- `<search>` - Search region

**Key Points**:
- Use semantic HTML5 elements
- Label multiple landmarks of same type
- Include skip link to main content
- Screen readers can navigate by landmarks
- 76% of screen reader users navigate by landmarks

---

## 2. ARIA Patterns (CRITICAL)

**Impact**: ARIA (Accessible Rich Internet Applications) fills gaps in semantic HTML for complex widgets. However, incorrect ARIA is worse than no ARIA.

### 2.1 When to Use ARIA

**First Rule of ARIA**: Don't use ARIA if semantic HTML exists.

**Incorrect**:
```tsx
// ❌ Unnecessary ARIA - semantic HTML exists
<div role="button" tabIndex={0} onClick={handleClick}>
  Submit
</div>

<span role="heading" aria-level="1">Title</span>

<div role="list">
  <div role="listitem">Item 1</div>
</div>
```

**Correct**:
```tsx
// ✅ Use semantic HTML first
<button onClick={handleClick}>Submit</button>

<h1>Title</h1>

<ul>
  <li>Item 1</li>
</ul>

// ✅ ARIA only when semantic HTML doesn't exist
// Example: Tab widget
<div role="tablist" aria-label="Account settings">
  <button
    role="tab"
    aria-selected={activeTab === 'profile'}
    aria-controls="profile-panel"
    id="profile-tab"
  >
    Profile
  </button>
  <button
    role="tab"
    aria-selected={activeTab === 'security'}
    aria-controls="security-panel"
    id="security-tab"
  >
    Security
  </button>
</div>

<div
  role="tabpanel"
  id="profile-panel"
  aria-labelledby="profile-tab"
  hidden={activeTab !== 'profile'}
>
  {/* Profile content */}
</div>
```

**Key Points**:
- Semantic HTML > ARIA
- Bad ARIA breaks accessibility
- Only use ARIA for patterns without semantic equivalents
- Test with screen readers

---

### 2.2 ARIA Roles

**WCAG**: 4.1.2 Name, Role, Value (Level A)

**Common Roles** (when semantic HTML doesn't exist):

**Incorrect**:
```tsx
// ❌ Overriding semantic role
<button role="link">Click me</button>

// ❌ Incomplete widget pattern
<div role="checkbox">Accept terms</div>

// ❌ No keyboard support
<div role="button" onClick={handleClick}>
  Delete
</div>
```

**Correct**:
```tsx
// ✅ Custom checkbox with full ARIA pattern
const Checkbox = ({ checked, onChange, children }: CheckboxProps) => {
  return (
    <label className="checkbox">
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        onClick={() => onChange(!checked)}
      />
      {children}
    </label>
  );
};

// ✅ Alert role for important messages
<div role="alert" className="error-message">
  Your session has expired. Please log in again.
</div>

// ✅ Status role for non-critical updates
<div role="status" aria-live="polite" className="toast">
  Changes saved successfully
</div>

// ✅ Dialog role for modals
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Delete</h2>
  <p id="dialog-description">
    Are you sure you want to delete this property?
  </p>
  <button>Delete</button>
  <button>Cancel</button>
</div>
```

**Common ARIA Roles**:
- `alert` - Important message (interrupts screen reader)
- `status` - Status update (polite announcement)
- `dialog` - Modal dialog
- `menu` - Menu widget (not navigation)
- `tablist/tab/tabpanel` - Tabs widget
- `combobox` - Combo box (autocomplete)
- `listbox/option` - Listbox widget
- `tree/treeitem` - Tree widget
- `grid/gridcell/row` - Data grid

---

### 2.3 ARIA States and Properties

**WCAG**: 4.1.2 Name, Role, Value (Level A)

**Incorrect**:
```tsx
// ❌ Missing ARIA states
<button>
  <svg>{/* icon */}</svg>
</button>

<div role="button" onClick={toggleMenu}>
  Menu
</div>

// ❌ Wrong ARIA values
<button aria-pressed="false">Filter</button> {/* Not a toggle */}
<input aria-required="false" /> {/* Use required attribute */}
```

**Correct**:
```tsx
// ✅ Button with icon needs label
<button aria-label="Delete property">
  <svg aria-hidden="true">{/* trash icon */}</svg>
</button>

// ✅ Expandable button
<button
  aria-expanded={isOpen}
  aria-controls="menu-dropdown"
  onClick={toggleMenu}
>
  Menu
</button>

<div id="menu-dropdown" hidden={!isOpen}>
  {/* Menu items */}
</div>

// ✅ Toggle button
<button
  aria-pressed={isFiltered}
  onClick={toggleFilter}
>
  Filter: {isFiltered ? 'On' : 'Off'}
</button>

// ✅ Current page in navigation
<nav>
  <a href="/dashboard" aria-current="page">Dashboard</a>
  <a href="/properties">Properties</a>
</nav>

// ✅ Loading state
<button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</button>

// ✅ Disabled with reason
<button
  disabled
  aria-disabled="true"
  title="Complete required fields to continue"
>
  Submit
</button>

// ✅ Pulwave pattern for form fields
interface InputProps {
  label: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

<Input
  label="Email"
  required
  aria-required="true"
  aria-invalid={!!error}
  aria-errormessage={error ? 'email-error' : undefined}
  disabled={disabled}
  aria-disabled={disabled}
/>
{error && <span id="email-error" role="alert">{error}</span>}
```

**Common ARIA States/Properties**:
- `aria-label` - Accessible label
- `aria-labelledby` - Reference to label element
- `aria-describedby` - Reference to description
- `aria-expanded` - Expanded state (true/false)
- `aria-pressed` - Toggle button state
- `aria-current` - Current item (page/step/location)
- `aria-busy` - Loading state
- `aria-disabled` - Disabled state
- `aria-hidden` - Hidden from assistive tech
- `aria-invalid` - Invalid form field
- `aria-required` - Required field
- `aria-live` - Live region (polite/assertive/off)
- `aria-atomic` - Announce entire region (true/false)

---

### 2.4 ARIA Live Regions

**WCAG**: 4.1.3 Status Messages (Level AA)

**Problem**: Dynamic content updates don't announce to screen readers.

**Incorrect**:
```tsx
// ❌ Toast appears but screen reader doesn't announce
const Toast = ({ message }: { message: string }) => (
  <div className="toast">{message}</div>
);

// ❌ Loading state change not announced
{isLoading && <div>Loading...</div>}
```

**Correct**:
```tsx
// ✅ Toast with live region
const Toast = ({ message }: { message: string }) => (
  <div role="status" aria-live="polite" className="toast">
    {message}
  </div>
);

// ✅ Error with assertive announcement
const ErrorMessage = ({ error }: { error: string }) => (
  <div role="alert" aria-live="assertive" className="error">
    {error}
  </div>
);

// ✅ Loading with screen reader announcement
const LoadingSpinner = ({ isLoading }: { isLoading: boolean }) => (
  <>
    {isLoading && (
      <div role="status" aria-live="polite" aria-busy="true">
        <span className="visually-hidden">Loading...</span>
        <svg className="spinner" aria-hidden="true">
          {/* spinner icon */}
        </svg>
      </div>
    )}
  </>
);

// ✅ Search results count
const SearchResults = ({ count }: { count: number }) => (
  <div role="status" aria-live="polite" aria-atomic="true">
    {count} results found
  </div>
);

// ✅ Pulwave toast pattern with auto-dismiss
import { useToast } from '@pulwave/foundation';

const Component = () => {
  const { showToast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      showToast({
        message: 'Changes saved successfully',
        type: 'success',
        duration: 5000,
      });
    } catch (error) {
      showToast({
        message: error.message,
        type: 'error',
        duration: 7000,
      });
    }
  };
};

// Toast implementation
const ToastContainer = () => {
  const { toasts } = useToastContext();

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.type === 'error' ? 'alert' : 'status'}
          className={`toast toast--${toast.type}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
```

**aria-live values**:
- `off` - No announcement (default)
- `polite` - Announce when user is idle (most common)
- `assertive` - Announce immediately (errors only)

**Key Points**:
- Use `role="alert"` (implicit `aria-live="assertive"`) for errors
- Use `role="status"` (implicit `aria-live="polite"`) for success
- Use `aria-atomic="true"` to announce entire region
- Keep live region in DOM, update content
- Don't overuse - only for important updates

---

### 2.5 Common ARIA Anti-Patterns

**Incorrect**:
```tsx
// ❌ Redundant role on semantic element
<nav role="navigation">

// ❌ Conflicting role
<button role="link">

// ❌ aria-label on div without role
<div aria-label="Container">

// ❌ Everything is a button
<div role="button" onClick={handleClick}>Click me</div>

// ❌ Missing required ARIA attributes
<div role="checkbox">Accept</div> {/* Missing aria-checked */}

// ❌ Using aria-hidden on focusable element
<button aria-hidden="true">Click</button>

// ❌ Incorrect aria-labelledby reference
<input aria-labelledby="nonexistent-id" />
```

**Correct**:
```tsx
// ✅ Semantic HTML doesn't need role
<nav>

// ✅ Use correct semantic element
<a href="/link">Link</a>

// ✅ aria-label only on interactive elements
<button aria-label="Close modal">

// ✅ Use button element
<button onClick={handleClick}>Click me</button>

// ✅ Complete ARIA pattern
<div
  role="checkbox"
  aria-checked={checked}
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
  Accept
</div>

// ✅ Don't hide focusable elements
<button>Click</button>

// ✅ Valid reference
<label id="email-label">Email</label>
<input aria-labelledby="email-label" />
```

**Key Rules**:
1. No ARIA is better than bad ARIA
2. Semantic HTML > ARIA
3. Don't override semantic roles
4. Complete the pattern (role + states + keyboard)
5. Test with screen readers

---

## 3. Keyboard Navigation (CRITICAL)

**Impact**: 15-20% of users rely on keyboard navigation. All functionality must be keyboard accessible.

### 3.1 Focus Order

**WCAG**: 2.4.3 Focus Order (Level A), 1.3.2 Meaningful Sequence (Level A)

**Problem**: Incorrect DOM order or CSS positioning breaks keyboard navigation.

**Incorrect**:
```tsx
// ❌ Visual order doesn't match DOM order
<div className="grid">
  <div style={{ order: 2 }}>Second visually</div>
  <div style={{ order: 1 }}>First visually</div>
  <div style={{ order: 3 }}>Third visually</div>
</div>

// ❌ Positive tabIndex creates unpredictable order
<button tabIndex={5}>First</button>
<button tabIndex={1}>Second</button>
<button tabIndex={3}>Third</button>

// ❌ Absolute positioning breaks logical order
<div>
  <button style={{ position: 'absolute', top: 0, right: 0 }}>
    Close
  </button>
  <h1>Modal Title</h1>
  <p>Content</p>
</div>
```

**Correct**:
```tsx
// ✅ DOM order matches visual order
<div className="grid">
  <div>First</div>
  <div>Second</div>
  <div>Third</div>
</div>

// ✅ Use natural tab order (tabIndex 0 or omit)
<button>First</button>
<button>Second</button>
<button>Third</button>

// ✅ Make non-interactive elements focusable if needed
<div tabIndex={-1} ref={headingRef}>
  {/* Can be focused programmatically, not in tab order */}
</div>

// ✅ Modal with correct focus order
<div role="dialog" aria-modal="true">
  <h2>Modal Title</h2>
  <p>Content</p>
  <button>Save</button>
  <button>Cancel</button>
  <button className="close-button" aria-label="Close">×</button>
</div>

// ✅ Pulwave Card with proper focus order
<Card>
  <CardHeader>
    <Heading level={3}>Property Name</Heading>
    <Button variant="ghost" size="sm" aria-label="Edit property">
      Edit
    </Button>
  </CardHeader>
  <CardBody>
    {/* Content */}
  </CardBody>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

**tabIndex values**:
- `-1` - Programmatically focusable, not in tab order
- `0` - Natural tab order (interactive elements)
- `>0` - **Never use** (creates unpredictable order)

**Key Points**:
- DOM order = visual order = focus order
- Don't use positive tabIndex
- Use CSS Grid/Flexbox order sparingly
- Test with Tab key
- Use `-1` for programmatic focus only

---

### 3.2 Keyboard Event Handlers

**WCAG**: 2.1.1 Keyboard (Level A), 2.1.2 No Keyboard Trap (Level A)

**Problem**: Click-only interactions exclude keyboard users.

**Incorrect**:
```tsx
// ❌ onClick only - no keyboard support
<div onClick={handleClick}>Click me</div>

// ❌ Missing Enter key for custom button
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === ' ') handleClick(); // Missing Enter
  }}
>
  Click me
</div>

// ❌ onKeyPress (deprecated)
<input onKeyPress={handleKeyPress} />
```

**Correct**:
```tsx
// ✅ Use semantic button
<button onClick={handleClick}>Click me</button>

// ✅ Custom interactive element with full keyboard support
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent scroll on Space
      handleClick();
    }
  }}
>
  Click me
</div>

// ✅ Input with Enter key handler
<input
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }}
/>

// ✅ Escape to close modal
const Modal = ({ onClose, children }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true">
      {children}
    </div>
  );
};

// ✅ Arrow keys for custom select
const useKeyboardNavigation = (items: string[], onSelect: (item: string) => void) => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(items[focusedIndex]);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
    }
  };

  return { focusedIndex, handleKeyDown };
};
```

**Keyboard patterns by widget**:

| Widget | Keys |
|--------|------|
| Button | Enter, Space |
| Link | Enter |
| Checkbox/Radio | Space |
| Select/Combobox | Arrow Up/Down, Enter, Escape |
| Tabs | Arrow Left/Right, Home, End |
| Menu | Arrow Up/Down, Enter, Escape |
| Dialog | Escape (close) |
| Tree | Arrow keys, Enter, Space |

---

### 3.3 Skip Links

**WCAG**: 2.4.1 Bypass Blocks (Level A)

**Problem**: Keyboard users must tab through entire navigation to reach main content.

**Incorrect**:
```tsx
// ❌ No skip link
<div>
  <header>
    <nav>{/* 20+ navigation links */}</nav>
  </header>
  <main>{/* Content */}</main>
</div>
```

**Correct**:
```tsx
// ✅ Skip link as first focusable element
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <Footer />
    </>
  );
};

// SCSS for skip link
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  z-index: 9999;
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--color-brand-primary);
  color: var(--color-text-on-primary);

  &:focus {
    top: 0;
  }
}

// ✅ Multiple skip links for complex layouts
<>
  <a href="#main-content" className="skip-link">
    Skip to main content
  </a>
  <a href="#sidebar" className="skip-link">
    Skip to sidebar
  </a>
  <a href="#footer" className="skip-link">
    Skip to footer
  </a>
</>

// ✅ Skip link with smooth scroll focus
const skipToContent = () => {
  const main = document.getElementById('main-content');
  if (main) {
    main.scrollIntoView({ behavior: 'smooth' });
    main.focus();
  }
};

<a
  href="#main-content"
  className="skip-link"
  onClick={(e) => {
    e.preventDefault();
    skipToContent();
  }}
>
  Skip to main content
</a>
```

**Key Points**:
- Place skip link as first focusable element
- Hide visually, show on focus
- Link to main content ID
- Add `tabIndex={-1}` to main if needed
- Use `position: absolute` for visual hiding

---

### 3.4 Focus Traps (Modals)

**WCAG**: 2.4.3 Focus Order (Level A), 2.1.2 No Keyboard Trap (Level A)

**Problem**: Focus escapes modal, allowing users to interact with background content.

**Incorrect**:
```tsx
// ❌ No focus trap - can tab to background
const Modal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="modal">
      {children}
    </div>
  );
};
```

**Correct**:
```tsx
// ✅ Focus trap implementation
import { useEffect, useRef } from 'react';

const Modal = ({ onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Save currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus modal on mount
    modalRef.current?.focus();

    // Restore focus on unmount
    return () => {
      previousFocusRef.current?.focus();
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements?.length) return;

      const first = focusableElements[0] as HTMLElement;
      const last = focusableElements[focusableElements.length - 1] as HTMLElement;

      // Shift + Tab on first element
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
      // Tab on last element
      else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="modal"
    >
      {children}
    </div>
  );
};

// ✅ Use library for focus trap (Pulwave pattern)
import { FocusTrap } from '@pulwave/foundation';

const Modal = ({ onClose, children }: ModalProps) => {
  return (
    <FocusTrap restoreFocus>
      <div role="dialog" aria-modal="true">
        {children}
      </div>
    </FocusTrap>
  );
};

// ✅ Pulwave Modal component (already has focus trap)
import { Modal } from '@pulwave/ui';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Delete"
>
  <p>Are you sure?</p>
  <Button onClick={handleDelete}>Delete</Button>
  <Button onClick={handleClose}>Cancel</Button>
</Modal>
```

**Focus trap requirements**:
1. Focus moves to modal on open
2. Tab cycles through modal elements only
3. Shift+Tab cycles backwards
4. Escape closes modal
5. Focus returns to trigger element on close
6. Background content is inert (`aria-modal="true"`)

---

### 3.5 Custom Controls

**WCAG**: 2.1.1 Keyboard (Level A), 4.1.2 Name, Role, Value (Level A)

**Problem**: Custom controls without keyboard support are unusable.

**Correct**:
```tsx
// ✅ Custom toggle switch
const ToggleSwitch = ({ checked, onChange, label }: ToggleSwitchProps) => {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="visually-hidden"
      />
      <span
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className="toggle-switch__track"
      >
        <span className="toggle-switch__thumb" />
      </span>
      <span className="toggle-switch__label">{label}</span>
    </label>
  );
};

// ✅ Custom slider
const Slider = ({ value, onChange, min, max, label }: SliderProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = (max - min) / 10;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        onChange(Math.min(value + step, max));
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        onChange(Math.max(value - step, min));
        break;
      case 'Home':
        e.preventDefault();
        onChange(min);
        break;
      case 'End':
        e.preventDefault();
        onChange(max);
        break;
    }
  };

  return (
    <div className="slider">
      <label id="slider-label">{label}</label>
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-labelledby="slider-label"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="slider__track"
      >
        <div
          className="slider__thumb"
          style={{ left: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
    </div>
  );
};
```

**Key Points**:
- Implement full keyboard support
- Add appropriate ARIA roles and states
- Match native control behavior
- Provide visual focus indicator
- Test with keyboard only

---

## 4. Color Contrast & Visual Design (CRITICAL)

**Impact**: 1 in 12 men and 1 in 200 women have color vision deficiency. 4.5:1 contrast ratio is minimum for WCAG AA.

### 4.1 Text Contrast Ratios

**WCAG**: 1.4.3 Contrast (Minimum) (Level AA), 1.4.6 Contrast (Enhanced) (Level AAA)

**Problem**: Low contrast text is unreadable for users with low vision or color blindness.

**Incorrect**:
```scss
// ❌ Insufficient contrast (2.5:1)
.text {
  color: #999;
  background: #fff;
}

// ❌ Light gray on white (1.5:1)
.muted {
  color: #ddd;
  background: #fff;
}

// ❌ Brand color without contrast check (unknown ratio)
.primary-text {
  color: var(--color-brand-primary);
  background: #fff;
}
```

**Correct**:
```scss
// ✅ WCAG AA compliant (4.5:1 minimum for normal text)
.text-primary {
  color: var(--color-text-primary); // #1a1a1a on #fff = 16.1:1
  background: var(--color-surface-default);
}

// ✅ WCAG AA compliant for secondary text (4.5:1)
.text-secondary {
  color: var(--color-text-secondary); // #5f5f5f on #fff = 7.1:1
  background: var(--color-surface-default);
}

// ✅ Large text can use 3:1 ratio (18pt+ or 14pt+ bold)
.heading {
  font-size: var(--font-size-2xl); // 24px
  font-weight: var(--font-weight-bold);
  color: var(--color-text-heading); // 3.5:1 (acceptable for large text)
}

// ✅ Link with sufficient contrast (4.5:1) and non-color indicator
.link {
  color: var(--color-link-default); // #0056b3 = 4.6:1
  text-decoration: underline; // Not relying on color alone

  &:hover {
    color: var(--color-link-hover);
    text-decoration-thickness: 2px;
  }

  &:focus {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}
```

**Contrast Requirements**:

| Content | Level AA | Level AAA |
|---------|----------|-----------|
| Normal text (<18pt) | 4.5:1 | 7:1 |
| Large text (18pt+ or 14pt+ bold) | 3:1 | 4.5:1 |
| UI components | 3:1 | - |
| Graphics | 3:1 | - |

**Pulwave Design Tokens** (already contrast-compliant):
```scss
// Text colors (on white background)
--color-text-primary: hsl(0, 0%, 10%);      // 16.1:1
--color-text-secondary: hsl(0, 0%, 37%);   // 7.1:1
--color-text-disabled: hsl(0, 0%, 62%);    // 3.9:1 (large text only)

// Surface colors
--color-surface-default: hsl(0, 0%, 100%); // White
--color-surface-elevated: hsl(0, 0%, 98%);  // Off-white

// Brand colors (checked for contrast)
--color-brand-primary: hsl(212, 100%, 45%); // 4.6:1 on white
--color-brand-primary-hover: hsl(212, 100%, 40%); // 5.9:1 on white
```

**Testing Tools**:
- Chrome DevTools: Inspect > Accessibility > Contrast
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Axe DevTools extension

---

### 4.2 Non-Text Contrast

**WCAG**: 1.4.11 Non-text Contrast (Level AA)

**Problem**: UI components and graphics need 3:1 contrast ratio.

**Incorrect**:
```scss
// ❌ Border too light (1.5:1)
.input {
  border: 1px solid #e0e0e0;
  background: #fff;
}

// ❌ Icon too light to see (2:1)
.icon {
  color: #ccc;
}

// ❌ Focus indicator too subtle (1.8:1)
button:focus {
  outline: 1px solid #ddd;
}
```

**Correct**:
```scss
// ✅ Border with 3:1 contrast
.input {
  border: 1px solid var(--color-border-default); // #757575 = 3.1:1
  background: var(--color-surface-default);

  &:focus {
    border-color: var(--color-brand-primary);
    outline: 2px solid var(--color-focus-ring); // 4.5:1
    outline-offset: 2px;
  }
}

// ✅ Icon with sufficient contrast
.icon {
  color: var(--color-icon-default); // #424242 = 8.6:1
}

// ✅ Chart with accessible colors
.chart {
  --chart-color-1: hsl(212, 100%, 40%); // Blue 5.9:1
  --chart-color-2: hsl(142, 70%, 35%);  // Green 4.7:1
  --chart-color-3: hsl(25, 95%, 40%);   // Orange 4.5:1
  --chart-color-4: hsl(291, 60%, 40%);  // Purple 4.6:1
}

// ✅ Button states with clear visual difference
.btn {
  background: var(--color-brand-primary);
  border: 1px solid var(--color-brand-primary);

  &:hover {
    background: var(--color-brand-primary-hover);
    border-color: var(--color-brand-primary-hover);
  }

  &:disabled {
    background: var(--color-surface-disabled);
    border-color: var(--color-border-disabled);
    color: var(--color-text-disabled);
    opacity: 0.6; // Visual indicator of disabled state
  }
}
```

**Key Points**:
- UI components need 3:1 contrast
- Focus indicators need 3:1 contrast against background
- Charts and graphs need accessible color palettes
- Don't rely on color alone for state

---

### 4.3 Color Independence

**WCAG**: 1.4.1 Use of Color (Level A)

**Problem**: Information conveyed by color alone is inaccessible.

**Incorrect**:
```tsx
// ❌ Color-only status indicator
<span style={{ color: 'green' }}>Active</span>
<span style={{ color: 'red' }}>Inactive</span>

// ❌ Color-only form validation
<input className={error ? 'error' : ''} />
.input.error {
  border-color: red; // Color only
}

// ❌ Color-only chart legend
<div className="legend">
  <span style={{ color: 'blue' }}>Series 1</span>
  <span style={{ color: 'green' }}>Series 2</span>
</div>
```

**Correct**:
```tsx
// ✅ Status with icon and text
<span className="status status--active">
  <svg aria-hidden="true">{/* check icon */}</svg>
  Active
</span>

<span className="status status--inactive">
  <svg aria-hidden="true">{/* x icon */}</svg>
  Inactive
</span>

// ✅ Form validation with icon and text
<Input
  error={error}
  aria-invalid={!!error}
  aria-errormessage="email-error"
/>
{error && (
  <span id="email-error" className="field-error" role="alert">
    <svg aria-hidden="true">{/* error icon */}</svg>
    {error}
  </span>
)}

.field-error {
  color: var(--color-feedback-error);

  &::before {
    content: '⚠'; // Icon
    margin-right: var(--spacing-1);
  }
}

// ✅ Chart with patterns and labels
<svg className="chart">
  <rect fill="url(#pattern-1)" /> {/* Pattern fill */}
  <rect fill="url(#pattern-2)" />

  <defs>
    <pattern id="pattern-1">
      {/* Diagonal lines */}
    </pattern>
    <pattern id="pattern-2">
      {/* Dots */}
    </pattern>
  </defs>
</svg>

// ✅ Pulwave Badge with semantic meaning
import { Badge } from '@pulwave/ui';

<Badge variant="success" icon="check">
  Active
</Badge>

<Badge variant="error" icon="x">
  Inactive
</Badge>
```

**Key Points**:
- Never use color alone for information
- Add text labels or icons
- Use patterns for charts
- Provide text alternatives
- 8% of men have color vision deficiency

---

### 4.4 Focus Indicators

**WCAG**: 2.4.7 Focus Visible (Level AA), 2.4.11 Focus Appearance (Level AAA)

**Problem**: Missing or subtle focus indicators make keyboard navigation impossible.

**Incorrect**:
```scss
// ❌ No focus indicator
button:focus {
  outline: none;
}

// ❌ Same as hover (can't distinguish)
button:hover,
button:focus {
  background: var(--color-brand-primary-hover);
}

// ❌ Too subtle (fails contrast)
input:focus {
  outline: 1px solid #ddd;
}
```

**Correct**:
```scss
// ✅ Clear focus indicator with sufficient contrast
button:focus-visible {
  outline: 2px solid var(--color-focus-ring); // 4.5:1 contrast
  outline-offset: 2px;
}

// ✅ Custom focus style
.btn:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--color-focus-ring-alpha); // Additional visual cue
}

// ✅ Input focus
.input:focus {
  border-color: var(--color-brand-primary);
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 0;
  box-shadow: 0 0 0 3px var(--color-focus-ring-alpha);
}

// ✅ Link focus
a:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

// ✅ Card/clickable area focus
.card--clickable:focus-within {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

// ✅ Global focus styles (Pulwave pattern)
*:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

// Override for specific components
.btn:focus-visible {
  outline-color: var(--color-brand-primary);
}
```

**Pulwave Focus Tokens**:
```scss
--color-focus-ring: hsl(212, 100%, 45%);        // Primary focus
--color-focus-ring-alpha: hsla(212, 100%, 45%, 0.2); // Soft glow
--color-focus-error: hsl(0, 70%, 50%);          // Error state focus
--color-focus-success: hsl(142, 70%, 45%);      // Success state focus
```

**Key Points**:
- Never remove focus styles completely
- Use `:focus-visible` to hide focus for mouse clicks
- Minimum 2px outline with 3:1 contrast
- Use `outline-offset` for breathing room
- Test with keyboard navigation

---

### 4.5 Typography

**WCAG**: 1.4.12 Text Spacing (Level AA), 1.4.4 Resize Text (Level AA)

**Problem**: Fixed sizes and tight spacing reduce readability.

**Incorrect**:
```scss
// ❌ Fixed pixel sizes (doesn't scale)
.text {
  font-size: 14px;
  line-height: 18px;
}

// ❌ Tight line height (< 1.5)
.paragraph {
  line-height: 1.2;
}

// ❌ Insufficient spacing
.paragraph {
  letter-spacing: -0.05em; // Too tight
  word-spacing: -0.1em;
}
```

**Correct**:
```scss
// ✅ Relative units (scales with user preferences)
.text {
  font-size: var(--font-size-base); // 1rem = 16px default
  line-height: var(--line-height-normal); // 1.5
}

// ✅ Generous line height (1.5+)
.paragraph {
  font-size: var(--font-size-base);
  line-height: 1.5; // WCAG minimum
  margin-bottom: var(--spacing-4);
}

// ✅ Readable paragraph width
.content {
  max-width: 65ch; // 65 characters for optimal readability
}

// ✅ Responsive typography
.heading {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  line-height: 1.2; // Headings can be tighter
}

// ✅ Pulwave typography scale
.text--xs { font-size: var(--font-size-xs); }    // 0.75rem
.text--sm { font-size: var(--font-size-sm); }    // 0.875rem
.text--base { font-size: var(--font-size-base); } // 1rem
.text--lg { font-size: var(--font-size-lg); }    // 1.125rem
.text--xl { font-size: var(--font-size-xl); }    // 1.25rem
.text--2xl { font-size: var(--font-size-2xl); }  // 1.5rem
.text--3xl { font-size: var(--font-size-3xl); }  // 1.875rem
```

**WCAG Text Spacing Requirements**:
- Line height: at least 1.5x font size
- Paragraph spacing: at least 2x font size
- Letter spacing: at least 0.12x font size
- Word spacing: at least 0.16x font size
- Text must be resizable up to 200% without loss of content

**Pulwave Typography Tokens**:
```scss
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
--line-height-loose: 2;

--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

---

## 5. Screen Reader Support (CRITICAL)

**Impact**: 2.2% of web users rely on screen readers. Proper screen reader support is essential for accessibility.

### 5.1 Descriptive Labels

**WCAG**: 2.4.6 Headings and Labels (Level AA), 4.1.2 Name, Role, Value (Level A)

**Problem**: Generic or missing labels don't provide context to screen reader users.

**Incorrect**:
```tsx
// ❌ Generic label
<button>Click here</button>

// ❌ Icon-only button without label
<button>
  <svg>{/* trash icon */}</svg>
</button>

// ❌ Ambiguous link text
<a href="/properties">Read more</a>

// ❌ Form without labels
<input type="text" placeholder="Search" />
```

**Correct**:
```tsx
// ✅ Descriptive button text
<button>Save property details</button>

// ✅ Icon button with aria-label
<button aria-label="Delete property">
  <svg aria-hidden="true">{/* trash icon */}</svg>
</button>

// ✅ Descriptive link text
<a href="/properties/123">View property details for 123 Main St</a>

// ✅ Link with visually-hidden context
<a href="/properties">
  Read more<span className="visually-hidden"> about property management</span>
</a>

// ✅ Form input with visible label
<label htmlFor="search">Search properties</label>
<input type="text" id="search" name="search" />

// ✅ Complex navigation with descriptive labels
<nav aria-label="Main navigation">
  <ul>
    <li>
      <a href="/dashboard" aria-current="page">
        Dashboard
      </a>
    </li>
    <li>
      <a href="/properties">
        Properties
        <span className="badge" aria-label="3 new properties">3</span>
      </a>
    </li>
  </ul>
</nav>

// ✅ Pulwave pattern for icon buttons
import { Button, Icon } from '@pulwave/ui';

<Button
  variant="ghost"
  size="sm"
  aria-label="Edit property"
  icon={<Icon name="edit" aria-hidden="true" />}
/>
```

**Key Points**:
- Button text should describe action
- Icon buttons need `aria-label`
- Links should make sense out of context
- Decorative icons use `aria-hidden="true"`
- Informative icons need text alternatives

---

### 5.2 Alternative Text

**WCAG**: 1.1.1 Non-text Content (Level A)

**Problem**: Images without alt text are invisible to screen readers.

**Incorrect**:
```tsx
// ❌ Missing alt attribute
<img src="property.jpg" />

// ❌ Redundant alt text
<img src="photo.jpg" alt="Photo" />

// ❌ File name as alt
<img src="IMG_1234.jpg" alt="IMG_1234" />

// ❌ Alt text that doesn't add value
<a href="/properties">
  <img src="icon.svg" alt="Click here" />
  View Properties
</a>
```

**Correct**:
```tsx
// ✅ Descriptive alt text
<img
  src="property.jpg"
  alt="Modern 3-bedroom apartment with city view in Lisbon"
/>

// ✅ Empty alt for decorative images
<img src="decorative-border.svg" alt="" />

// ✅ Icon inside link (empty alt, link text provides context)
<a href="/properties">
  <img src="icon.svg" alt="" />
  View Properties
</a>

// ✅ Complex image with long description
<figure>
  <img
    src="floor-plan.jpg"
    alt="Floor plan of 2-bedroom apartment"
    aria-describedby="floor-plan-description"
  />
  <figcaption id="floor-plan-description">
    Floor plan showing an open-concept living area with kitchen,
    two bedrooms, and one bathroom totaling 850 square feet.
  </figcaption>
</figure>

// ✅ SVG with title and description
<svg role="img" aria-labelledby="chart-title chart-desc">
  <title id="chart-title">Property sales by month</title>
  <desc id="chart-desc">
    Bar chart showing property sales increasing from 10 in January
    to 45 in December
  </desc>
  {/* Chart elements */}
</svg>

// ✅ Background image with text alternative
<div
  className="hero"
  style={{ backgroundImage: 'url(hero.jpg)' }}
  role="img"
  aria-label="Modern apartment building with glass facade"
>
  <h1>Find Your Dream Home</h1>
</div>

// ✅ Pulwave Avatar component
import { Avatar } from '@pulwave/ui';

<Avatar
  src="/avatar.jpg"
  alt="John Smith, Property Manager"
  fallback="JS"
/>
```

**Alt Text Guidelines**:
- **Informative images**: Describe the content and purpose
- **Decorative images**: Use empty alt (`alt=""`)
- **Functional images**: Describe the action (e.g., "Search")
- **Complex images**: Use `aria-describedby` for long descriptions
- **Limit**: Keep under 150 characters when possible

**Metrics**:
- 100% of images must have alt attribute
- 0% of alt text should be file names
- Decorative images: `alt=""` (intentionally empty)

---

### 5.3 Visually Hidden Content

**WCAG**: 4.1.2 Name, Role, Value (Level A)

**Problem**: Some content needs to be available to screen readers but not visible.

**Incorrect**:
```scss
// ❌ display: none removes from accessibility tree
.screen-reader-only {
  display: none;
}

// ❌ visibility: hidden removes from accessibility tree
.hidden {
  visibility: hidden;
}

// ❌ Negative text-indent can cause horizontal scroll
.sr-only {
  text-indent: -9999px;
}
```

**Correct**:
```scss
// ✅ Visually hidden but accessible to screen readers
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

// ✅ Focusable version (for skip links)
.visually-hidden-focusable:not(:focus):not(:focus-within) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Usage Examples**:
```tsx
// ✅ Additional context for screen readers
<button>
  <svg aria-hidden="true">{/* trash icon */}</svg>
  <span className="visually-hidden">Delete property</span>
</button>

// ✅ Table headers for layout tables
<table>
  <thead>
    <tr>
      <th className="visually-hidden">Property Name</th>
      <th className="visually-hidden">Location</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>123 Main St</td>
      <td>Lisbon</td>
    </tr>
  </tbody>
</table>

// ✅ Form instructions
<label htmlFor="password">
  Password
  <span className="visually-hidden">
    Must be at least 8 characters with one uppercase letter and one number
  </span>
</label>
<input type="password" id="password" />

// ✅ Loading state
<button disabled={isLoading}>
  {isLoading && <span className="visually-hidden">Loading...</span>}
  <svg className="spinner" aria-hidden="true">{/* spinner */}</svg>
  {isLoading ? 'Saving...' : 'Save'}
</button>

// ✅ Pulwave utility class
import '@pulwave/foundation/styles/utilities';

<span className="u-visually-hidden">
  Additional context for screen readers
</span>
```

**Key Points**:
- Use `.visually-hidden` class from Pulwave Foundation
- Don't use `display: none` or `visibility: hidden`
- Useful for icons, skip links, and additional context
- Make skip links visible on focus

---

### 5.4 Reading Order

**WCAG**: 1.3.2 Meaningful Sequence (Level A)

**Problem**: Visual order doesn't match DOM order, breaking screen reader experience.

**Incorrect**:
```tsx
// ❌ CSS changes visual order but DOM order is wrong
<div className="grid">
  <div style={{ order: 3 }}>Third visually</div>
  <div style={{ order: 1 }}>First visually</div>
  <div style={{ order: 2 }}>Second visually</div>
</div>

// ❌ Absolute positioning breaks reading order
<div>
  <div style={{ position: 'absolute', top: 0, right: 0 }}>
    Important notice
  </div>
  <h1>Page Title</h1>
  <p>Content</p>
</div>
```

**Correct**:
```tsx
// ✅ DOM order matches visual order
<div className="grid">
  <div>First</div>
  <div>Second</div>
  <div>Third</div>
</div>

// ✅ Logical source order
<div>
  <h1>Page Title</h1>
  <div className="notice">Important notice</div>
  <p>Content</p>
</div>

// ✅ Form with logical order
<form>
  <fieldset>
    <legend>Personal Information</legend>
    <label htmlFor="first-name">First Name</label>
    <input type="text" id="first-name" />

    <label htmlFor="last-name">Last Name</label>
    <input type="text" id="last-name" />
  </fieldset>

  <fieldset>
    <legend>Contact Information</legend>
    <label htmlFor="email">Email</label>
    <input type="email" id="email" />
  </fieldset>

  <button type="submit">Submit</button>
</form>

// ✅ Card with logical reading order
<article className="property-card">
  <h3>Property Name</h3>
  <img src="property.jpg" alt="Modern apartment exterior" />
  <p>Description of property...</p>
  <div className="property-meta">
    <span>3 beds</span>
    <span>2 baths</span>
  </div>
  <a href="/properties/123">View Details</a>
</article>
```

**Testing Reading Order**:
1. Turn off CSS
2. Read from top to bottom
3. Does it make sense?
4. Test with screen reader
5. Check Tab order matches visual order

---

### 5.5 Screen Reader Testing

**WCAG**: N/A (Best Practice)

**Tools**:
- **NVDA** (Windows, Free): https://www.nvaccess.org/
- **JAWS** (Windows, Paid): https://www.freedomscientific.com/products/software/jaws/
- **VoiceOver** (macOS/iOS, Built-in): Cmd+F5
- **TalkBack** (Android, Built-in): Settings > Accessibility
- **Narrator** (Windows, Built-in): Win+Ctrl+Enter

**VoiceOver Keyboard Shortcuts** (macOS):
- **VO**: Control + Option
- **VO + A**: Start reading
- **VO + →**: Next item
- **VO + ←**: Previous item
- **VO + Space**: Activate link/button
- **VO + U**: Open rotor (headings, links, landmarks)
- **VO + Cmd + H**: Next heading
- **VO + Cmd + L**: Next link

**NVDA Keyboard Shortcuts** (Windows):
- **NVDA**: Insert or CapsLock
- **NVDA + Down**: Start reading
- **Down arrow**: Next item
- **Up arrow**: Previous item
- **Enter**: Activate link/button
- **NVDA + F7**: Elements list
- **H**: Next heading
- **K**: Next link
- **D**: Next landmark

**Testing Checklist**:
```tsx
// ✅ Test with screen reader
const ScreenReaderTestChecklist = [
  'All images have alt text',
  'All buttons have descriptive labels',
  'Form inputs have associated labels',
  'Headings are in logical order',
  'Landmarks are properly labeled',
  'Focus order matches visual order',
  'Live regions announce updates',
  'Modals trap focus',
  'Error messages are announced',
  'Loading states are announced',
];
```

**Example: Testing a Modal**:
```tsx
// Test this component with screen reader:
const Modal = ({ title, children, onClose }: ModalProps) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="modal"
    >
      <h2 id="modal-title">{title}</h2>
      {children}
      <button onClick={onClose} aria-label="Close modal">
        ×
      </button>
    </div>
  );
};

// Screen reader should announce:
// 1. "Dialog: [Title]" (on open)
// 2. Focus moves to modal
// 3. Can navigate through modal content
// 4. Tab cycles within modal only
// 5. "Close modal, button" (when focused on close button)
// 6. Escape key closes modal
// 7. Focus returns to trigger element
```

**Key Points**:
- Test with actual screen readers
- Test keyboard navigation first
- Test on both desktop and mobile
- Test with multiple screen readers
- Test critical user paths

---

## 6. Focus Management (CRITICAL)

**Impact**: Proper focus management ensures keyboard users know where they are and can navigate efficiently.

### 6.1 Managing Focus on Route Change

**WCAG**: 2.4.3 Focus Order (Level A)

**Problem**: In SPAs, focus doesn't reset on route change, disorienting keyboard users.

**Incorrect**:
```tsx
// ❌ No focus management on route change
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/properties" element={<Properties />} />
</Routes>
```

**Correct**:
```tsx
// ✅ Focus management with route change
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const FocusManager = ({ children }: { children: React.ReactNode }) => {
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    // Focus main content area on route change
    mainRef.current?.focus();

    // Announce route change to screen readers
    const announcement = document.getElementById('route-announcement');
    if (announcement) {
      announcement.textContent = `Navigated to ${document.title}`;
    }
  }, [location.pathname]);

  return (
    <>
      <div
        id="route-announcement"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
      />
      <main ref={mainRef} tabIndex={-1} id="main-content">
        {children}
      </main>
    </>
  );
};

// Usage in app
<Router>
  <Header />
  <FocusManager>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/properties" element={<Properties />} />
    </Routes>
  </FocusManager>
</Router>

// ✅ Pulwave pattern with AppShell
import { AppShell, useFocusManagement } from '@pulwave/experience/shell';

const App = () => {
  useFocusManagement(); // Handles focus on route change

  return (
    <AppShell>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AppShell>
  );
};
```

**Key Points**:
- Focus main content area on route change
- Make main focusable with `tabIndex={-1}`
- Announce route change to screen readers
- Preserve focus for back button navigation

---

### 6.2 Managing Focus in Modals

**WCAG**: 2.4.3 Focus Order (Level A)

See section 3.4 for complete focus trap implementation.

**Key Points**:
- Focus modal on open
- Trap focus within modal
- Restore focus on close
- Escape key closes modal

---

### 6.3 Managing Focus in Dropdowns

**WCAG**: 4.1.2 Name, Role, Value (Level A)

**Incorrect**:
```tsx
// ❌ No focus management
const Dropdown = ({ items }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Menu
      </button>
      {isOpen && (
        <ul>
          {items.map(item => <li>{item}</li>)}
        </ul>
      )}
    </div>
  );
};
```

**Correct**:
```tsx
// ✅ Dropdown with focus management
const Dropdown = ({ items, onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
    setFocusedIndex(0);

    // Focus first item after dropdown opens
    setTimeout(() => {
      const firstItem = listRef.current?.querySelector('[role="menuitem"]') as HTMLElement;
      firstItem?.focus();
    }, 0);
  };

  const handleClose = () => {
    setIsOpen(false);
    buttonRef.current?.focus(); // Return focus to button
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(Math.min(focusedIndex + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(Math.max(focusedIndex - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(items[focusedIndex]);
        handleClose();
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
    }
  };

  useEffect(() => {
    // Focus current item when index changes
    const items = listRef.current?.querySelectorAll('[role="menuitem"]');
    (items?.[focusedIndex] as HTMLElement)?.focus();
  }, [focusedIndex]);

  return (
    <div className="dropdown">
      <button
        ref={buttonRef}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={handleOpen}
      >
        Menu
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="menu"
          onKeyDown={handleKeyDown}
        >
          {items.map((item, index) => (
            <li key={item}>
              <button
                role="menuitem"
                onClick={() => {
                  onSelect(item);
                  handleClose();
                }}
                tabIndex={index === focusedIndex ? 0 : -1}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ✅ Pulwave Dropdown component (already has focus management)
import { Dropdown } from '@pulwave/ui';

<Dropdown
  trigger={<Button>Menu</Button>}
  items={[
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: handleDelete },
  ]}
/>
```

**Key Points**:
- Focus first item when dropdown opens
- Arrow keys navigate items
- Enter/Space selects item
- Escape closes and returns focus
- Return focus to trigger on close

---

### 6.4 Restoring Focus

**WCAG**: 2.4.3 Focus Order (Level A)

**Problem**: Focus is lost after closing a component, disorienting users.

**Correct**:
```tsx
// ✅ Save and restore focus
const useRestoreFocus = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    previousFocusRef.current?.focus();
  };

  return { saveFocus, restoreFocus };
};

// Usage in Modal
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const { saveFocus, restoreFocus } = useRestoreFocus();

  useEffect(() => {
    if (isOpen) {
      saveFocus();
    } else {
      restoreFocus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

// ✅ Pulwave pattern (automatic)
import { Modal } from '@pulwave/ui';

<Modal isOpen={isOpen} onClose={handleClose}>
  {/* Focus automatically restored on close */}
</Modal>
```

---

### 6.5 Focus Styles

See section 4.4 for complete focus styling patterns.

**Key Points**:
- Always show focus indicator
- 2px outline minimum
- 3:1 contrast ratio
- Use `:focus-visible` for better UX

---

## 7. Forms & Labels (CRITICAL)

**Impact**: Forms are the primary interaction point. Accessible forms are critical for all users.

### 7.1 Label Association

See section 1.2 for complete label patterns.

**Key Points**:
- All inputs must have labels
- Use `htmlFor`/`id` association
- Use `aria-describedby` for hints
- Use `aria-errormessage` for errors

---

### 7.2 Error Identification

**WCAG**: 3.3.1 Error Identification (Level A), 3.3.3 Error Suggestion (Level AA)

**Incorrect**:
```tsx
// ❌ Color-only error indication
<input className={error ? 'error' : ''} />

// ❌ Error not associated with input
<input type="email" />
<div className="error">Invalid email</div>

// ❌ Generic error message
<span>Error</span>
```

**Correct**:
```tsx
// ✅ Accessible error pattern
const EmailInput = ({ error }: { error?: string }) => {
  const id = 'email-input';
  const errorId = `${id}-error`;

  return (
    <div className="form-field">
      <label htmlFor={id}>Email</label>
      <input
        type="email"
        id={id}
        aria-invalid={!!error}
        aria-errormessage={error ? errorId : undefined}
        className={error ? 'input--error' : ''}
      />
      {error && (
        <span id={errorId} className="field-error" role="alert">
          <svg aria-hidden="true">{/* error icon */}</svg>
          {error}
        </span>
      )}
    </div>
  );
};

// ✅ Form with error summary
const FormErrorSummary = ({ errors }: { errors: Record<string, string> }) => {
  if (Object.keys(errors).length === 0) return null;

  return (
    <div
      role="alert"
      aria-labelledby="error-summary-title"
      className="form-error-summary"
    >
      <h2 id="error-summary-title">
        There {Object.keys(errors).length === 1 ? 'is' : 'are'} {Object.keys(errors).length} error{Object.keys(errors).length === 1 ? '' : 's'}
      </h2>
      <ul>
        {Object.entries(errors).map(([field, message]) => (
          <li key={field}>
            <a href={`#${field}`}>{message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ✅ Real-time validation with debounce
const useFieldValidation = (value: string, validator: (v: string) => string | undefined) => {
  const [error, setError] = useState<string>();
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched) return;

    const timeout = setTimeout(() => {
      setError(validator(value));
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, validator, touched]);

  return {
    error,
    onBlur: () => setTouched(true),
  };
};

// ✅ Pulwave form pattern
import { useForm } from '@pulwave/data';
import { Input, Button, FormErrorSummary } from '@pulwave/ui';

const PropertyForm = () => {
  const { register, handleSubmit, errors, isSubmitting } = useForm<PropertyFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormErrorSummary errors={errors} />

      <Input
        label="Property Name"
        {...register('name', { required: 'Property name is required' })}
        error={errors.name?.message}
      />

      <Button type="submit" disabled={isSubmitting}>
        Save Property
      </Button>
    </form>
  );
};
```

**Key Points**:
- Mark invalid fields with `aria-invalid="true"`
- Associate errors with `aria-errormessage`
- Use `role="alert"` for error announcements
- Provide specific, helpful error messages
- Show error summary at top of form

---

### 7.3 Field Instructions

**WCAG**: 3.3.2 Labels or Instructions (Level A)

**Incorrect**:
```tsx
// ❌ No instructions for complex field
<input type="password" />

// ❌ Instructions not associated
<input type="email" />
<small>Enter a valid email address</small>
```

**Correct**:
```tsx
// ✅ Instructions associated with aria-describedby
<div>
  <label htmlFor="password">Password</label>
  <input
    type="password"
    id="password"
    aria-describedby="password-hint"
  />
  <span id="password-hint" className="field-hint">
    Must be at least 8 characters with one uppercase letter and one number
  </span>
</div>

// ✅ Instructions and error (multiple describedby)
<div>
  <label htmlFor="email">Email</label>
  <input
    type="email"
    id="email"
    aria-describedby="email-hint email-error"
    aria-invalid={!!error}
  />
  <span id="email-hint" className="field-hint">
    We'll never share your email
  </span>
  {error && (
    <span id="email-error" className="field-error" role="alert">
      {error}
    </span>
  )}
</div>

// ✅ Pulwave Input component handles this automatically
import { Input } from '@pulwave/ui';

<Input
  label="Password"
  type="password"
  hint="Must be at least 8 characters with one uppercase letter and one number"
  error={passwordError}
  required
/>
```

---

### 7.4 Required Fields

**WCAG**: 3.3.2 Labels or Instructions (Level A)

**Incorrect**:
```tsx
// ❌ Visual asterisk only
<label>
  Email *
  <input type="email" />
</label>

// ❌ No indication of required
<input type="email" />
```

**Correct**:
```tsx
// ✅ Required attribute + visual indicator
<label htmlFor="email">
  Email
  <span aria-label="required">*</span>
</label>
<input
  type="email"
  id="email"
  required
  aria-required="true"
/>

// ✅ Required in label text
<label htmlFor="email">Email (required)</label>
<input type="email" id="email" required />

// ✅ Fieldset with legend explaining required
<fieldset>
  <legend>Personal Information (all fields required)</legend>
  <label htmlFor="first-name">First Name</label>
  <input type="text" id="first-name" required />

  <label htmlFor="last-name">Last Name</label>
  <input type="text" id="last-name" required />
</fieldset>

// ✅ Pulwave pattern
import { Input } from '@pulwave/ui';

<Input
  label="Email"
  type="email"
  required
  requiredIndicator="*"
/>
```

**Key Points**:
- Use `required` attribute
- Add `aria-required="true"`
- Provide visual indicator
- Don't rely on color alone
- Explain required fields in form instructions

---

### 7.5 Input Validation

**WCAG**: 3.3.1 Error Identification (Level A), 3.3.4 Error Prevention (Level AA)

**Correct**:
```tsx
// ✅ Client-side validation with helpful messages
const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address (e.g., user@example.com)';
  }
  return undefined;
};

// ✅ Password strength indicator
const PasswordInput = () => {
  const [password, setPassword] = useState('');
  const strength = calculatePasswordStrength(password);

  return (
    <div>
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-describedby="password-strength password-hint"
      />
      <div
        id="password-strength"
        role="status"
        aria-live="polite"
        className={`password-strength password-strength--${strength}`}
      >
        Password strength: {strength}
      </div>
      <span id="password-hint" className="field-hint">
        Must be at least 8 characters with one uppercase letter and one number
      </span>
    </div>
  );
};

// ✅ Confirmation before destructive action
const DeleteConfirmation = ({ onDelete }: { onDelete: () => void }) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        I understand this action cannot be undone
      </label>
      <Button
        onClick={onDelete}
        disabled={!confirmed}
        variant="destructive"
      >
        Delete Property
      </Button>
    </div>
  );
};
```

---

## 8. Dynamic Content & Live Regions (HIGH)

### 8.1 ARIA Live Regions

See section 2.4 for complete live region patterns.

**Key Points**:
- Use `role="alert"` for errors (assertive)
- Use `role="status"` for success (polite)
- Keep live region in DOM
- Use `aria-atomic` for complete announcements

---

### 8.2 Loading States

**WCAG**: 4.1.3 Status Messages (Level AA)

**Correct**:
```tsx
// ✅ Loading with screen reader announcement
const LoadingButton = ({ isLoading, children }: LoadingButtonProps) => {
  return (
    <button disabled={isLoading} aria-busy={isLoading}>
      {isLoading && (
        <span className="visually-hidden">Loading...</span>
      )}
      <svg className={isLoading ? 'spinner' : 'hidden'} aria-hidden="true">
        {/* spinner */}
      </svg>
      {children}
    </button>
  );
};

// ✅ Page-level loading
const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="loading-overlay"
    >
      <span className="visually-hidden">Loading page content...</span>
      <svg className="spinner" aria-hidden="true">
        {/* spinner */}
      </svg>
    </div>
  );
};
```

---

### 8.3 Toast Notifications

See section 2.4 for complete toast patterns.

---

### 8.4 Infinite Scroll

**WCAG**: 2.4.1 Bypass Blocks (Level A)

**Correct**:
```tsx
// ✅ Infinite scroll with announcements
const InfiniteList = ({ items, loadMore, hasMore }: InfiniteListProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <ul aria-label="Properties">
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      {hasMore && (
        <div ref={loadMoreRef} role="status" aria-live="polite">
          {isLoading && 'Loading more properties...'}
        </div>
      )}

      <button onClick={loadMore} className="load-more">
        Load more properties
      </button>
    </>
  );
};
```

---

### 8.5 Dynamic Updates

**WCAG**: 4.1.3 Status Messages (Level AA)

**Correct**:
```tsx
// ✅ Dynamic content updates
const NotificationCount = ({ count }: { count: number }) => {
  const prevCountRef = useRef(count);

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <span aria-label={`${count} notifications`}>
        {count}
      </span>
      {count > prevCountRef.current && (
        <span role="status" aria-live="polite" className="visually-hidden">
          {count - prevCountRef.current} new notification{count - prevCountRef.current === 1 ? '' : 's'}
        </span>
      )}
    </div>
  );
};
```

---

## 9. Testing & Auditing (HIGH)

### 9.1 Automated Testing

**Tools**:
- **Axe DevTools** (Browser Extension): https://www.deque.com/axe/devtools/
- **Lighthouse** (Chrome DevTools): Audit > Accessibility
- **axe-core** (Testing Library): @axe-core/react
- **jest-axe** (Jest integration)
- **pa11y** (CI integration)

**Incorrect**:
```tsx
// ❌ No accessibility testing
import { render } from '@testing-library/react';

it('renders button', () => {
  render(<Button>Click me</Button>);
  // Missing accessibility checks
});
```

**Correct**:
```tsx
// ✅ Automated accessibility testing
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// ✅ Check specific ARIA attributes
import { render, screen } from '@testing-library/react';

it('button has accessible name', () => {
  render(<Button aria-label="Delete property">×</Button>);
  expect(screen.getByRole('button', { name: /delete property/i })).toBeInTheDocument();
});

// ✅ Keyboard navigation testing
it('supports keyboard navigation', () => {
  render(<Modal isOpen onClose={handleClose} />);

  // Tab through focusable elements
  userEvent.tab();
  expect(screen.getByRole('button', { name: /close/i })).toHaveFocus();

  // Escape closes modal
  userEvent.keyboard('{Escape}');
  expect(handleClose).toHaveBeenCalled();
});

// ✅ Pulwave testing pattern
import { renderWithA11y } from '@pulwave/testing';

it('component is accessible', async () => {
  const { checkA11y } = renderWithA11y(<PropertyCard {...props} />);
  await checkA11y();
});
```

**Automated Testing Limitations**:
- Only catches ~30-50% of issues
- Can't test screen reader experience
- Can't test keyboard navigation fully
- Can't test color contrast in all contexts
- Manual testing still required

---

### 9.2 Manual Testing

**Keyboard Testing Checklist**:
```tsx
const KeyboardTestingChecklist = [
  '✅ All interactive elements reachable via Tab',
  '✅ Focus order matches visual order',
  '✅ Focus visible at all times',
  '✅ Enter/Space activates buttons/links',
  '✅ Arrow keys navigate menus/dropdowns',
  '✅ Escape closes modals/dropdowns',
  '✅ No keyboard traps',
  '✅ Skip link works',
  '✅ Forms submittable via Enter',
  '✅ Custom controls have keyboard support',
];
```

**Color Contrast Testing**:
```tsx
const ContrastTestingChecklist = [
  '✅ Text contrast ≥ 4.5:1 (normal text)',
  '✅ Large text contrast ≥ 3:1',
  '✅ UI component contrast ≥ 3:1',
  '✅ Focus indicator contrast ≥ 3:1',
  '✅ Information not conveyed by color alone',
  '✅ Links distinguishable without color',
];
```

---

### 9.3 Screen Reader Testing

See section 5.5 for screen reader testing patterns.

---

### 9.4 Keyboard Testing

**Test with keyboard only**:
1. Unplug mouse (or don't use it)
2. Navigate with Tab/Shift+Tab
3. Activate with Enter/Space
4. Use arrow keys for menus/dropdowns
5. Close with Escape
6. Verify focus is always visible
7. Verify no keyboard traps

---

### 9.5 Continuous Monitoring

**CI Integration**:
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    setupFiles: ['./test/setup.ts'],
    globals: true,
    environment: 'jsdom',
  },
});

// test/setup.ts
import { expect } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Run axe on all component tests
afterEach(async () => {
  const { container } = render.mock.results[0]?.value || {};
  if (container) {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }
});
```

**GitHub Actions**:
```yaml
# .github/workflows/a11y.yml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:a11y
      - run: npm run build
      - run: npx pa11y-ci
```

---

## 10. Common Patterns (HIGH)

### 10.1 Tabs

**WCAG**: 1.3.1 Info and Relationships (Level A)

**Correct**:
```tsx
// ✅ Accessible tabs
const Tabs = ({ tabs, defaultTab }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setActiveTab(tabs[(index + 1) % tabs.length].id);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setActiveTab(tabs[(index - 1 + tabs.length) % tabs.length].id);
        break;
      case 'Home':
        e.preventDefault();
        setActiveTab(tabs[0].id);
        break;
      case 'End':
        e.preventDefault();
        setActiveTab(tabs[tabs.length - 1].id);
        break;
    }
  };

  return (
    <div className="tabs">
      <div role="tablist" aria-label="Account settings">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${tab.id}-panel`}
          aria-labelledby={`${tab.id}-tab`}
          hidden={activeTab !== tab.id}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

// ✅ Pulwave Tabs component
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@pulwave/ui';

<Tabs defaultValue="profile">
  <TabsList aria-label="Account settings">
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">Profile content</TabsContent>
  <TabsContent value="security">Security content</TabsContent>
</Tabs>
```

**Tab Pattern Requirements**:
- `role="tablist"` on container
- `role="tab"` on buttons
- `role="tabpanel"` on content
- `aria-selected` on active tab
- `aria-controls` links tab to panel
- Arrow Left/Right navigate tabs
- Home/End go to first/last tab
- Only active tab in tab order (`tabIndex={0}`)

---

### 10.2 Accordions

**Correct**:
```tsx
// ✅ Accessible accordion
const Accordion = ({ items }: AccordionProps) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="accordion">
      {items.map(item => {
        const isOpen = openItems.has(item.id);

        return (
          <div key={item.id} className="accordion-item">
            <h3>
              <button
                aria-expanded={isOpen}
                aria-controls={`${item.id}-content`}
                id={`${item.id}-header`}
                onClick={() => toggle(item.id)}
                className="accordion-trigger"
              >
                <span>{item.title}</span>
                <svg
                  aria-hidden="true"
                  className={`accordion-icon ${isOpen ? 'open' : ''}`}
                >
                  {/* chevron icon */}
                </svg>
              </button>
            </h3>
            <div
              id={`${item.id}-content`}
              role="region"
              aria-labelledby={`${item.id}-header`}
              hidden={!isOpen}
              className="accordion-content"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ✅ Pulwave Accordion component
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@pulwave/ui';

<Accordion type="multiple">
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

### 10.3 Modals/Dialogs

See section 3.4 for complete modal patterns.

---

### 10.4 Tooltips

**Correct**:
```tsx
// ✅ Accessible tooltip
const Tooltip = ({ children, content }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const id = useId();

  return (
    <div className="tooltip-wrapper">
      <button
        aria-describedby={isVisible ? id : undefined}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </button>
      {isVisible && (
        <div
          id={id}
          role="tooltip"
          className="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};

// ✅ Pulwave Tooltip component
import { Tooltip } from '@pulwave/ui';

<Tooltip content="Delete this property">
  <Button variant="ghost" icon="trash" />
</Tooltip>
```

---

### 10.5 Dropdowns/Menus

See section 6.3 for complete dropdown patterns.

---

### 10.6 Data Tables

**Correct**:
```tsx
// ✅ Accessible data table
<table>
  <caption>Properties in Lisbon</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Location</th>
      <th scope="col">Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Apartment A</th>
      <td>Lisbon Centro</td>
      <td>€250,000</td>
    </tr>
  </tbody>
</table>

// ✅ Sortable table
<table>
  <caption>Properties in Lisbon</caption>
  <thead>
    <tr>
      <th scope="col">
        <button
          onClick={() => handleSort('name')}
          aria-sort={sortColumn === 'name' ? sortDirection : 'none'}
        >
          Name
          <svg aria-hidden="true">{/* sort icon */}</svg>
        </button>
      </th>
    </tr>
  </thead>
</table>

// ✅ Pulwave DataTable component
import { DataTable } from '@pulwave/ui';

<DataTable
  data={properties}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'location', label: 'Location' },
  ]}
  caption="Properties in Lisbon"
/>
```

---

### 10.7 Carousels

**Correct**:
```tsx
// ✅ Accessible carousel
const Carousel = ({ items }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Property images"
    >
      <div role="group" aria-roledescription="slide" aria-label={`${currentIndex + 1} of ${items.length}`}>
        <img src={items[currentIndex].src} alt={items[currentIndex].alt} />
      </div>

      <div className="carousel-controls">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          aria-label="Previous slide"
        >
          Previous
        </button>

        <span aria-live="polite" aria-atomic="true">
          Slide {currentIndex + 1} of {items.length}
        </span>

        <button
          onClick={() => setCurrentIndex(prev => Math.min(items.length - 1, prev + 1))}
          disabled={currentIndex === items.length - 1}
          aria-label="Next slide"
        >
          Next
        </button>
      </div>

      <button onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? 'Play' : 'Pause'} auto-rotation
      </button>
    </section>
  );
};
```

---

## Appendix

### A. WCAG 2.1 AA Checklist

**Level A (Must Have)**:
- [ ] 1.1.1 Non-text Content - All images have alt text
- [ ] 1.3.1 Info and Relationships - Semantic HTML, proper landmarks
- [ ] 1.3.2 Meaningful Sequence - Reading order matches visual order
- [ ] 2.1.1 Keyboard - All functionality available via keyboard
- [ ] 2.1.2 No Keyboard Trap - No focus traps (except modals)
- [ ] 2.4.1 Bypass Blocks - Skip links provided
- [ ] 2.4.3 Focus Order - Logical focus order
- [ ] 3.3.1 Error Identification - Errors clearly identified
- [ ] 3.3.2 Labels or Instructions - All inputs have labels
- [ ] 4.1.2 Name, Role, Value - All UI components have accessible names

**Level AA (Should Have)**:
- [ ] 1.4.3 Contrast (Minimum) - Text contrast ≥ 4.5:1
- [ ] 1.4.11 Non-text Contrast - UI elements contrast ≥ 3:1
- [ ] 2.4.6 Headings and Labels - Descriptive headings and labels
- [ ] 2.4.7 Focus Visible - Focus indicator always visible
- [ ] 3.3.3 Error Suggestion - Helpful error messages
- [ ] 3.3.4 Error Prevention - Confirmation for destructive actions
- [ ] 4.1.3 Status Messages - Status updates announced

---

### B. ARIA Attributes Quick Reference

**Labeling**:
- `aria-label` - Defines accessible label
- `aria-labelledby` - References label element
- `aria-describedby` - References description

**States**:
- `aria-expanded` - Expanded state (true/false)
- `aria-selected` - Selected state
- `aria-checked` - Checked state
- `aria-pressed` - Pressed state (toggle buttons)
- `aria-current` - Current item (page/step/location)
- `aria-busy` - Loading state
- `aria-disabled` - Disabled state
- `aria-hidden` - Hidden from assistive tech
- `aria-invalid` - Invalid state
- `aria-required` - Required field

**Relationships**:
- `aria-controls` - Controls another element
- `aria-owns` - Owns child elements
- `aria-activedescendant` - Active descendant (for focus management)

**Live Regions**:
- `aria-live` - Live region (polite/assertive/off)
- `aria-atomic` - Announce entire region (true/false)
- `aria-relevant` - What changes to announce

---

### C. Screen Reader Keyboard Shortcuts

**VoiceOver (macOS)**:
- VO = Control + Option
- VO + A: Start reading
- VO + →: Next item
- VO + Cmd + H: Next heading
- VO + U: Rotor (landmarks, headings, links)

**NVDA (Windows)**:
- NVDA = Insert or CapsLock
- NVDA + Down: Start reading
- H: Next heading
- K: Next link
- D: Next landmark
- NVDA + F7: Elements list

**JAWS (Windows)**:
- Insert + F7: Links list
- Insert + F6: Headings list
- Insert + Ctrl + R: Landmarks list

---

### D. Testing Tools

**Browser Extensions**:
- Axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/extension/
- Lighthouse: Built into Chrome DevTools
- Accessibility Insights: https://accessibilityinsights.io/

**Command Line**:
- pa11y: https://pa11y.org/
- axe-core: https://github.com/dequelabs/axe-core

**Color Contrast**:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Contrast Ratio: https://contrast-ratio.com/
- Chrome DevTools: Inspect > Accessibility > Contrast

**Screen Readers**:
- NVDA (Windows, Free): https://www.nvaccess.org/
- VoiceOver (macOS, Built-in): Cmd+F5
- JAWS (Windows, Paid): https://www.freedomscientific.com/

---

**Related Guides**:
- [Front-End Category](../front-end/AGENTS.md) - Complete front-end patterns
- [Components](../front-end/components/AGENTS.md) - Component patterns
- [Testing](../testing/AGENTS.md) - Testing strategies

**Version**: 1.0.0
**Last Updated**: 2026-01-17
