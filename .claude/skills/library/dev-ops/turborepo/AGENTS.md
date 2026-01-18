# Turborepo Patterns - Complete Implementation Guide

> **Abstract**: This guide provides comprehensive patterns for configuring Turborepo in monorepo environments. It covers task pipeline configuration, caching strategies (local and remote), workspace filtering, dependency management, and CI/CD optimization. Each pattern includes incorrect vs correct examples with detailed explanations of why certain approaches fail and how to implement them properly. Special emphasis on Pulwave's Turborepo configuration with React 19, Vite 7, and npm workspaces.

---

## Table of Contents

1. [Turborepo Fundamentals](#1-turborepo-fundamentals)
   - 1.1 [Monorepo vs Polyrepo](#11-monorepo-vs-polyrepo)
   - 1.2 [Task Orchestration](#12-task-orchestration)
   - 1.3 [Pipeline Configuration](#13-pipeline-configuration)
   - 1.4 [Workspace Structure](#14-workspace-structure)

2. [Task Configuration](#2-task-configuration)
   - 2.1 [Task Dependencies (dependsOn)](#21-task-dependencies-dependson)
   - 2.2 [Outputs and Caching](#22-outputs-and-caching)
   - 2.3 [Inputs for Cache Keys](#23-inputs-for-cache-keys)
   - 2.4 [Cache Configuration](#24-cache-configuration)
   - 2.5 [Persistent Tasks](#25-persistent-tasks)

3. [Caching Strategies](#3-caching-strategies)
   - 3.1 [Local Caching](#31-local-caching)
   - 3.2 [Remote Caching](#32-remote-caching)
   - 3.3 [Cache Hits and Misses](#33-cache-hits-and-misses)
   - 3.4 [Cache Invalidation](#34-cache-invalidation)
   - 3.5 [Hashing Strategies](#35-hashing-strategies)

4. [Workspace Filtering](#4-workspace-filtering)
   - 4.1 [Filter Syntax](#41-filter-syntax)
   - 4.2 [Changed Packages Detection](#42-changed-packages-detection)
   - 4.3 [Dependency Filtering](#43-dependency-filtering)
   - 4.4 [App Filtering](#44-app-filtering)
   - 4.5 [Git-Based Filtering](#45-git-based-filtering)

5. [Pipeline Dependencies](#5-pipeline-dependencies)
   - 5.1 [Upstream Dependencies (^)](#51-upstream-dependencies-)
   - 5.2 [Downstream Dependencies](#52-downstream-dependencies)
   - 5.3 [Topological Ordering](#53-topological-ordering)
   - 5.4 [Parallel Execution](#54-parallel-execution)

6. [Environment Variables](#6-environment-variables)
   - 6.1 [globalPassThroughEnv](#61-globalpassthroughenv)
   - 6.2 [globalDependencies](#62-globaldependencies)
   - 6.3 [.env File Handling](#63-env-file-handling)
   - 6.4 [Environment Variable Hashing](#64-environment-variable-hashing)

7. [Performance Optimization](#7-performance-optimization)
   - 7.1 [Parallel Execution](#71-parallel-execution)
   - 7.2 [Incremental Builds](#72-incremental-builds)
   - 7.3 [Remote Caching Strategies](#73-remote-caching-strategies)
   - 7.4 [CI/CD Optimization](#74-cicd-optimization)

8. [Monorepo Structure](#8-monorepo-structure)
   - 8.1 [Workspace Organization](#81-workspace-organization)
   - 8.2 [Package.json Configurations](#82-packagejson-configurations)
   - 8.3 [npm Workspaces Integration](#83-npm-workspaces-integration)
   - 8.4 [Dependency Management](#84-dependency-management)

9. [CI/CD Integration](#9-cicd-integration)
   - 9.1 [GitHub Actions Setup](#91-github-actions-setup)
   - 9.2 [Remote Caching in CI](#92-remote-caching-in-ci)
   - 9.3 [Selective CI Runs](#93-selective-ci-runs)
   - 9.4 [Build Matrix Strategies](#94-build-matrix-strategies)

10. [Pulwave Integration](#10-pulwave-integration)
    - 10.1 [Pulwave turbo.json Configuration](#101-pulwave-turbojson-configuration)
    - 10.2 [Workspace Structure](#102-workspace-structure)
    - 10.3 [Build Pipeline](#103-build-pipeline)
    - 10.4 [Development Workflow](#104-development-workflow)

11. [Appendices](#11-appendices)
    - [Appendix A: Complete Turborepo Checklist](#appendix-a-complete-turborepo-checklist)
    - [Appendix B: Task Configuration Reference](#appendix-b-task-configuration-reference)
    - [Appendix C: Filter Syntax Cheat Sheet](#appendix-c-filter-syntax-cheat-sheet)
    - [Appendix D: CI/CD Pipeline Example](#appendix-d-cicd-pipeline-example)

---

## 1. Turborepo Fundamentals

### 1.1 Monorepo vs Polyrepo

**Impact**: CRITICAL - Architectural decision affecting developer experience and build performance

**Why**: Understanding when to use a monorepo vs multiple repositories is critical. Turborepo excels at managing monorepos with shared dependencies and coordinated builds.

**Incorrect**:
```json
// ❌ Using Turborepo for a single application
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "build": "turbo run build"
  }
}

// Problem: Turborepo overhead without benefits
// No shared dependencies, no task orchestration needed
```

**Correct**:
```json
// ✅ Turborepo for monorepo with multiple packages
{
  "name": "pulwave-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test"
  }
}

// Benefits:
// 1. Shared dependencies (React, TypeScript)
// 2. Coordinated builds with proper ordering
// 3. Caching across all packages
// 4. Parallel execution where possible
```

**When to use Monorepo**:
- Multiple related packages
- Shared dependencies
- Coordinated releases
- Cross-package refactoring

**When to use Polyrepo**:
- Independent services
- Different release cycles
- Separate teams
- Distinct tech stacks

---

### 1.2 Task Orchestration

**Impact**: CRITICAL - Core Turborepo functionality for coordinating tasks

**Why**: Turborepo orchestrates tasks across workspaces, ensuring proper execution order and parallelization.

**Incorrect**:
```bash
# ❌ Manual task orchestration
cd packages/ui && npm run build
cd packages/data && npm run build
cd packages/features && npm run build
cd apps/web/real-estate && npm run build

# Problems:
# 1. No parallelization
# 2. Manual dependency tracking
# 3. No caching
# 4. Error-prone ordering
```

**Correct**:
```bash
# ✅ Turborepo task orchestration
turbo run build

# Turborepo automatically:
# 1. Builds in topological order (dependencies first)
# 2. Parallelizes independent tasks
# 3. Caches results
# 4. Skips unchanged packages
```

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    }
  }
}

// The ^ symbol means "run build in dependencies first"
// Turborepo creates execution graph:
// foundation → ui → data → features → experience → apps
```

---

### 1.3 Pipeline Configuration

**Impact**: CRITICAL - Defines how tasks execute across the monorepo

**Why**: Proper pipeline configuration ensures correct build order, optimal caching, and fast builds.

**Incorrect**:
```json
// ❌ No task configuration
{
  "tasks": {}
}

// Problems:
// 1. No caching
// 2. No dependency tracking
// 3. No parallelization
// 4. No output specification
```

**Correct**:
```json
// ✅ Complete pipeline configuration
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "**/.env.*local",
    ".env"
  ],
  "globalPassThroughEnv": [
    "NODE_ENV",
    "CI",
    "VITE_*"
  ],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"],
      "env": ["NODE_ENV"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**", "tests/**", "vitest.config.ts"]
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}

// This configuration:
// 1. Defines all tasks with proper dependencies
// 2. Specifies what to cache (outputs)
// 3. Sets environment variables
// 4. Disables caching for dev servers
```

---

### 1.4 Workspace Structure

**Impact**: CRITICAL - Foundation for monorepo organization

**Why**: Proper workspace structure enables clean separation of concerns and efficient builds.

**Incorrect**:
```
monorepo/
├── components/          # ❌ Flat structure
├── utils/
├── services/
├── app1/
├── app2/
└── shared/

Problems:
1. No clear hierarchy
2. Difficult to filter
3. Unclear dependencies
4. Hard to scale
```

**Correct**:
```
pulwave/
├── apps/                # ✅ Top-level applications
│   └── web/
│       ├── real-estate/
│       └── restaurant/
├── packages/            # ✅ Shared packages
│   ├── foundation/      # Layer 1: Design tokens, utils
│   ├── data/            # Layer 2: Data layer
│   ├── ui/              # Layer 3: UI components
│   ├── patterns/        # Layer 4: Layout patterns
│   ├── features/        # Layer 5: Feature packages
│   ├── experience/      # Layer 6: Page assemblies
│   ├── tooling/         # Shared configs
│   └── internal/        # Internal packages
└── turbo.json

Benefits:
1. Clear hierarchy (apps vs packages)
2. Easy filtering (--filter=apps/*)
3. Explicit dependencies
4. Scalable structure
```

---

## 2. Task Configuration

### 2.1 Task Dependencies (dependsOn)

**Impact**: CRITICAL - Ensures tasks run in correct order

**Why**: Task dependencies define the execution graph. Incorrect dependencies cause build failures or unnecessary work.

**Incorrect**:
```json
// ❌ No dependencies specified
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    },
    "test": {
      "outputs": ["coverage/**"]
    }
  }
}

// Problems:
// 1. Tests might run before build completes
// 2. Build might use stale dependencies
// 3. No guaranteed execution order
```

**Correct**:
```json
// ✅ Proper dependencies
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}

// Dependency syntax:
// "^build" = Run build in dependencies first (topological)
// "build" = Run build in this package first (sequential)
// ["^build", "lint"] = Multiple dependencies
```

**Dependency Types**:
```json
{
  "tasks": {
    // Topological dependency (^)
    "build": {
      "dependsOn": ["^build"]
      // foundation:build → ui:build → features:build
    },

    // Sequential dependency (same package)
    "test": {
      "dependsOn": ["build"]
      // ui:build → ui:test
    },

    // Multiple dependencies
    "e2e": {
      "dependsOn": ["^build", "build", "test"]
      // deps:build → this:build → this:test → this:e2e
    }
  }
}
```

---

### 2.2 Outputs and Caching

**Impact**: CRITICAL - Determines what gets cached for fast rebuilds

**Why**: Correct output specification is essential for caching. Missing outputs mean cache misses; extra outputs waste space.

**Incorrect**:
```json
// ❌ No outputs specified
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
      // No outputs = no caching!
    }
  }
}

// ❌ Overly broad outputs
{
  "tasks": {
    "build": {
      "outputs": ["**"]
      // Caches everything including node_modules, .git, etc.
    }
  }
}
```

**Correct**:
```json
// ✅ Specific outputs for each task
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        "dist/**",
        ".next/**",
        "build/**",
        "*.tsbuildinfo"
      ]
    },
    "test": {
      "outputs": [
        "coverage/**",
        ".vitest/**"
      ]
    },
    "lint": {
      "outputs": []
      // No outputs = still cached based on inputs
    }
  }
}

// Output patterns:
// - dist/** = All files in dist directory
// - *.tsbuildinfo = TypeScript build info
// - .next/** = Next.js build output
// - coverage/** = Test coverage reports
```

---

### 2.3 Inputs for Cache Keys

**Impact**: HIGH - Fine-tunes cache invalidation

**Why**: By default, Turborepo hashes all files. Specifying inputs improves cache hits by ignoring irrelevant files.

**Incorrect**:
```json
// ❌ No inputs specified (default behavior)
{
  "tasks": {
    "test": {
      "outputs": ["coverage/**"]
      // Hashes ALL files, including README.md, docs, etc.
      // Cache invalidates unnecessarily
    }
  }
}
```

**Correct**:
```json
// ✅ Specific inputs for better caching
{
  "tasks": {
    "test": {
      "inputs": [
        "src/**",
        "tests/**",
        "*.test.ts",
        "vitest.config.ts",
        "tsconfig.json"
      ],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "inputs": [
        "src/**",
        "eslint.config.js",
        ".eslintrc.json"
      ],
      "outputs": []
    },
    "build": {
      "inputs": [
        "src/**",
        "public/**",
        "vite.config.ts",
        "tsconfig.json",
        "package.json"
      ],
      "outputs": ["dist/**"]
    }
  }
}

// Benefits:
// 1. README changes don't invalidate tests
// 2. Documentation changes don't trigger rebuilds
// 3. Better cache hit rates
```

---

### 2.4 Cache Configuration

**Impact**: HIGH - Controls caching behavior per task

**Why**: Some tasks should never be cached (dev servers), while others benefit from aggressive caching.

**Incorrect**:
```json
// ❌ Caching dev server
{
  "tasks": {
    "dev": {
      "persistent": true
      // cache: true by default
      // Dev server gets cached and never restarts!
    }
  }
}
```

**Correct**:
```json
// ✅ Proper cache configuration
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
      // Never cache dev servers
    },
    "build": {
      "cache": true,
      "outputs": ["dist/**"]
      // Always cache builds
    },
    "test": {
      "cache": true,
      "outputs": ["coverage/**"]
      // Cache test results
    },
    "clean": {
      "cache": false
      // Never cache cleanup tasks
    }
  }
}

// Cache rules:
// - cache: false = Never cache (dev, clean, watch)
// - cache: true = Always cache (build, test, lint)
// - Default is true if outputs exist
```

---

### 2.5 Persistent Tasks

**Impact**: CRITICAL - For long-running processes like dev servers

**Why**: Persistent tasks run continuously (dev servers, watchers). Turborepo must know to keep them running.

**Incorrect**:
```json
// ❌ Dev server without persistent flag
{
  "tasks": {
    "dev": {
      "cache": false
      // Turborepo waits for task to complete
      // Dev server blocks other tasks!
    }
  }
}
```

**Correct**:
```json
// ✅ Persistent dev tasks
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
      // Turborepo knows this task runs indefinitely
      // Other tasks can start in parallel
    },
    "watch": {
      "cache": false,
      "persistent": true
    },
    "start": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["build"]
    }
  }
}

// Persistent task examples:
// - dev = Development server (Vite, Next.js)
// - watch = File watcher (TypeScript, Tailwind)
// - start = Production server
// - storybook = Storybook dev server
```

---

## 3. Caching Strategies

### 3.1 Local Caching

**Impact**: CRITICAL - Primary mechanism for fast local builds

**Why**: Local caching stores build outputs on disk. Subsequent builds with identical inputs restore from cache instantly.

**How it works**:
```
1. Task runs with inputs (src files, config)
2. Turborepo hashes inputs → cache key
3. Outputs written to node_modules/.cache/turbo/
4. Next run with same inputs → cache hit
5. Outputs restored from cache (no rebuild)
```

**Incorrect**:
```json
// ❌ No outputs specified = no caching
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}

// ❌ Outputs in .gitignore but not in turbo.json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
      // But dist/ is in .gitignore
      // Cache works but not committed
    }
  }
}
```

**Correct**:
```json
// ✅ Proper local caching
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "*.tsbuildinfo"],
      "inputs": ["src/**", "vite.config.ts"]
    }
  }
}

// Cache location:
// node_modules/.cache/turbo/[task-hash]/
// ├── .turbo/
// │   ├── turbo-build.log
// │   └── outputs.json
// └── dist/
//     └── [cached files]
```

**Cache verification**:
```bash
# First run - no cache
turbo run build
# >>> FULL TURBO
# Build takes 30s

# Second run - cache hit
turbo run build
# >>> cache hit, replaying output
# Build takes 0.1s

# Force cache bypass
turbo run build --force
# >>> FULL TURBO (ignores cache)
```

---

### 3.2 Remote Caching

**Impact**: HIGH - Shared caching across team and CI

**Why**: Remote caching allows team members and CI to share build artifacts, dramatically speeding up builds.

**Incorrect**:
```json
// ❌ No remote cache configured
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}

// CI and developers rebuild from scratch every time
```

**Correct**:
```json
// ✅ Remote cache setup (Vercel)
{
  "remoteCache": {
    "signature": true
  },
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}
```

```bash
# Login to Vercel for remote caching
npx turbo login

# Link project
npx turbo link

# Now builds use remote cache
turbo run build
# >>> Remote cache hit from CI build
```

**Self-hosted remote cache**:
```json
// .turbo/config.json
{
  "teamId": "my-team",
  "apiUrl": "https://cache.example.com"
}
```

```typescript
// Custom cache server (S3, CloudFlare R2)
import { createServer } from 'turbo-cache-server';

createServer({
  storage: {
    type: 's3',
    bucket: 'my-turbo-cache',
    region: 'us-east-1'
  }
});
```

---

### 3.3 Cache Hits and Misses

**Impact**: HIGH - Understanding cache behavior for debugging

**Why**: Cache misses slow down builds. Understanding why caches miss helps optimize configuration.

**Cache hit indicators**:
```bash
turbo run build

# Cache hit
# >>> cache hit, replaying output [packages/ui:build]
# Build: 0.1s (from cache)

# Cache miss
# >>> cache miss, executing [packages/ui:build]
# Build: 30s
```

**Common cache miss causes**:
1. **Input files changed**
```bash
# Edit src/Button.tsx
turbo run build
# >>> cache miss (expected)
```

2. **Environment variables changed**
```json
{
  "tasks": {
    "build": {
      "env": ["NODE_ENV", "API_URL"]
    }
  }
}
```
```bash
API_URL=different turbo run build
# >>> cache miss (env changed)
```

3. **Dependency changes**
```bash
npm install new-package
turbo run build
# >>> cache miss (package.json changed)
```

4. **Global dependencies changed**
```json
{
  "globalDependencies": [".env"]
}
```
```bash
# Edit .env file
turbo run build
# >>> cache miss for ALL tasks
```

---

### 3.4 Cache Invalidation

**Impact**: CRITICAL - Ensuring fresh builds when needed

**Why**: Stale caches cause bugs. Proper invalidation strategies prevent this.

**Incorrect**:
```json
// ❌ Missing environment variables in config
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
      // Changing API_URL doesn't invalidate cache!
    }
  }
}
```

**Correct**:
```json
// ✅ Explicit cache invalidation triggers
{
  "globalDependencies": [
    "**/.env.*local",
    ".env",
    "tsconfig.json"
  ],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "VITE_API_URL"],
      "inputs": [
        "src/**",
        "public/**",
        "vite.config.ts",
        "package.json"
      ]
    }
  }
}

// Cache invalidates when:
// 1. Any globalDependencies change
// 2. Any env variables in "env" change
// 3. Any files matching "inputs" change
// 4. Dependencies build outputs change
```

**Manual cache invalidation**:
```bash
# Force bypass cache
turbo run build --force

# Clear entire cache
rm -rf node_modules/.cache/turbo

# Clear specific package cache
turbo run build --filter=@pulwave/ui --force
```

---

### 3.5 Hashing Strategies

**Impact**: MEDIUM - Advanced cache optimization

**Why**: Turborepo uses Git-based hashing by default. Understanding hashing helps debug cache issues.

**Default hashing** (Git-based):
```bash
# Turborepo hashes:
# 1. Git index (tracked files)
# 2. Environment variables
# 3. Task configuration
# 4. External dependencies

# Not included in hash:
# - Untracked files
# - .gitignore files
# - node_modules (except package.json)
```

**Custom hashing**:
```json
{
  "tasks": {
    "build": {
      "inputs": [
        "src/**",
        "!src/**/*.test.ts",
        "!src/**/*.stories.ts"
      ],
      "outputs": ["dist/**"]
    }
  }
}

// Inputs support negation:
// !src/**/*.test.ts = Exclude test files from hash
```

**Debugging hashes**:
```bash
# Show hash for each task
turbo run build --dry-run

# Output:
# Packages in scope: @pulwave/ui, @pulwave/data
# Tasks to Run:
# @pulwave/ui#build
#   Hash: 7a3f2d1c
#   Cached: false
#   Directory: packages/ui
```

---

## 4. Workspace Filtering

### 4.1 Filter Syntax

**Impact**: CRITICAL - Selective task execution for development and CI

**Why**: Filtering allows running tasks on specific packages, dramatically speeding up development and CI.

**Incorrect**:
```bash
# ❌ No filtering - runs all packages
turbo run build
# Builds 50+ packages when you only changed 1
```

**Correct**:
```bash
# ✅ Filter by package name
turbo run build --filter=@pulwave/ui

# ✅ Filter by glob pattern
turbo run build --filter='@pulwave/*'

# ✅ Filter by directory
turbo run build --filter='./packages/ui'

# ✅ Multiple filters
turbo run build --filter=@pulwave/ui --filter=@pulwave/data
```

**Filter syntax reference**:
```bash
# Exact package
--filter=@pulwave/ui

# Glob pattern
--filter='@pulwave/*'
--filter='apps/*'

# Directory
--filter='./packages/ui'

# Exclude
--filter='!@pulwave/ui'

# Multiple filters (OR)
--filter=@pulwave/ui --filter=@pulwave/data
```

---

### 4.2 Changed Packages Detection

**Impact**: CRITICAL - Essential for efficient CI builds

**Why**: Only build packages that changed since last deployment. Saves time and resources.

**Incorrect**:
```bash
# ❌ Always build everything
turbo run build
# CI rebuilds all 50 packages every time
```

**Correct**:
```bash
# ✅ Build only changed packages
turbo run build --filter='...[HEAD^1]'
# Builds packages changed since last commit

# ✅ Since specific commit
turbo run build --filter='...[abc123]'

# ✅ Since main branch
turbo run build --filter='...[origin/main]'

# ✅ In CI (changed since last successful deploy)
turbo run build --filter='...[origin/main]'
```

**Filter syntax for changes**:
```bash
# Since last commit
--filter='...[HEAD^1]'

# Since specific commit
--filter='...[abc123]'

# Since branch
--filter='...[origin/main]'

# Changed files in working directory
--filter='...[HEAD]'

# With dependencies
--filter='...[HEAD^1]...'
```

---

### 4.3 Dependency Filtering

**Impact**: CRITICAL - Include dependencies in filtered builds

**Why**: When filtering, you often need to include packages that depend on or are depended on by the filtered package.

**Incorrect**:
```bash
# ❌ Build only the package, ignore dependencies
turbo run build --filter=@pulwave/features-profile
# Fails because @pulwave/ui dependency isn't built
```

**Correct**:
```bash
# ✅ Include dependencies (everything the package depends on)
turbo run build --filter=...@pulwave/features-profile
# Builds: foundation → ui → data → features-profile

# ✅ Include dependents (everything that depends on this package)
turbo run build --filter=@pulwave/ui...
# Builds: ui → features → experience → apps

# ✅ Include both dependencies and dependents
turbo run build --filter=...@pulwave/ui...
# Builds: foundation → ui → features → experience → apps
```

**Dependency filter syntax**:
```bash
# Include dependencies (^)
--filter='...@pulwave/ui'
# foundation → data → ui

# Include dependents ($)
--filter='@pulwave/ui...'
# ui → features → experience → apps

# Include both
--filter='...@pulwave/ui...'
# foundation → ui → features → experience → apps

# Changed packages + dependencies
--filter='...[HEAD^1]...'
# All changed packages and their dependencies
```

---

### 4.4 App Filtering

**Impact**: HIGH - Development workflow optimization

**Why**: During development, you often want to run only one app and its dependencies.

**Incorrect**:
```bash
# ❌ Start all apps
npm run dev
# Starts real-estate app AND restaurant app
# Uses double the resources
```

**Correct**:
```bash
# ✅ Run specific app with dependencies
turbo run dev --filter=@pulwave/real-estate...
# Only starts real-estate app + required packages

# ✅ Run all apps (glob)
turbo run dev --filter='apps/*'

# ✅ Run specific app without dependencies
turbo run dev --filter=@pulwave/real-estate
```

**App filtering examples**:
```bash
# Development: Single app + deps
turbo run dev --filter=...@pulwave/real-estate

# Build: All apps
turbo run build --filter='apps/*'

# Test: Specific app
turbo run test --filter=@pulwave/real-estate

# Lint: All apps
turbo run lint --filter='apps/*'
```

**Package.json script**:
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:real-estate": "turbo run dev --filter=...@pulwave/real-estate",
    "dev:restaurant": "turbo run dev --filter=...@pulwave/restaurant",
    "build": "turbo run build --filter='apps/*'"
  }
}
```

---

### 4.5 Git-Based Filtering

**Impact**: CRITICAL - CI/CD optimization for monorepos

**Why**: In CI, only test and build packages affected by the PR. Dramatically reduces CI time.

**Incorrect**:
```yaml
# ❌ Always run all tests in CI
- name: Test
  run: turbo run test
  # Tests all 50 packages even for 1-line change
```

**Correct**:
```yaml
# ✅ Test only changed packages
- name: Test
  run: turbo run test --filter='...[origin/main]'
  # Only tests packages changed since main
```

**Git-based filter patterns**:
```bash
# Changed since main
turbo run test --filter='...[origin/main]'

# Changed in PR (GitHub Actions)
turbo run test --filter='...[origin/main...HEAD]'

# Changed + dependencies
turbo run build --filter='...[origin/main]...'

# Changed + dependents
turbo run test --filter='[origin/main]...'

# All affected (changed + deps + dependents)
turbo run test --filter='...[origin/main]...'
```

**GitHub Actions example**:
```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Need full history for git filter

      - name: Test changed packages
        run: |
          turbo run test \
            --filter='...[origin/main]' \
            --continue
```

---

## 5. Pipeline Dependencies

### 5.1 Upstream Dependencies (^)

**Impact**: CRITICAL - Ensures dependencies build before dependents

**Why**: The `^` symbol means "run this task in dependencies first". Essential for topological builds.

**Incorrect**:
```json
// ❌ No upstream dependencies
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
      // features-profile tries to import @pulwave/ui
      // But @pulwave/ui hasn't built yet!
    }
  }
}
```

**Correct**:
```json
// ✅ Upstream dependencies with ^
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}

// Execution order:
// 1. foundation:build (no deps)
// 2. ui:build (depends on foundation)
// 3. data:build (depends on foundation)
// 4. features:build (depends on ui + data)
// 5. experience:build (depends on features)
// 6. apps:build (depends on experience)
```

**How `^` works**:
```json
{
  "tasks": {
    // ^ means "in dependencies"
    "build": {
      "dependsOn": ["^build"]
      // Before building this package,
      // run "build" in all its dependencies
    },

    // Without ^ means "in this package"
    "test": {
      "dependsOn": ["build"]
      // Before running test,
      // run build in THIS package
    }
  }
}
```

---

### 5.2 Downstream Dependencies

**Impact**: MEDIUM - Less common than upstream, but useful for cleanup tasks

**Why**: Sometimes you need to run a task AFTER dependents finish (cleanup, aggregation).

**Example**:
```json
{
  "tasks": {
    "clean": {
      "dependsOn": ["$clean"]
      // $ means "in dependents"
      // Clean dependents first, then this package
    },
    "aggregate-coverage": {
      "dependsOn": ["$test"]
      // Run tests in dependents, then aggregate
    }
  }
}
```

**Use cases**:
- Cleanup tasks (clean from leaves to root)
- Aggregation (collect data from dependents)
- Deployment (deploy leaves before root)

---

### 5.3 Topological Ordering

**Impact**: CRITICAL - Correct build order in monorepos

**Why**: Turborepo automatically orders tasks based on package dependencies. Understanding this is essential.

**Package dependencies**:
```json
// packages/features/profile/package.json
{
  "name": "@pulwave/features-profile",
  "dependencies": {
    "@pulwave/ui": "workspace:*",
    "@pulwave/data": "workspace:*"
  }
}

// Dependency graph:
// foundation
// ├── ui
// │   └── features-profile
// └── data
//     └── features-profile
```

**Topological order**:
```bash
turbo run build

# Turborepo executes in order:
# 1. foundation:build (no deps)
# 2. ui:build & data:build (parallel, both depend on foundation)
# 3. features-profile:build (depends on ui & data)
```

**Visualizing the graph**:
```bash
# Generate dependency graph
turbo run build --graph
# Opens visualization in browser

# Generate dot file
turbo run build --graph=graph.dot
# Convert to image: dot -Tpng graph.dot -o graph.png
```

---

### 5.4 Parallel Execution

**Impact**: CRITICAL - Maximizes build performance

**Why**: Turborepo parallelizes tasks that don't depend on each other. Understanding parallelization helps optimize builds.

**Incorrect**:
```json
// ❌ Artificial sequential dependencies
{
  "tasks": {
    "lint": {
      "dependsOn": ["build"]
      // Lint doesn't need build!
      // Runs sequentially for no reason
    }
  }
}
```

**Correct**:
```json
// ✅ Minimal dependencies for max parallelization
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {
      "outputs": []
      // No dependencies = runs in parallel with build
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
      // Needs upstream builds, but can run parallel with local build
    }
  }
}
```

**Parallel execution example**:
```bash
turbo run build lint typecheck

# Execution plan:
# Time 0s:  foundation:build, foundation:lint, foundation:typecheck (parallel)
# Time 10s: ui:build, ui:lint, data:build, data:lint (parallel)
# Time 20s: ui:typecheck, data:typecheck (parallel)
# Time 30s: features:build, features:lint, features:typecheck (parallel)
```

**Controlling concurrency**:
```bash
# Limit parallel tasks
turbo run build --concurrency=4

# Run one at a time
turbo run build --concurrency=1

# Use all CPU cores (default)
turbo run build
```

---

## 6. Environment Variables

### 6.1 globalPassThroughEnv

**Impact**: CRITICAL - Environment variables available to all tasks

**Why**: Some environment variables should be available to all tasks (NODE_ENV, CI). Others should be explicit per task.

**Incorrect**:
```json
// ❌ No passthrough env
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}

// NODE_ENV not available in build
// Build outputs development code in production
```

**Correct**:
```json
// ✅ Global passthrough for common vars
{
  "globalPassThroughEnv": [
    "NODE_ENV",
    "CI",
    "VERCEL",
    "GITHUB_ACTIONS"
  ],
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}

// All tasks have access to:
// - process.env.NODE_ENV
// - process.env.CI
// - process.env.VERCEL
// - process.env.GITHUB_ACTIONS
```

**Wildcard patterns**:
```json
{
  "globalPassThroughEnv": [
    "NODE_ENV",
    "VITE_*",
    "NEXT_PUBLIC_*"
  ]
}

// All VITE_* and NEXT_PUBLIC_* vars available
// Example: VITE_API_URL, NEXT_PUBLIC_SITE_URL
```

---

### 6.2 globalDependencies

**Impact**: CRITICAL - Files that invalidate ALL caches when changed

**Why**: Some files affect all packages (.env, tsconfig.json). Changes should invalidate all caches.

**Incorrect**:
```json
// ❌ No global dependencies
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}

// .env changes don't invalidate cache
// All packages use stale environment!
```

**Correct**:
```json
// ✅ Global dependencies for shared config
{
  "globalDependencies": [
    "**/.env.*local",
    ".env",
    "tsconfig.json",
    "package-lock.json"
  ],
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}

// When any globalDependencies change:
// - All caches invalidate
// - All tasks re-run
```

**Common global dependencies**:
```json
{
  "globalDependencies": [
    // Environment files
    "**/.env.*local",
    ".env",
    ".env.local",

    // TypeScript config
    "tsconfig.json",
    "tsconfig.*.json",

    // Package lock
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",

    // Build tools
    "vite.config.ts",
    "turbo.json"
  ]
}
```

---

### 6.3 .env File Handling

**Impact**: HIGH - Proper environment variable management

**Why**: .env files need special handling for caching and security.

**Incorrect**:
```bash
# ❌ .env in version control
git add .env
git commit -m "Add env file"
# Secrets exposed in git history!
```

**Correct**:
```bash
# ✅ .env in .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
```

```json
// turbo.json
{
  "globalDependencies": [
    "**/.env.*local"
  ],
  "globalPassThroughEnv": [
    "NODE_ENV",
    "VITE_*"
  ]
}
```

**.env file structure**:
```bash
# .env.example (committed)
VITE_API_URL=https://api.example.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# .env.local (not committed)
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=actual-secret-key
```

---

### 6.4 Environment Variable Hashing

**Impact**: HIGH - Cache invalidation when env changes

**Why**: Environment variables affect build outputs. Changes should invalidate cache.

**Incorrect**:
```json
// ❌ Env vars not in hash
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
      // Uses process.env.API_URL but doesn't declare it
      // Cache doesn't invalidate when API_URL changes!
    }
  }
}
```

**Correct**:
```json
// ✅ Explicit env vars in task config
{
  "tasks": {
    "build": {
      "env": ["NODE_ENV", "VITE_API_URL"],
      "outputs": ["dist/**"]
    }
  }
}

// Cache key includes:
// - Input files
// - NODE_ENV value
// - VITE_API_URL value
// Changing API_URL invalidates cache
```

**Wildcard env vars**:
```json
{
  "globalPassThroughEnv": ["VITE_*"],
  "tasks": {
    "build": {
      "env": ["VITE_*"],
      "outputs": ["dist/**"]
    }
  }
}

// Any VITE_* change invalidates cache
```

---

## 7. Performance Optimization

### 7.1 Parallel Execution

**Impact**: CRITICAL - Maximizes CPU utilization

**Why**: Turborepo can run multiple tasks in parallel. Proper configuration is essential for fast builds.

**Metrics**:
```bash
# Before optimization (sequential)
turbo run build
# Total: 120s

# After optimization (parallel)
turbo run build
# Total: 30s (4x faster)
```

**Optimization techniques**:
```json
{
  "tasks": {
    // Independent tasks run in parallel
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

```bash
# Run multiple tasks
turbo run lint typecheck test
# All run in parallel across packages
```

**Concurrency control**:
```bash
# Default: Use all CPU cores
turbo run build

# Limit to 4 parallel tasks
turbo run build --concurrency=4

# Serial execution (debugging)
turbo run build --concurrency=1
```

---

### 7.2 Incremental Builds

**Impact**: CRITICAL - Only rebuild what changed

**Why**: Incremental builds leverage caching to skip unchanged packages.

**Before**:
```bash
# Without Turborepo
npm run build
# Builds all 50 packages: 120s
```

**After**:
```bash
# With Turborepo
turbo run build
# First run: 120s (cold cache)
# Second run: 1s (cache hit for all)
# After change to 1 package: 5s (cache hit for 49, rebuild 1)
```

**Incremental configuration**:
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "*.tsbuildinfo"],
      "inputs": ["src/**"]
    }
  }
}
```

```bash
# Change one file
echo "// comment" >> packages/ui/src/Button.tsx

# Only ui package rebuilds
turbo run build
# >>> cache hit [packages/foundation:build]
# >>> cache hit [packages/data:build]
# >>> cache miss [packages/ui:build]
# >>> cache hit [packages/features:build]
# Total: 2s instead of 120s
```

---

### 7.3 Remote Caching Strategies

**Impact**: HIGH - Share caches across team and CI

**Why**: Remote caching prevents redundant builds across the team and CI.

**Setup (Vercel)**:
```bash
# One-time setup
npx turbo login
npx turbo link
```

```json
// turbo.json
{
  "remoteCache": {
    "signature": true
  }
}
```

**Workflow**:
```bash
# Developer A builds
turbo run build
# Uploads to remote cache

# Developer B (same code)
turbo run build
# Downloads from remote cache (instant)

# CI builds
turbo run build
# Reuses remote cache from Dev A
```

**Self-hosted cache**:
```typescript
// cache-server.ts
import { createServer } from 'turbo-remote-cache';

createServer({
  storage: {
    type: 's3',
    bucket: process.env.CACHE_BUCKET,
    region: 'us-east-1'
  },
  auth: {
    type: 'token',
    secret: process.env.CACHE_SECRET
  }
});
```

---

### 7.4 CI/CD Optimization

**Impact**: CRITICAL - Fast CI builds for rapid iteration

**Why**: CI/CD is often the bottleneck. Turborepo can reduce CI time by 10x.

**Incorrect**:
```yaml
# ❌ Slow CI: No caching, builds everything
- name: Build
  run: npm run build
  # 50 packages × 2 minutes = 100 minutes
```

**Correct**:
```yaml
# ✅ Fast CI: Caching + filtering
- name: Build
  run: |
    turbo run build \
      --filter='...[origin/main]' \
      --remote-cache-read-only=true
  # Only changed packages: 5 minutes
```

**Full CI example**:
```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install
        run: npm ci

      - name: Build
        run: |
          turbo run build \
            --filter='...[origin/main]' \
            --concurrency=4
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

      - name: Test
        run: |
          turbo run test \
            --filter='...[origin/main]' \
            --concurrency=4
```

**CI optimizations**:
1. Remote cache (Vercel or self-hosted)
2. Filter to changed packages (`--filter='...[origin/main]'`)
3. Parallel execution (`--concurrency=4`)
4. npm cache (`actions/setup-node` with `cache: 'npm'`)

---

## 8. Monorepo Structure

### 8.1 Workspace Organization

**Impact**: CRITICAL - Foundation of monorepo architecture

**Why**: Proper organization enables clean dependencies and efficient builds.

**Incorrect**:
```
monorepo/
├── component1/
├── component2/
├── utils/
├── app/
└── shared/

Problems:
- Flat structure
- No hierarchy
- Unclear dependencies
```

**Correct**:
```
pulwave/
├── apps/
│   └── web/
│       ├── real-estate/
│       └── restaurant/
├── packages/
│   ├── foundation/
│   ├── data/
│   ├── ui/
│   ├── patterns/
│   ├── features/
│   ├── experience/
│   ├── tooling/
│   └── internal/
└── turbo.json

Benefits:
- Clear hierarchy
- Easy filtering (apps/*, packages/*)
- Explicit dependencies
- Scalable
```

---

### 8.2 Package.json Configurations

**Impact**: CRITICAL - Workspace coordination

**Why**: Root package.json coordinates workspaces. Package package.json defines dependencies.

**Root package.json**:
```json
{
  "name": "pulwave-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.7.0",
    "typescript": "^5.7.0"
  }
}
```

**Package package.json**:
```json
{
  "name": "@pulwave/features-profile",
  "version": "0.1.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies": {
    "@pulwave/ui": "workspace:*",
    "@pulwave/data": "workspace:*",
    "react": "^19.0.0"
  },
  "devDependencies": {
    "vite": "^7.0.0",
    "vitest": "^2.0.0"
  }
}
```

---

### 8.3 npm Workspaces Integration

**Impact**: CRITICAL - Dependency management in monorepo

**Why**: npm workspaces + Turborepo provide powerful monorepo tooling.

**Installation**:
```bash
# Install in all workspaces
npm install

# Install in specific workspace
npm install lodash -w @pulwave/ui

# Install in root
npm install turbo -D
```

**Workspace protocol**:
```json
{
  "dependencies": {
    "@pulwave/ui": "workspace:*"
  }
}

// workspace:* = Link to local package
// npm install automatically links
```

**Running scripts**:
```bash
# Turbo (recommended)
turbo run build

# npm workspaces
npm run build -w @pulwave/ui
npm run build --workspaces
```

---

### 8.4 Dependency Management

**Impact**: CRITICAL - Avoiding dependency hell

**Why**: Monorepos can have complex dependency graphs. Proper management prevents issues.

**Dependency types**:
```json
{
  "dependencies": {
    // Production dependencies
    "@pulwave/ui": "workspace:*",
    "react": "^19.0.0"
  },
  "devDependencies": {
    // Development dependencies
    "vite": "^7.0.0",
    "vitest": "^2.0.0"
  },
  "peerDependencies": {
    // Required by consumer
    "react": "^19.0.0"
  }
}
```

**Shared dependencies**:
```json
// Root package.json
{
  "devDependencies": {
    // Shared across all packages
    "typescript": "^5.7.0",
    "eslint": "^9.0.0"
  }
}

// Package package.json
{
  "devDependencies": {
    // Package-specific
    "vite": "^7.0.0"
  }
}
```

---

## 9. CI/CD Integration

### 9.1 GitHub Actions Setup

**Impact**: CRITICAL - Automated testing and deployment

**Why**: GitHub Actions + Turborepo enable fast, efficient CI/CD.

**Basic workflow**:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: turbo run build

      - name: Test
        run: turbo run test

      - name: Lint
        run: turbo run lint
```

**With remote caching**:
```yaml
- name: Build
  run: turbo run build
  env:
    TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
    TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
```

---

### 9.2 Remote Caching in CI

**Impact**: HIGH - Dramatically faster CI builds

**Why**: Remote caching allows CI runs to reuse builds from previous runs and local development.

**Setup**:
```yaml
- name: Build with remote cache
  run: turbo run build
  env:
    TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
    TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
```

**Read-only cache**:
```yaml
- name: Build (read-only cache)
  run: |
    turbo run build \
      --remote-cache-read-only=true
```

---

### 9.3 Selective CI Runs

**Impact**: CRITICAL - Only test/build what changed

**Why**: PRs often touch few packages. Selective runs save time.

**Changed packages only**:
```yaml
- name: Build changed packages
  run: |
    turbo run build \
      --filter='...[origin/main]'
```

**With dependencies**:
```yaml
- name: Build changed + dependencies
  run: |
    turbo run build \
      --filter='...[origin/main]...'
```

---

### 9.4 Build Matrix Strategies

**Impact**: MEDIUM - Test across multiple configurations

**Why**: Ensures compatibility across Node versions, OSes, etc.

**Matrix example**:
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Test
        run: turbo run test
```

---

## 10. Pulwave Integration

### 10.1 Pulwave turbo.json Configuration

**Impact**: CRITICAL - Pulwave's actual Turborepo configuration

**Current configuration**:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "**/.env.*local",
    ".env"
  ],
  "globalPassThroughEnv": [
    "NODE_ENV",
    "CI",
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
    "VITE_APP_ENV"
  ],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

**Key features**:
1. Global env passthrough for Vite and Supabase
2. .env files trigger full cache invalidation
3. Build tasks have topological dependencies
4. Dev servers never cache
5. Tests depend on local build

---

### 10.2 Workspace Structure

**Impact**: CRITICAL - Pulwave's monorepo organization

**Structure**:
```
pulwave/
├── apps/
│   └── web/
│       ├── real-estate/       # Real estate vertical app
│       └── restaurant/        # Restaurant vertical app (WIP)
├── packages/
│   ├── foundation/            # Layer 1: Design tokens, utils
│   ├── data/                  # Layer 2: Data layer
│   ├── ui/                    # Layer 3: UI components (91 components)
│   ├── patterns/              # Layer 4: Layout patterns
│   ├── features/              # Layer 5: Feature packages (16 features)
│   ├── experience/            # Layer 6: Page assemblies (7 experiences)
│   ├── tooling/               # Shared configs
│   │   ├── typescript/
│   │   ├── eslint/
│   │   └── prettier/
│   └── internal/              # Internal-only packages
│       └── env/               # Zod env validation
└── turbo.json
```

**Dependencies flow downward**:
```
apps/web/real-estate
  → packages/experience/admin
    → packages/features/admin-dashboard
      → packages/ui/components
        → packages/foundation
```

---

### 10.3 Build Pipeline

**Impact**: CRITICAL - Pulwave's build workflow

**Build command**:
```bash
turbo run build
```

**Execution order**:
```
1. foundation:build          (no deps)
2. data:build                (depends on foundation)
3. ui:build                  (depends on foundation)
4. patterns:build            (depends on ui)
5. features/*:build          (depends on ui, data)
6. experience/*:build        (depends on features)
7. apps/web/*:build          (depends on experience)
```

**Parallel execution**:
- Steps 2-3 run in parallel (both depend only on foundation)
- All features build in parallel (16 packages)
- All experiences build in parallel (7 packages)

**Timing**:
```bash
# Cold build (no cache)
turbo run build
# Total: ~60s

# Warm build (full cache)
turbo run build
# Total: ~1s

# After 1 package change
turbo run build
# Total: ~5s (rebuild 1 package + dependents)
```

---

### 10.4 Development Workflow

**Impact**: CRITICAL - Pulwave development practices

**Start development**:
```bash
# All apps
npm run dev

# Specific app
npm run dev -w apps/web/real-estate

# With Turbo filtering
turbo run dev --filter=...@pulwave/real-estate
```

**Common workflows**:
```bash
# 1. Feature development (work on UI component)
turbo run dev --filter=...@pulwave/ui

# 2. App development (work on real-estate app)
turbo run dev --filter=...@pulwave/real-estate

# 3. Quality checks
turbo run lint typecheck test

# 4. Build everything
turbo run build

# 5. Clean build (bypass cache)
turbo run build --force
```

**Package.json scripts**:
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "check:circular": "madge --circular --extensions ts,tsx .",
    "check:architecture": "tsx scripts/check-architecture.ts"
  }
}
```

---

## 11. Appendices

### Appendix A: Complete Turborepo Checklist

**Essential Configuration**:
- [ ] turbo.json exists with $schema
- [ ] globalDependencies includes .env files
- [ ] globalPassThroughEnv includes NODE_ENV, CI
- [ ] All tasks have proper dependsOn
- [ ] Build tasks specify outputs
- [ ] Dev tasks have cache: false, persistent: true

**Task Configuration**:
- [ ] build task has dependsOn: ["^build"]
- [ ] build task outputs include dist/**, .next/**
- [ ] test task depends on build
- [ ] lint task has no dependencies
- [ ] typecheck depends on ^build

**Caching**:
- [ ] Outputs specified for all cacheable tasks
- [ ] Inputs specified for fine-grained caching
- [ ] Dev tasks explicitly disable caching
- [ ] Remote cache configured (optional)

**Workspace Structure**:
- [ ] Root package.json has workspaces
- [ ] Apps in apps/*
- [ ] Packages in packages/*
- [ ] Clear dependency hierarchy

**CI/CD**:
- [ ] GitHub Actions workflow exists
- [ ] Uses actions/setup-node with cache: 'npm'
- [ ] Filters to changed packages in PR
- [ ] Remote cache configured with secrets

**Development**:
- [ ] npm run dev works
- [ ] npm run build works
- [ ] Individual package dev scripts work
- [ ] Filtering works (--filter=package-name)

---

### Appendix B: Task Configuration Reference

**Task Properties**:
```typescript
interface TaskConfig {
  // Dependencies
  dependsOn?: string[];

  // Caching
  cache?: boolean;
  outputs?: string[];
  inputs?: string[];

  // Environment
  env?: string[];

  // Execution
  persistent?: boolean;

  // Output
  outputMode?: 'full' | 'hash-only' | 'new-only' | 'errors-only';
}
```

**Common Task Patterns**:
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "inputs": ["src/**", "package.json"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**", "tests/**"]
    },
    "lint": {
      "outputs": [],
      "inputs": ["src/**", "eslint.config.js"]
    }
  }
}
```

---

### Appendix C: Filter Syntax Cheat Sheet

**Basic Filters**:
```bash
# By package name
--filter=@pulwave/ui

# By glob
--filter='@pulwave/*'
--filter='apps/*'

# By directory
--filter='./packages/ui'
```

**Dependency Filters**:
```bash
# Include dependencies
--filter='...@pulwave/ui'

# Include dependents
--filter='@pulwave/ui...'

# Include both
--filter='...@pulwave/ui...'
```

**Git Filters**:
```bash
# Changed since commit
--filter='...[HEAD^1]'
--filter='...[origin/main]'

# Changed + dependencies
--filter='...[HEAD^1]...'

# Changed + dependents
--filter='[HEAD^1]...'
```

**Combining Filters**:
```bash
# Multiple filters (OR)
--filter=@pulwave/ui --filter=@pulwave/data

# Exclude
--filter='@pulwave/*' --filter='!@pulwave/ui'
```

---

### Appendix D: CI/CD Pipeline Example

**Complete GitHub Actions workflow**:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # For git-based filtering

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: |
          turbo run build \
            --filter='...[origin/main]' \
            --concurrency=4
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

      - name: Test
        run: |
          turbo run test \
            --filter='...[origin/main]' \
            --concurrency=4 \
            --continue

      - name: Lint
        run: |
          turbo run lint \
            --filter='...[origin/main]' \
            --continue

      - name: Typecheck
        run: |
          turbo run typecheck \
            --filter='...[origin/main]' \
            --continue

      - name: Upload coverage
        if: always()
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/*/coverage-final.json
```

---

**End of Turborepo Patterns Guide** - 50+ patterns covering task orchestration, caching strategies, workspace filtering, CI/CD optimization, and Pulwave integration. Follow these patterns for efficient monorepo development with Turborepo.
