# Task Configuration

## Task Dependencies

### Upstream Dependencies (`^`)
```json
"build": {
  "dependsOn": ["^build"]
}
```
Build dependencies before building package.

### Same-package Dependencies
```json
"test": {
  "dependsOn": ["build"]
}
```
Run build before test in same package.

### No Dependencies
```json
"lint": {
  "dependsOn": []
}
```
Run independently.

## Cache Configuration

### Cacheable Task
```json
"build": {
  "outputs": ["dist/**", ".next/**", "!.next/cache/**"],
  "inputs": [
    "$TURBO_DEFAULT$",
    "!**/*.test.ts"
  ]
}
```

### Non-cacheable Task
```json
"dev": {
  "cache": false,
  "persistent": true
}
```

## Environment Variables

### Pass-through (Available to Task)
```json
"globalPassThroughEnv": ["NODE_ENV", "CI"],
"tasks": {
  "build": {
    "env": ["VITE_*"]
  }
}
```

### Global Dependencies (Invalidate Cache)
```json
"globalDependencies": [
  "**/.env.*local",
  ".env",
  "tsconfig.packages.json"
]
```

## Common Tasks

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "outputs": ["coverage/**"]
    },
    "lint": {
      "inputs": ["$TURBO_DEFAULT$", "eslint.config.js"],
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^typecheck"],
      "outputs": [".tsbuildinfo"]
    }
  }
}
```

## Filtering

```bash
# Single package
turbo run build --filter=@pulwave/ui

# Pattern matching
turbo run build --filter="packages/*"
turbo run build --filter="apps/**"

# Changed packages
turbo run test --filter=...[HEAD^1]
turbo run build --filter=...[main]

# Dependencies of package
turbo run build --filter=...@pulwave/ui
```
