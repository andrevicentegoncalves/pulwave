# ADR-002: Atomic Domain Structure

**Status:** Accepted  
**Date:** 2026-01-12  
**Deciders:** Architecture Team

---

## Context and Problem Statement

How should we organize code within the data layer to ensure modularity, testability, and clear separation of concerns?

## Decision Drivers

- Need clear boundaries between domains
- Want each domain to be self-contained and testable
- Must support independent development of features
- Require consistent structure across all domains

## Considered Options

1. **Atomic domain folders with interfaces/repositories/services/hooks/tests**
2. Flat structure with all services in one folder
3. Feature-based organization with mixed concerns
4. Monolithic approach with shared services

## Decision Outcome

**Chosen option:** "Atomic domain folders"

### Rationale

Each domain (auth, profile, payment, etc.) is a self-contained unit with:
```
domain/
├── interfaces/       # Type definitions and contracts
├── repositories/     # Generic proxies to providers
├── services/         # Business logic
├── hooks/           # React Query hooks
├── keys/            # React Query cache keys
└── __tests__/       # Co-located tests
```

This structure ensures:
- Clear ownership and boundaries
- Easy to find related code
- Independent testing
- Scalable as features grow

### Positive Consequences

- Each domain is independently testable
- New developers can understand one domain at a time
- Changes are localized to specific domains
- Clear dependency graph
- Easy to extract domains to separate packages if needed

### Negative Consequences

- More folders and files
- Need to maintain consistency across domains
- Potential code duplication between domains (solved with shared utils)

## Examples

### Auth Domain
```
domains/global/auth/
├── interfaces/
│   ├── IUserRepository.ts
│   └── types/User.ts
├── repositories/
│   └── userRepository.ts
├── services/
│   ├── sessionService.ts
│   ├── passwordService.ts
│   └── authService.ts  # Facade
├── hooks/
│   └── useAuth.ts
└── __tests__/
```

## Links

- [Data Layer README](../packages/entities/docs/README.md)
- [ADR-001: Provider-Agnostic Data Layer](./001-provider-agnostic-data-layer.md)

---

**Tags:** architecture, organization, domain-driven-design  
**Related ADRs:** ADR-001, ADR-005
