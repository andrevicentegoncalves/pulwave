# ADR-001: Provider-Agnostic Data Layer

**Status:** Accepted  
**Date:** 2026-01-12  
**Deciders:** Architecture Team  
**Technical Story:** Deep architecture audit and implementation

---

## Context and Problem Statement

The application needs a data access layer that can work with multiple backend providers (Supabase, Firebase, Prisma) without coupling business logic to any specific implementation. How can we design a data layer that is truly provider-agnostic while maintaining type safety and developer experience?

## Decision Drivers

- Need to switch providers without rewriting application logic
- Want to support multi-provider deployments (different domains on different backends)
- Require strong TypeScript type safety
- Must maintain clean separation of concerns
- Need to support future providers without breaking changes

## Considered Options

1. **Abstract Factory Pattern with Runtime Provider Selection**
2. Direct provider implementations with manual switching
3. ORM-based abstraction (Prisma only)
4. GraphQL layer as abstraction

## Decision Outcome

**Chosen option:** "Abstract Factory Pattern with Runtime Provider Selection"

### Rationale

The Abstract Factory pattern provides the best balance of flexibility, type safety, and maintainability. It allows:
- Runtime provider configuration via environment variables
- Domain-level provider selection (different providers for different domains)
- Zero business logic changes when switching providers
- Future provider additions without modifying existing code

### Positive Consequences

- Complete provider independence for services and hooks
- Easy testing with mock providers
- Can run different providers simultaneously
- Future-proof architecture
- Clear separation: Components → Hooks → Services → Repositories → Providers

### Negative Consequences

- Additional abstraction layer adds complexity
- Need to implement multiple providers manually
- Initial setup time higher than direct implementation

## Implementation Details

### Architecture Layers

```
Components (React)
    ↓
Hooks (React Query + Repository)
    ↓
Services (Business Logic)
    ↓
Repositories (Generic Proxies)
    ↓
Providers (Supabase, Firebase, Prisma)
```

### Key Files

- `packages/entities/providers/ProviderFactory.ts` - Abstract factory
- `packages/entities/_infrastructure/infrastructure.ts` - Provider initialization
- Domain-specific repository interfaces (e.g., `IUserRepository`)

### Provider Configuration

```typescript
// Environment-based (recommended)
VITE_DATA_PROVIDER=supabase

// Programmatic (advanced)
createDataProvider({
    user: 'supabase',
    profile: 'firebase',
    payment: 'supabase'
})
```

## Links

- [Data Layer Documentation](../packages/entities/docs/README.md)
- [Migration Guide](../packages/entities/docs/MIGRATION.md)
- [ADR-002: Atomic Domain Structure](./002-atomic-domain-structure.md)

---

**Tags:** architecture, data-layer, provider-abstraction, design-pattern  
**Related ADRs:** ADR-002, ADR-005
