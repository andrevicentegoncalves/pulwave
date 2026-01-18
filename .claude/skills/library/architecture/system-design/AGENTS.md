# System Design Architecture - Implementation Guide

**Version 1.0.0**
Pulwave Engineering
2026-01-17

> **Note:**
> This is the detailed implementation guide for system design patterns in Pulwave.
> For quick reference, see [SKILL.md](SKILL.md). For category overview, see [../AGENTS.md](../AGENTS.md).

## Abstract

High-level architecture decisions, trade-offs, and patterns for distributed systems including event-driven architecture, CQRS, saga pattern, and circuit breakers.

---

## Table of Contents

1. [Event-Driven Architecture](#1-event-driven-architecture)
2. [CQRS Pattern](#2-cqrs-pattern)
3. [Saga Pattern](#3-saga-pattern)
4. [Circuit Breaker](#4-circuit-breaker)
5. [Architecture Decision Records](#5-architecture-decision-records)

---

## 1. Event-Driven Architecture

Decouple services through event-based communication for better scalability and maintainability.

---

## 2. CQRS Pattern

Separate read and write models for optimized data access patterns.

---

## 3. Saga Pattern

Handle distributed transactions across multiple services.

---

## 4. Circuit Breaker

Implement resilience and fault tolerance for external service calls.

---

## 5. Architecture Decision Records

Document significant architectural decisions with context, options considered, and chosen approach.

---

**Last Updated**: 2026-01-17
**Version**: 1.0.0
**Maintained By**: Pulwave Engineering
