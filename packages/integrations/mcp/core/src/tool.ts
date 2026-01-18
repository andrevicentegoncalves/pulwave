/**
 * @pulwave/mcp-core - Tool utilities
 *
 * Helper functions for creating and managing MCP tools.
 */

import { z } from 'zod';
import type { ToolDefinition, ToolAnnotations, ToolResult, PaginatedResult, ListQueryParams } from './types.js';

/**
 * Create a type-safe tool definition
 */
export function defineTool<TInput extends z.ZodTypeAny, TOutput>(
    config: ToolDefinition<TInput, TOutput>
): ToolDefinition<TInput, TOutput> {
    return config;
}

/**
 * Create a read-only tool (query operations)
 */
export function defineReadOnlyTool<TInput extends z.ZodTypeAny, TOutput>(
    config: Omit<ToolDefinition<TInput, TOutput>, 'annotations'>
): ToolDefinition<TInput, TOutput> {
    return {
        ...config,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    };
}

/**
 * Create a write tool (mutation operations)
 */
export function defineWriteTool<TInput extends z.ZodTypeAny, TOutput>(
    config: Omit<ToolDefinition<TInput, TOutput>, 'annotations'> & {
        destructive?: boolean;
        idempotent?: boolean;
    }
): ToolDefinition<TInput, TOutput> {
    return {
        ...config,
        annotations: {
            readOnlyHint: false,
            destructiveHint: config.destructive ?? false,
            idempotentHint: config.idempotent ?? false,
            openWorldHint: true,
        },
    };
}

/**
 * Wrap handler with error handling
 */
export function withErrorHandling<TInput, TOutput>(
    handler: (input: TInput) => Promise<TOutput>
): (input: TInput) => Promise<ToolResult<TOutput>> {
    return async (input: TInput): Promise<ToolResult<TOutput>> => {
        try {
            const data = await handler(input);
            return { success: true, data };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            return { success: false, error: message };
        }
    };
}

/**
 * Common Zod schemas for reuse
 */
export const commonSchemas = {
    /** UUID string */
    uuid: z.string().uuid(),

    /** Pagination parameters */
    pagination: z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(20),
    }),

    /** Sort parameters */
    sorting: z.object({
        orderBy: z.string().optional(),
        orderDirection: z.enum(['asc', 'desc']).default('asc'),
    }),

    /** Search parameter */
    search: z.object({
        query: z.string().min(1).max(200),
    }),

    /** Date range */
    dateRange: z.object({
        from: z.string().datetime().optional(),
        to: z.string().datetime().optional(),
    }),
};

/**
 * Create paginated result
 */
export function paginatedResult<T>(
    items: T[],
    total: number,
    params: ListQueryParams
): PaginatedResult<T> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    return {
        items,
        total,
        page,
        pageSize,
        hasMore: page * pageSize < total,
    };
}

/**
 * Format tool output for Claude
 */
export function formatOutput(data: unknown): string {
    if (typeof data === 'string') return data;
    return JSON.stringify(data, null, 2);
}

/**
 * Format error message with actionable suggestion
 */
export function formatError(error: string, suggestion?: string): string {
    let message = `Error: ${error}`;
    if (suggestion) {
        message += `\n\nSuggestion: ${suggestion}`;
    }
    return message;
}
