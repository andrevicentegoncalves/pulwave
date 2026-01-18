# Component Migration Guidelines

This document provides a step-by-step guide to migrate legacy components to the Pulwave UI standards.

---

## 1. Preparation
Before starting the migration, ensure you are familiar with the core standards:
- [Component Guidelines](./component_guidelines.md): Architecture and patterns.
- [Token Guidelines](./token_guidelines.md): Usage of design tokens.

### Pre-Migration Check
- [ ] Identify all props used in the legacy component.
- [ ] If the component uses sub-components, verify if their props are up to date.
- [ ] Check if the component exists in the Style Guide.

---

## 2. Structural Migration (Compound Components & CVA)
We use the **Compound Component** pattern and **CVA** (Class Variance Authority) for variant management.

### Step-by-Step
1.  **Define Types**: Create a `types.ts` file using `cva` for all visual variants (sizes, colors, shapes).
2.  **Modularize Structure**: Break the component into logic-less parts if it's complex.
3.  **Implement Root**: Use `forwardRef` and apply the `classNames()` result to the root element.
4.  **Attach Sub-components**: Use `Object.assign` to attach sub-components to the Root.

```tsx
// Example: Component.tsx
export const MyComponent = Object.assign(MyComponentRoot, {
    Header: MyComponentHeader,
    Content: MyComponentContent,
});
```

---

## 3. Styling Migration (Modular BEM SCSS)
**Strict Rule**: No inline styles (`style={{ }}`) and no hardcoded values.

### Step-by-Step
1.  **Create Styles Folder**: Setup `styles/` and `styles/partials/`.
2.  **Follow BEM**: Use `block__element--modifier` naming convention.
3.  **Modularize Partials**: split styles into:
    - `_base.scss`: Layout and core structure.
    - `_tokens.scss`: Component-specific CSS variables.
    - `_variants.scss`: Visual variants (linked to CVA classes).
    - `_sizes.scss`: Size modifiers.
    - `_states.scss`: Hover, focus, disabled, active states.
    - `_elements.scss`: Sub-element styling.
4.  **Entry Point**: Create `styles/_index.scss` and `@forward` all partials.

> [!IMPORTANT]
> Use design tokens `var(--color-*)`, `var(--scale-*)`, etc., exclusively.

---

## 4. Cleanup & Optimization
- [ ] **Remove Deprecated Code**: Delete all legacy shims, polyfills, and backwards compatibility logic.
- [ ] **Ensure No Inlines**: Search for any remaining `style` attributes.
- [ ] **Check Nested Props**: If using other components, ensure their props are typed and updated to the latest versions.

### Automated Cleanup
You can use the automated script to fix common design token and spacing issues in SCSS files:
```bash
node packages/foundation/scripts/styles/fix-styles.cjs
```

---

## 5. Style Guide Entry
If the component is documented in the style guide, you must update its page.

### Documentation Requirements
- [ ] **All Sections Present**: ensure Overview, Examples, Props, and Accessibility sections exist.
- [ ] **Code Usage Updated**: Verify that `CodeUsage` snippets show correct imports and modern usage.
- [ ] **Demos Revamped**: Update all demos to show every variant and size.
- [ ] **Types Verification**: Ensure the documentation accurately reflects the `types.ts` definition.

---

## Migration Checklist Summary
| Category | Requirement |
| :--- | :--- |
| **Pattern** | Compound Components |
| **Variants** | Class Variance Authority (CVA) |
| **Styling** | Modular BEM SCSS (Partials) |
| **Values** | Design Tokens Only |
| **Cleanup** | No deprecated/legacy code |
| **Docs** | Fully updated Style Guide entry |
