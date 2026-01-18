# Architecture Skills - Category Guide

**Version 1.0.0**
Pulwave Engineering
2026-01-16

> **Note:**
> This is the architecture category compilation for AI agents and LLMs working on the Pulwave codebase.
> This document aggregates all 5 architecture skills with links to detailed implementation guides.

## Abstract

Comprehensive architecture guide for Pulwave's Atomic Modular Monorepo. Contains 5 skills covering project structure, data layer patterns, mobile architecture, scalability patterns, and system design. Essential for understanding and maintaining Pulwave's architectural boundaries and design principles.

**Architecture Principles:**
- Atomic Modular Monorepo with strict layer separation
- Dependencies flow downward only (Apps → Experience → Features → UI → Foundation)
- Provider-agnostic data layer with hexagonal architecture
- Domain-driven design for data organization
- Feature-based package isolation

---

## Table of Contents

1. [Project Structure](#1-project-structure) (CRITICAL) - Monorepo organization
2. [Data Layer](#2-data-layer) (HIGH) - Repository pattern, services
3. [System Design](#3-system-design) (HIGH) - High-level architecture
4. [Scalability](#4-scalability) (MEDIUM) - Scaling patterns
5. [Mobile](#5-mobile) (MEDIUM) - Mobile-first architecture

---

## 1. Project Structure

**Location**: [project-structure/](project-structure/)
**Quick Ref**: [SKILL.md](project-structure/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q1 priority

**Impact**: CRITICAL

Atomic Modular Monorepo architecture with strict layer separation. Defines where code lives, how layers interact, and architectural boundaries. This is the foundation of Pulwave's codebase organization.

### Layer Hierarchy

```
Apps (apps/web/*)
  ↓ depends on
Experience (packages/experience/*)
  ↓ depends on
Features (packages/features/*)
  ↓ depends on
UI (packages/ui/)
Data (packages/data/)
  ↓ depends on
Foundation (packages/foundation/)
```

### Key Rules

- **Downward dependencies only** - Higher layers depend on lower layers, never reverse
- **UI never imports Features** - UI components are pure, presentational
- **Features never import Features** - Features are isolated, share via Foundation
- **Data layer is provider-agnostic** - Abstract database/API access

### When to Use

- Creating new packages
- Deciding where to place code
- Reviewing architectural boundaries
- Refactoring for better separation
- Onboarding new developers

### Package Types

| Layer | Purpose | Examples |
|-------|---------|----------|
| Apps | Thin shells, routing, providers | `apps/web/real-estate` |
| Experience | Page assemblies, flows | `packages/experience/onboarding` |
| Features | Domain logic, feature-specific UI | `packages/features/authentication` |
| Patterns | Reusable layout compositions | `packages/patterns/` |
| UI | Pure presentational components | `packages/ui/components/Button` |
| Data | Provider-agnostic data layer | `packages/data/domains/profile` |
| Foundation | Design tokens, utilities | `packages/foundation/` |

---

## 2. Data Layer

**Location**: [data-layer/](data-layer/)
**Quick Ref**: [SKILL.md](data-layer/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q1 priority

**Impact**: HIGH

Hexagonal architecture with Repository pattern, Services, and Hooks. Provider-agnostic abstraction over Supabase. Domain-driven organization with clear separation of concerns.

### Architecture Pattern

```
Component → Hook → Service → Repository → Provider
```

1. **Component** - UI component in Features/Experience layer
2. **Hook** - React Query hook (`useProfile`, `useProperties`)
3. **Service** - Business logic, transformations, validation
4. **Repository** - Data access abstraction
5. **Provider** - Supabase implementation (swappable)

### Key Patterns

- **Domain-driven organization** - 9 domains (profile, property, billing, etc.)
- **Provider pattern** - Abstract Supabase behind interfaces
- **TanStack Query hooks** - Automatic caching, deduplication
- **Query keys** - Consistent cache key generation
- **Service layer** - Business logic separate from data access

### When to Use

- Fetching data from database
- Creating new data domains
- Abstracting data access
- Implementing business logic
- Reviewing data layer code

### Domain Structure

```
packages/data/domains/[domain]/
├── hooks/               # React Query hooks
│   └── use[Domain].ts
├── services/            # Business logic
│   └── [domain]Service.ts
├── repositories/        # Data access
│   └── [domain]Repository.ts
├── interfaces/          # TypeScript types
│   └── types/
├── keys/                # Query keys
│   └── index.ts
└── __tests__/           # Unit tests
```

---

## 3. System Design

**Location**: [system-design/](system-design/)
**Quick Ref**: [SKILL.md](system-design/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: HIGH

High-level architecture decisions, trade-offs, patterns for distributed systems, event-driven architecture, CQRS, sagas, circuit breakers.

### Key Patterns

- **Event-driven architecture** - Decouple services with events
- **CQRS** - Separate read and write models
- **Saga pattern** - Distributed transactions
- **Circuit breaker** - Resilience and fault tolerance

### When to Use

- Making architecture decisions
- Designing new features
- Scaling existing systems
- Improving reliability
- System integration

---

## 4. Scalability

**Location**: [scalability/](scalability/)
**Quick Ref**: [SKILL.md](scalability/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: MEDIUM

Patterns for scaling the monorepo, code splitting, lazy loading, optimization strategies, micro-frontends considerations.

### Key Patterns

- **Route-based code splitting** - Lazy load routes
- **Feature-based isolation** - Packages are independently deployable
- **Lazy load admin features** - Only for admin users
- **Micro-frontends** - Future consideration for scale

### When to Use

- Planning for growth
- Optimizing bundle size
- Implementing code splitting
- Considering micro-frontends
- Scaling team structure

---

## 5. Mobile

**Location**: [mobile/](mobile/)
**Quick Ref**: [SKILL.md](mobile/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q3 priority

**Impact**: MEDIUM

Mobile-first responsive design patterns, touch interactions, performance optimization for mobile, safe area handling.

### Key Patterns

- **Mobile-first CSS** - Start with mobile, scale up
- **touch-action: manipulation** - Remove tap delay
- **Safe area insets** - Handle notches, rounded corners
- **Reduced bundle for mobile** - Lazy load desktop features

### When to Use

- Building mobile-responsive UI
- Optimizing for mobile performance
- Handling touch interactions
- Supporting mobile devices

---

## Usage Workflows

### Creating a New Feature

**Architecture decision workflow:**

```
1. Identify feature domain (system-design)
   - Is this a new domain or existing?
   - What are the boundaries?

2. Choose layer (project-structure)
   - Pure UI? → packages/ui/
   - Feature logic? → packages/features/[feature]
   - Page assembly? → packages/experience/[experience]
   - Data access? → packages/data/domains/[domain]

3. Design data flow (data-layer)
   - Component → Hook → Service → Repository → Provider
   - Define interfaces and types
   - Create query keys

4. Consider scalability (scalability)
   - Will this grow significantly?
   - Should it be lazy loaded?
   - Code splitting strategy?

5. Mobile considerations (mobile)
   - How does this work on mobile?
   - Touch interactions needed?
   - Mobile-specific optimizations?
```

---

### Adding a New Domain

**Data layer workflow:**

```bash
# 1. Create domain structure (data-layer)
mkdir -p packages/data/domains/new-domain/{hooks,services,repositories,interfaces/types,keys,__tests__}

# 2. Define types (data-modeling from data category)
# packages/data/domains/new-domain/interfaces/types/index.ts

# 3. Create repository (data-layer)
# packages/data/domains/new-domain/repositories/newDomainRepository.ts
export const newDomainRepository = {
  async findById(id: string) {
    return dataProvider.newDomain.findById(id);
  },
  // ...
};

# 4. Create service (data-layer)
# packages/data/domains/new-domain/services/newDomainService.ts
export const newDomainService = {
  async getNewDomain(id: string) {
    const data = await newDomainRepository.findById(id);
    // Business logic, transformations
    return enrichData(data);
  },
};

# 5. Create query keys (data-layer)
# packages/data/domains/new-domain/keys/index.ts
export const newDomainKeys = {
  all: ['newDomain'] as const,
  detail: (id: string) => [...newDomainKeys.all, id] as const,
};

# 6. Create hook (data-layer)
# packages/data/domains/new-domain/hooks/useNewDomain.ts
export function useNewDomain(id: string) {
  return useQuery({
    queryKey: newDomainKeys.detail(id),
    queryFn: () => newDomainService.getNewDomain(id),
  });
}

# 7. Export from domain (data-layer)
# packages/data/domains/new-domain/index.ts

# 8. Add to data package exports (data-layer)
# packages/data/index.ts
```

---

### Refactoring for Better Architecture

**Boundary enforcement workflow:**

```
1. Identify violation (project-structure)
   - UI importing Features? ❌
   - Features importing Features? ❌
   - Data importing UI? ❌

2. Analyze dependency (project-structure)
   - Why does this dependency exist?
   - What's the minimal interface needed?

3. Extract to lower layer (project-structure)
   - Move shared code to Foundation
   - Create pure UI components
   - Abstract data access

4. Update imports (project-structure)
   - Point to new location
   - Remove old imports
   - Verify with architecture checks

5. Validate (project-structure)
   npm run check:architecture
   npm run check:circular
```

---

## Anti-Patterns to Avoid

### ❌ Upward Dependencies

```typescript
// BAD: UI importing Features
// packages/ui/components/Button/Button.tsx
import { useAuth } from '@pulwave/features-authentication'; // ❌ UI can't import Features

// GOOD: Pass as prop
export function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

// In Feature component:
import { Button } from '@pulwave/ui';
import { useAuth } from '@pulwave/features-authentication';

function FeatureComponent() {
  const { logout } = useAuth();
  return <Button onClick={logout}>Logout</Button>;
}
```

---

### ❌ Feature-to-Feature Dependencies

```typescript
// BAD: Features importing other Features
// packages/features/billing/src/BillingDashboard.tsx
import { ProfileCard } from '@pulwave/features-profile'; // ❌ Features can't import Features

// GOOD: Compose in Experience layer
// packages/experience/dashboard/src/Dashboard.tsx
import { BillingDashboard } from '@pulwave/features-billing';
import { ProfileCard } from '@pulwave/features-profile';

export function Dashboard() {
  return (
    <div>
      <ProfileCard />
      <BillingDashboard />
    </div>
  );
}
```

---

### ❌ Direct Provider Access

```typescript
// BAD: Importing Supabase directly
// packages/features/profile/src/ProfileCard.tsx
import { supabase } from '@pulwave/data/providers/supabase'; // ❌ Bypass abstraction

// GOOD: Use data layer hooks
import { useProfile } from '@pulwave/data';

function ProfileCard() {
  const { data: profile } = useProfile();
  return <div>{profile.name}</div>;
}
```

---

## Coverage Status

| Skill | SKILL.md | AGENTS.md | Priority |
|-------|----------|-----------|----------|
| project-structure | ✅ | ⚠️ Q1 | CRITICAL |
| data-layer | ✅ | ⚠️ Q1 | HIGH |
| system-design | ✅ | ⚠️ Q2 | HIGH |
| scalability | ✅ | ⚠️ Q2 | MEDIUM |
| mobile | ✅ | ⚠️ Q3 | MEDIUM |

**Current**: 0/5 skills with AGENTS.md (0%)
**Q1 Target**: 2/5 skills (40%)
**Q2 Target**: 4/5 skills (80%)

---

## Related Categories

- **Data** - [../data/AGENTS.md](../data/AGENTS.md) - State management, data fetching patterns
- **Front-End** - [../front-end/AGENTS.md](../front-end/AGENTS.md) - Component architecture
- **Testing** - [../testing/AGENTS.md](../testing/AGENTS.md) - Architecture testing strategies
- **Tools** - [../tools/AGENTS.md](../tools/AGENTS.md) - Monorepo tools

---

## Further Reading

- [Pulwave Architecture Guide](../../../CLAUDE.md) - Complete documentation
- [Master Skills Library](../AGENTS.md) - All skills index
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)

---

**Last Updated**: 2026-01-16
**Version**: 1.0.0
**Total Skills**: 5
**With AGENTS.md**: 0
**Maintained By**: Pulwave Engineering
