# Monorepo Management

## Turborepo

High-performance build system for JavaScript/TypeScript monorepos.

### Core Concepts

1. **Pipelines**: Define how tasks relate (e.g., `build` depends on `^build`).
2. **Caching**: Never do the same work twice. Hash inputs (files) -> Cache outputs (dist/).
3. **Parallel**: Run tasks across all cores.

### turbo.json Example
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": {},
    "test": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Workspace Management (pnpm)

### installation
We use `pnpm` workspaces.
`pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Dependency Rules
* **Dev Dependencies**: Install at root if shared (e.g., Prettier), or in package if specific.
* **Peer Dependencies**: Use for UI libraries (React) in shared packages to avoid duplicate instances.

### Command Cheat Sheet
```bash
# Run 'dev' in all packages parallely
turbo dev

# Run 'build' only for 'web' and its dependencies
turbo build --filter=web...

# Run command in all packages (pnpm native)
pnpm -r run test

# Add dependency to specific workspace
pnpm add axios --filter web
```

## Code Sharing

### Internal Packages
To use `packages/ui` in `apps/web`:
1. `packages/ui/package.json` name: `@pulwave/ui`
2. `apps/web/package.json` dependency: `"@pulwave/ui": "workspace:*"`
3. Implements `main`, `types`, and `exports` in package.json.

### Versioning (Changesets)
1. Developer makes changes.
2. Runs `npx changeset` to create intent file (Major/Minor/Patch).
3. CI detects changeset, automatically creates PR for version bump + Changelog.
4. Merge Version PR -> CI publishes to NPM/Registry.
