---
name: web-interface-audit
description: Comprehensive front-end code audit combining accessibility, performance, forms, and typography. Use when reviewing UI code or auditing existing implementations.
version: 1.1.0
tags: [React, Accessibility, Performance, UI, CSS, TypeScript]
---

# Web Interface Audit

Comprehensive review for production-grade UI quality.

## When to Use

- Performing a final QA pass on a feature
- Reviewing UI components for accessibility
- Standardizing form behavior
- Auditing legacy code for UX regressions

## Audit Checklist

### 1. Accessibility (WCAG Compliance)
- [ ] Icon-only buttons have `aria-label`.
- [ ] Form controls have `<label>` or `aria-label`.
- [ ] Interactive elements have keyboard handlers (`onKeyDown`/`onKeyUp`).
- [ ] Use `<button>` for actions, `<a>` for navigation (not `<div onClick>`).
- [ ] Decorative icons have `aria-hidden="true"`.
- [ ] Focus is visible (never `outline: none` without replacement).

### 2. Forms & Inputs
- [ ] Inputs have `autocomplete` and meaningful `name`.
- [ ] Use correct `type` (`email`, `tel`, `url`, `number`) and `inputmode`.
- [ ] Paste is never blocked.
- [ ] Submit button shows spinner during request.
- [ ] `autocomplete="off"` on non-auth fields.

### 3. Animation & Motion
- [ ] Respects `prefers-reduced-motion`.
- [ ] Animate `transform` and `opacity` only.
- [ ] Never `transition: all`.
- [ ] Never exceed `200ms` for interaction feedback.

### 4. Typography & Content
- [ ] Use `…` (proper ellipsis) not `...` in string literals.
- [ ] Use curly quotes (`“”`) not straight (`"`).
- [ ] `font-variant-numeric: tabular-nums` for data tables.
- [ ] Handle empty states—don't render broken UI.

## Full Compiled Guide

**Category Guide**: [../front-end/AGENTS.md](../front-end/AGENTS.md) - Complete front-end category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

### Detailed Rules
Guide in `references/guidelines.md`:
- Complete 100+ point checklist for performance, i18n, and content.

### Design Constraints
Guide in `references/design-constraints.md`:
- Specific project constraints for Tailwind and Motion.
