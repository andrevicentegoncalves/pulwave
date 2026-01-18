---
name: data-validation-expert
description: Specialist in runtime data validation, schema enforcement, and input sanitization (Zod, Joi, Pydantic).
version: 1.0.0
tags: [Validation, Schema, Zod, Security, Input]
---

# Data Validation & Schema Enforcement

Expertise in ensuring data integrity and security through robust runtime validation and sanitization.

## Expertise
- **Schema Libraries**: Mastery of Zod (TypeScript), Pydantic (Python), and FluentValidation (.NET).
- **Runtime Validation**: Enforcing types and constraints at API boundaries and form inputs.
- **Sanitization**: Preventing XSS and SQLi through robust input cleaning.
- **Error Mapping**: Transforming raw validation errors into user-friendly feedback.
- **Type Safety**: Inferring static types directly from validation schemas.

## Workflow
1. **Define Schema**: Create a centralized schema for every input (Param, Body, Form).
2. **Apply Boundary**: Wrap API handlers and Form submits in validation logic.
3. **Handle Errors**: Implement a global error handler to return structured validation feedback.
4. **Sanitize**: Apply specific cleaning rules for HTML/Script inputs.
5. **Infer Types**: Use `z.infer` or equivalent to ensure 100% type safety in application logic.

## Scoring (0-10)
- **10**: 100% boundary validation, inferred types, zero raw inputs, robust sanitization.
- **7**: Solid schema usage for major inputs, standard error handling, basic sanitization.
- **3**: Incomplete validation, manually checked "if" statements, raw strings in logic.
- **0**: Zero runtime validation, completely trusts user input.

## Full Compiled Guide

For complete implementation guidance with 40+ validation patterns and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **Validation Fundamentals** (CRITICAL) - Why runtime validation, validation boundaries, type safety, schema-driven development, validation vs sanitization
- **Zod Schemas** (CRITICAL) - Basic schema definition, type inference (`z.infer`), schema composition, refinements and transforms, async validation
- **Form Validation** (CRITICAL) - React Hook Form integration, field-level validation, cross-field validation, async field validation, error display
- **API Validation** (CRITICAL) - Request body validation, query parameter validation, path parameter validation, response validation, validation middleware
- **Input Sanitization** (CRITICAL) - XSS prevention (DOMPurify), SQL injection prevention, HTML sanitization, string trimming, encoding
- **Custom Validators** (HIGH) - Custom refinements, reusable validators, domain-specific rules, conditional validation, business logic validation
- **Error Handling** (CRITICAL) - Error formatting, error messages, field path extraction, localized errors, error recovery
- **Database Validation** (HIGH) - Unique constraints, foreign key validation, check constraints, trigger validation, RLS validation
- **Performance** (MEDIUM) - Schema caching, lazy validation, partial validation, validation debouncing, validation memoization
- **Testing Validation** (HIGH) - Schema testing, validation error testing, boundary testing, sanitization testing, security testing
- Plus common validation patterns, security checklist, Zod API reference, and error message templates

**Category Guide**: [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Complete crosscutting category with all patterns and examples
