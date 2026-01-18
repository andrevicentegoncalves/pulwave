---
name: components
description: Core component library patterns and design system integration. Covers design tokens, layout components, and component architecture.
version: 1.0.0
tags: [Components, Design System, Tokens, Layout, Architecture]
---

# Component Library Guide

Core component patterns for building consistent, token-based UI components.

## When to Use

- Building new UI components
- Using the design system
- Working with layout patterns
- Creating compound components

## Quick Reference

### Core Principles
1. **Use core library** - Never raw platform components
2. **Design tokens** - All values from tokens
3. **Consistent patterns** - Same props, same behavior
4. **Accessibility** - Built-in a11y support

### Token Usage
```tsx
// ✅ Tokens
<Box padding="$4" color="$textPrimary" />

// ❌ Hard-coded
<Box padding={16} color="#333" />
```

### Layout Pattern
```tsx
<VStack gap="$4" padding="$4">
  <Heading>Title</Heading>
  <Text>Content</Text>
</VStack>
```

## Full Compiled Guide

For complete implementation guidance with 40+ component patterns and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **Design Tokens** (CRITICAL) - Semantic tokens, theme-awareness, token categories
- **Component Structure** (HIGH) - Atomic design, file organization, barrel exports
- **CVA Integration** (CRITICAL) - Type-safe variants, compound variants, TypeScript
- **Component API Design** (CRITICAL) - Props interface, forwardRef, polymorphic "as" prop
- **Composition Patterns** (HIGH) - Compound components, composition vs configuration
- **Styling Patterns** (HIGH) - SCSS with BEM, CSS custom properties, dynamic styles
- **Layout Components** (HIGH) - Stack components (VStack/HStack), responsive layout
- **Accessibility** (CRITICAL) - Semantic HTML, ARIA attributes, keyboard navigation
- **State Management** (HIGH) - Controlled vs uncontrolled, loading/error/empty states
- Plus complete CVA templates and component development checklist

**Category Guide**: [../front-end/AGENTS.md](../front-end/AGENTS.md) - Complete front-end category with all patterns and examples

## Additional Resources

### Core Components
Component catalog in `references/catalog.md`:
- Box, HStack, VStack
- Button, Input, Card
- Typography components

### Layout Patterns
Common layouts in `references/layouts.md`:
- Page layouts
- Form layouts
- List item layouts

### Token System
Token values in `references/tokens.md`:
- Spacing scale
- Color semantics
- Typography scale

## Anti-Patterns

❌ Raw platform components
❌ Hard-coded values
❌ Inline magic numbers
❌ Missing loading/error states

✅ Core library components
✅ Token-based props
✅ Semantic color tokens
✅ Complete state handling
