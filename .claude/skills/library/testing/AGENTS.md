# Testing Skills - Category Guide

**Version 2.0.0**
Pulwave Engineering
2026-01-18

> **Note:**
> This is the testing category compilation for AI agents and LLMs working on the Pulwave codebase.
> This document aggregates all 6 testing skills with links to detailed implementation guides.

## Abstract

Comprehensive testing guide for Pulwave's Vitest + Playwright stack. Contains 6 skills covering unit testing, integration testing, E2E testing, web application testing, performance testing, and visual regression testing. Essential for ensuring code quality and preventing regressions.

**Testing Tech Stack:**
- Vitest (unit tests)
- Testing Library (React component tests)
- Playwright (E2E tests)
- Lighthouse (performance)
- Percy/Chromatic (visual regression)
- Anthropic tools (web app testing)

---

## Table of Contents

1. [Unit Testing](#1-unit-testing) (HIGH) - Vitest, Testing Library
2. [Integration Testing](#2-integration-testing) (HIGH) - API, database tests
3. [E2E Testing](#3-e2e-testing) (HIGH) - Playwright, user journeys
4. [Performance Testing](#4-performance-testing) (MEDIUM) - Lighthouse, load tests
5. [Visual Regression](#5-visual-regression) (LOW) - Screenshot testing
6. [Web App Testing](#6-web-app-testing) (LOW) - Anthropic web testing tools

---

## 1. Unit Testing

**Location**: [unit-testing/](unit-testing/)
**Quick Ref**: [SKILL.md](unit-testing/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: HIGH

Vitest patterns, Testing Library for React components, mocking strategies, test organization, coverage targets.

### Key Patterns

- **Test behavior, not implementation** - User-centric tests
- **Mock external dependencies** - Isolate unit under test
- **Use Testing Library** - Query by accessibility
- **80%+ coverage** - Critical paths well-tested

### When to Use

- Testing pure functions
- Testing React components
- Testing hooks
- Testing utilities
- Regression prevention

### Test Examples

```typescript
// Testing a component
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with primary variant', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--primary');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });
});

// Testing a hook
import { renderHook, waitFor } from '@testing-library/react';
import { useProfile } from './useProfile';

describe('useProfile', () => {
  it('fetches profile data', async () => {
    const { result } = renderHook(() => useProfile('user-123'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 'user-123', name: 'John' });
  });
});

// Testing a service
import { profileService } from './profileService';
import { profileRepository } from './profileRepository';

vi.mock('./profileRepository');

describe('profileService', () => {
  it('enriches profile data', async () => {
    vi.mocked(profileRepository.findById).mockResolvedValue({ id: '1', name: 'John' });

    const result = await profileService.getFullProfile('1');

    expect(result).toHaveProperty('enrichedField');
    expect(profileRepository.findById).toHaveBeenCalledWith('1');
  });
});
```

---

## 2. Integration Testing

**Location**: [integration-testing/](integration-testing/)
**Quick Ref**: [SKILL.md](integration-testing/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: HIGH

API testing, database testing, end-to-end feature flows within a package, mocking external services.

### Key Patterns

- **Test full feature flows** - Multiple components working together
- **Use test database** - Isolated test data
- **Mock external services** - Control third-party APIs
- **Test error scenarios** - Failure paths

### When to Use

- Testing API endpoints
- Testing database operations
- Testing feature integration
- Testing error handling
- Integration with external services

### Integration Test Example

```typescript
// API integration test
import { createTestClient } from '@/test-utils';
import { profileService } from '@/services';

describe('Profile API', () => {
  const client = createTestClient();

  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  it('creates a profile', async () => {
    const response = await client.post('/api/v1/profiles', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toBe('John');

    // Verify in database
    const profile = await profileService.getProfile(response.body.id);
    expect(profile.firstName).toBe('John');
  });

  it('handles validation errors', async () => {
    const response = await client.post('/api/v1/profiles', {
      firstName: '', // Invalid
      email: 'not-an-email', // Invalid
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(2);
  });
});
```

---

## 3. E2E Testing

**Location**: [e2e-testing/](e2e-testing/)
**Quick Ref**: [SKILL.md](e2e-testing/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: HIGH

Playwright patterns, page object model, user journey testing, visual regression, CI integration.

### Key Patterns

- **Page object model** - Encapsulate page interactions
- **Test user journeys** - Complete workflows
- **Visual regression** - Screenshot comparison
- **Parallel execution** - Fast test runs

### When to Use

- Testing critical user flows
- Testing multi-page workflows
- Cross-browser testing
- Visual regression testing
- Smoke tests in CI

### E2E Test Example

```typescript
// Playwright E2E test
import { test, expect } from '@playwright/test';

test.describe('Login flow', () => {
  test('allows user to log in', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in credentials
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');

    // Click login button
    await page.getByRole('button', { name: 'Log in' }).click();

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Verify user is logged in
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Log in' }).click();

    // Verify error message
    await expect(page.getByText('Invalid credentials')).toBeVisible();

    // Verify still on login page
    await expect(page).toHaveURL('/login');
  });
});

// Page object pattern
class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Log in' }).click();
  }

  async getErrorMessage() {
    return this.page.getByRole('alert').textContent();
  }
}

test('uses page object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  await expect(page).toHaveURL('/dashboard');
});
```

---

## 4. Performance Testing

**Location**: [performance-testing/](performance-testing/)
**Quick Ref**: [SKILL.md](performance-testing/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q3 priority

**Impact**: MEDIUM

Lighthouse audits, Core Web Vitals monitoring, load testing, bundle size analysis.

### Key Patterns

- **Lighthouse CI** - Automated audits
- **Core Web Vitals** - LCP, INP, CLS tracking
- **Load testing** - k6, Artillery for backend
- **Bundle analysis** - Vite bundle analyzer

### When to Use

- Measuring performance
- Regression detection
- Optimization validation
- Production monitoring

### Performance Test Example

```typescript
// Lighthouse CI configuration
// lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": ["http://localhost:3000", "http://localhost:3000/dashboard"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "interactive": ["error", { "maxNumericValue": 3500 }]
      }
    }
  }
}

// Bundle size test
test('bundle size within limits', async () => {
  const stats = await buildApp();
  const mainBundle = stats.assets.find(a => a.name === 'main.js');

  expect(mainBundle.size).toBeLessThan(300 * 1024); // 300KB
});
```

---

## 5. Visual Regression

**Location**: [visual-regression/](visual-regression/)
**Quick Ref**: [SKILL.md](visual-regression/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q4 priority

**Impact**: LOW

Screenshot testing, pixel diffing, visual approval workflow, integration with Playwright.

### Key Patterns

- **Screenshot on key pages** - Critical UI components
- **Pixel diffing** - Detect unintended changes
- **Approval workflow** - Review and approve changes
- **Cross-browser** - Test multiple browsers

### When to Use

- Preventing visual regressions
- UI component library testing
- Cross-browser compatibility
- Design system validation

### Visual Test Example

```typescript
// Playwright visual regression
import { test, expect } from '@playwright/test';

test('button matches screenshot', async ({ page }) => {
  await page.goto('/style-guide/button');

  // Take screenshot
  await expect(page.getByRole('button', { name: 'Primary' })).toHaveScreenshot('button-primary.png');
});

test('dashboard layout', async ({ page }) => {
  await page.goto('/dashboard');

  // Full page screenshot
  await expect(page).toHaveScreenshot('dashboard.png', {
    fullPage: true,
  });
});

// With Percy/Chromatic
test('visual regression with Percy', async ({ page }) => {
  await page.goto('/dashboard');
  await percySnapshot(page, 'Dashboard');
});
```

---

## 6. Web App Testing

**Location**: [webapp-testing/](webapp-testing/)
**Quick Ref**: [SKILL.md](webapp-testing/SKILL.md)
**Provider**: Anthropic

**Impact**: LOW

Web application testing utilities and tools provided by Anthropic. Complements Playwright E2E tests with additional testing capabilities.

**See individual skill folder for full documentation and examples.**

---

## Testing Strategy

### Testing Pyramid

```
       /\
      /  \     E2E (10%)
     /    \    Few, critical user journeys
    /______\
   /        \  Integration (30%)
  /          \ Feature flows, API tests
 /____________\
/              \ Unit (60%)
                Pure functions, components
```

### Coverage Targets

| Layer | Target | Priority |
|-------|--------|----------|
| Unit Tests | 80%+ | HIGH |
| Integration Tests | 60%+ | HIGH |
| E2E Tests | Critical paths | MEDIUM |
| Performance Tests | All pages | MEDIUM |
| Visual Tests | Component library | LOW |

---

## Usage Workflows

### Testing a New Feature

**Complete testing workflow:**

```bash
# 1. Write unit tests (unit-testing)
# Test individual functions and components

# 2. Write integration tests (integration-testing)
# Test feature flow with real database

# 3. Write E2E tests (e2e-testing)
# Test critical user journey

# 4. Run all tests
npm run test          # Unit + integration
npm run test:e2e      # E2E tests
npm run test:coverage # Check coverage

# 5. Performance test (performance-testing)
npm run lighthouse

# 6. Visual regression (visual-regression)
npm run test:visual
```

---

## Coverage Status

| Skill | SKILL.md | AGENTS.md | Priority |
|-------|----------|-----------|----------|
| unit-testing | ✅ | ⚠️ Q2 | HIGH |
| integration-testing | ✅ | ⚠️ Q2 | HIGH |
| e2e-testing | ✅ | ⚠️ Q2 | HIGH |
| performance-testing | ✅ | ⚠️ Q3 | MEDIUM |
| visual-regression | ✅ | ⚠️ Q4 | LOW |
| webapp-testing | ✅ | ✅ | LOW |

**Current**: 1/6 skills with AGENTS.md (17%)
**Q1 Target**: 1/6 skills (17%)
**Q2 Target**: 4/6 skills (67%)

---

## Related Categories

- **Front-End** - [../front-end/AGENTS.md](../front-end/AGENTS.md) - Component testing
- **Backend** - [../backend/AGENTS.md](../backend/AGENTS.md) - API testing
- **Data** - [../data/AGENTS.md](../data/AGENTS.md) - Data layer testing

---

## Further Reading

- [Pulwave Architecture Guide](../../../CLAUDE.md)
- [Master Skills Library](../AGENTS.md)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

---

## Version History

### 2.0.0 (2026-01-18)
- Added: webapp-testing skill (Anthropic web testing tools)
- Total skills: 5 → 6
- Updated: Table of contents, coverage status
- Migration: webapp-testing moved from `.claude/skills/anthropic/` to `.claude/skills/library/testing/`

### 1.0.0 (2026-01-16)
- Initial version with 5 skills

---

**Last Updated**: 2026-01-18
**Version**: 2.0.0
**Total Skills**: 6
**With AGENTS.md**: 1
**Maintained By**: Pulwave Engineering
