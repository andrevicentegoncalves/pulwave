/**
 * @pulwave/mcp-core
 *
 * Core MCP server utilities and abstractions for Pulwave.
 *
 * @example
 * ```typescript
 * import { BaseMcpServer, defineTool, defineReadOnlyTool } from '@pulwave/mcp-core';
 * import { z } from 'zod';
 *
 * const getUserTool = defineReadOnlyTool({
 *   name: 'get_user',
 *   description: 'Get user by ID',
 *   inputSchema: z.object({ id: z.string().uuid() }),
 *   handler: async ({ id }) => fetchUser(id),
 * });
 * ```
 */

// Types
export type {
    BaseTool,
    ToolDefinition,
    ToolAnnotations,
    ToolResult,
    PaginatedResult,
    ListQueryParams,
    McpServerConfig,
    DataProvider,
} from './types.js';

// Server
export { BaseMcpServer, createMcpServer } from './server.js';

// Tool utilities
export {
    defineTool,
    defineReadOnlyTool,
    defineWriteTool,
    withErrorHandling,
    commonSchemas,
    paginatedResult,
    formatOutput,
    formatError,
} from './tool.js';

// Re-export zod for convenience
export { z } from 'zod';
