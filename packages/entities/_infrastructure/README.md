# Caching Architecture

## Overview
This module implements a **Provider Pattern** for caching, enabling the application to seamlessly switch between local in-memory storage and remote Redis storage without modifying business logic.

## Directory Structure
The architecture is split into three distinct locations:

```
packages/entities/infrastructure/
├── interfaces/
│   └── cache/
│       └── ICacheProvider.ts       # The Contract (Get, Set, Del, Invalidate)
│
├── providers/
│   └── cache/
│       ├── memory/
│       │   └── InMemoryCacheProvider.ts  # Local RAM implementation (Browser/Dev)
│       └── redis/
│           └── RedisCacheProvider.ts     # Remote Redis implementation (Production)
│
└── cache/                          # Core Logic & Utilities
    ├── CacheManager.ts             # Factory / Singleton (Decides which provider to use)
    ├── keys/                       # Shared Key generation logic (e.g. "user:123")
    ├── invalidation/               # Shared Invalidation rules
    └── constants/                  # Shared Time-To-Live (TTL) definitions
```

## How it Works

1.  **Selection (`CacheManager`)**:
    The `CacheManager` acts as a factory. When the application starts:
    *   If running in the **Browser**, it automatically initializes `InMemoryCacheProvider`.
    *   If running in **Node.js** and `USE_REDIS=true`, it initializes `RedisCacheProvider`.
    *   Otherwise, it defaults to `InMemoryCacheProvider`.

2.  **Usage**:
    Services interact only with the `ICacheProvider` interface. They do not know or care if the data is in Redis or RAM.

    ```typescript
    import { cache } from '@pulwave/entities/infrastructure';

    // Works with ANY provider
    await cache.set('key', 'value', 300);
    ```

## Providers

### 1. In-Memory Provider
*   **Use Case**: Browser environments, Unit Tests, Local Development.
*   **Implementation**: Native JavaScript `Map`.
*   **Features**: LRU (Least Recently Used) eviction, manual TTL handling.

### 2. Redis Provider
*   **Use Case**: Production Server-Side Rendering (SSR), API Routes.
*   **Implementation**: `ioredis`.
*   **Features**: Distributed caching across multiple server instances, high performance.
