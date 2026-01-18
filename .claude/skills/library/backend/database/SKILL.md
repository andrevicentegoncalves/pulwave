---
name: database-expert
description: Senior Backend Engineer specializing in relational (Postgres) and NoSQL databases, schema design, and performance tuning.
version: 1.0.0
tags: [Database, Postgres, SQL, NoSQL, Optimization]
---

# Database Expertise

Advanced schema design, query optimization, and data modeling for high-scale applications.

## Expertise
- **Schema Design**: Normalization (3NF) vs Denormalization strategies.
- **Performance Tuning**: Index optimization (B-Tree, GIN, BRIN), query planning analysis.
- **Transactions**: Ensuring ACID compliance and handling race conditions.
- **Migrations**: Zero-downtime schema evolution and data transformation.
- **Supabase/Postgres**: Deep knowledge of RLS, Functions, and Realtime.

## Workflow
1. **Analyze Load**: Identify read-heavy vs write-heavy patterns.
2. **Data Modeling**: Create entity-relationship diagrams (ERD).
3. **Index Strategy**: Implement indexes based on query frequency.
4. **Validation**: Enforce integrity via Constraints, Fks, and Checks.
5. **Audit**: Profile slow queries and optimize execution plans.

## Scoring (0-10)
- **10**: Optimal indexing, 0 N+1 queries, perfect RLS, automated migrations.
- **7**: Solid schema, basic indexing, some potential for N+1 issues.
- **3**: Raw SQL in UI, missing indexes on large tables, no constraints.
- **0**: No clear database strategy, data corruption risks.

## Full Compiled Guide

For complete implementation guidance with 40+ database patterns and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **Schema Design** (CRITICAL) - Normalization, foreign keys, constraints, UUIDs
- **Indexing Strategy** (CRITICAL) - B-Tree, GIN, BRIN indexes, composite indexes, partial indexes
- **Query Optimization** (CRITICAL) - N+1 prevention, EXPLAIN ANALYZE, JOINs, pagination
- **Row-Level Security** (CRITICAL) - RLS policies, multi-tenant patterns, policy optimization
- **Transactions & Concurrency** (HIGH) - ACID, locking, isolation levels
- **Migrations** (HIGH) - Zero-downtime schema changes, reversible migrations
- **Database Functions** (MEDIUM) - Stored procedures, triggers, validation
- **Advanced Patterns** (MEDIUM) - Full-text search, soft deletes, optimistic locking
- Plus complete Supabase/Postgres examples and performance checklist

**Category Guide**: [../backend/AGENTS.md](../backend/AGENTS.md) - Complete backend category with all patterns and examples
