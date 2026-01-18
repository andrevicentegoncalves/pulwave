/**
 * @pulwave/mcp-vercel
 *
 * MCP server for Vercel deployments.
 * This is a shell implementation - ready for when Vercel is configured.
 *
 * ## Tools Available (shell - not yet implemented)
 *
 * ### Projects
 * - `list_vercel_projects` - List Vercel projects
 * - `get_vercel_project` - Get project details
 *
 * ### Deployments
 * - `list_vercel_deployments` - List deployments
 * - `get_vercel_deployment` - Get deployment details
 * - `get_vercel_deployment_logs` - Get deployment logs
 *
 * ### Domains
 * - `list_vercel_domains` - List domains
 * - `get_vercel_domain` - Get domain details
 *
 * ### Environment Variables
 * - `list_vercel_env_vars` - List env vars (masked)
 * - `get_vercel_env_var` - Get env var (masked)
 *
 * @example
 * ```typescript
 * import { createServer } from '@pulwave/mcp-vercel';
 *
 * const server = createServer({
 *   token: process.env.VERCEL_TOKEN,
 *   teamId: 'team_xxx',
 * });
 *
 * await server.start();
 * ```
 */

export { PulwaveVercelMcpServer, createServer } from './server';
export { VercelProvider, type VercelConfig } from './provider';
export * from './tools';
