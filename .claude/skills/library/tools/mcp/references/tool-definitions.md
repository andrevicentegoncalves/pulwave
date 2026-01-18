# MCP Tool Definitions

## Basic Structure

```typescript
import { z, defineReadOnlyTool } from '@pulwave/mcp-core';

const myTool = defineReadOnlyTool({
  name: 'tool_name',           // snake_case
  description: 'Clear description of what tool does.',
  inputSchema: z.object({...}),
  handler: async (input) => {
    // Implementation
    return result;
  },
});
```

## Naming Conventions

| Pattern | Example | Use Case |
|---------|---------|----------|
| `list_*` | `list_profiles` | Paginated lists |
| `get_*` | `get_profile` | Single item by ID |
| `search_*` | `search_profiles` | Text search |
| `create_*` | `create_profile` | Create item |
| `update_*` | `update_profile` | Update item |
| `delete_*` | `delete_profile` | Delete item |

## Input Schema Patterns

### With Common Schemas
```typescript
import { commonSchemas } from '@pulwave/mcp-core';

inputSchema: z.object({
  ...commonSchemas.pagination.shape,  // page, pageSize
  ...commonSchemas.sorting.shape,     // orderBy, orderDirection
  id: commonSchemas.uuid,             // UUID validation
})
```

### Custom Fields
```typescript
inputSchema: z.object({
  query: z.string().min(2).describe('Search query'),
  limit: z.number().int().min(1).max(50).default(10),
  status: z.enum(['active', 'inactive']).optional(),
})
```

## Handler Patterns

### Paginated Results
```typescript
import { paginatedResult } from '@pulwave/mcp-core';

handler: async ({ page, pageSize }) => {
  const { data, count } = await query;
  return paginatedResult(data, count, { page, pageSize });
}
```

### Error Handling
```typescript
handler: async ({ id }) => {
  const item = await provider.getById('table', id);

  if (!item) {
    throw new Error(`Item not found: ${id}`);
  }

  return item;
}
```

## Grouping Tools

```typescript
// tools/profiles.ts
export function createProfileTools(provider: Provider) {
  const listProfiles = defineReadOnlyTool({...});
  const getProfile = defineReadOnlyTool({...});
  const searchProfiles = defineReadOnlyTool({...});

  return [listProfiles, getProfile, searchProfiles];
}

// Register all
server.registerTools(createProfileTools(provider));
```

## Description Best Practices

```typescript
// ✅ Good - clear, actionable
description: 'List user profiles with optional filtering by role and status. Returns paginated results with basic profile info.'

// ❌ Bad - vague
description: 'Gets profiles'
```
