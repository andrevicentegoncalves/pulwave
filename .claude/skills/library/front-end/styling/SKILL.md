---
name: styling
description: SCSS/Sass architecture and styling best practices for maintainable, scalable stylesheets. Covers BEM, design tokens, mixins, and build optimization.
version: 1.0.0
tags: [SCSS, Sass, CSS, BEM, Design Tokens, Architecture]
---

# Styling Guide (SCSS/Sass)

Master SCSS architecture with maintainable, scalable stylesheets using BEM, design tokens, and modular patterns.

## When to Use

- Setting up SCSS architecture
- Creating design tokens
- Building component styles with BEM
- Writing reusable mixins
- Organizing stylesheet partials

## Quick Reference

### Core Principles
1. **Never hard-code values** - Use design tokens
2. **BEM naming** - Block__Element--Modifier
3. **Modular partials** - One component per file
4. **Max 3 nesting levels** - Avoid deep nesting

### BEM Pattern
```scss
.button {
  &__icon { }     // Element
  &__label { }    // Element
  &--primary { }  // Modifier
  &--small { }    // Modifier
}
```

### Token Usage
```scss
// ✅ Tokens
.card { padding: $spacing-4; color: $color-text-primary; }

// ❌ Magic numbers
.card { padding: 16px; color: #333; }
```

## Full Compiled Guide

**Category Guide**: [../front-end/AGENTS.md](../front-end/AGENTS.md) - Complete front-end category with all patterns and examples

**Individual AGENTS.md**: [AGENTS.md](./AGENTS.md) - Comprehensive SCSS/Sass architecture guide (45+ patterns)

### What's in AGENTS.md

**Architecture Fundamentals** (CRITICAL):
- 7-1 Pattern for organizing SCSS projects
- File organization by feature with partials structure
- Import order to prevent specificity issues
- Partial naming conventions with underscore prefix

**Design Tokens** (CRITICAL):
- Token definition using CSS custom properties
- Spacing scale (4px base unit system)
- Color system with semantic tokens mapping to primitives
- Typography scale (font sizes, weights, line heights)
- Border radius and shadow token systems

**BEM Methodology** (CRITICAL):
- BEM naming convention (Block__Element--Modifier)
- Block, Element, and Modifier patterns
- Nesting guidelines (max 3 levels)
- Flat BEM structure for performance

**Component Styling** (CRITICAL):
- Component structure with base/variants/sizes/states partials
- Base styles that all variants inherit
- Variant modifiers for visual styles
- Interactive state handling (hover, active, focus, disabled)
- Responsive component patterns

**Mixins and Functions** (CRITICAL/HIGH):
- Breakpoint mixins for responsive design
- Layout mixins (flex-center, flex-column, container, aspect-ratio)
- Typography mixins (headings, truncate, line-clamp)
- Custom functions for calculations

**Responsive Design** (CRITICAL):
- Mobile-first approach
- Consistent breakpoint system
- Container queries for component-based responsive design
- Fluid typography with clamp()

**Performance** (CRITICAL/HIGH):
- Build optimization with Vite configuration
- Selector performance best practices
- Critical CSS extraction
- Tree shaking with PurgeCSS

**Advanced Patterns** (HIGH):
- Theme switching with CSS custom properties
- RTL support
- CSS-in-JS integration with CVA
- CSS custom properties for dynamic theming

**Testing and Quality** (CRITICAL):
- Stylelint configuration with BEM enforcement
- Visual regression testing
- Accessibility testing for styles

**Pulwave Integration** (CRITICAL):
- Foundation package structure
- UI component styles with CVA integration
- Build pipeline with Turbo

**Appendices**:
- Complete token reference
- BEM cheat sheet
- Mixin library
- Stylelint rules
- Migration guide from inline styles to SCSS

## Additional Resources

### Design Tokens
Complete token system in `references/tokens.md`:
- Spacing scale
- Color system (semantic + palette)
- Typography scale
- Border radius and shadows

### BEM Patterns
Naming conventions in `references/bem.md`:
- Block, Element, Modifier rules
- Component examples
- Nesting guidelines

### Mixins Library
Reusable mixins in `references/mixins.md`:
- Responsive breakpoints
- Flex utilities
- Text truncation
- Focus states

### File Architecture
Organization patterns in `references/architecture.md`:
- 7-1 pattern
- Import order
- Partial naming

## Anti-Patterns

❌ Hard-coded colors/spacing
❌ Deep nesting (>3 levels)
❌ Non-BEM class names
❌ `!important` (except accessibility)

✅ Token-based values
✅ Flat BEM structure
✅ Mixin reuse
✅ Organized partials
