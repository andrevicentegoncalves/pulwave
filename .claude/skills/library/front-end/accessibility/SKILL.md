---
name: accessibility-expert
description: Senior UI/UX Engineer specializing in WCAG 2.1+ compliance, ARIA patterns, and inclusive design.
version: 1.0.0
tags: [Accessibility, A11y, WCAG, ARIA, UI]
---

# Accessibility (A11y)

Expertise in building inclusive interfaces that are usable by everyone, regardless of ability.

## Expertise
- **WCAG 2.1 Compliance**: Mastery of Level A, AA, and AAA requirements.
- **ARIA Patterns**: Correct usage of `aria-*` attributes and roles without over-engineering.
- **Screen Reader Testing**: Proficiency with VoiceOver, NVDA, and JAWS.
- **Keyboard Navigation**: Ensuring 100% functionality without a mouse (Focus traps, Skip links).
- **Inclusive Design**: Focus on color contrast, readable typography, and cognitive ease.

## Workflow
1. **Audit UI**: Use automated tools (Axe, Lighthouse) and manual keyboard testing.
2. **Fix Semantic HTML**: Replace `<div>` buttons with `<button>`, add `<label>` to inputs.
3. **Enhance ARIA**: Add `aria-current`, `aria-live`, and `aria-expanded` where needed.
4. **Contrast Pass**: Verify all text meets AA (4.5:1) or AAA (7:1) ratios.
5. **Screen Reader Pass**: Walk through critical paths with a screen reader active.

## Scoring (0-10)
- **10**: 100% WCAG AA compliant, high contrast, perfect keyboard & screen reader support.
- **7**: Good semantic HTML, basic ARIA, 100% keyboard support.
- **3**: Missing labels, poor contrast, keyboard traps, "div" buttons.
- **0**: Completely inaccessible UI, prevents usage for many populations.

## Full Compiled Guide

For complete implementation guidance with 40+ accessibility patterns and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **Semantic HTML** (CRITICAL) - Button elements, form controls, headings hierarchy, lists, landmark regions
- **ARIA Patterns** (CRITICAL) - When to use ARIA, roles, states/properties, live regions, anti-patterns
- **Keyboard Navigation** (CRITICAL) - Focus order, keyboard handlers, skip links, focus traps, custom controls
- **Color Contrast & Visual Design** (CRITICAL) - Text contrast (4.5:1), non-text contrast, color independence, focus indicators, typography
- **Screen Reader Support** (CRITICAL) - Descriptive labels, alt text, visually hidden content, reading order, testing
- **Focus Management** (CRITICAL) - Route changes, modals, dropdowns, restoring focus, focus styles
- **Forms & Labels** (CRITICAL) - Label association, error identification, field instructions, required fields, validation
- **Dynamic Content & Live Regions** (HIGH) - ARIA live regions, loading states, toasts, infinite scroll, dynamic updates
- **Testing & Auditing** (HIGH) - Automated testing (axe, Lighthouse), manual testing, screen reader testing, keyboard testing, CI integration
- **Common Patterns** (HIGH) - Tabs, accordions, modals, tooltips, dropdowns, data tables, carousels
- Plus complete WCAG 2.1 AA checklist, ARIA attributes reference, screen reader shortcuts, and testing tools

**Category Guide**: [../front-end/AGENTS.md](../front-end/AGENTS.md) - Complete front-end category with all patterns and examples
