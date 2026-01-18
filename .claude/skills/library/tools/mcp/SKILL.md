---
name: mcp
description: Build Model Context Protocol (MCP) servers with tools, resources, and provider patterns for LLM integration.
version: 1.0.0
tags: [MCP, Claude, Tools, AI Integration, TypeScript, Python]
---

# MCP Server Development

Build MCP servers that enable LLMs to interact with external services through well-designed tools.

## When to Use

- Expose database queries to Claude
- Create AI-accessible APIs
- Build read-only data exploration tools
- Integrate external services for AI use

## Quick Reference

### Tool Definition (TypeScript)
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

### Tool Annotations
```typescript
{
  readOnlyHint: true,      // Safe to run without side effects
  destructiveHint: false,  // Doesn't delete/modify data
  idempotentHint: true,    // Same result on repeated calls
  openWorldHint: false,    // Closed set of possible results
}
```

## Development Phases

### Phase 1: Research & Planning
- Study MCP protocol documentation
- Understand the API you're integrating
- Plan tool coverage (comprehensive API vs workflow tools)

### Phase 2: Implementation
- Set up project structure
- Create shared utilities (API client, error handling)
- Implement tools with proper schemas

### Phase 3: Review & Test
- Code quality review (DRY, consistent errors, full types)
- Build verification
- Test with MCP Inspector

### Phase 4: Create Evaluations
- Create 10 complex, realistic test questions
- Verify answers with actual tool usage

## Tool Design Principles

| Principle | Description |
|-----------|-------------|
| **Naming** | Use consistent prefixes (`github_create_issue`) |
| **Descriptions** | Clear, actionable, include examples |
| **Errors** | Guide agents toward solutions |
| **Pagination** | Support filtering and limiting results |

## Scoring (0-10)

- **10**: Full tool coverage, proper schemas, pagination, error handling, evaluations
- **7**: Basic CRUD tools, reasonable descriptions
- **3**: Minimal tools, poor error handling
- **0**: No MCP integration

## Full Compiled Guide

**Category Guide**: [../tools/AGENTS.md](../tools/AGENTS.md) - Complete tools category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

- `references/tool-definitions.md` - Defining tools and naming conventions
- `references/best-practices.md` - MCP design guidelines
- `references/typescript-guide.md` - TypeScript implementation patterns
- `references/python-guide.md` - Python/FastMCP implementation patterns
