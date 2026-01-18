# Architecture Decision Records

> Documentation of architectural decisions made during the project

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [000](./000-template.md) | ADR Template | - | - |
| [001](./001-provider-agnostic-data-layer.md) | Provider-Agnostic Data Layer | Accepted | 2026-01-12 |
| [002](./002-atomic-domain-structure.md) | Atomic Domain Structure | Accepted | 2026-01-12 |
| [003](./003-cva-component-pattern.md) | CVA Component Pattern | Accepted | 2026-01-12 |
| [004](./004-bem-scss-partials.md) | BEM + SCSS Partials | Accepted | 2026-01-12 |
| [005](./005-react-query-server-state.md) | React Query for Server State | Accepted | 2026-01-12 |
| [006](./006-package-reorganization.md) | Data Layer Elevation | Accepted | 2026-01-12 |
| [007](./007-tooling-internal-packages.md) | Tooling & Internal Packages | Accepted | 2026-01-14 |

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

## Why ADRs?

- **Knowledge Preservation**: Future team members understand why decisions were made
- **Context**: Captures the context and constraints at the time of decision
- **Communication**: Facilitates discussion about architectural choices
- **Accountability**: Makes decision-making transparent

## When to Create an ADR?

Create an ADR when making decisions about:
- Architecture patterns (e.g., data layer design)
- Technology choices (e.g., React Query vs Redux)
- Code organization (e.g., folder structure)
- Design system decisions (e.g., styling methodology)
- Infrastructure choices (e.g., provider abstraction)

## How to Create an ADR?

1. Copy `000-template.md`
2. Name it `XXX-short-title.md` (increment number)
3. Fill in all sections
4. Submit for review
5. Update this index

## ADR Lifecycle

- **Proposed**: Under discussion
- **Accepted**: Approved and being implemented
- **Deprecated**: No longer recommended but still in use
- **Superseded**: Replaced by a newer ADR

## Categories

### Architecture & Design
- ADR-001: Provider-Agnostic Data Layer
- ADR-002: Atomic Domain Structure
- ADR-006: Data Layer Elevation

### UI & Styling
- ADR-003: CVA Component Pattern
- ADR-004: BEM + SCSS Partials

### State Management
- ADR-005: React Query for Server State

### Developer Experience
- ADR-007: Tooling & Internal Packages

---

For questions or suggestions about ADRs, contact the architecture team.
