# TypeScript MCP Implementation

## Recommended Stack

- **Language**: TypeScript (high-quality SDK support)
- **Schema**: Zod for input validation
- **Transport**: Streamable HTTP (remote) or stdio (local)

## Project Structure

```
my-mcp-server/
├── src/
│   ├── index.ts          # Entry point
│   ├── server.ts         # Server setup
│   ├── provider.ts       # API client wrapper
│   └── tools/
│       ├── index.ts      # Tool exports
│       ├── users.ts      # User-related tools
│       └── repos.ts      # Repo-related tools
├── package.json
└── tsconfig.json
```

## Server Setup

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'my-server',
  version: '1.0.0',
});

// Register tools
server.tool('tool_name', schema, handler);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Tool Registration

```typescript
import { z } from 'zod';

server.tool(
  'list_users',
  {
    description: 'List users with optional filtering',
    inputSchema: z.object({
      role: z.enum(['admin', 'user']).optional(),
      limit: z.number().int().min(1).max(100).default(20),
    }),
    annotations: {
      readOnlyHint: true,
    },
  },
  async ({ role, limit }) => {
    const users = await api.listUsers({ role, limit });
    return {
      content: [{ type: 'text', text: JSON.stringify(users, null, 2) }],
    };
  }
);
```

## Zod Schema Patterns

```typescript
// Common patterns
const pagination = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

const uuid = z.string().uuid();

const dateRange = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

// Reuse in tools
inputSchema: z.object({
  ...pagination.shape,
  id: uuid,
});
```

## Error Handling

```typescript
async function handler(input) {
  try {
    const result = await api.call(input);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  } catch (error) {
    if (error.status === 404) {
      throw new Error(`Resource not found: ${input.id}. Use list_* to find valid IDs.`);
    }
    throw new Error(`API error: ${error.message}`);
  }
}
```

## Testing

```bash
# Build
npm run build

# Test with MCP Inspector
npx @modelcontextprotocol/inspector

# Verify compilation
npx tsc --noEmit
```

## Quality Checklist

- [ ] All tools have clear descriptions
- [ ] Input schemas use Zod with constraints
- [ ] Error messages are actionable
- [ ] Pagination supported for list operations
- [ ] No duplicated code
- [ ] Full TypeScript types
