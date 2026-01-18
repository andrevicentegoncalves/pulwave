# Tools Skills - Category Guide

**Version 3.0.0**
Pulwave Engineering
2026-01-18

> **Note:**
> This is the tools category compilation for AI agents and LLMs working on the Pulwave codebase.
> This document aggregates all 11 tools skills including development tools, document processing, and creative utilities.

## Abstract

Comprehensive tools guide for development, document generation, and workflow automation. Contains 11 skills covering TypeScript patterns, MCP servers, document processing (PDF, DOCX, PPTX, XLSX), creative tools, and workflow utilities.

**Tools Categories:**
- **Development**: TypeScript (strict mode, generics), MCP (AI integration)
- **Document Processing**: PDF, DOCX, PPTX, XLSX generation
- **Workflow**: Doc coauthoring, skill creation, web artifacts
- **Creative**: Algorithmic art, GIF creation

**Technology Stack:**
- TypeScript 5.6 (strict mode, generics)
- MCP SDK (AI integration)
- Zod (runtime validation)
- Python 3.8+ (creative tools)
- Node.js 18+ (document processing)

---

## Table of Contents

### Development Tools
1. [MCP](#1-mcp) (HIGH) - Model Context Protocol servers
2. [TypeScript](#2-typescript) (CRITICAL) - Strict mode, type safety, generics

### Document Processing
3. [PDF](#3-pdf) (MEDIUM) - PDF generation and manipulation
4. [DOCX](#4-docx) (MEDIUM) - Word document processing
5. [PPTX](#5-pptx) (MEDIUM) - PowerPoint presentations
6. [XLSX](#6-xlsx) (MEDIUM) - Excel spreadsheets

### Workflow Tools
7. [Doc Coauthoring](#7-doc-coauthoring) (LOW) - Document collaboration
8. [Skill Creator](#8-skill-creator) (LOW) - Create new skills
9. [Web Artifacts](#9-web-artifacts) (LOW) - Build deployable web artifacts

### Creative Tools
10. [Algorithmic Art](#10-algorithmic-art) (LOW) - Generative art creation
11. [Slack GIF Creator](#11-slack-gif-creator) (LOW) - Animated GIF creation

---

## 1. MCP

**Location**: [mcp/](mcp/)
**Quick Ref**: [SKILL.md](mcp/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q1 priority

**Impact**: HIGH

Build Model Context Protocol (MCP) servers that enable LLMs to interact with external services through well-designed tools, resources, and provider patterns.

### Key Concepts

- **Tools**: Callable functions exposed to LLMs
- **Resources**: Data/content accessible to LLMs
- **Providers**: Backend integrations (DB, APIs, files)
- **Schemas**: Zod-based input validation
- **Annotations**: Tool hints (readOnly, destructive, idempotent)

### When to Use

- Exposing database queries to Claude
- Creating AI-accessible APIs
- Building read-only data exploration tools
- Integrating external services for AI use

### Quick Example

```typescript
import { z, defineReadOnlyTool, commonSchemas } from '@pulwave/mcp-core';

const listProfiles = defineReadOnlyTool({
  name: 'list_profiles',
  description: 'List user profiles with filtering and pagination.',
  inputSchema: z.object({
    ...commonSchemas.pagination.shape,
    role: z.enum(['user', 'admin']).optional(),
    search: z.string().optional(),
  }),
  handler: async (input) => {
    // Query logic
    return data;
  },
});
```

### Development Phases

1. **Research & Planning** - Study MCP protocol, understand API to integrate
2. **Implementation** - Set up project, create shared utilities, implement tools
3. **Review & Test** - Code quality, build verification, MCP Inspector testing
4. **Create Evaluations** - 10 complex test questions with actual tool usage

### Tool Design Principles

| Principle | Description |
|-----------|-------------|
| **Naming** | Use consistent prefixes (`github_create_issue`) |
| **Descriptions** | Clear, actionable, include examples |
| **Errors** | Guide agents toward solutions |
| **Pagination** | Support filtering and limiting results |

### Tools & Resources

- **MCP SDK**: Protocol implementation
- **Zod**: Schema validation
- **commonSchemas**: Reusable pagination/filtering schemas
- **MCP Inspector**: Testing tool

---

## 2. TypeScript

**Location**: [typescript/](typescript/)
**Quick Ref**: [SKILL.md](typescript/SKILL.md)
**Full Guide**: [AGENTS.md](typescript/AGENTS.md)

**Impact**: CRITICAL

Expert-level TypeScript patterns for type-safe, maintainable code. Covers strict mode configuration, advanced types, generics, type narrowing, and integration with React, TanStack Query, and Zod.

### Core Expertise

- **Strict Mode**: All strict checks enabled, zero `any` types
- **Generics**: Reusable, type-safe functions and components
- **Type Narrowing**: Guards, assertions, discriminated unions
- **Utility Types**: Mapped types, conditional types, template literals
- **Integration**: React 19, TanStack Query, Zod schemas

### When to Use

- Writing type-safe code
- Creating reusable utilities and hooks
- Type modeling for complex domains
- Fixing type errors
- Code review for type safety

### Quick Examples

```typescript
// Strict mode (tsconfig.json)
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}

// Discriminated unions
type Status =
  | { type: 'loading' }
  | { type: 'success'; data: Data }
  | { type: 'error'; error: Error };

function handleStatus(status: Status) {
  switch (status.type) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <View data={status.data} />;
    case 'error':
      return <Error error={status.error} />;
  }
}

// Generic hook with constraints
function useQuery<TData, TError = Error>(
  key: QueryKey,
  fn: () => Promise<TData>
): UseQueryResult<TData, TError> {
  // Implementation
}

// Zod schema to TypeScript type
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});
type User = z.infer<typeof userSchema>;
```

### TypeScript Patterns (40+)

**Strict Configuration** (CRITICAL)
- tsconfig.json setup with all strict flags
- Compiler options for optimal type checking
- No `any` policy enforcement

**Type Safety Patterns** (CRITICAL)
- Use `unknown` instead of `any`
- Proper type assertions vs type guards
- `never` type for exhaustive checks

**Generics** (HIGH)
- Generic functions with constraints
- Generic React components
- Generic hooks with type inference
- Conditional types based on generics

**Type Narrowing** (HIGH)
- Type guards (`typeof`, `instanceof`, custom)
- Discriminated unions
- Assertion functions
- Control flow analysis

**Utility Types** (MEDIUM)
- Built-in utilities: `Partial`, `Pick`, `Omit`, `Record`
- Mapped types: `{ [K in keyof T]: ... }`
- Conditional types: `T extends U ? X : Y`
- Template literal types

**React Integration** (HIGH)
- Component props typing
- Generic components
- Event handler types
- Children types
- Ref types

**TanStack Query Types** (MEDIUM)
- Query data typing
- Mutation types
- Type inference from query functions
- Error types

**Zod Integration** (HIGH)
- Schema definition
- Type inference with `z.infer`
- Runtime validation + TypeScript types
- Form validation integration

### Workflow

1. **Configure**: Enable strict mode in tsconfig.json
2. **Define**: Create precise types (no `any`)
3. **Narrow**: Use type guards and discriminated unions
4. **Reuse**: Build generic utilities and hooks
5. **Validate**: Integrate runtime validation with Zod

### Scoring (0-10)

- **10**: Strict mode, zero `any`, generic utilities, Zod integration, full React typing
- **7**: Strict mode enabled, minimal `any`, basic generics, component types
- **3**: Some type annotations, lots of `any`, loose config
- **0**: JavaScript with `.ts` extension, no type checking

---

## 3. PDF

**Location**: [pdf/](pdf/)
**Quick Ref**: [SKILL.md](pdf/SKILL.md)
**Provider**: Anthropic

**Impact**: MEDIUM

Generate and manipulate PDF documents programmatically. Essential for creating reports, invoices, documentation, and other printable content.

**See individual skill folder for full documentation and examples.**

---

## 4. DOCX

**Location**: [docx/](docx/)
**Quick Ref**: [SKILL.md](docx/SKILL.md)
**Provider**: Anthropic

**Impact**: MEDIUM

Create and edit Microsoft Word documents (.docx) programmatically. Useful for generating formatted documents, reports, and templates.

**See individual skill folder for full documentation and examples.**

---

## 5. PPTX

**Location**: [pptx/](pptx/)
**Quick Ref**: [SKILL.md](pptx/SKILL.md)
**Provider**: Anthropic

**Impact**: MEDIUM

Build PowerPoint presentations (.pptx) programmatically. Create slides, add content, and format presentations automatically.

**See individual skill folder for full documentation and examples.**

---

## 6. XLSX

**Location**: [xlsx/](xlsx/)
**Quick Ref**: [SKILL.md](xlsx/SKILL.md)
**Provider**: Anthropic

**Impact**: MEDIUM

Generate Excel spreadsheets (.xlsx) with formulas, formatting, and charts. Essential for data exports and automated reporting.

**See individual skill folder for full documentation and examples.**

---

## 7. Doc Coauthoring

**Location**: [doc-coauthoring/](doc-coauthoring/)
**Quick Ref**: [SKILL.md](doc-coauthoring/SKILL.md)
**Provider**: Anthropic

**Impact**: LOW

Collaborate on document creation with AI assistance. Streamline documentation workflows and content generation.

**See individual skill folder for full documentation and examples.**

---

## 8. Skill Creator

**Location**: [skill-creator/](skill-creator/)
**Quick Ref**: [SKILL.md](skill-creator/SKILL.md)
**Provider**: Anthropic

**Impact**: LOW

Create new Claude Code skills with proper structure and documentation. Automates skill scaffolding and setup.

**See individual skill folder for full documentation and examples.**

---

## 9. Web Artifacts

**Location**: [web-artifacts/](web-artifacts/)
**Quick Ref**: [SKILL.md](web-artifacts/SKILL.md)
**Provider**: Anthropic

**Impact**: LOW

Build deployable web artifacts and components. Create standalone HTML/CSS/JS files for quick prototyping.

**See individual skill folder for full documentation and examples.**

---

## 10. Algorithmic Art

**Location**: [algorithmic-art/](algorithmic-art/)
**Quick Ref**: [SKILL.md](algorithmic-art/SKILL.md)
**Provider**: Anthropic

**Impact**: LOW

Generate generative art using algorithms and creative coding patterns. Create unique visual designs programmatically.

**See individual skill folder for full documentation and examples.**

---

## 11. Slack GIF Creator

**Location**: [slack-gif-creator/](slack-gif-creator/)
**Quick Ref**: [SKILL.md](slack-gif-creator/SKILL.md)
**Provider**: Anthropic

**Impact**: LOW

Create animated GIFs optimized for Slack and other messaging platforms. Generate custom animations and reactions.

**See individual skill folder for full documentation and examples.**

---

## Related Skills

**For component development, see:**
- [front-end/component-design](../front-end/component-design/) - CVA variants, compound components
- [front-end/frameworks](../front-end/frameworks/) - React 19 patterns

**For data layer typing, see:**
- [architecture/data-layer](../architecture/data-layer/) - Repository pattern with TypeScript

**For code quality, see:**
- [crosscutting/code-hygiene](../crosscutting/code-hygiene/) - ESLint, Prettier setup

**For testing tools, see:**
- [testing/unit-testing](../testing/unit-testing/) - Vitest setup
- [testing/e2e-testing](../testing/e2e-testing/) - Playwright setup

**For design tools, see:**
- [front-end/canvas-design](../front-end/canvas-design/) - Interactive canvas design
- [front-end/theme-factory](../front-end/theme-factory/) - Theme generation

---

## Version History

### 3.0.0 (2026-01-18) - LIBRARY INTEGRATION
- **MAJOR UPDATE**: Integrated all Anthropic tools into unified library
- Added: 9 new skills from Anthropic (pdf, docx, pptx, xlsx, doc-coauthoring, skill-creator, web-artifacts, algorithmic-art, slack-gif-creator)
- Total skills: 2 → 11 (450% expansion)
- Removed: External tools section (now fully integrated)
- Updated: Table of contents with 4 categories (Development, Document Processing, Workflow, Creative)
- Migration: All skills moved from `.claude/skills/anthropic/` to `.claude/skills/library/tools/`

### 2.0.0 (2026-01-17)
- **MAJOR REWRITE**: Corrected to reflect only Pulwave-specific tools
- Removed: 13 tools that were actually Anthropic general-purpose utilities
- Updated: Now covers only MCP and TypeScript (2 Pulwave tools)
- Added: Clear separation and reference to external Anthropic tools (15 skills)
- Fixed: Skill count from 18 to 2, corrected Anthropic count from 16 to 15

### 1.0.0 (2026-01-16)
- Initial version (incorrect - mixed Pulwave and Anthropic tools)

---

**Last Updated**: 2026-01-18
**Version**: 3.0.0
**Skills Covered**: 11 (2 Pulwave development tools + 9 Anthropic tools)
**Maintained By**: Pulwave Engineering
