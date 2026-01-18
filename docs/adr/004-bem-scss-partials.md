# ADR-004: BEM + SCSS Partials

**Status:** Accepted  
**Date:** 2026-01-12  
**Deciders:** UI Team

---

## Context and Problem Statement

How should we organize component styles to maintain scalability, readability, and adherence to design tokens?

## Decision Drivers

- Need consistent naming conventions
- Want modular, maintainable stylesheets
- Must enforce design token usage
- Require clear style organization
- Need to support theming

## Considered Options

1. **BEM naming with SCSS partials organized by type**
2. Utility-first CSS (Tailwind)
3. CSS Modules with camelCase
4. Flat SCSS files per component

## Decision Outcome

**Chosen option:** "BEM naming with SCSS partials"

### Rationale

BEM (Block Element Modifier) provides:
- Clear naming hierarchy: `.button`, `.button__icon`, `.button--primary`
- Prevents naming collisions
- Self-documenting class names
- Easy to understand component structure

SCSS partials organization:
```
component/
└── styles/
    ├── _index.scss          # Main entry, imports all partials
    └── partials/
        ├── _base.scss       # Core styles, structure
        ├── _variants.scss   # Kind/variant styles
        ├── _states.scss     # Hover, focus, active, disabled
        ├── _sizes.scss      # Size variations
        └── _elements.scss   # Child elements (__icon, __label)
```

### Positive Consequences

- Clear separation of style concerns
- Easy to find specific styles
- Consistent structure across all components
- Enforces token usage via linting
- Maintainable even with complex components

### Negative Consequences

- More files per component
- Need to understand BEM methodology
- Verbose class names

## Implementation Rules

1. **Use design tokens for all values**
   ```scss
   color: var(--color-primary-500);  // ✅
   color: #3b82f6;                   // ❌
   ```

2. **Follow BEM strictly**
   ```scss
   .button { }                  // Block
   .button__icon { }           // Element
   .button--primary { }        // Modifier
   .button--large { }          // Modifier
   ```

3. **Organize by type in partials**
   - `_base.scss`: `.button { display, layout, typography }`
   - `_variants.scss`: `.button--primary { background, color }`
   - `_states.scss`: `.button:hover`, `.button:disabled`

## Migration Status

- ✅ All 89 UI components migrated
- ✅ 20+ data-visualization charts migrated
- ✅ Stylelint rules enforcing token usage
- ✅ Automated style linting in CI/CD

## Links

- [BEM Methodology](http://getbem.com/)
- [Style Guide](../packages/foundation/styles/docs/)
- [ADR-003: CVA Component Pattern](./003-cva-component-pattern.md)

---

**Tags:** css, styling, methodology, design-tokens  
**Related ADRs:** ADR-003
