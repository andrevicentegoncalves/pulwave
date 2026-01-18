---
name: qa-patterns
description: Standards for Quality Assurance and testing methodology. Covers TDD, BDD, Test Planning, and QA best practices.
version: 1.0.0
tags: [Testing, QA, TDD, Quality, Methodology]
---

# QA Methodology & Patterns

Building quality in from the start.

## When to Use

- Writing a test plan for a major feature
- Implementing Test Driven Development (TDD)
- Setting up a QA process
- Reviewing test coverage

## Quick Reference

### The Testing Pyramid
1. **Unit Tests (Bottom)**: Many, fast, specific. (Jest/Vitest).
2. **Integration Tests (Middle)**: Testing how parts work together.
3. **E2E Tests (Top)**: Few, slow, user-centric (Cypress/Playwright).

### TDD (Test Driven Development)
*Cycle*: **Red** (Write failing test) -> **Green** (Make it pass) -> **Refactor** (Improve code).

## Full Compiled Guide

**Category Guide**: [../testing/AGENTS.md](../testing/AGENTS.md) - Complete testing category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

### Test Planning
Guide in `references/planning.md`:
- How to write a test plan
- Identifying edge cases
- Regression testing strategy

### Senior QA Practices
Guide in `references/qa-best-practices.md`:
- Bug report standards
- Exploratory testing
- Automation vs Manual testing

## Key Metrics

- **Code Coverage**: target > 80% (but don't obsess over numbers vs quality).
- **Flakiness**: % of tests that fail intermittently.
- **Cycle Time**: Time from code commit to test green.

## Tools

- **Jest / Vitest**: Unit testing.
- **Cypress / Playwright**: E2E.
- **Testing Library**: User-centric DOM testing.
- **MSW (Mock Service Worker)**: Network mocking.
