# Architecture Decision Records (ADR)

Documenting significant architectural decisions to preserve context and history.

## What is an ADR?

A short text file (usually Markdown) that describes:
1. A technical decision
2. The context of that decision
3. The consequences of that decision

**Goal**: When a new developer asks "Why did we use MongoDB instead of Postgres?", the ADR answers it.

## When to write one?

- Introducing a new language or framework
- Changing a database
- Significant structural changes (Monolith -> Microservices)
- Choosing a third-party vendor (Auth0 vs Custom Auth)

## Standard Template

```markdown
# [Short Title]

**Status**: [Proposed | Accepted | Deprecated | Superseded]
**Date**: YYYY-MM-DD
**Deciders**: [List of people involved]

## Context and Problem Statement

[Describe the context and problem statement, e.g., in free form using two to three sentences. You may want to articulate the problem in form of a question.]

## Decision Drivers

* [driver 1, e.g., a force, facing concern, ...]
* [driver 2, e.g., a force, facing concern, ...]

## Considered Options

* [option 1]
* [option 2]
* [option 3]

## Decision Outcome

Chosen option: "[option 1]", because [justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force force | … | comes out best (see below)].

### Positive Consequences

* [e.g., improved maintainability]
* [e.g., scalability improvement]

### Negative Consequences

* [e.g., increased complexity]
* [e.g., higher cost]

## Pros and Cons of the Options

### [Option 1]

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]

### [Option 2]

* Good, because [argument a]
* Bad, because [argument b]
```

## Management Process

1. **Storage**: Store in `/docs/adr/` in the repo.
2. **Numbering**: Prefix with index `001-use-typescript.md`, `002-switch-to-postgres.md`.
3. **Immutability**: Once Accepted, do not edit (except to mark Superseded). Create a new ADR to change a decision.

## Request for Comments (RFC)

For larger changes before a decision is made.
1. Draft the ADR (Status: Proposed).
2. Open a Pull Request.
3. Discuss in PR comments.
4. Merge when "Accepted" or close if "Rejected".
