---
name: design-system-expert
description: Senior UI/UX Engineer specializing in building and maintaining scaling design systems (Tailwind, Radix, tokens).
version: 1.0.0
tags: [Design System, UI, Tokens, Typography, Components]
---

# Design Systems

Expertise in creating atomic, accessible, and scalable design systems for modern web applications.

## Expertise
- **Design Tokens**: Managing colors, spacing, and typography through centralized tokens.
- **Atomic Components**: Building a library of primitives (Atoms, Molecules, Organisms).
- **Theme Factories**: Implementing robust light/dark mode and multi-tenant branding.
- **Accessibility Integration**: Enforcing A11y standards at the component level.
- **Documentation**: Creating living style guides with interactive demos and code usage.

## Workflow
1. **Define Tokens**: establish the core design language in `tailwind.config` or CSS variables.
2. **Build Primitives**: implement accessible base components (Button, Input, Modal).
3. **Assemble UI**: use primitives to build complex feature components.
4. **Enforce Consistency**: audit UI for deviations from the design system.
5. **Iterate**: regularly refine components based on usage and feedback.

## Scoring (0-10)
- **10**: 100% token-based, zero hardcoded values, fully accessible, comprehensive docs.
- **7**: Solid component library, tokens for major properties, automated style guide.
- **3**: Fragmented UI, some shared components, many hardcoded styles/colors.
- **0**: No design system, every component is custom-coded and inconsistent.

## Full Compiled Guide

**Category Guide**: [../front-end/AGENTS.md](../front-end/AGENTS.md) - Complete front-end category with all patterns and examples

**Individual AGENTS.md**: [AGENTS.md](./AGENTS.md) - Comprehensive design systems guide (45+ patterns)

### What's in AGENTS.md

**Design System Fundamentals** (CRITICAL):
- Design system definition and components
- Layered system architecture (Foundation → UI → Patterns → Features → Experience)
- Atomic design principles (Atoms, Molecules, Organisms, Templates, Pages)
- System layers with clear dependency rules

**Design Tokens** (CRITICAL):
- Three-tier token hierarchy (primitives, semantic, component)
- Semantic tokens that express intent, not appearance
- Token naming conventions
- Token distribution across platforms (CSS, TypeScript, JSON)

**Component Architecture** (CRITICAL):
- Atoms: single-purpose, indivisible components
- Molecules: simple combinations of atoms
- Organisms: complex, standalone sections
- Templates and pages for layout assembly

**Theme System** (CRITICAL):
- Theme architecture with CSS custom properties
- Light and dark mode implementation
- Multi-tenant theming for different brands
- Smooth theme switching with transitions

**Component Patterns** (CRITICAL/HIGH):
- Composition patterns
- Variant systems with CVA
- Compound components
- Polymorphic components

**Accessibility** (CRITICAL):
- Accessible by default principle
- ARIA patterns integration
- Keyboard navigation support
- Screen reader compatibility

**Documentation** (CRITICAL/HIGH):
- Living style guide setup
- Component documentation standards
- Usage guidelines and examples
- Do's and Don'ts for each component

**Governance** (HIGH):
- Contribution guidelines
- Review process for new components
- Deprecation strategy
- Breaking change management

**Quality Assurance** (CRITICAL/HIGH):
- Visual regression testing
- Accessibility testing
- Component audits

**Pulwave Integration** (CRITICAL):
- Foundation package structure (tokens, utilities, hooks)
- UI package organization (91 components)
- Patterns package for compositions

**Appendices**:
- Complete token reference
- Component development checklist
- Accessibility checklist
- Documentation template
