---
name: design-constraints
description: Opinionated constraints for building tailored interfaces (Tailwind defaults, motion/react, cn utility).
version: 1.0.0
tags: [Tailwind, Design, Animation, UI]
---

# Design & Component Constraints

Opinionated standards for consistent UI development.

## Core Stack
- **Tailwind CSS**: MUST use defaults unless custom values exist.
- **Motion**: MUST use `motion/react` (formerly `framer-motion`) for JS animations.
- **Utility**: MUST use `cn` utility (`clsx` + `tailwind-merge`) for class logic.
- **Primitives**: MUST use accessible primitives (`Base UI`, `React Aria`, `Radix`).

## Component Rules
- **Icon Buttons**: MUST have `aria-label`.
- **Destructive Actions**: MUST use `AlertDialog`.
- **Loading States**: SHOULD use structural skeletons.
- **Viewport**: NEVER use `h-screen`, use `h-dvh`.
- **Typography**: MUST use `text-balance` for headings and `text-pretty` for body.
- **Metrics**: MUST use `tabular-nums` for data.

## Animation Performance
- **Compositor**: Animate only `transform` and `opacity`.
- **Feedback**: NEVER exceed `200ms` for interaction feedback.
- **Looping**: MUST pause looping animations when off-screen.
- **Implicit**: NEVER add animation unless explicitly requested.

## Design Aesthetics
- **Gradients**: NEVER use gradients or purple/multicolor gradients unless requested.
- **Affordances**: NEVER use glow effects as primary affordances.
- **Colors**: SHOULD limit accent color usage to one per view.

## Full Compiled Guide

**Category Guide**: [../front-end/AGENTS.md](../front-end/AGENTS.md) - Complete front-end category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples
