# Component Documentation Checklist

Use this checklist when creating or reviewing component documentation. All items should be completed before a component is marked as "Stable".

---

## Required Metadata

- [ ] **Name** — Component name
- [ ] **Description** — One-line description (< 20 words)
- [ ] **Status** — stable / beta / experimental / deprecated
- [ ] **Version** — Semantic version (e.g., 2.1.0)
- [ ] **Last Updated** — ISO date (e.g., 2024-12-30)

### Accessibility Status (Carbon-style)
- [ ] **Keyboard** — pass / partial / fail
- [ ] **Focus Management** — pass / partial / fail
- [ ] **Color Contrast** — pass / partial / fail  
- [ ] **Screen Reader** — pass / partial / fail

---

## Overview Tab (Required)

### Live Demo
- [ ] Interactive demo component at top of page

### When to Use
- [ ] 3-5 clear use cases (bullet points)

### When NOT to Use
- [ ] Scenarios to avoid with **alternative component suggestions**

### Variants
- [ ] All visual variants listed and demonstrated

---

## Guidelines Tab (Required)

### Formatting (Carbon-style)
- [ ] **Anatomy** — Diagram or numbered parts list
- [ ] **Sizes** — All size variants with descriptions
- [ ] **Emphasis** — Hierarchy guidance (if applicable)
- [ ] **Alignment** — Layout rules (if applicable)

### Content Guidelines
- [ ] **Main Elements** — Label/content writing rules
- [ ] **Overflow Content** — Truncation behavior
- [ ] **Further Guidance** — Edge case handling

### Universal Behaviors
- [ ] **States** — All interactive states documented
- [ ] **Interactions** — Mouse and keyboard behavior
- [ ] **Loading** — Loading state behavior (if applicable)

### Per-Variant Documentation (Carbon-style)
- [ ] Each variant has dedicated section with:
  - Description
  - Best practices (Do's)

### Do's and Don'ts
- [ ] Minimum 4 Do's
- [ ] Minimum 4 Don'ts

### Related Components
- [ ] Links to similar/alternative components with context

### Modifiers (Carbon-style)
- [ ] Document variations like:
  - With icon
  - Icon-only
  - With badge
  - Grouped

### Responsive Behavior
- [ ] Desktop, Tablet, Mobile behavior documented

---

## Code Tab (Required)

### Props Table
- [ ] All props documented with:
  - Name
  - Type
  - Default value
  - Required indicator
  - Description

### Style Tokens (Carbon-style)
- [ ] Token mapping table per variant:
  - State, Text token, Background token, Border token

### Structure Specs (Carbon-style)
- [ ] Spacing measurements table:
  - Element, Token, Pixel value

### Code Examples
- [ ] Minimum 3 realistic examples with titles and descriptions

---

## Accessibility Tab (Required)

### Keyboard Navigation
- [ ] All keyboard shortcuts in table format

### ARIA Attributes
- [ ] All ARIA attributes with usage context

### Screen Reader Behavior
- [ ] Expected announcements documented

### Focus Indicator
- [ ] Focus ring documentation

---

## Quality Checks

- [ ] All examples use **realistic content** (no "Lorem ipsum")
- [ ] All demos are **interactive** and functional
- [ ] Reviewed by **designer AND developer**
- [ ] **No TypeScript errors** in demo code
- [ ] Tested in **light and dark themes**

---

## References (Optional)

- [ ] Links to WCAG patterns
- [ ] Links to Carbon/Material design references

---

*Template based on IBM Carbon Design System patterns*
*Created: December 2024*
