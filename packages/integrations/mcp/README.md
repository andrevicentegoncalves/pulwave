# Pulwave MCP Servers

Model Context Protocol (MCP) servers for integrating Claude with Pulwave's infrastructure.

## Packages

| Package | Status | Description |
|---------|--------|-------------|
| `@pulwave/mcp-core` | ✅ Ready | Base utilities and abstractions |
| `@pulwave/mcp-supabase` | ✅ Ready | Full Supabase database integration |
| `@pulwave/mcp-github` | ✅ Ready | GitHub repository operations |
| `@pulwave/mcp-vercel` | 🚧 Shell | Vercel deployments (awaiting setup) |
| `@pulwave/mcp-stripe` | 🚧 Shell | Stripe payments (awaiting setup) |

## Architecture

All MCP servers follow a consistent pattern:

```
├── src/
│   ├── provider.ts      # Data provider (abstracted API client)
│   ├── tools/           # Tool definitions grouped by domain
│   │   ├── [domain].ts  # Domain-specific tools
│   │   └── index.ts     # Tool exports
│   ├── server.ts        # MCP server implementation
│   ├── cli.ts           # CLI entry point
│   └── index.ts         # Public API
├── package.json
└── tsconfig.json
```

## Building

```bash
# From monorepo root
npm install
npm run build -w packages/mcp/core
npm run build -w packages/mcp/supabase
npm run build -w packages/mcp/github
npm run build -w packages/mcp/vercel
npm run build -w packages/mcp/stripe
```

## Configuration

### Claude Code

Add to your Claude Code MCP settings (see `.claude/mcp-servers.json`):

```json
{
  "mcpServers": {
    "pulwave-supabase": {
      "command": "node",
      "args": ["packages/mcp/supabase/dist/cli.js"],
      "env": {
        "SUPABASE_URL": "your-supabase-url",
        "SUPABASE_ANON_KEY": "your-anon-key"
      }
    }
  }
}
```

### Environment Variables

| Variable | Server | Required | Description |
|----------|--------|----------|-------------|
| `SUPABASE_URL` | supabase | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | supabase | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | supabase | No | Service role key for admin ops |
| `GITHUB_TOKEN` | github | Yes | GitHub personal access token |
| `GITHUB_OWNER` | github | No | Default repository owner |
| `GITHUB_REPO` | github | No | Default repository name |
| `VERCEL_TOKEN` | vercel | Yes | Vercel API token |
| `VERCEL_TEAM_ID` | vercel | No | Team ID for team deployments |
| `STRIPE_SECRET_KEY` | stripe | Yes | Stripe secret key |

## Available Tools

### Supabase (20+ tools)

**Profiles**
- `list_profiles` - List user profiles with filtering
- `get_profile` - Get profile by ID
- `search_profiles` - Search profiles

**Translations**
- `list_translations` - List translations
- `search_translations` - Search by key/value
- `get_missing_translations` - Find translation gaps
- `get_translation_stats` - Translation statistics

**Properties**
- `list_properties` - List properties
- `get_property` - Get property details
- `list_buildings` - List buildings
- `list_leases` - List leases
- `get_property_stats` - Property statistics

**Admin**
- `list_master_data` - List master data
- `list_feature_flags` - List feature flags
- `list_audit_logs` - Query audit logs
- `get_system_config` - Get system config
- `list_locales` - List locales

**Schema**
- `list_tables` - List database tables
- `describe_table` - Get table columns
- `run_query` - Execute read-only SQL
- `get_enum_values` - Get enum values

### GitHub (18 tools)

**Repositories**
- `list_repositories` - List user repositories
- `get_repository` - Get repository details
- `list_branches` - List branches
- `get_branch` - Get branch details
- `list_commits` - List commits

**Pull Requests**
- `list_pull_requests` - List PRs
- `get_pull_request` - Get PR details
- `get_pull_request_diff` - Get PR diff
- `list_pull_request_files` - List changed files
- `list_pull_request_reviews` - List PR reviews

**Issues**
- `list_issues` - List issues
- `get_issue` - Get issue details
- `list_issue_comments` - List comments
- `search_issues` - Search issues/PRs

**Files**
- `get_file_content` - Get file content
- `list_directory` - List directory
- `search_code` - Search code
- `get_tree` - Get file tree

### Vercel (Shell - 9 tools)

- `list_vercel_projects` / `get_vercel_project`
- `list_vercel_deployments` / `get_vercel_deployment` / `get_vercel_deployment_logs`
- `list_vercel_domains` / `get_vercel_domain`
- `list_vercel_env_vars` / `get_vercel_env_var`

### Stripe (Shell - 15 tools)

- `list_stripe_customers` / `get_stripe_customer` / `search_stripe_customers`
- `list_stripe_subscriptions` / `get_stripe_subscription`
- `list_stripe_invoices` / `get_stripe_invoice`
- `list_stripe_payment_intents` / `get_stripe_payment_intent`
- `list_stripe_payment_methods` / `get_stripe_payment_method`
- `list_stripe_products` / `get_stripe_product`
- `list_stripe_prices` / `get_stripe_price`

## Development

### Adding a New Tool

```typescript
import { z, defineReadOnlyTool } from '@pulwave/mcp-core';

export const myTool = defineReadOnlyTool({
    name: 'my_tool_name',
    description: 'What this tool does',
    inputSchema: z.object({
        param: z.string().describe('Parameter description'),
    }),
    handler: async ({ param }) => {
        // Tool implementation
        return { result: 'data' };
    },
});
```

### Tool Annotations

All tools use annotations to describe their behavior:

- `readOnlyHint: true` - Tool only reads data (default for `defineReadOnlyTool`)
- `destructiveHint: false` - Tool doesn't modify data destructively
- `idempotentHint: true` - Safe to call multiple times
- `openWorldHint: true` - May interact with external systems

## License

Private - Pulwave
