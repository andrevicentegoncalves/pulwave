---
name: turborepo
description: Configure Turborepo for monorepo builds with task pipelines, caching, and workspace filtering.
version: 1.0.0
tags: [Turborepo, Monorepo, Build, Caching, Pipeline]
---

# Turborepo Patterns

Configure Turborepo for efficient monorepo builds with proper caching and task dependencies.

## When to Use

- Monorepo build orchestration
- Task dependency management
- Build caching (local + remote)
- Selective workspace runs

## Quick Reference

### turbo.json Structure
```json
{
  "globalDependencies": ["**/.env.*local", ".env"],
  "globalPassThroughEnv": ["NODE_ENV", "CI"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

### Common Commands
```bash
turbo run build              # Build all
turbo run build --filter=@pulwave/ui  # Single package
turbo run dev --filter=apps/*         # All apps
turbo run test --filter=...[HEAD^1]   # Changed since last commit
```

## Task Configuration

| Key | Purpose | Example |
|-----|---------|---------|
| `dependsOn` | Task dependencies | `["^build"]` (deps first) |
| `outputs` | Cached output paths | `["dist/**"]` |
| `inputs` | Cache key inputs | `["src/**"]` |
| `cache` | Enable caching | `false` for dev |
| `persistent` | Long-running | `true` for dev servers |

## Workflow

1. **Define Tasks**: Configure in `turbo.json`
2. **Set Dependencies**: Use `^` for upstream deps
3. **Specify Outputs**: What to cache
4. **Filter Runs**: Use `--filter` for selective runs
5. **Enable Remote**: Optional remote caching

## Scoring (0-10)

- **10**: Full pipeline, remote caching, proper inputs/outputs
- **7**: Basic task config, local caching
- **3**: No caching, no dependencies
- **0**: No Turborepo, manual builds

## Full Compiled Guide

**Category Guide**: [../dev-ops/AGENTS.md](../dev-ops/AGENTS.md) - Complete dev-ops category with all patterns and examples

**Individual AGENTS.md**: [AGENTS.md](./AGENTS.md) - Comprehensive Turborepo configuration guide (50+ patterns)

### What's in AGENTS.md

**Turborepo Fundamentals** (CRITICAL):
- Monorepo vs polyrepo architecture decisions
- Task orchestration across workspaces
- Pipeline configuration best practices
- Workspace structure organization

**Task Configuration** (CRITICAL):
- Task dependencies with dependsOn and ^ syntax
- Outputs and caching configuration
- Inputs for cache keys optimization
- Cache configuration per task
- Persistent tasks for dev servers

**Caching Strategies** (CRITICAL):
- Local caching for fast rebuilds
- Remote caching for team/CI sharing
- Cache hits and misses debugging
- Cache invalidation triggers
- Hashing strategies for optimization

**Workspace Filtering** (CRITICAL):
- Filter syntax (package, glob, directory)
- Changed packages detection with Git
- Dependency filtering (dependencies and dependents)
- App filtering for selective runs
- Git-based filtering for CI

**Pipeline Dependencies** (CRITICAL):
- Upstream dependencies (^) for topological builds
- Downstream dependencies ($) for cleanup
- Topological ordering and execution graph
- Parallel execution for performance

**Environment Variables** (HIGH):
- globalPassThroughEnv for common vars
- globalDependencies for shared config
- .env file handling and security
- Environment variable hashing for cache invalidation

**Performance Optimization** (CRITICAL):
- Parallel execution strategies
- Incremental builds with caching
- Remote caching strategies for teams
- CI/CD optimization techniques

**Monorepo Structure** (HIGH):
- Workspace organization patterns
- Package.json configurations
- npm workspaces integration
- Dependency management best practices

**CI/CD Integration** (CRITICAL):
- GitHub Actions setup with Turborepo
- Remote caching in CI pipelines
- Selective CI runs for changed packages
- Build matrix strategies for testing

**Pulwave Integration** (CRITICAL):
- Pulwave's turbo.json configuration
- Workspace structure (apps/*, packages/*)
- Build pipeline execution order
- Development workflow commands

**Appendices**:
- Complete Turborepo checklist
- Task configuration reference
- Filter syntax cheat sheet
- CI/CD pipeline example

## Additional Resources

- `references/task-configuration.md` - Task setup
- `references/filtering.md` - Workspace filtering
- `references/caching.md` - Cache strategies
