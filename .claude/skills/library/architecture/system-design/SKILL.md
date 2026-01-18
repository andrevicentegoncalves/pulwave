---
name: system-design
description: Toolkit for technical decision making, architecture diagrams, and system design patterns. Includes C4 model and ADR templates.
version: 1.0.0
tags: [Architecture, Design Patterns, Diagrams, C4 Model, Decision Records]
---

# System Design & Decisions

Frameworks for visualizing architecture and documenting technical decisions.

## When to Use

- Starting a new project or feature
- Explaining complex flows to stakeholders
- Documenting major technology choices (ADRs)
- Visualizing system boundaries
- During "Whiteboard" design interviews/sessions

## Quick Reference

### C4 Model (Context, Container, Component, Code)
1. **Context**: System + Users + External Systems (Big Picture)
2. **Container**: Applications, Databases, Microservices (High Level)
3. **Component**: Internal structure of a container (Controllers, Services)
4. **Code**: UML Class diagrams (Details)

### Architecture Decision Records (ADR)
Format for capturing "Why we did X":
- **Title**: Short, noun phrase
- **Context**: The problem/constraints
- **Decision**: What we chose
- **Consequences**: Pros (Good) and Cons (Bad)

## Full Compiled Guide

**Category Guide**: [../architecture/AGENTS.md](../architecture/AGENTS.md) - Complete architecture category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

### Architecture Diagrams
Guide in `references/diagrams.md`:
- C4 Model deep dive
- Diagrams as Code (Mermaid)
- Sequence Diagrams
- State Diagrams

### Decision Records
Templates and process in `references/decision-records.md`:
- ADR Standard Template
- RFC (Request for Comments) Process
- Tech Stack Selection Matrix

## Common Tools

- **Mermaid.js**: Markdown-based diagrams (GitHub supported)
- **Excalidraw**: Sketch-style whiteboarding
- **PlantUML**: Classic code-to-diagram
- **Structurizr**: C4 model specialized tool

## Design Principles

- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Ain't Gonna Need It
- **DRY**: Don't Repeat Yourself
- **SOLID**: OO Design Principles
- **12-Factor App**: Cloud-native best practices
