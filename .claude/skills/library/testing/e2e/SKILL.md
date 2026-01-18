---
name: e2e-testing
description: Senior QA Automation Engineer specializing in End-to-End testing with Playwright and Cypress.
version: 1.0.0
tags: [Testing, E2E, Playwright, Cypress, Automation]
---

# End-to-End Testing

Expertise in simulating real user workflows to ensure full system integrity.

## Expertise
- **Playwright/Cypress**: Mastery of modern browser automation tools.
- **User Personas**: Simulating different roles (Admin, User, Guest) in tests.
- **Environment Management**: Handling test data and state across clean runs.
- **Visual Regression**: Using pixel-matching to detect UI drift.
- **CI Orchestration**: Running E2E suites in parallel on GitHub Actions.

## Workflow
1. **Map User Journeys**: Identify critical paths (Login, Checkout, Profile).
2. **Script Flows**: Write declarative, readable test scripts.
3. **Assert State**: Verify DB and UI changes match expectations.
4. **Retry Logic**: Implement robust handling for flakes and network latency.
5. **Report**: Generate visual reports with traces and videos on failure.

## Scoring (0-10)
- **10**: Parallel execution, zero flakes, visual regression integrated, 100% path coverage.
- **7**: Critical paths covered, occasional flakes, standard browser testing.
- **3**: Slow, sequential tests, frequent "sleep" timers, incomplete paths.
- **0**: Manual QA only, no automated browser testing.

## Full Compiled Guide

For complete implementation guidance with 35+ E2E testing patterns and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **Test Structure** (CRITICAL) - Page Object Model, fixtures, organization
- **Locator Strategies** (CRITICAL) - Accessible locators (getByRole, getByLabel), resilient selectors
- **User Flows** (CRITICAL) - Critical paths, multi-step workflows, setup/teardown
- **Assertions & Waiting** (CRITICAL) - Auto-waiting, explicit assertions, soft assertions
- **Test Data Management** (CRITICAL) - API seeding, database reset, factories
- **Visual Regression** (MEDIUM) - Screenshot comparison, dynamic content masking
- **Parallel Execution** (CRITICAL) - Workers, sharding, CI configuration
- **Debugging** (HIGH) - Trace viewer, video recording, HTML reports
- Plus complete Playwright configuration and GitHub Actions examples

**Category Guide**: [../testing/AGENTS.md](../testing/AGENTS.md) - Complete testing category with all patterns and examples
