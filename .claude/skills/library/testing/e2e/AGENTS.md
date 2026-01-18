# End-to-End Testing - Complete Implementation Guide

**Version**: 1.0.0
**Last Updated**: 2026-01-17
**Skill Level**: Senior QA Automation Engineer

---

## Abstract

This guide provides comprehensive patterns for end-to-end testing with Playwright. Covers test structure, page object model, user flows, locator strategies, visual regression, parallel execution, and CI/CD integration.

**Target Audience**: QA engineers, automation engineers, developers implementing E2E tests.

**Pulwave Context**: Uses Playwright for browser automation, page objects for maintainability, and GitHub Actions for CI/CD E2E test execution.

---

## Table of Contents

1. [Test Structure & Organization](#1-test-structure--organization)
   - 1.1 Page Object Model (CRITICAL)
   - 1.2 Test File Organization (HIGH)
   - 1.3 Fixtures for Reusable Setup (MEDIUM)
   - 1.4 Test Naming Conventions (MEDIUM)

2. [Locator Strategies](#2-locator-strategies)
   - 2.1 Use Accessible Locators (CRITICAL)
   - 2.2 Avoid Brittle Selectors (HIGH)
   - 2.3 Use data-testid Sparingly (MEDIUM)
   - 2.4 Locator Best Practices (HIGH)

3. [User Flows & Journeys](#3-user-flows--journeys)
   - 3.1 Test Critical Paths (CRITICAL)
   - 3.2 Setup & Teardown (HIGH)
   - 3.3 Multi-Step Workflows (HIGH)
   - 3.4 Error Scenarios (MEDIUM)

4. [Assertions & Waiting](#4-assertions--waiting)
   - 4.1 Auto-Waiting (CRITICAL)
   - 4.2 Explicit Assertions (HIGH)
   - 4.3 Soft Assertions (MEDIUM)
   - 4.4 Custom Matchers (LOW)

5. [Test Data Management](#5-test-data-management)
   - 5.1 Seed Test Data Before Tests (CRITICAL)
   - 5.2 Clean Up After Tests (HIGH)
   - 5.3 Use Factories for Test Data (MEDIUM)
   - 5.4 API Setup for Faster Tests (HIGH)

6. [Visual Regression](#6-visual-regression)
   - 6.1 Screenshot Comparison (MEDIUM)
   - 6.2 Update Baselines (LOW)
   - 6.3 Ignore Dynamic Content (MEDIUM)

7. [Parallel Execution & CI](#7-parallel-execution--ci)
   - 7.1 Run Tests in Parallel (CRITICAL)
   - 7.2 Shard Tests Across Workers (MEDIUM)
   - 7.3 CI Configuration (HIGH)
   - 7.4 Retry Failed Tests (MEDIUM)

8. [Debugging & Reporting](#8-debugging--reporting)
   - 8.1 Trace Viewer (HIGH)
   - 8.2 Video Recording (MEDIUM)
   - 8.3 HTML Reports (MEDIUM)
   - 8.4 Debug Mode (LOW)

---

## 1. Test Structure & Organization

### 1.1 Page Object Model for Maintainable Tests

**Impact: CRITICAL** (reduces duplication, improves maintainability)

**Why**: Page objects encapsulate page structure and interactions. When UI changes, update one page object instead of 50 tests.

**Incorrect: Selectors in every test**
```typescript
// ❌ BAD: Duplicated selectors, brittle tests
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page.locator('.welcome-message')).toBeVisible();
});

test('shows error on invalid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'wrong');
  await page.click('button[type="submit"]');
  // Selectors duplicated!
});
```

**Correct: Page Object Model**
```typescript
// ✅ GOOD: Page object encapsulates structure
// tests/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole('button', { name: /sign in/i });
    this.errorMessage = page.getByRole('alert');
    this.welcomeMessage = page.getByText(/welcome/i);
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoggedIn() {
    await expect(this.welcomeMessage).toBeVisible();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}

// tests/auth.spec.ts
import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('user can login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  await loginPage.expectLoggedIn();
});

test('shows error on invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('user@example.com', 'wrong-password');
  await loginPage.expectError('Invalid credentials');
});
```

**Metrics**: Page objects reduce test maintenance time by 60-80%. UI change = 1 file update instead of N tests.

**Pulwave-specific**: Page object structure:
```
tests/
  pages/
    LoginPage.ts
    DashboardPage.ts
    PropertyListPage.ts
    PropertyFormPage.ts
  flows/
    createProperty.flow.ts
  fixtures/
    testData.ts
  e2e/
    auth.spec.ts
    properties.spec.ts
```

---

### 1.2 Organize Tests by Feature/Flow

**Impact: HIGH** (easy navigation, parallel execution)

**Pattern: Group related tests**
```typescript
// tests/e2e/auth.spec.ts
test.describe('Authentication', () => {
  test('user can sign up', async ({ page }) => { /* ... */ });
  test('user can log in', async ({ page }) => { /* ... */ });
  test('user can log out', async ({ page }) => { /* ... */ });
  test('user can reset password', async ({ page }) => { /* ... */ });
});

// tests/e2e/properties.spec.ts
test.describe('Property Management', () => {
  test.describe('Listing', () => {
    test('displays all properties', async ({ page }) => { /* ... */ });
    test('filters by price', async ({ page }) => { /* ... */ });
    test('searches by name', async ({ page }) => { /* ... */ });
  });

  test.describe('Creation', () => {
    test('creates property with valid data', async ({ page }) => { /* ... */ });
    test('shows validation errors', async ({ page }) => { /* ... */ });
  });
});
```

---

### 1.3 Use Fixtures for Reusable Setup

**Impact: MEDIUM** (DRY, consistent test environment)

**Pattern: Custom fixtures**
```typescript
// tests/fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page; // Pre-logged in page
};

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    // Login before test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test@example.com', 'password123');
    await use(page);
  },
});

// Usage in tests
test('logged in user can view dashboard', async ({ authenticatedPage, dashboardPage }) => {
  await dashboardPage.goto();
  await dashboardPage.expectPropertiesLoaded();
});
```

**Metrics**: Fixtures reduce setup code duplication by 80%+.

---

## 2. Locator Strategies

### 2.1 Use Accessible Locators (getByRole, getByLabel)

**Impact: CRITICAL** (reliable selectors, tests accessibility)

**Locator priority:**
1. **getByRole** (best) - Tests accessibility
2. **getByLabel** (good) - Tests form labels
3. **getByPlaceholder** (ok) - Fallback for inputs
4. **getByText** (ok) - For static content
5. **getByTestId** (last resort) - No accessibility benefit

**Incorrect: CSS selectors**
```typescript
// ❌ BRITTLE: Breaks when classes change
await page.click('.btn.btn-primary.btn-lg');
await page.fill('#email-input', 'test@example.com');
await page.locator('div > form > button:nth-child(3)').click();
```

**Correct: Accessible locators**
```typescript
// ✅ RESILIENT: Semantic, accessible locators
await page.getByRole('button', { name: /submit/i }).click();
await page.getByLabel(/email/i).fill('test@example.com');
await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
await page.getByPlaceholderText(/enter your email/i).fill('test@example.com');
await page.getByText(/welcome back/i).isVisible();
```

**Common roles:**
```typescript
// Buttons
page.getByRole('button', { name: /submit/i });

// Links
page.getByRole('link', { name: /home/i });

// Inputs
page.getByRole('textbox', { name: /email/i });
page.getByRole('checkbox', { name: /agree to terms/i });
page.getByRole('radio', { name: /option 1/i });

// Headings
page.getByRole('heading', { name: /dashboard/i, level: 1 });

// Lists
page.getByRole('list');
page.getByRole('listitem');

// Tables
page.getByRole('table');
page.getByRole('row');
page.getByRole('cell');

// Dialogs
page.getByRole('dialog');
```

**Metrics**: Accessible locators are 3x more resilient to UI changes. Forces proper ARIA labels.

---

### 2.2 Avoid Brittle CSS/XPath Selectors

**Impact: HIGH** (reduce test maintenance)

**Brittle selectors:**
```typescript
// ❌ BREAKS EASILY
page.locator('div.container > div:nth-child(2) > button');
page.locator('#root > div > form > input[type="text"]:first-child');
page.locator('.css-1234567-Button'); // CSS-in-JS classes
```

**Resilient selectors:**
```typescript
// ✅ STABLE
page.getByRole('button', { name: /submit/i });
page.locator('[data-testid="submit-button"]'); // If no accessible alternative
page.locator('button', { hasText: 'Submit' });
```

---

### 2.3 Use data-testid Sparingly (Last Resort)

**Impact: MEDIUM** (balance between stability and maintainability)

**When to use testId:**
- No semantic role (charts, canvases, custom widgets)
- Ambiguous elements (multiple buttons with same text)
- Dynamic content where text changes

**Pattern: Minimal testIds**
```typescript
// Component
<button data-testid="property-delete-btn-{id}">Delete</button>
<div data-testid="chart-container">
  <canvas>{/* Chart */}</canvas>
</div>

// Test
await page.getByTestId('property-delete-btn-123').click();
await expect(page.getByTestId('chart-container')).toBeVisible();
```

**Guideline**: <10% of locators should be testIds. Prefer accessible selectors.

---

### 2.4 Locator Best Practices

**Impact: HIGH** (reliable, maintainable selectors)

**Pattern: Precise locators**
```typescript
// ✅ Specific, not ambiguous
page.getByRole('button', { name: /submit/i, exact: true });

// ✅ Filter by context
page.locator('form').getByRole('button', { name: /submit/i });

// ✅ Chain locators
page.getByRole('dialog').getByRole('button', { name: /close/i });

// ✅ Has text
page.getByRole('row').filter({ hasText: 'Property 1' });

// ✅ Has element
page.getByRole('article').filter({ has: page.getByRole('button') });

// ✅ Nth element (when necessary)
page.getByRole('listitem').nth(0);

// ✅ First/last
page.getByRole('button').first();
page.getByRole('button').last();
```

---

## 3. User Flows & Journeys

### 3.1 Test Critical User Paths End-to-End

**Impact: CRITICAL** (ensures core functionality works)

**Pattern: Real user workflows**
```typescript
test('property owner can create and publish listing', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const propertyFormPage = new PropertyFormPage(page);
  const propertyListPage = new PropertyListPage(page);

  // 1. Login
  await loginPage.goto();
  await loginPage.login('owner@example.com', 'password123');

  // 2. Navigate to create property
  await dashboardPage.goto();
  await dashboardPage.clickCreateProperty();

  // 3. Fill property form
  await propertyFormPage.fillForm({
    name: 'Luxury Apartment',
    address: '123 Main St',
    price: 500000,
    bedrooms: 3,
    bathrooms: 2,
  });

  // 4. Upload photos
  await propertyFormPage.uploadPhoto('./tests/fixtures/property1.jpg');

  // 5. Submit
  await propertyFormPage.submit();

  // 6. Verify published
  await propertyListPage.goto();
  await expect(page.getByText('Luxury Apartment')).toBeVisible();
  await expect(page.getByText('$500,000')).toBeVisible();

  // 7. Verify in database (via API)
  const response = await page.request.get('/api/properties/latest');
  const property = await response.json();
  expect(property.name).toBe('Luxury Apartment');
  expect(property.status).toBe('published');
});
```

**Metrics**: Testing 10 critical paths covers 80% of user value.

**Pulwave-specific critical paths:**
- User registration → email verification → profile setup
- Login → dashboard → create property → publish
- Search properties → view details → contact owner
- Owner → view analytics → export report
- Admin → manage users → assign roles

---

### 3.2 Setup & Teardown (Clean Test Environment)

**Impact: HIGH** (isolated tests, no cross-contamination)

**Pattern: Database reset between tests**
```typescript
import { test } from '@playwright/test';

test.beforeEach(async ({ page, request }) => {
  // Reset database
  await request.post('/api/test/reset-db');

  // Seed test data
  await request.post('/api/test/seed', {
    data: {
      users: [
        { email: 'test@example.com', role: 'owner' },
        { email: 'admin@example.com', role: 'admin' },
      ],
      properties: [
        { name: 'Property 1', price: 500000 },
      ],
    },
  });
});

test.afterEach(async ({ page }, testInfo) => {
  // Screenshot on failure
  if (testInfo.status !== 'passed') {
    await page.screenshot({
      path: `screenshots/${testInfo.title}.png`,
      fullPage: true,
    });
  }
});

test.afterAll(async ({ request }) => {
  // Clean up test data
  await request.post('/api/test/cleanup');
});
```

---

### 3.3 Multi-Step Workflows

**Impact: HIGH** (test complex user journeys)

**Pattern: Sequential steps with validation**
```typescript
test('tenant can apply for lease', async ({ page }) => {
  // Step 1: Login as tenant
  await loginAs(page, 'tenant@example.com');
  await expect(page).toHaveURL('/dashboard');

  // Step 2: Search for properties
  const searchPage = new SearchPage(page);
  await searchPage.goto();
  await searchPage.search({ minPrice: 1000, maxPrice: 2000 });

  // Step 3: View property details
  await searchPage.clickProperty('Apartment Downtown');
  await expect(page).toHaveURL(/\/properties\/\w+/);

  // Step 4: Apply for lease
  await page.getByRole('button', { name: /apply now/i }).click();

  // Step 5: Fill application
  await page.getByLabel(/move-in date/i).fill('2024-06-01');
  await page.getByLabel(/employment status/i).selectOption('employed');
  await page.getByLabel(/monthly income/i).fill('5000');

  // Step 6: Upload documents
  await page.getByLabel(/upload id/i).setInputFiles('./tests/fixtures/id.pdf');

  // Step 7: Submit application
  await page.getByRole('button', { name: /submit application/i }).click();

  // Step 8: Verify confirmation
  await expect(page.getByText(/application submitted/i)).toBeVisible();

  // Step 9: Verify email sent (via API)
  const emails = await page.request.get('/api/test/emails');
  const emailList = await emails.json();
  expect(emailList).toContainEqual(
    expect.objectContaining({
      to: 'tenant@example.com',
      subject: expect.stringContaining('Application Received'),
    })
  );
});
```

---

## 4. Assertions & Waiting

### 4.1 Playwright Auto-Waits (No Manual Waits Needed)

**Impact: CRITICAL** (reliable tests, no flakiness)

**Why**: Playwright automatically waits for elements before actions. No need for `sleep()` or manual waits.

**Incorrect: Manual waits**
```typescript
// ❌ FLAKY: Hard-coded waits
await page.click('button');
await page.waitForTimeout(3000); // Brittle!
const text = await page.textContent('.result');
```

**Correct: Auto-waiting actions**
```typescript
// ✅ RELIABLE: Auto-waits for element to be actionable
await page.getByRole('button', { name: /submit/i }).click();
// Waits for button to be:
// - Attached to DOM
// - Visible
// - Stable (not animating)
// - Enabled
// - Not obscured by other elements

await expect(page.getByText(/success/i)).toBeVisible();
// Auto-waits up to 5 seconds for element to appear
```

**Auto-wait actions:**
- `click()`, `fill()`, `check()`, `selectOption()` - Wait for actionability
- `expect().toBeVisible()` - Wait for element to appear
- `expect().toHaveText()` - Wait for text content
- `waitForSelector()` - Explicit wait (use sparingly)

**Metrics**: Auto-waiting eliminates 95% of timing-related flakiness.

---

### 4.2 Use Explicit Assertions

**Impact: HIGH** (clear test failures)

**Pattern: Verify state changes**
```typescript
test('form submission updates database', async ({ page, request }) => {
  await page.goto('/properties/new');

  await page.getByLabel(/name/i).fill('Test Property');
  await page.getByLabel(/price/i).fill('500000');
  await page.getByRole('button', { name: /submit/i }).click();

  // Assert UI feedback
  await expect(page.getByText(/property created/i)).toBeVisible();

  // Assert URL changed
  await expect(page).toHaveURL(/\/properties\/\w+/);

  // Assert database state (via API)
  const response = await request.get('/api/properties/latest');
  const property = await response.json();
  expect(property.name).toBe('Test Property');
  expect(property.price).toBe(500000);

  // Assert UI reflects database
  await expect(page.getByRole('heading', { name: /test property/i })).toBeVisible();
});
```

---

### 4.3 Soft Assertions (Continue on Failure)

**Impact: MEDIUM** (collect multiple failures)

**Pattern: Soft assertions**
```typescript
import { test, expect } from '@playwright/test';

test('property card shows all fields', async ({ page }) => {
  await page.goto('/properties/123');

  // Soft assertions continue even if one fails
  await expect.soft(page.getByText('Luxury Apartment')).toBeVisible();
  await expect.soft(page.getByText('$500,000')).toBeVisible();
  await expect.soft(page.getByText('3 beds')).toBeVisible();
  await expect.soft(page.getByText('2 baths')).toBeVisible();

  // All failures reported at end
});
```

---

## 5. Test Data Management

### 5.1 Seed Test Data via API (Not UI)

**Impact: CRITICAL** (fast tests, reliable setup)

**Incorrect: Create data through UI**
```typescript
// ❌ SLOW: Creating data through UI
test('user can view properties', async ({ page }) => {
  // Login as admin
  await loginPage.goto();
  await loginPage.login('admin@example.com', 'password');

  // Create property 1 (1 minute)
  await dashboardPage.clickCreateProperty();
  await propertyFormPage.fill({ /* ... */ });
  await propertyFormPage.submit();

  // Create property 2 (1 minute)
  await dashboardPage.clickCreateProperty();
  await propertyFormPage.fill({ /* ... */ });
  await propertyFormPage.submit();

  // Now test...
  // Total: 2+ minutes of setup!
});
```

**Correct: Seed via API**
```typescript
// ✅ FAST: Create data via API
test('user can view properties', async ({ page, request }) => {
  // Seed test data (5 seconds)
  await request.post('/api/test/seed', {
    data: {
      properties: [
        { name: 'Property 1', price: 500000, owner_id: 'user-123' },
        { name: 'Property 2', price: 750000, owner_id: 'user-123' },
      ],
    },
  });

  // Login
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');

  // Test list page
  await propertyListPage.goto();
  await expect(page.getByText('Property 1')).toBeVisible();
  await expect(page.getByText('Property 2')).toBeVisible();

  // Total: 10 seconds (12x faster!)
});
```

**Metrics**: API setup is 10-50x faster than UI setup. Tests run in seconds instead of minutes.

---

### 5.2 Clean Up Test Data After Tests

**Impact: HIGH** (isolated tests, no interference)

**Pattern: Database reset**
```typescript
// tests/fixtures/database.ts
export async function resetDatabase(request: APIRequestContext) {
  await request.post('/api/test/reset-db');
}

export async function seedDatabase(request: APIRequestContext, data: SeedData) {
  await request.post('/api/test/seed', { data });
}

// tests/properties.spec.ts
test.beforeEach(async ({ request }) => {
  await resetDatabase(request);
  await seedDatabase(request, {
    users: [{ email: 'test@example.com', role: 'owner' }],
    properties: [{ name: 'Test Property', price: 500000 }],
  });
});

test.afterEach(async ({ request }) => {
  await request.post('/api/test/cleanup');
});
```

---

### 5.3 Use Factories for Test Data

**Impact: MEDIUM** (consistent, maintainable test data)

**Pattern: Data factories**
```typescript
// tests/factories/propertyFactory.ts
export function createProperty(overrides: Partial<Property> = {}): Property {
  return {
    id: `prop-${Date.now()}`,
    name: 'Test Property',
    address: '123 Test St',
    price: 500000,
    bedrooms: 3,
    bathrooms: 2,
    status: 'available',
    owner_id: 'user-123',
    ...overrides,
  };
}

// Usage
const property1 = createProperty({ name: 'Luxury Condo' });
const property2 = createProperty({ price: 750000, bedrooms: 4 });
```

---

## 6. Visual Regression

### 6.1 Screenshot Comparison for Visual Testing

**Impact: MEDIUM** (catch visual regressions)

**Pattern: Visual snapshots**
```typescript
test('property card matches design', async ({ page }) => {
  await page.goto('/properties/123');

  // Take screenshot and compare
  await expect(page.getByTestId('property-card')).toHaveScreenshot('property-card.png');

  // Full page screenshot
  await expect(page).toHaveScreenshot('property-details-page.png', {
    fullPage: true,
  });

  // With options
  await expect(page.getByTestId('chart')).toHaveScreenshot('chart.png', {
    maxDiffPixels: 100, // Allow up to 100 pixel diff
    threshold: 0.2,     // 20% threshold
  });
});
```

**Metrics**: Visual regression catches 60% of CSS/layout bugs that unit tests miss.

---

### 6.2 Ignore Dynamic Content

**Impact: MEDIUM** (reduce false positives)

**Pattern: Mask dynamic content**
```typescript
await expect(page).toHaveScreenshot('dashboard.png', {
  mask: [
    page.getByTestId('current-time'),      // Masks timestamps
    page.getByTestId('live-data-chart'),   // Masks dynamic charts
  ],
});
```

---

## 7. Parallel Execution & CI

### 7.1 Run Tests in Parallel for Speed

**Impact: CRITICAL** (10x faster test execution)

**Configuration:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  // Run tests in parallel
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4, // 2 workers in CI, 4 locally

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Timeout
  timeout: 30000,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

**Metrics**: 4 workers = 4x faster. 100 tests in 5 minutes instead of 20 minutes.

---

### 7.2 Shard Tests Across Machines

**Impact: MEDIUM** (scale to 1000+ tests)

**Pattern: Sharding**
```bash
# Run 1st quarter of tests
npx playwright test --shard=1/4

# Run 2nd quarter
npx playwright test --shard=2/4

# Run 3rd quarter
npx playwright test --shard=3/4

# Run 4th quarter
npx playwright test --shard=4/4
```

**CI configuration (GitHub Actions):**
```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install
      - run: npx playwright test --shard=${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-${{ matrix.shard }}
          path: playwright-report/
```

**Metrics**: 4 shards = 4x parallelization. 1000 tests in 10 minutes.

---

## 8. Debugging & Reporting

### 8.1 Use Trace Viewer for Failed Tests

**Impact: HIGH** (debug failures faster)

**Pattern: Enable traces**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry', // Record trace on first retry
    // Or: trace: 'on' (always record, slower)
    // Or: trace: 'retain-on-failure' (only keep failed)
  },
});
```

**View traces:**
```bash
# Open trace viewer
npx playwright show-trace trace.zip

# Features:
# - Timeline of all actions
# - DOM snapshots at each step
# - Network requests
# - Console logs
# - Screenshots
```

**Metrics**: Trace viewer reduces debugging time by 70%. See exact failure context.

---

### 8.2 Video Recording on Failure

**Impact: MEDIUM** (visual debugging)

**Configuration:**
```typescript
export default defineConfig({
  use: {
    video: 'retain-on-failure', // Record video only for failed tests
    // Or: video: 'on' (always record)
  },
});
```

---

### 8.3 HTML Reports

**Impact: MEDIUM** (shareable test results)

**Generate report:**
```bash
npx playwright test
npx playwright show-report

# CI: Upload artifact
```

**Configuration:**
```typescript
export default defineConfig({
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
  ],
});
```

---

## Appendix

### E2E Testing Checklist

- [ ] Page objects for all major pages
- [ ] Tests organized by feature/flow
- [ ] Critical user paths covered (login, create, view, update, delete)
- [ ] Accessible locators (getByRole, getByLabel)
- [ ] No manual waits (use auto-waiting)
- [ ] Test data seeded via API (not UI)
- [ ] Database reset between tests
- [ ] Tests run in parallel (fully isolated)
- [ ] CI/CD integration (GitHub Actions)
- [ ] Retry on failure (2-3 retries)
- [ ] Trace/video on failure
- [ ] HTML reports generated
- [ ] Visual regression for critical pages

### Playwright Best Practices

```typescript
// ✅ Good locators
page.getByRole('button', { name: /submit/i });
page.getByLabel(/email/i);
page.getByText(/welcome/i);

// ✅ Auto-waiting
await page.click('button'); // Waits automatically
await expect(page.getByText('Success')).toBeVisible(); // Waits up to 5s

// ✅ API requests for setup
await request.post('/api/test/seed', { data: testData });

// ✅ Page objects
const loginPage = new LoginPage(page);
await loginPage.login('user@example.com', 'password');

// ✅ Fixtures for reusable setup
test('...', async ({ authenticatedPage }) => {
  // Already logged in
});
```

---

**End of End-to-End Testing Guide**

For questions or improvements, consult the testing team or update this document following the contribution guidelines.
