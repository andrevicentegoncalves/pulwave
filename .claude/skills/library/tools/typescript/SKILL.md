---
name: typescript-expert
description: TypeScript patterns focusing on strict mode, advanced types, generics, type safety, and integration with React and Zod.
version: 1.0.0
tags: [TypeScript, Type Safety, Generics, Strict Mode, Zod]
---

# TypeScript Mastery

Expert-level TypeScript patterns for type-safe, maintainable code.

## Expertise
- **Strict Mode**: Enabling all strict checks, no `any` types
- **Generics**: Reusable, type-safe functions and components
- **Type Narrowing**: Guards, assertions, discriminated unions
- **Utility Types**: Mapped types, conditional types, template literals
- **Integration**: React 19, TanStack Query, Zod schemas

## Workflow
1. **Configure**: Enable strict mode in tsconfig.json
2. **Define**: Create precise types (no `any`)
3. **Narrow**: Use type guards and discriminated unions
4. **Reuse**: Build generic utilities and hooks
5. **Validate**: Integrate runtime validation with Zod

## Scoring (0-10)
- **10**: Strict mode, zero `any`, generic utilities, Zod integration
- **7**: Strict mode enabled, minimal `any`, basic generics
- **3**: Some type annotations, lots of `any`, loose config
- **0**: JavaScript with `.ts` extension, no type checking

## Full Compiled Guide

For complete implementation guidance with 40+ TypeScript patterns and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **Strict Configuration** (CRITICAL) - tsconfig.json setup, compiler options
- **Type Safety Patterns** (CRITICAL) - No `any`, unknown vs never, type assertions
- **Generics** (HIGH) - Generic functions, components, hooks, constraints
- **Type Narrowing** (HIGH) - Guards, discriminated unions, assertion functions
- **Utility Types** (MEDIUM) - Mapped types, conditional types, template literals
- **React Integration** (HIGH) - Component props, hooks, event handlers
- **TanStack Query Types** (MEDIUM) - Query types, mutation types, type inference
- **Zod Integration** (HIGH) - Schema to TypeScript type generation
- Plus complete tsconfig examples and type utilities library

**Category Guide**: [../tools/AGENTS.md](../tools/AGENTS.md) - All tools skills compilation
