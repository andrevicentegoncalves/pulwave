---
name: unit-testing
description: Senior QA Engineer specializing in Unit and Integration testing using Jest, Vitest, and Testing Library.
version: 1.0.0
tags: [Testing, Unit, Jest, Vitest, TDD]
---

# Unit & Integration Testing

Expertise in building fast, reliable, and decoupled tests for business logic and components.

## Expertise
- **Atomic Testing**: Testing single functions or components in isolation with mocks.
- **Integration Testing**: Testing components working together or with real hooks.
- **Mocks & Spies**: Mastery of `vi.mock`, `jest.fn`, and MSW for API mocking.
- **Coverage Strategy**: Focusing on "High Value" paths rather than 100% line coverage.
- **Hooks Testing**: Deep knowledge of `renderHook` for custom React logic.

## Workflow
1. **Analyze Requirements**: Identify the "Happy Path" and "Edge Cases".
2. **Setup Environment**: Configure Vitest/Jest and Testing Library.
3. **Write Tests**: Implement Red-Green-Refactor TDD cycle.
4. **Mock Externalities**: Use MSW or local mocks for network and DB.
5. **Verify**: Ensure tests run in <100ms each and are flake-free.

## Scoring (0-10)
- **10**: Flake-free, sub-second execution, automated CI integration, high signal.
- **7**: Good coverage, some brittle mocks, manual execution occasionally.
- **3**: "Snapshot only" tests, fragile dependencies, slow execution.
- **0**: No tests, "manual verification" only.

## Full Compiled Guide

For complete implementation guidance with 35+ testing patterns and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **Test Structure & Organization** (CRITICAL) - Colocation, AAA pattern, descriptive names
- **Component Testing** (CRITICAL) - User behavior, accessibility queries, conditional rendering
- **Hook Testing** (HIGH) - renderHook, state changes, TanStack Query wrappers
- **Mocking Patterns** (CRITICAL) - vi.mock, vi.fn, MSW for API mocking, timers
- **TDD Workflow** (CRITICAL) - Red-Green-Refactor cycle, test-first development
- **Coverage Strategy** (HIGH) - High-value paths, avoiding 100% coverage trap
- **Performance & Reliability** (CRITICAL) - Fast tests, zero flakiness, test isolation
- **Advanced Patterns** (MEDIUM) - Snapshots, test utilities, visual regression
- Plus complete Vitest config and Testing Library query reference

**Category Guide**: [../testing/AGENTS.md](../testing/AGENTS.md) - Complete testing category with all patterns and examples
