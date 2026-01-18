# Database Expertise - Complete Implementation Guide

**Version**: 1.0.0
**Last Updated**: 2026-01-17
**Skill Level**: Senior Database Engineer

---

## Abstract

This guide provides comprehensive patterns for database design, optimization, and management with PostgreSQL and Supabase. Covers schema design, indexing strategies, query optimization, Row-Level Security (RLS), transactions, migrations, and production best practices.

**Target Audience**: Backend engineers, database administrators, architects designing data models.

**Pulwave Context**: Uses Supabase (PostgreSQL 15+), Row-Level Security for authorization, database functions for business logic, and automated migrations for schema evolution.

---

## Table of Contents

1. [Schema Design](#1-schema-design)
   - 1.1 Normalization vs Denormalization (CRITICAL)
   - 1.2 Foreign Key Constraints (HIGH)
   - 1.3 Check Constraints for Data Integrity (MEDIUM)
   - 1.4 Enum Types vs String Columns (MEDIUM)
   - 1.5 UUID vs Serial Primary Keys (HIGH)

2. [Indexing Strategy](#2-indexing-strategy)
   - 2.1 Create Indexes on Foreign Keys (CRITICAL)
   - 2.2 Composite Indexes for Multi-Column Queries (HIGH)
   - 2.3 Partial Indexes for Filtered Queries (MEDIUM)
   - 2.4 Index Types: B-Tree vs GIN vs BRIN (MEDIUM)
   - 2.5 Avoid Over-Indexing (MEDIUM)

3. [Query Optimization](#3-query-optimization)
   - 3.1 Prevent N+1 Queries with Eager Loading (CRITICAL)
   - 3.2 Use EXPLAIN ANALYZE for Query Planning (HIGH)
   - 3.3 Optimize JOIN Strategies (HIGH)
   - 3.4 Aggregate Efficiently (MEDIUM)
   - 3.5 Pagination with Cursors (MEDIUM)

4. [Row-Level Security (RLS)](#4-row-level-security-rls)
   - 4.1 Enable RLS on All Tables (CRITICAL)
   - 4.2 Policy Patterns for Multi-Tenant Apps (CRITICAL)
   - 4.3 Optimize RLS Policies (HIGH)
   - 4.4 Test RLS Policies Thoroughly (HIGH)

5. [Transactions & Concurrency](#5-transactions--concurrency)
   - 5.1 Use Transactions for Multi-Step Operations (CRITICAL)
   - 5.2 Handle Concurrent Updates with Locking (HIGH)
   - 5.3 Isolation Levels (MEDIUM)
   - 5.4 Deadlock Prevention (MEDIUM)

6. [Migrations](#6-migrations)
   - 6.1 Zero-Downtime Schema Changes (CRITICAL)
   - 6.2 Reversible Migrations (HIGH)
   - 6.3 Data Migrations vs Schema Migrations (MEDIUM)
   - 6.4 Migration Testing (HIGH)

7. [Database Functions & Triggers](#7-database-functions--triggers)
   - 7.1 Stored Functions for Business Logic (MEDIUM)
   - 7.2 Triggers for Audit Logging (MEDIUM)
   - 7.3 Database-Side Validation (LOW)
   - 7.4 Computed Columns with Generated Columns (LOW)

8. [Advanced Patterns](#8-advanced-patterns)
   - 8.1 Full-Text Search with GIN Indexes (MEDIUM)
   - 8.2 Soft Deletes with Deleted_At Column (MEDIUM)
   - 8.3 Optimistic Locking with Version Column (MEDIUM)
   - 8.4 Polymorphic Relationships (LOW)

---

## 1. Schema Design

### 1.1 Normalize to 3NF, Then Denormalize for Performance

**Impact: CRITICAL** (prevents data anomalies, enables efficient queries)

**Why**: Normalization eliminates redundancy and prevents update/delete anomalies. Denormalization trades storage for query performance when needed.

**Incorrect: Denormalized from the start**
```sql
-- ❌ BAD: Duplicate user data in every property
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  name TEXT,
  price NUMERIC,
  owner_id UUID,
  owner_name TEXT,          -- Duplicate!
  owner_email TEXT,         -- Duplicate!
  owner_phone TEXT,         -- Duplicate!
  manager_name TEXT,        -- Duplicate!
  manager_email TEXT        -- Duplicate!
);

-- Problems:
-- 1. Update anomaly: Changing owner name requires updating ALL properties
-- 2. Insert anomaly: Can't add owner without property
-- 3. Delete anomaly: Deleting last property deletes owner data
-- 4. Storage waste: Owner data duplicated N times
```

**Correct: Start normalized (3NF)**
```sql
-- ✅ GOOD: Normalized schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  bedrooms INT CHECK (bedrooms >= 0),
  bathrooms INT CHECK (bathrooms >= 0),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_manager_id ON properties(manager_id);

-- Queries with joins (normalized)
SELECT
  p.id,
  p.name,
  p.price,
  o.name AS owner_name,
  m.name AS manager_name
FROM properties p
INNER JOIN users o ON o.id = p.owner_id
LEFT JOIN users m ON m.id = p.manager_id
WHERE p.price > 100000;
```

**When to denormalize:**
```sql
-- ✅ OK: Denormalize for read-heavy queries
-- Add computed column for frequently accessed owner name
ALTER TABLE properties ADD COLUMN owner_name_cached TEXT;

-- Keep it updated with trigger
CREATE OR REPLACE FUNCTION sync_owner_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.owner_name_cached := (SELECT name FROM users WHERE id = NEW.owner_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_owner_name_trigger
BEFORE INSERT OR UPDATE OF owner_id ON properties
FOR EACH ROW
EXECUTE FUNCTION sync_owner_name();

-- Now queries are faster (no join)
SELECT id, name, owner_name_cached FROM properties WHERE price > 100000;
```

**Metrics**: Normalization prevents 100% of data anomalies. Denormalize only when profiling shows join performance issues (typically >10M rows).

**Pulwave-specific**: Start normalized, denormalize based on query patterns:
```sql
-- Normalized: users, properties, leases (separate tables)
-- Denormalized: property_stats table (aggregated data)
CREATE TABLE property_stats (
  property_id UUID PRIMARY KEY REFERENCES properties(id),
  total_leases INT DEFAULT 0,
  active_leases INT DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  last_lease_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Updated by triggers or background job
```

---

### 1.2 Always Use Foreign Key Constraints

**Impact: HIGH** (enforces referential integrity, prevents orphaned records)

**Incorrect: No foreign keys**
```sql
-- ❌ DANGEROUS: No referential integrity
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  owner_id UUID  -- No FK constraint
);

-- Orphaned records possible:
DELETE FROM users WHERE id = 'user-123';
-- properties with owner_id = 'user-123' still exist! (orphans)

INSERT INTO properties (owner_id) VALUES ('fake-id');
-- Accepted! Invalid reference.
```

**Correct: Foreign key constraints**
```sql
-- ✅ SAFE: Referential integrity enforced
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Cascade options:
-- CASCADE: Delete dependent rows
-- SET NULL: Set FK to NULL (requires nullable column)
-- RESTRICT: Prevent deletion if dependents exist
-- NO ACTION: Similar to RESTRICT but checked at end of transaction

-- Example: Different actions for different relationships
CREATE TABLE leases (
  id UUID PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  -- Delete lease if property deleted

  tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  -- Prevent deleting user if they have active leases

  created_by UUID REFERENCES users(id) ON DELETE SET NULL
  -- Set to NULL if creator deleted (audit trail preserved)
);
```

**Metrics**: Foreign keys prevent 100% of referential integrity violations. Required for production databases.

**Pulwave-specific**: FK naming convention:
```sql
-- Standard FK naming: fk_<table>_<column>_<referenced_table>
ALTER TABLE properties
ADD CONSTRAINT fk_properties_owner_id_users
FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE leases
ADD CONSTRAINT fk_leases_property_id_properties
FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;

ALTER TABLE leases
ADD CONSTRAINT fk_leases_tenant_id_users
FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE RESTRICT;
```

---

### 1.3 Use Check Constraints for Data Validation

**Impact: MEDIUM** (enforces business rules at database level, prevents invalid data)

**Incorrect: Application-only validation**
```sql
-- ❌ FRAGILE: Only validated in application code
CREATE TABLE properties (
  price NUMERIC,
  bedrooms INT,
  bathrooms INT
);

-- Invalid data can slip through:
-- - Direct SQL INSERT bypasses app validation
-- - Bugs in application code
-- - Bulk imports
INSERT INTO properties (price, bedrooms) VALUES (-1000, -5);
-- Accepted! (invalid)
```

**Correct: Database check constraints**
```sql
-- ✅ ENFORCED: Database prevents invalid data
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  price NUMERIC NOT NULL CHECK (price >= 0),
  bedrooms INT CHECK (bedrooms >= 0 AND bedrooms <= 100),
  bathrooms INT CHECK (bathrooms >= 0 AND bathrooms <= 100),
  status TEXT NOT NULL CHECK (status IN ('available', 'rented', 'maintenance')),
  lease_start_date DATE,
  lease_end_date DATE,

  -- Complex constraint
  CONSTRAINT valid_lease_dates CHECK (
    (lease_start_date IS NULL AND lease_end_date IS NULL)
    OR
    (lease_start_date IS NOT NULL AND lease_end_date IS NOT NULL AND lease_end_date > lease_start_date)
  )
);

-- Now invalid data is rejected at database level
INSERT INTO properties (price, bedrooms) VALUES (-1000, -5);
-- ERROR: new row violates check constraint
```

**Metrics**: Database constraints are the final defense layer. Prevent invalid data from ANY source (app bugs, admin tools, bulk imports).

**Pulwave-specific**: Constraints for common validations:
```sql
-- Email format (simple check)
ALTER TABLE users ADD CONSTRAINT valid_email
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Phone format
ALTER TABLE users ADD CONSTRAINT valid_phone
CHECK (phone ~ '^\+?[\d\s-()]+$');

-- Price ranges
ALTER TABLE properties ADD CONSTRAINT realistic_price
CHECK (price BETWEEN 1000 AND 100000000);

-- Date ranges
ALTER TABLE leases ADD CONSTRAINT future_start_date
CHECK (start_date >= CURRENT_DATE - INTERVAL '1 year');
```

---

### 1.4 Use Enum Types vs String Columns for Fixed Sets

**Impact: MEDIUM** (improves type safety, saves storage, enables validation)

**Incorrect: Unconstrained text columns**
```sql
-- ❌ BAD: Typos and invalid values possible
CREATE TABLE properties (
  status TEXT  -- Could be anything!
);

-- Typos accepted:
INSERT INTO properties (status) VALUES ('availble');  -- Typo!
INSERT INTO properties (status) VALUES ('AVAILABLE'); -- Case mismatch
INSERT INTO properties (status) VALUES ('sold');      -- Invalid for rentals
```

**Correct: PostgreSQL ENUM or CHECK constraint**
```sql
-- ✅ GOOD: Enum type
CREATE TYPE property_status AS ENUM ('available', 'rented', 'maintenance', 'unavailable');

CREATE TABLE properties (
  status property_status NOT NULL DEFAULT 'available'
);

-- Invalid values rejected
INSERT INTO properties (status) VALUES ('sold');
-- ERROR: invalid input value for enum property_status: "sold"

-- Alternative: Check constraint (easier to modify)
CREATE TABLE properties (
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'rented', 'maintenance', 'unavailable'))
);
```

**When to use each:**
- **ENUM**: Fixed set that rarely changes (e.g., user roles, property types)
- **CHECK**: More flexible, easier to add values (no migration needed for constraint)
- **Separate table**: Set changes frequently or has metadata (e.g., countries, categories)

**Metrics**: ENUMs save storage (stored as 4 bytes vs variable text). CHECK constraints more flexible.

**Pulwave-specific**: Use CHECK constraints for flexibility:
```sql
-- Prefer CHECK constraints (easier migrations)
CREATE TABLE users (
  role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'manager', 'admin', 'super_admin'))
);

-- Adding new role (no migration needed):
-- Just update CHECK constraint
ALTER TABLE users DROP CONSTRAINT users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('user', 'manager', 'admin', 'super_admin', 'auditor'));
```

---

### 1.5 UUID vs Auto-Increment (Serial) Primary Keys

**Impact: HIGH** (affects distributed systems, security, URL exposure)

**Incorrect: Sequential integer IDs**
```sql
-- ❌ SECURITY RISK: Predictable IDs
CREATE TABLE users (
  id SERIAL PRIMARY KEY,  -- 1, 2, 3, ...
  name TEXT
);

-- Problems:
-- 1. URL enumeration: /users/1, /users/2, /users/3...
-- 2. Exposes scale: "We have 1000 users"
-- 3. Distributed systems: ID collisions in multi-node setup
-- 4. Bulk operations: Difficult to generate IDs client-side
```

**Correct: UUIDs for public-facing resources**
```sql
-- ✅ SECURE: UUIDs (random, unpredictable)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Benefits:
-- 1. No URL enumeration: /users/550e8400-e29b-41d4-a716-446655440000
-- 2. Distributed-safe: No collisions across servers
-- 3. Client-side generation: Generate ID before INSERT
-- 4. Security: No information leakage

-- Performance note: UUIDs are 16 bytes vs 4 bytes (integer)
-- Use uuid_generate_v7() for better index performance (time-ordered)
```

**When to use each:**
- **UUID**: Public-facing IDs, distributed systems, security-sensitive
- **SERIAL**: Internal tables, high insert volume (UUID index overhead)

**Metrics**: UUIDs add ~12 bytes per row, ~10-20% index overhead. Acceptable for most use cases. UUID v7 has similar index performance to SERIAL.

**Pulwave-specific**: UUID for user-facing, SERIAL for internal:
```sql
-- User-facing: UUID
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
);

-- Internal logs: SERIAL (high insert volume)
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Indexing Strategy

### 2.1 Always Index Foreign Keys

**Impact: CRITICAL** (100x query performance improvement on joins)

**Why**: Foreign keys are used in JOINs, WHERE clauses, and foreign key constraint checks. Without indexes, these operations require full table scans.

**Incorrect: No FK indexes**
```sql
-- ❌ SLOW: Full table scan on JOIN
CREATE TABLE leases (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  tenant_id UUID REFERENCES users(id)
);

-- Query requires full table scan
SELECT * FROM leases WHERE property_id = 'prop-123';
-- Seq Scan on leases (cost=0.00..1000.00 rows=1000 width=100)
```

**Correct: Index all foreign keys**
```sql
-- ✅ FAST: Index lookup
CREATE TABLE leases (
  id UUID PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id),
  tenant_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leases_property_id ON leases(property_id);
CREATE INDEX idx_leases_tenant_id ON leases(tenant_id);

-- Query uses index
SELECT * FROM leases WHERE property_id = 'prop-123';
-- Index Scan using idx_leases_property_id (cost=0.29..8.30 rows=1 width=100)
```

**Metrics**: Indexes reduce query time from O(n) to O(log n). On 1M rows: full scan ~1000ms, index scan ~1ms (1000x faster).

**Pulwave-specific**: Auto-create FK indexes in migrations:
```sql
-- Migration template
-- 1. Create FK
ALTER TABLE leases
ADD CONSTRAINT fk_leases_property_id
FOREIGN KEY (property_id) REFERENCES properties(id);

-- 2. Always create index
CREATE INDEX idx_leases_property_id ON leases(property_id);
```

---

### 2.2 Composite Indexes for Multi-Column Queries

**Impact: HIGH** (enables efficient multi-condition queries)

**Incorrect: Separate single-column indexes**
```sql
-- ❌ SUBOPTIMAL: Postgres can only use one index
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price);

-- Query can only use one index efficiently
SELECT * FROM properties
WHERE status = 'available' AND price > 100000;
-- Uses idx_properties_status, then filters price in memory
```

**Correct: Composite index for common query pattern**
```sql
-- ✅ OPTIMAL: Single composite index
CREATE INDEX idx_properties_status_price ON properties(status, price);

-- Query uses both columns from index
SELECT * FROM properties
WHERE status = 'available' AND price > 100000;
-- Index Scan using idx_properties_status_price

-- Column order matters!
-- Good: WHERE status = 'X' AND price > Y (uses index)
-- Good: WHERE status = 'X' (uses index, leftmost prefix)
-- Bad: WHERE price > Y (can't use index, price is 2nd column)
```

**Column order rules:**
1. Equality columns first (status = 'available')
2. Range columns second (price > 100000)
3. Most selective column first

**Metrics**: Composite index can be 10-100x faster than single-column index for multi-condition queries.

**Pulwave-specific**: Common composite indexes:
```sql
-- Properties: status + price (listing queries)
CREATE INDEX idx_properties_status_price ON properties(status, price);

-- Properties: owner + status (owner dashboard)
CREATE INDEX idx_properties_owner_status ON properties(owner_id, status);

-- Leases: tenant + dates (tenant history)
CREATE INDEX idx_leases_tenant_dates ON leases(tenant_id, start_date, end_date);

-- Audit logs: user + action + timestamp (audit queries)
CREATE INDEX idx_audit_user_action_time ON audit_logs(user_id, action, created_at DESC);
```

---

### 2.3 Partial Indexes for Filtered Queries

**Impact: MEDIUM** (smaller indexes, faster queries on subsets)

**Pattern: Index only rows matching condition**
```sql
-- Full index (large, slow)
CREATE INDEX idx_properties_price ON properties(price);
-- Indexes ALL rows (including unavailable, deleted, etc.)

-- ✅ BETTER: Partial index (small, fast)
CREATE INDEX idx_active_properties_price ON properties(price)
WHERE status = 'available' AND deleted_at IS NULL;
-- Indexes only rows WHERE status = 'available' AND deleted_at IS NULL

-- Queries must match the WHERE condition
SELECT * FROM properties
WHERE status = 'available' AND deleted_at IS NULL AND price > 100000;
-- Uses partial index (much smaller, faster)

-- Other useful partial indexes
-- Active users only
CREATE INDEX idx_active_users_email ON users(email)
WHERE deleted_at IS NULL;

-- Recent data only
CREATE INDEX idx_recent_logs ON audit_logs(created_at)
WHERE created_at > NOW() - INTERVAL '30 days';

-- Specific status only
CREATE INDEX idx_pending_payments ON payments(created_at)
WHERE status = 'pending';
```

**Metrics**: Partial indexes can be 50-90% smaller than full indexes. Smaller index = faster scans, less memory.

**Pulwave-specific**: Partial indexes for common filters:
```sql
-- Active properties only
CREATE INDEX idx_active_properties ON properties(created_at DESC)
WHERE status IN ('available', 'rented') AND deleted_at IS NULL;

-- Unverified users (for admin queries)
CREATE INDEX idx_unverified_users ON users(created_at)
WHERE email_verified_at IS NULL;

-- Failed payments (for retry jobs)
CREATE INDEX idx_failed_payments ON payments(created_at)
WHERE status = 'failed' AND retry_count < 3;
```

---

### 2.4 Choose Correct Index Type: B-Tree vs GIN vs BRIN

**Impact: MEDIUM** (different use cases, significant performance differences)

**B-Tree (default)**: Most common, supports =, <, >, <=, >=, BETWEEN
```sql
-- ✅ B-Tree for equality and range queries
CREATE INDEX idx_properties_price ON properties(price);
-- Queries: price = 100000, price > 100000, price BETWEEN 50000 AND 200000
```

**GIN (Generalized Inverted Index)**: For arrays, JSONB, full-text search
```sql
-- ✅ GIN for array contains queries
CREATE INDEX idx_properties_tags ON properties USING GIN(tags);
-- Query: WHERE tags @> ARRAY['luxury', 'pool']

-- GIN for JSONB
CREATE INDEX idx_properties_metadata ON properties USING GIN(metadata);
-- Query: WHERE metadata @> '{"features": "parking"}'

-- GIN for full-text search
CREATE INDEX idx_properties_search ON properties USING GIN(to_tsvector('english', name || ' ' || description));
-- Query: WHERE to_tsvector('english', name || ' ' || description) @@ to_tsquery('luxury & pool')
```

**BRIN (Block Range Index)**: For very large tables with naturally ordered data
```sql
-- ✅ BRIN for large, append-only tables (logs, events)
CREATE INDEX idx_audit_logs_created_at ON audit_logs USING BRIN(created_at);
-- Much smaller than B-Tree: 1% size, 90% performance
-- Best for time-series data (created_at, updated_at)
```

**Metrics**:
- B-Tree: General purpose, 100% accuracy
- GIN: 10-100x faster for array/JSONB queries, larger index
- BRIN: 100x smaller index, 90% as fast (for sequential data)

**Pulwave-specific**: Use appropriate index type:
```sql
-- B-Tree: Standard queries
CREATE INDEX idx_properties_price ON properties(price);

-- GIN: Tag search
CREATE INDEX idx_properties_tags ON properties USING GIN(tags);

-- BRIN: Audit logs (time-series)
CREATE INDEX idx_audit_logs_time ON audit_logs USING BRIN(created_at);
```

---

### 2.5 Avoid Over-Indexing (Monitor Index Usage)

**Impact: MEDIUM** (too many indexes slow down writes, waste storage)

**Problem**: Each index must be updated on INSERT/UPDATE/DELETE
```sql
-- ❌ TOO MANY: 10 indexes on one table
CREATE TABLE properties (id, name, price, bedrooms, bathrooms, status, ...);

CREATE INDEX idx1 ON properties(name);
CREATE INDEX idx2 ON properties(price);
CREATE INDEX idx3 ON properties(bedrooms);
CREATE INDEX idx4 ON properties(bathrooms);
CREATE INDEX idx5 ON properties(status);
CREATE INDEX idx6 ON properties(name, price);
CREATE INDEX idx7 ON properties(status, price);
-- ... 3 more indexes

-- Every INSERT/UPDATE/DELETE maintains 10 indexes!
```

**Pattern: Monitor and remove unused indexes**
```sql
-- ✅ Find unused indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,  -- Number of index scans (0 = unused)
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY idx_scan, tablename;

-- Remove unused indexes
DROP INDEX IF EXISTS idx_properties_unused;

-- Monitor index size
SELECT
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

**Metrics**: Each index adds 10-30% write overhead. Keep only indexes that are actually used.

---

## 3. Query Optimization

### 3.1 Prevent N+1 Queries with Eager Loading

**Impact: CRITICAL** (reduces 1000 queries to 2 queries, 100-500x faster)

**Incorrect: N+1 query problem**
```sql
-- ❌ BAD: 1 query + N queries
-- Query 1: Get all properties
SELECT * FROM properties LIMIT 10;
-- Returns 10 properties

-- Query 2-11: Get owner for each property (N queries!)
SELECT * FROM users WHERE id = 'owner-1';
SELECT * FROM users WHERE id = 'owner-2';
SELECT * FROM users WHERE id = 'owner-3';
-- ... 10 queries total

-- Total: 1 + 10 = 11 queries (N+1 problem!)
```

**Correct: JOIN or IN query**
```sql
-- ✅ GOOD: 1 query with JOIN
SELECT
  p.id,
  p.name,
  p.price,
  u.id AS owner_id,
  u.name AS owner_name,
  u.email AS owner_email
FROM properties p
INNER JOIN users u ON u.id = p.owner_id
LIMIT 10;
-- 1 query total!

-- Alternative: IN query (2 queries, better for Supabase)
-- Query 1: Get properties
SELECT * FROM properties LIMIT 10;
-- Returns owner_ids: ['id1', 'id2', 'id3', ...]

-- Query 2: Get all owners in one query
SELECT * FROM users WHERE id IN ('id1', 'id2', 'id3', ...);
-- 2 queries total
```

**Metrics**: N+1 queries are the #1 performance killer. 100 properties = 101 queries vs 2 queries (50x reduction).

**Pulwave-specific**: Use Supabase select with joins:
```typescript
// ❌ BAD: N+1 queries
const { data: properties } = await supabase.from('properties').select();

for (const property of properties) {
  const { data: owner } = await supabase
    .from('users')
    .select()
    .eq('id', property.owner_id)
    .single();
  // N queries!
}

// ✅ GOOD: Single query with join
const { data } = await supabase
  .from('properties')
  .select(`
    *,
    owner:users!owner_id(id, name, email),
    manager:users!manager_id(id, name, email)
  `);

// Returns:
// [
//   {
//     id: 'prop-1',
//     name: 'Property 1',
//     owner: { id: 'user-1', name: 'John' },
//     manager: { id: 'user-2', name: 'Jane' }
//   },
//   ...
// ]
```

---

### 3.2 Use EXPLAIN ANALYZE to Understand Query Plans

**Impact: HIGH** (identifies slow queries, guides optimization)

**Pattern: Analyze query execution**
```sql
-- Get query plan (estimate)
EXPLAIN
SELECT * FROM properties WHERE status = 'available' AND price > 100000;

-- Output:
-- Seq Scan on properties (cost=0.00..100.00 rows=10 width=100)
--   Filter: (status = 'available' AND price > 100000)

-- Get actual execution stats
EXPLAIN ANALYZE
SELECT * FROM properties WHERE status = 'available' AND price > 100000;

-- Output:
-- Seq Scan on properties (cost=0.00..100.00 rows=10 width=100) (actual time=0.05..5.23 rows=8 loops=1)
--   Filter: (status = 'available' AND price > 100000)
--   Rows Removed by Filter: 992
-- Planning Time: 0.15 ms
-- Execution Time: 5.35 ms

-- After adding index:
CREATE INDEX idx_properties_status_price ON properties(status, price);

EXPLAIN ANALYZE
SELECT * FROM properties WHERE status = 'available' AND price > 100000;

-- Output:
-- Index Scan using idx_properties_status_price (cost=0.29..8.30 rows=8 width=100) (actual time=0.02..0.05 rows=8 loops=1)
--   Index Cond: ((status = 'available') AND (price > 100000))
-- Planning Time: 0.20 ms
-- Execution Time: 0.08 ms
```

**What to look for:**
- **Seq Scan**: Full table scan (bad for large tables)
- **Index Scan**: Using index (good!)
- **Bitmap Heap Scan**: Multiple indexes combined
- **cost**: Estimated cost (higher = slower)
- **actual time**: Real execution time
- **rows**: Actual rows returned vs estimated

**Metrics**: EXPLAIN ANALYZE shows 100x improvement from adding indexes.

---

### 3.3 Optimize JOIN Strategies

**Impact: HIGH** (correct join type = 10-100x faster queries)

**JOIN types and when to use:**
```sql
-- INNER JOIN: Only matching rows
SELECT p.*, u.name
FROM properties p
INNER JOIN users u ON u.id = p.owner_id;
-- Returns only properties with existing owner

-- LEFT JOIN: All left rows + matching right rows
SELECT p.*, u.name
FROM properties p
LEFT JOIN users u ON u.id = p.owner_id;
-- Returns all properties, even if owner doesn't exist

-- RIGHT JOIN: All right rows + matching left rows (rarely used)
-- Use LEFT JOIN instead

-- FULL OUTER JOIN: All rows from both tables (rarely needed)

-- CROSS JOIN: Cartesian product (avoid!)
```

**Optimization: Filter before JOIN**
```sql
-- ❌ SLOW: Filter after JOIN
SELECT p.*, u.name
FROM properties p
LEFT JOIN users u ON u.id = p.owner_id
WHERE p.status = 'available' AND p.price > 100000;
-- Joins all rows, then filters

-- ✅ FAST: Filter before JOIN (use subquery or CTE)
WITH active_properties AS (
  SELECT * FROM properties
  WHERE status = 'available' AND price > 100000
)
SELECT ap.*, u.name
FROM active_properties ap
LEFT JOIN users u ON u.id = ap.owner_id;
-- Filters first (smaller join), then joins
```

**Metrics**: Filtering before JOIN reduces join set size by 90%+.

---

### 3.4 Aggregate Efficiently with GROUP BY

**Impact: MEDIUM** (correct aggregation = 10x faster)

**Pattern: Use indexes for GROUP BY**
```sql
-- Query: Count properties per owner
EXPLAIN ANALYZE
SELECT owner_id, COUNT(*)
FROM properties
GROUP BY owner_id;

-- Without index on owner_id: Slow (full scan + hash aggregate)
-- With index on owner_id: Fast (index scan + group aggregate)

-- Optimize: Add index
CREATE INDEX idx_properties_owner_id ON properties(owner_id);

-- Advanced: Covering index includes aggregated columns
CREATE INDEX idx_properties_owner_status ON properties(owner_id, status);

SELECT owner_id, status, COUNT(*)
FROM properties
GROUP BY owner_id, status;
-- Index-only scan (no table access needed!)
```

**Metrics**: Index on GROUP BY column = 10-50x faster for large tables.

---

### 3.5 Cursor-Based Pagination for Large Datasets

**Impact: MEDIUM** (stable pagination, better performance than OFFSET)

**Incorrect: OFFSET pagination**
```sql
-- ❌ SLOW: OFFSET requires scanning skipped rows
SELECT * FROM properties
ORDER BY created_at DESC
LIMIT 20 OFFSET 10000;
-- Scans 10,020 rows, returns 20 (slow for large offsets)
```

**Correct: Cursor-based pagination**
```sql
-- ✅ FAST: Use cursor (WHERE + index)
-- Page 1: Get first 20
SELECT * FROM properties
ORDER BY created_at DESC
LIMIT 20;
-- Returns: last created_at = '2024-01-15 10:00:00'

-- Page 2: Use cursor
SELECT * FROM properties
WHERE created_at < '2024-01-15 10:00:00'
ORDER BY created_at DESC
LIMIT 20;
-- Scans from cursor, no offset needed (fast!)

-- Make sure created_at is indexed
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);
```

**Metrics**: OFFSET 10000 scans 10,020 rows. Cursor scans 20 rows (500x faster).

**Pulwave-specific**: Implement in API:
```typescript
// packages/data/domains/properties/repositories/propertyRepository.ts
export const propertyRepository = {
  async findMany(options: {
    limit?: number;
    cursor?: string; // ISO timestamp
  }) {
    let query = supabase
      .from('properties')
      .select()
      .order('created_at', { ascending: false })
      .limit(options.limit || 20);

    if (options.cursor) {
      query = query.lt('created_at', options.cursor);
    }

    const { data, error } = await query;
    if (error) throw error;

    return {
      items: data,
      nextCursor: data.length > 0 ? data[data.length - 1].created_at : null,
    };
  },
};

// Usage
const page1 = await propertyRepository.findMany({ limit: 20 });
const page2 = await propertyRepository.findMany({
  limit: 20,
  cursor: page1.nextCursor,
});
```

---

## 4. Row-Level Security (RLS)

### 4.1 Enable RLS on All User-Facing Tables

**Impact: CRITICAL** (prevents unauthorized data access at database level)

**Incorrect: Application-level auth only**
```sql
-- ❌ INSECURE: No RLS, relies on app logic
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  owner_id UUID,
  name TEXT
);

-- Any user can read any property if app has bug
SELECT * FROM properties; -- Returns ALL properties
```

**Correct: RLS policies enforce access**
```sql
-- ✅ SECURE: RLS enabled
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  name TEXT
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read own properties
CREATE POLICY "Users read own properties"
ON properties FOR SELECT
USING (auth.uid() = owner_id);

-- Policy: Users can insert own properties
CREATE POLICY "Users insert own properties"
ON properties FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can update own properties
CREATE POLICY "Users update own properties"
ON properties FOR UPDATE
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Now users can only access their own data
SELECT * FROM properties; -- Returns ONLY user's properties
```

**Metrics**: RLS prevents 100% of authorization bypasses at database level. Required for multi-tenant apps.

**Pulwave-specific**: Template for all tables:
```sql
-- Enable RLS
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

-- Read policy
CREATE POLICY "[table]_read_own"
ON [table] FOR SELECT
USING (auth.uid() = user_id);

-- Write policies
CREATE POLICY "[table]_insert_own"
ON [table] FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "[table]_update_own"
ON [table] FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "[table]_delete_own"
ON [table] FOR DELETE
USING (auth.uid() = user_id);
```

---

### 4.2 RLS Policy Patterns for Multi-Tenant Apps

**Impact: CRITICAL** (isolate tenant data, enable collaboration)

**Pattern: Organization-based access**
```sql
-- Shared resources within organization
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  owner_id UUID REFERENCES users(id)
);

CREATE TABLE organization_members (
  organization_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT,
  PRIMARY KEY (organization_id, user_id)
);

-- RLS: Access if user is org member
CREATE POLICY "Org members access properties"
ON properties FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = properties.organization_id
    AND user_id = auth.uid()
  )
);

-- RLS: Only admins can delete
CREATE POLICY "Org admins delete properties"
ON properties FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = properties.organization_id
    AND user_id = auth.uid()
    AND role = 'admin'
  )
);
```

**Pulwave-specific**: Property managers pattern:
```sql
-- Property managers can access assigned properties
CREATE TABLE property_managers (
  property_id UUID REFERENCES properties(id),
  user_id UUID REFERENCES users(id),
  PRIMARY KEY (property_id, user_id)
);

CREATE POLICY "Owners and managers access properties"
ON properties FOR SELECT
USING (
  auth.uid() = owner_id
  OR
  EXISTS (
    SELECT 1 FROM property_managers
    WHERE property_id = properties.id
    AND user_id = auth.uid()
  )
);
```

---

### 4.3 Optimize RLS Policies for Performance

**Impact: HIGH** (poorly written RLS can slow queries 10-100x)

**Incorrect: Subquery for every row**
```sql
-- ❌ SLOW: Correlated subquery executed per row
CREATE POLICY "Slow policy"
ON properties FOR SELECT
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  OR
  owner_id = auth.uid()
);
-- Subquery runs for EVERY row!
```

**Correct: Use indexed columns and joins**
```sql
-- ✅ FAST: Direct column comparison (indexed)
CREATE POLICY "Fast policy"
ON properties FOR SELECT
USING (
  owner_id = auth.uid()
  OR
  auth.jwt() ->> 'role' = 'admin'  -- Read from JWT (no query)
);

-- Ensure owner_id is indexed
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
```

**Metrics**: Optimized RLS adds <5% overhead. Poorly written RLS can slow queries by 10-100x.

---

### 4.4 Test RLS Policies Thoroughly

**Impact: HIGH** (RLS bugs = data breaches)

**Pattern: Test as different users**
```sql
-- Set session to specific user
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claim.sub = 'user-123';

-- Test: Can user read only their data?
SELECT * FROM properties;
-- Should return only properties where owner_id = 'user-123'

-- Test: Can user modify others' data?
UPDATE properties SET name = 'Hacked' WHERE id = 'other-user-property';
-- Should fail (0 rows updated)

-- Reset
RESET role;
```

**Pulwave-specific**: Automated RLS tests:
```typescript
// Test suite for RLS policies
describe('Properties RLS', () => {
  it('allows users to read only own properties', async () => {
    const user1 = await createTestUser();
    const user2 = await createTestUser();

    const prop1 = await createProperty({ owner_id: user1.id });
    const prop2 = await createProperty({ owner_id: user2.id });

    // Login as user1
    const supabase1 = createClientForUser(user1);
    const { data } = await supabase1.from('properties').select();

    expect(data).toHaveLength(1);
    expect(data[0].id).toBe(prop1.id);
  });
});
```

---

## 5. Transactions & Concurrency

### 5.1 Use Transactions for Multi-Step Operations

**Impact: CRITICAL** (prevents partial updates, ensures data integrity)

**Incorrect: Multiple statements without transaction**
```sql
-- ❌ DANGEROUS: No atomicity
-- Transfer money between accounts
UPDATE accounts SET balance = balance - 100 WHERE id = 'acc-1';
-- What if crash happens here?
UPDATE accounts SET balance = balance + 100 WHERE id = 'acc-2';
-- acc-1 debited, acc-2 never credited! (data corruption)
```

**Correct: Atomic transaction**
```sql
-- ✅ SAFE: All or nothing
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 'acc-1';
UPDATE accounts SET balance = balance + 100 WHERE id = 'acc-2';

COMMIT;
-- Both updates succeed or both fail (atomic)

-- With error handling
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 'acc-1';
-- Check balance didn't go negative
IF (SELECT balance FROM accounts WHERE id = 'acc-1') < 0 THEN
  ROLLBACK; -- Undo all changes
  RAISE EXCEPTION 'Insufficient balance';
ELSE
  UPDATE accounts SET balance = balance + 100 WHERE id = 'acc-2';
  COMMIT;
END IF;
```

**Metrics**: Transactions ensure ACID properties (Atomicity, Consistency, Isolation, Durability). Required for financial operations, inventory updates, multi-table writes.

**Pulwave-specific**: Supabase RPC for transactions:
```sql
-- Create function with transaction
CREATE OR REPLACE FUNCTION transfer_money(
  from_account UUID,
  to_account UUID,
  amount NUMERIC
)
RETURNS VOID AS $$
BEGIN
  -- Check balance
  IF (SELECT balance FROM accounts WHERE id = from_account) < amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Debit
  UPDATE accounts SET balance = balance - amount WHERE id = from_account;

  -- Credit
  UPDATE accounts SET balance = balance + amount WHERE id = to_account;

  -- Log transaction
  INSERT INTO transactions (from_account, to_account, amount)
  VALUES (from_account, to_account, amount);
END;
$$ LANGUAGE plpgsql;

-- Call from client
await supabase.rpc('transfer_money', {
  from_account: 'acc-1',
  to_account: 'acc-2',
  amount: 100,
});
```

---

### 5.2 Handle Concurrent Updates with Locking

**Impact: HIGH** (prevents lost updates in concurrent scenarios)

**Problem: Lost update**
```sql
-- ❌ LOST UPDATE PROBLEM
-- User A reads balance: $100
SELECT balance FROM accounts WHERE id = 'acc-1'; -- 100

-- User B reads balance: $100
SELECT balance FROM accounts WHERE id = 'acc-1'; -- 100

-- User A updates: balance = 100 + 50 = 150
UPDATE accounts SET balance = 150 WHERE id = 'acc-1';

-- User B updates: balance = 100 + 30 = 130 (overwrites A's update!)
UPDATE accounts SET balance = 130 WHERE id = 'acc-1';

-- Final balance: 130 (should be 180!)
```

**Solution: Optimistic locking with version column**
```sql
-- ✅ SAFE: Version-based concurrency control
ALTER TABLE accounts ADD COLUMN version INT DEFAULT 1;

-- User A reads balance + version
SELECT balance, version FROM accounts WHERE id = 'acc-1';
-- balance: 100, version: 1

-- User A updates with version check
UPDATE accounts
SET balance = 150, version = version + 1
WHERE id = 'acc-1' AND version = 1;
-- Success: 1 row updated

-- User B updates with same version
UPDATE accounts
SET balance = 130, version = version + 1
WHERE id = 'acc-1' AND version = 1;
-- Failure: 0 rows updated (version is now 2)
-- Retry with new version

-- Alternative: Row-level locking (pessimistic)
BEGIN;

SELECT * FROM accounts WHERE id = 'acc-1' FOR UPDATE;
-- Locks row until transaction ends

UPDATE accounts SET balance = balance + 50 WHERE id = 'acc-1';

COMMIT;
-- Lock released
```

**Metrics**: Optimistic locking adds 1 column, prevents 100% of lost updates. Pessimistic locking reduces throughput (use for critical operations only).

---

## Appendix

### Database Performance Checklist

- [ ] All foreign keys indexed
- [ ] Composite indexes for multi-column queries
- [ ] No N+1 queries (use JOINs or IN)
- [ ] RLS enabled on all user-facing tables
- [ ] Transactions for multi-step operations
- [ ] Query plans analyzed with EXPLAIN ANALYZE
- [ ] Indexes monitored for usage (remove unused)
- [ ] Pagination uses cursors (not OFFSET)
- [ ] Check constraints for data validation
- [ ] Zero-downtime migration strategy

### Common Query Patterns

```sql
-- Prevent N+1: Get properties with owners
SELECT
  p.*,
  json_build_object('id', u.id, 'name', u.name) AS owner
FROM properties p
LEFT JOIN users u ON u.id = p.owner_id;

-- Aggregate with GROUP BY
SELECT
  owner_id,
  COUNT(*) AS property_count,
  AVG(price) AS avg_price
FROM properties
GROUP BY owner_id;

-- Cursor pagination
SELECT * FROM properties
WHERE created_at < $cursor
ORDER BY created_at DESC
LIMIT 20;

-- Full-text search
SELECT * FROM properties
WHERE to_tsvector('english', name || ' ' || description)
  @@ to_tsquery('luxury & pool');

-- JSON operations
SELECT * FROM properties
WHERE metadata @> '{"features": "parking"}';
```

---

**End of Database Expertise Guide**

For questions or improvements, consult the database team or update this document following the contribution guidelines.
