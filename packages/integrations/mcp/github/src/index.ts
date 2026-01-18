/**
 * @pulwave/mcp-github
 *
 * MCP server for GitHub operations.
 *
 * ## Tools Available
 *
 * ### Repositories
 * - `list_repositories` - List user repositories
 * - `get_repository` - Get repository details
 * - `list_branches` - List repository branches
 * - `get_branch` - Get branch details
 * - `list_commits` - List commits with filtering
 *
 * ### Pull Requests
 * - `list_pull_requests` - List PRs with filtering
 * - `get_pull_request` - Get PR details
 * - `get_pull_request_diff` - Get PR diff
 * - `list_pull_request_files` - List changed files
 * - `list_pull_request_reviews` - List PR reviews
 *
 * ### Issues
 * - `list_issues` - List issues with filtering
 * - `get_issue` - Get issue details
 * - `list_issue_comments` - List issue comments
 * - `search_issues` - Search issues/PRs
 *
 * ### Files
 * - `get_file_content` - Get file content
 * - `list_directory` - List directory contents
 * - `search_code` - Search code in repository
 * - `get_tree` - Get repository file tree
 *
 * @example
 * ```typescript
 * import { createServer } from '@pulwave/mcp-github';
 *
 * const server = createServer({
 *   token: process.env.GITHUB_TOKEN,
 *   defaultOwner: 'myorg',
 *   defaultRepo: 'myrepo',
 * });
 *
 * await server.start();
 * ```
 */

export { PulwaveGitHubMcpServer, createServer } from './server';
export { GitHubProvider, type GitHubConfig } from './provider';
export * from './tools';
