# Backend Skills - Category Guide

**Version 1.2.0**
Pulwave Engineering
2026-01-18

> **Note:**
> This is the backend category compilation for AI agents and LLMs working on the Pulwave codebase.
> This document aggregates all 2 backend skills with links to detailed implementation guides.

## Abstract

Backend development guide for Pulwave's Supabase-managed stack. Contains 2 skills covering API design and database optimization. Pulwave uses Supabase managed backend (no self-hosted servers or Edge Functions).

**Note**: Skills removed in v1.2.0: `nodejs` (no self-hosted servers), `serverless` (no Edge Functions). Skills removed in v1.1.0: `distributed-systems` (no Kafka/Redis), `frameworks` (no backend frameworks).

**Backend Tech Stack:**
- Supabase (managed database, auth, storage)
- RESTful APIs via Supabase client
- Row Level Security (RLS)
- PostgreSQL (database)
- Frontend-only React monorepo

---

## Table of Contents

1. [API Design](#1-api-design) (HIGH) - RESTful patterns, versioning
2. [Database](#2-database) (HIGH) - Supabase optimization, RLS

---

## 1. API Design

**Location**: [api-design/](api-design/)
**Quick Ref**: [SKILL.md](api-design/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: HIGH

RESTful API patterns, resource naming, versioning strategies, error handling, pagination, filtering, sorting.

### Key Patterns

- **RESTful resource naming** - `/api/v1/resources`, plural nouns
- **Cursor-based pagination** - Better for large datasets
- **Standard error responses** - Consistent error format
- **API versioning** - `/api/v1`, `/api/v2` for breaking changes

### When to Use

- Designing new API endpoints
- Refactoring existing APIs
- Implementing pagination
- Error handling standardization
- API versioning decisions

---

## 2. Database

**Location**: [database/](database/)
**Quick Ref**: [SKILL.md](database/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q1 priority

**Impact**: HIGH

Supabase patterns, query optimization, indexing strategies, Row Level Security (RLS) policies, views for complex queries.

### Key Patterns

- **RLS policies** - Row-level authorization
- **Indexes on foreign keys** - Query performance
- **Avoid N+1 queries** - Use joins or batch queries
- **Use views** - Complex query abstraction

### When to Use

- Optimizing slow queries
- Implementing authorization
- Creating database schema
- Adding indexes
- Writing complex queries

---

## Usage Workflows

### Creating a New API Endpoint

**Backend workflow:**

```typescript
// 1. Design API (api-design)
// RESTful: POST /api/v1/properties
// Request body validation
// Response format

// 2. Create database function (database)
// SQL function with RLS
CREATE OR REPLACE FUNCTION create_property(...)
RETURNS properties AS $$
BEGIN
  -- Insert with RLS enforcement
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

// 3. Implement repository (data-layer from architecture)
// packages/data/domains/property/repositories/propertyRepository.ts
export const propertyRepository = {
  async create(data: CreatePropertyDTO) {
    return dataProvider.property.create(data);
  },
};

// 4. Implement service (data-layer from architecture)
// packages/data/domains/property/services/propertyService.ts
export const propertyService = {
  async createProperty(data: CreatePropertyDTO) {
    // Validation
    validatePropertyData(data);

    // Business logic
    const enrichedData = enrichProperty(data);

    // Repository call
    return propertyRepository.create(enrichedData);
  },
};

// 5. Create API route (frameworks)
// app.post('/api/v1/properties', async (req, res) => {
//   try {
//     const property = await propertyService.createProperty(req.body);
//     res.status(201).json(property);
//   } catch (error) {
//     handleError(error, res);
//   }
// });
```

---

### Optimizing Slow Query

**Database optimization workflow:**

```sql
-- 1. Identify slow query (database)
EXPLAIN ANALYZE
SELECT * FROM properties
WHERE user_id = '...'
AND status = 'active';

-- 2. Add index (database)
CREATE INDEX idx_properties_user_status
ON properties(user_id, status);

-- 3. Add RLS policy (database)
CREATE POLICY properties_select
ON properties FOR SELECT
USING (user_id = auth.uid() OR is_admin());

-- 4. Test query performance (database)
EXPLAIN ANALYZE
SELECT * FROM properties
WHERE user_id = '...'
AND status = 'active';
-- Should show index usage

-- 5. Update repository if needed (data-layer)
-- Add caching, batch queries
```

---

## Anti-Patterns to Avoid

### ❌ N+1 Queries

```typescript
// BAD: N+1 query problem
async function getPropertiesWithOwners(propertyIds: string[]) {
  const properties = await propertyRepository.findByIds(propertyIds);

  // N additional queries!
  for (const property of properties) {
    property.owner = await userRepository.findById(property.userId);
  }

  return properties;
}

// GOOD: Single query with join
async function getPropertiesWithOwners(propertyIds: string[]) {
  return propertyRepository.findByIdsWithOwners(propertyIds);
  // Uses SQL JOIN or batch query
}
```

---

### ❌ Missing Error Handling

```typescript
// BAD: Unhandled promise rejection
async function updateProperty(id: string, data: UpdateDTO) {
  await propertyRepository.update(id, data); // Can throw, no handling!
}

// GOOD: Proper error handling
async function updateProperty(id: string, data: UpdateDTO) {
  try {
    await propertyRepository.update(id, data);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new HttpError(404, 'Property not found');
    }
    if (error instanceof ValidationError) {
      throw new HttpError(400, error.message);
    }
    // Log and rethrow
    logger.error('Failed to update property', { id, error });
    throw new HttpError(500, 'Internal server error');
  }
}
```

---

### ❌ No Request Validation

```typescript
// BAD: No validation
app.post('/api/v1/properties', async (req, res) => {
  const property = await propertyService.createProperty(req.body);
  res.json(property);
});

// GOOD: Schema validation
import { z } from 'zod';

const createPropertySchema = z.object({
  name: z.string().min(1).max(100),
  address: z.string(),
  price: z.number().positive(),
});

app.post('/api/v1/properties', async (req, res) => {
  try {
    const data = createPropertySchema.parse(req.body);
    const property = await propertyService.createProperty(data);
    res.status(201).json(property);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    }
  }
});
```

---

## Coverage Status

| Skill | SKILL.md | AGENTS.md | Priority |
|-------|----------|-----------|----------|
| api-design | ✅ | ⚠️ Q2 | HIGH |
| database | ✅ | ⚠️ Q1 | HIGH |

**Current**: 0/2 skills with AGENTS.md (0%)
**Q1 Target**: 1/2 skills (50%)
**Q2 Target**: 2/2 skills (100%)

---

## Related Categories

- **Architecture** - [../architecture/AGENTS.md](../architecture/AGENTS.md) - Data layer patterns
- **Crosscutting** - [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Error handling, logging
- **Testing** - [../testing/AGENTS.md](../testing/AGENTS.md) - Backend testing

---

## Further Reading

- [Pulwave Architecture Guide](../../../CLAUDE.md)
- [Master Skills Library](../AGENTS.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Last Updated**: 2026-01-18
**Version**: 1.2.0
**Total Skills**: 2
**With AGENTS.md**: 0
**Maintained By**: Pulwave Engineering

**Changes in v1.2.0:**
- Removed `nodejs` (no self-hosted Node.js servers, frontend-only monorepo)
- Removed `serverless` (no Supabase Edge Functions, no serverless code)

**Changes in v1.1.0:**
- Removed `distributed-systems` (no Kafka/Redis clusters in Pulwave)
- Removed `frameworks` (no self-hosted Node.js servers, using Supabase managed backend)
