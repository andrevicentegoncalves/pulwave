# Pulwave AI Agent Guide

Welcome, Agent. This directory contains the collective intelligence and automation workflows for the Pulwave project.

## Project Structure for Agents

- [FRONTEND_STANDARDS.md](file:///.agent/FRONTEND_STANDARDS.md): **[MANDATORY]** Read this to understand the BEM + CVA styling architecture and component guidelines.
- [workflows/](file:///.agent/workflows/): Execution playbooks. Always check for a relevant workflow before performing complex migrations or audits.
- [logs/](file:///.agent/logs/): **Centralized Logging.** All diagnostic output, type checks, build errors, and transient reports MUST be stored here.
- [history/](file:///.agent/history/): (Internal) Execution history and context snapshots.

## Core Directives

1.  **Strict Agnosticism**: Features and Logic must remain independent of the underlying database (Supabase) and specific experience implementations.
2.  **Clean Architecture**: Logic belongs in `packages/features/`, content in `packages/features/style-guide/src/content`, and experience-specific assembly in `packages/experience/`.
3.  **BEM + CVA Styling**: No utility-first (Tailwind) or inline styles. Use modular SCSS with BEM naming and CVA for variants.
4.  **Logging**: Never leave `.log` or `.txt` files in the root or package directories. Always redirect script output to `.agent/logs/`.
5.  **Documentation**: A task is only finished when the Style Guide reflects the changes. Use the `style-guide-audit` workflow.

## Operational Standards

- **Type Safety**: No `any`. Always resolve TS errors properly.
- **Atomic Components**: Favor small, focused primitives over monolithic blocks.
- **Polymorphism**: Ensure components support the `as` prop when semantically appropriate.
