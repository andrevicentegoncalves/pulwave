/**
 * @pulwave/mcp-core - Base MCP Server
 *
 * Abstract base class for MCP server implementations.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';
import type { BaseTool, ToolDefinition, McpServerConfig, DataProvider } from './types.js';
import { formatOutput, formatError } from './tool.js';

/**
 * Abstract base MCP server with common functionality
 */
export abstract class BaseMcpServer {
    protected server: Server;
    protected tools: Map<string, BaseTool> = new Map();
    protected config: McpServerConfig;
    protected provider?: DataProvider;

    constructor(config: McpServerConfig) {
        this.config = config;
        this.server = new Server(
            { name: config.name, version: config.version },
            { capabilities: { tools: {} } }
        );
        this.setupHandlers();
    }

    /**
     * Register tools - implement in subclass
     */
    protected abstract registerTools(): void;

    /**
     * Set the data provider
     */
    setProvider(provider: DataProvider): void {
        this.provider = provider;
    }

    /**
     * Register a tool
     */
    protected registerTool(tool: BaseTool): void {
        this.tools.set(tool.name, tool);
    }

    /**
     * Setup MCP request handlers
     */
    private setupHandlers(): void {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            const tools = Array.from(this.tools.values()).map((tool) => ({
                name: tool.name,
                description: tool.description,
                inputSchema: this.zodToJsonSchema(tool.inputSchema),
                annotations: tool.annotations,
            }));
            return { tools };
        });

        // Execute tool
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            const tool = this.tools.get(name);

            if (!tool) {
                return {
                    content: [{ type: 'text', text: formatError(`Unknown tool: ${name}`, 'Use list_tools to see available tools.') }],
                    isError: true,
                };
            }

            try {
                // Validate input
                const validatedInput = tool.inputSchema.parse(args);

                // Execute handler
                const result = await tool.handler(validatedInput);

                return {
                    content: [{ type: 'text', text: formatOutput(result) }],
                };
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Tool execution failed';
                return {
                    content: [{ type: 'text', text: formatError(message) }],
                    isError: true,
                };
            }
        });
    }

    /**
     * Convert Zod schema to JSON Schema (simplified)
     */
    private zodToJsonSchema(schema: z.ZodType): object {
        // Use zod's built-in JSON schema generation if available
        // This is a simplified version - in production use zod-to-json-schema
        return {
            type: 'object',
            properties: {},
        };
    }

    /**
     * Start the server with stdio transport
     */
    async start(): Promise<void> {
        // Initialize provider if set
        if (this.provider) {
            await this.provider.connect();
        }

        // Register tools
        this.registerTools();

        // Start stdio transport
        const transport = new StdioServerTransport();
        await this.server.connect(transport);

        console.error(`${this.config.name} v${this.config.version} started`);
    }

    /**
     * Stop the server
     */
    async stop(): Promise<void> {
        if (this.provider) {
            await this.provider.disconnect();
        }
        await this.server.close();
    }
}

/**
 * Create a simple MCP server from tool definitions
 */
export function createMcpServer(
    config: McpServerConfig,
    tools: ToolDefinition[]
): BaseMcpServer {
    class SimpleMcpServer extends BaseMcpServer {
        private toolList: ToolDefinition[];

        constructor(config: McpServerConfig, tools: ToolDefinition[]) {
            super(config);
            this.toolList = tools;
        }

        protected registerTools(): void {
            for (const tool of this.toolList) {
                this.registerTool(tool);
            }
        }
    }

    return new SimpleMcpServer(config, tools);
}
