---
name: api-docs
description: Generate and maintain API documentation with OpenAPI, TypeDoc, and automated tooling.
version: 1.0.0
tags: [Documentation, OpenAPI, TypeDoc, Swagger, API]
---

# API Documentation

Generate, maintain, and publish API documentation across frontend and backend codebases.

## When to Use

- Auto-generate API docs from code
- Create OpenAPI/Swagger specs
- Generate TypeScript/JS documentation
- Maintain developer portals

## Quick Reference

### OpenAPI Generation
```typescript
// From Zod schemas
import { generateSchema } from '@anatine/zod-openapi';

const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});

const openApiSchema = generateSchema(userSchema);
```

### TypeDoc Setup
```json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "plugin": ["typedoc-plugin-markdown"]
}
```

### JSDoc Comments
```typescript
/**
 * Fetches user profile by ID
 * @param id - User UUID
 * @returns User profile or null if not found
 * @throws {NotFoundError} When user doesn't exist
 */
async function getUser(id: string): Promise<User | null>
```

## Documentation Types

| Type | Tool | Output |
|------|------|--------|
| REST API | OpenAPI/Swagger | Interactive docs |
| TypeScript | TypeDoc | HTML/Markdown |
| Components | Storybook | Visual docs |
| General | Docusaurus | Developer portal |

## Workflow

1. **Add JSDoc**: Document functions and types
2. **Configure Tool**: Set up TypeDoc/OpenAPI
3. **Generate**: Run doc generation
4. **Publish**: Deploy to docs site
5. **Automate**: CI/CD doc builds

## Scoring (0-10)

- **10**: Full OpenAPI spec, TypeDoc, auto-generated, versioned
- **7**: Basic JSDoc, some generated docs
- **3**: Minimal comments, no generation
- **0**: No documentation

## Full Compiled Guide

**Category Guide**: [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Complete crosscutting category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

- `references/openapi.md` - OpenAPI generation
- `references/typedoc.md` - TypeScript documentation
