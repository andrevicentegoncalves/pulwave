/**
 * @pulwave/mcp-core - Type definitions
 *
 * Shared types for MCP server implementations.
 */

import type { z } from 'zod';

/**
 * Base tool definition for registration (non-generic)
 */
export interface BaseTool {
    /** Unique tool name (snake_case recommended) */
    name: string;
    /** Human-readable description for Claude */
    description: string;
    /** Zod schema for input validation */
    inputSchema: z.ZodTypeAny;
    /** Tool handler function */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (input: any) => Promise<any>;
    /** Tool annotations */
    annotations?: ToolAnnotations;
}

/**
 * Tool definition with Zod schema validation (generic for creation)
 */
export interface ToolDefinition<TInput extends z.ZodTypeAny = z.ZodTypeAny, TOutput = unknown> {
    /** Unique tool name (snake_case recommended) */
    name: string;
    /** Human-readable description for Claude */
    description: string;
    /** Zod schema for input validation */
    inputSchema: TInput;
    /** Tool handler function */
    handler: (input: z.infer<TInput>) => Promise<TOutput>;
    /** Tool annotations */
    annotations?: ToolAnnotations;
}

/**
 * Tool behavior annotations (MCP standard)
 */
export interface ToolAnnotations {
    /** Tool only reads data, doesn't modify */
    readOnlyHint?: boolean;
    /** Tool performs destructive/irreversible actions */
    destructiveHint?: boolean;
    /** Tool can be called multiple times with same result */
    idempotentHint?: boolean;
    /** Tool interacts with external systems */
    openWorldHint?: boolean;
}

/**
 * MCP Server configuration
 */
export interface McpServerConfig {
    /** Server name */
    name: string;
    /** Server version */
    version: string;
    /** Server description */
    description?: string;
    /** Transport type */
    transport?: 'stdio' | 'http';
}

/**
 * Tool execution result
 */
export interface ToolResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

/**
 * Common query parameters for list operations
 */
export interface ListQueryParams {
    page?: number;
    pageSize?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
}

/**
 * Provider interface for data sources
 */
export interface DataProvider {
    /** Provider name */
    name: string;
    /** Check if provider is connected */
    isConnected(): Promise<boolean>;
    /** Connect to the provider */
    connect(): Promise<void>;
    /** Disconnect from the provider */
    disconnect(): Promise<void>;
}
