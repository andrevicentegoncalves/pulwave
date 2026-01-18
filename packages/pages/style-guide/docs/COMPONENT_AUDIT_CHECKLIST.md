# Component Audit Checklist

When creating or updating a component, complete this audit to ensure the Style Guide fully reflects the implementation.

---

## 1. Component Documentation

- [ ] Component has a dedicated section in the Style Guide
- [ ] Name, purpose, and description are accurate
- [ ] All explanatory text is clear and up to date

## 2. Props & API

- [ ] All props match TypeScript types
- [ ] Missing props added, deprecated ones removed
- [ ] Default values are documented
- [ ] Prop descriptions explain behavioral impact

## 3. Visual Demos

- [ ] Every variant, size, and state is demonstrated
- [ ] Demos reflect realistic production usage
- [ ] Dark mode, disabled, loading, error states shown
- [ ] Spacing, alignment, typography match design tokens

## 4. Code Examples (codeUsage)

- [ ] All codeUsage snippets include required import statements
- [ ] ALL demos for the component are verified (not just one)
- [ ] Imports use `@ui` and `@foundation` (not `@pulwave/*` or direct paths)
- [ ] Icons imported from `@ui` (not `lucide-react`)
- [ ] codeUsage code matches what the demo actually renders
- [ ] Examples are current, compile, and follow idiomatic patterns
- [ ] If props changed, codeUsage updated to reflect new API

## 5. Cross-References

- [ ] Links to related components are correct
- [ ] References updated if components renamed or deprecated

## 6. Standards

- [ ] Naming follows BEM + CVA conventions
- [ ] SCSS uses modular structure (tokens, base, variants, sizes)
- [ ] Accessibility notes present when required

---

## Non-Negotiable Rule

**A component is not considered complete unless this checklist is fully verified.**
