# API Design Implementation Guide

**Abstract**: This guide provides comprehensive patterns for designing robust, scalable, and developer-friendly APIs. Covers REST and GraphQL best practices, HTTP methods, status codes, error handling, versioning, pagination, filtering, authentication, rate limiting, and documentation. Every pattern includes incorrect vs correct implementations with full code examples specific to Pulwave's TypeScript + Supabase stack.

---

## Table of Contents

1. **REST API Design** (CRITICAL)
   - 1.1 Resource Naming
   - 1.2 HTTP Methods
   - 1.3 URL Structure
   - 1.4 Status Codes
   - 1.5 Idempotency

2. **Request/Response Design** (CRITICAL)
   - 2.1 Request Validation
   - 2.2 Response Format
   - 2.3 Error Responses
   - 2.4 Pagination
   - 2.5 Filtering and Sorting

3. **GraphQL Design** (HIGH)
   - 3.1 Schema Design
   - 3.2 Queries
   - 3.3 Mutations
   - 3.4 N+1 Problem (DataLoader)
   - 3.5 Security (Depth Limiting)

4. **API Versioning** (CRITICAL)
   - 4.1 Versioning Strategies
   - 4.2 Breaking Changes
   - 4.3 Deprecation Policy
   - 4.4 Version Communication
   - 4.5 Migration Path

5. **Error Handling** (CRITICAL)
   - 5.1 Error Response Format
   - 5.2 Validation Errors
   - 5.3 HTTP Status Codes
   - 5.4 Error Messages
   - 5.5 Error Logging

6. **Security** (CRITICAL)
   - 6.1 Authentication
   - 6.2 Authorization
   - 6.3 Input Validation
   - 6.4 Rate Limiting
   - 6.5 CORS

7. **Documentation** (HIGH)
   - 7.1 OpenAPI/Swagger
   - 7.2 Request/Response Examples
   - 7.3 Authentication Documentation
   - 7.4 Error Documentation
   - 7.5 Changelog

8. **Performance** (HIGH)
   - 8.1 Caching
   - 8.2 Compression
   - 8.3 Payload Size
   - 8.4 Query Optimization
   - 8.5 Rate Limiting

9. **Testing** (HIGH)
   - 9.1 Contract Testing
   - 9.2 Integration Testing
   - 9.3 Performance Testing
   - 9.4 Security Testing
   - 9.5 Documentation Testing

10. **Common Patterns** (MEDIUM)
    - 10.1 HATEOAS
    - 10.2 Batch Operations
    - 10.3 Webhooks
    - 10.4 Long-Running Operations
    - 10.5 File Uploads

**Appendix**
- A. HTTP Status Codes Reference
- B. REST vs GraphQL Decision Matrix
- C. API Design Checklist
- D. OpenAPI Specification Template

---

## 1. REST API Design (CRITICAL)

**Impact**: RESTful design principles ensure APIs are predictable, intuitive, and easy to consume. Consistent REST patterns reduce developer friction and improve API adoption.

### 1.1 Resource Naming

**Problem**: Inconsistent naming makes APIs confusing and hard to discover.

**Incorrect**:
```typescript
// ❌ Verbs in URLs
GET /getUsers
POST /createUser
DELETE /deleteUser/{id}

// ❌ Singular nouns
GET /user
GET /property

// ❌ Inconsistent naming
GET /users
GET /property  // Should be /properties
GET /lease     // Should be /leases

// ❌ Mixed case
GET /Users
GET /propertyTypes
```

**Correct**:
```typescript
// ✅ Plural nouns, consistent naming
GET    /users
POST   /users
GET    /users/{id}
PUT    /users/{id}
PATCH  /users/{id}
DELETE /users/{id}

GET    /properties
POST   /properties
GET    /properties/{id}

GET    /tenants
GET    /leases

// ✅ Nested resources (max 2 levels deep)
GET    /properties/{id}/units
GET    /properties/{id}/units/{unitId}
GET    /users/{id}/leases
POST   /users/{id}/payment-methods

// ✅ Kebab-case for multi-word resources
GET    /payment-methods
GET    /subscription-plans
GET    /audit-logs

// ✅ Collection actions (use verbs sparingly)
POST   /users/{id}/verify-email
POST   /properties/{id}/publish
POST   /leases/{id}/terminate

// Pulwave API pattern
// packages/data/domains/properties/api/routes.ts
export const propertyRoutes = {
  list: '/api/v1/properties',
  detail: '/api/v1/properties/:id',
  units: '/api/v1/properties/:id/units',
  publish: '/api/v1/properties/:id/publish',  // Action
} as const;
```

**Naming Rules**:
1. **Plural nouns** for resources (`/users`, not `/user`)
2. **No verbs** in URLs (`/users`, not `/getUsers`)
3. **Kebab-case** for multi-word (`/payment-methods`)
4. **Max 2-3 levels** of nesting
5. **Actions as verbs** only when necessary (`/verify-email`)

**Metrics**:
- Plural nouns: 100% of resources
- URL depth: ≤ 3 levels
- Consistent case: kebab-case everywhere

---

### 1.2 HTTP Methods

**Problem**: Using wrong HTTP methods violates REST principles and breaks caching, idempotency, and safety guarantees.

**Incorrect**:
```typescript
// ❌ GET with side effects (not safe)
GET /users/{id}/delete

// ❌ POST for everything
POST /users/get
POST /users/update

// ❌ Wrong method for operation
GET /users (with body to create user)
DELETE /users/{id} (returns updated list)
```

**Correct**:
```typescript
// ✅ GET - Retrieve (Safe, Cacheable)
GET /users           // List all users
GET /users/{id}      // Get single user
GET /properties?status=active  // Filter

// ✅ POST - Create (Not Idempotent, Not Safe)
POST /users
Request:
{
  "email": "user@example.com",
  "name": "John Doe"
}
Response: 201 Created
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2026-01-17T10:00:00Z"
}

// ✅ PUT - Replace entire resource (Idempotent)
PUT /users/{id}
Request:
{
  "email": "user@example.com",
  "name": "John Smith",  // Must include all fields
  "phone": "+351912345678"
}

// ✅ PATCH - Update partial (Idempotent, preferred)
PATCH /users/{id}
Request:
{
  "name": "John Smith"  // Only changed fields
}

// ✅ DELETE - Remove (Idempotent)
DELETE /users/{id}
Response: 204 No Content

// Pulwave controller pattern
// packages/data/domains/properties/api/controller.ts
import { Request, Response } from 'express';
import { propertyService } from '../services/propertyService';

export const propertyController = {
  // GET - List properties
  async list(req: Request, res: Response) {
    const { page = 1, limit = 20, status } = req.query;
    const properties = await propertyService.list({ page, limit, status });
    return res.status(200).json(properties);
  },

  // GET - Get single property
  async get(req: Request, res: Response) {
    const { id } = req.params;
    const property = await propertyService.findById(id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    return res.status(200).json(property);
  },

  // POST - Create property
  async create(req: Request, res: Response) {
    const property = await propertyService.create(req.body);
    return res.status(201).json(property);
  },

  // PATCH - Update property
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const property = await propertyService.update(id, req.body);
    return res.status(200).json(property);
  },

  // DELETE - Remove property
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await propertyService.delete(id);
    return res.status(204).send();
  },
};
```

**HTTP Method Properties**:

| Method | Safe | Idempotent | Cacheable | Request Body | Response Body |
|--------|------|------------|-----------|--------------|---------------|
| GET | ✅ | ✅ | ✅ | ❌ | ✅ |
| POST | ❌ | ❌ | ❌ | ✅ | ✅ |
| PUT | ❌ | ✅ | ❌ | ✅ | ✅ |
| PATCH | ❌ | ✅ | ❌ | ✅ | ✅ |
| DELETE | ❌ | ✅ | ❌ | ❌ | Optional |

**Key Points**:
- **Safe**: No side effects (GET, HEAD, OPTIONS)
- **Idempotent**: Same result if called multiple times (PUT, PATCH, DELETE, GET)
- **Cacheable**: Response can be cached (GET, HEAD)
- Use PATCH over PUT for partial updates

---

### 1.3 URL Structure

**Problem**: Poorly structured URLs make APIs hard to understand and use.

**Incorrect**:
```typescript
// ❌ Deep nesting (4+ levels)
GET /organizations/{orgId}/properties/{propId}/units/{unitId}/tenants/{tenantId}

// ❌ Query params in path
GET /users/search?name=john  // Should be GET /users?name=john

// ❌ Inconsistent structure
GET /users/{id}
GET /property-detail/{id}
GET /get-tenant/{id}
```

**Correct**:
```typescript
// ✅ Shallow nesting (max 2-3 levels)
GET /properties/{id}
GET /properties/{id}/units
GET /units/{id}/tenant

// ✅ Use query params for filtering
GET /users?name=john&role=admin
GET /properties?status=active&city=lisbon

// ✅ Consistent structure
GET /users/{id}
GET /properties/{id}
GET /tenants/{id}

// ✅ Collection operations
GET    /properties              // List all
GET    /properties/{id}         // Get one
GET    /properties/{id}/units   // Nested collection
POST   /properties              // Create
PATCH  /properties/{id}         // Update
DELETE /properties/{id}         // Delete

// ✅ Actions as sub-resources (when needed)
POST /properties/{id}/publish
POST /users/{id}/verify-email
POST /leases/{id}/renew

// Pulwave URL patterns
// packages/data/domains/properties/api/routes.ts
import { Router } from 'express';
import { propertyController } from './controller';
import { authenticate } from '@pulwave/data/middleware';

const router = Router();

// Collection routes
router.get('/properties', authenticate, propertyController.list);
router.post('/properties', authenticate, propertyController.create);

// Individual resource routes
router.get('/properties/:id', authenticate, propertyController.get);
router.patch('/properties/:id', authenticate, propertyController.update);
router.delete('/properties/:id', authenticate, propertyController.delete);

// Nested resources
router.get('/properties/:id/units', authenticate, propertyController.getUnits);
router.post('/properties/:id/units', authenticate, propertyController.createUnit);

// Actions
router.post('/properties/:id/publish', authenticate, propertyController.publish);

export default router;
```

**URL Structure Rules**:
1. **Version in URL**: `/api/v1/resources`
2. **Plural nouns**: `/users`, `/properties`
3. **Max depth**: 2-3 levels
4. **Query params**: For filtering, sorting, pagination
5. **Path params**: For resource IDs
6. **Actions**: POST to `/resource/{id}/action` (sparingly)

---

### 1.4 Status Codes

**Problem**: Using wrong status codes confuses clients and breaks HTTP semantics.

**Incorrect**:
```typescript
// ❌ 200 OK for all responses
res.status(200).json({ error: 'User not found' });
res.status(200).json({ error: 'Validation failed' });

// ❌ Generic 500 for validation errors
res.status(500).json({ error: 'Email is required' });

// ❌ 404 for authorization failures
if (!hasPermission) {
  res.status(404).json({ error: 'Not found' });
}
```

**Correct**:
```typescript
// ✅ 2xx - Success
res.status(200).json(data);              // GET, PATCH - Success
res.status(201).json(created);           // POST - Created
res.status(204).send();                  // DELETE - No content

// ✅ 4xx - Client errors
res.status(400).json({ error: 'Invalid email format' });  // Bad request
res.status(401).json({ error: 'Authentication required' }); // Unauthorized
res.status(403).json({ error: 'Insufficient permissions' }); // Forbidden
res.status(404).json({ error: 'Property not found' });    // Not found
res.status(409).json({ error: 'Email already exists' });  // Conflict
res.status(422).json({ errors: validationErrors });      // Validation failed
res.status(429).json({ error: 'Rate limit exceeded' });   // Too many requests

// ✅ 5xx - Server errors
res.status(500).json({ error: 'Internal server error' }); // Server bug
res.status(503).json({ error: 'Service unavailable' });   // Maintenance

// Pulwave error middleware
// packages/data/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: 'Validation failed',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Custom API errors
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  // Database errors
  if (err.message.includes('unique constraint')) {
    return res.status(409).json({
      error: 'Resource already exists',
    });
  }

  // Default to 500
  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: 'Internal server error',
  });
};

// Usage in controller
export const createProperty = async (req: Request, res: Response) => {
  const property = await propertyService.create(req.body);

  if (!property) {
    throw new APIError(400, 'Failed to create property');
  }

  return res.status(201).json(property);
};
```

**Status Code Cheat Sheet**:

**2xx - Success**
- `200 OK` - GET, PATCH success
- `201 Created` - POST success (include Location header)
- `204 No Content` - DELETE success, no body

**4xx - Client Error**
- `400 Bad Request` - Malformed request
- `401 Unauthorized` - Authentication required/failed
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource conflict (duplicate email)
- `422 Unprocessable Entity` - Validation failed
- `429 Too Many Requests` - Rate limit exceeded

**5xx - Server Error**
- `500 Internal Server Error` - Unexpected server error
- `503 Service Unavailable` - Maintenance or overload

---

### 1.5 Idempotency

**Problem**: Non-idempotent operations can cause duplicate records or inconsistent state.

**Incorrect**:
```typescript
// ❌ POST without idempotency key (can create duplicates)
POST /payments
{
  "amount": 100,
  "currency": "EUR"
}

// ❌ PATCH changes based on current value (not idempotent)
PATCH /users/{id}/increment-login-count
```

**Correct**:
```typescript
// ✅ POST with idempotency key
POST /payments
Headers:
  Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Request:
{
  "amount": 100,
  "currency": "EUR"
}

// ✅ PATCH with absolute values (idempotent)
PATCH /users/{id}
{
  "login_count": 42  // Absolute value
}

// ✅ PUT replaces entire resource (idempotent)
PUT /users/{id}
{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+351912345678"
}

// Pulwave idempotency middleware
// packages/data/middleware/idempotency.ts
import { Request, Response, NextFunction } from 'express';
import { redis } from '@pulwave/data/providers/redis';

export const idempotencyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only check for POST requests
  if (req.method !== 'POST') {
    return next();
  }

  const idempotencyKey = req.headers['idempotency-key'] as string;

  if (!idempotencyKey) {
    return res.status(400).json({
      error: 'Idempotency-Key header required for POST requests',
    });
  }

  // Check if we've seen this key before
  const cachedResponse = await redis.get(`idempotency:${idempotencyKey}`);

  if (cachedResponse) {
    // Return cached response
    const { status, body } = JSON.parse(cachedResponse);
    return res.status(status).json(body);
  }

  // Capture response
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    // Cache response for 24 hours
    redis.set(
      `idempotency:${idempotencyKey}`,
      JSON.stringify({ status: res.statusCode, body }),
      'EX',
      86400
    );
    return originalJson(body);
  };

  next();
};

// Usage
router.post('/payments', idempotencyMiddleware, paymentController.create);
```

**Key Points**:
- POST: Use Idempotency-Key header for duplicate prevention
- PUT: Always idempotent (replaces entire resource)
- PATCH: Should be idempotent (use absolute values)
- DELETE: Idempotent (deleting same resource twice = same result)
- GET: Always idempotent and safe

---

## 2. Request/Response Design (CRITICAL)

### 2.1 Request Validation

**Problem**: Accepting invalid input leads to data corruption and security vulnerabilities.

**Incorrect**:
```typescript
// ❌ No validation
export const createProperty = async (req: Request, res: Response) => {
  const property = await propertyService.create(req.body);
  return res.status(201).json(property);
};

// ❌ Manual validation (error-prone)
export const createProperty = async (req: Request, res: Response) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name required' });
  }
  if (typeof req.body.price !== 'number') {
    return res.status(400).json({ error: 'Price must be number' });
  }
  // ... many more checks
};
```

**Correct**:
```typescript
// ✅ Zod schema validation
import { z } from 'zod';

// Define schema
const createPropertySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postal_code: z.string().regex(/^\d{4}-\d{3}$/, 'Invalid postal code'),
    country: z.string().length(2, 'Country must be ISO code'),
  }),
  type: z.enum(['residential', 'commercial', 'industrial']),
  status: z.enum(['draft', 'active', 'sold']).default('draft'),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  area_sqm: z.number().positive().optional(),
});

type CreatePropertyInput = z.infer<typeof createPropertySchema>;

// Validation middleware
// packages/data/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code,
          })),
        });
      }
      next(error);
    }
  };
};

// Usage in routes
import { validate } from '@pulwave/data/middleware';

router.post(
  '/properties',
  authenticate,
  validate(createPropertySchema),
  propertyController.create
);

// Controller (validated input)
export const create = async (req: Request, res: Response) => {
  const input = req.body as CreatePropertyInput; // Already validated
  const property = await propertyService.create(input);
  return res.status(201).json(property);
};

// ✅ Query parameter validation
const listPropertiesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['draft', 'active', 'sold']).optional(),
  city: z.string().optional(),
  min_price: z.coerce.number().positive().optional(),
  max_price: z.coerce.number().positive().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'created_desc']).default('created_desc'),
});

router.get(
  '/properties',
  authenticate,
  validateQuery(listPropertiesQuerySchema),
  propertyController.list
);
```

**Validation Response Format**:
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "price",
      "message": "Price must be positive",
      "code": "too_small"
    },
    {
      "field": "address.postal_code",
      "message": "Invalid postal code",
      "code": "invalid_string"
    }
  ]
}
```

**Key Points**:
- Use Zod for type-safe validation
- Validate all inputs (body, query, params)
- Return 422 with detailed errors
- Use schemas for TypeScript types
- Validate early (middleware)

---

### 2.2 Response Format

**Problem**: Inconsistent response formats make clients hard to build.

**Incorrect**:
```typescript
// ❌ Inconsistent success response
GET /users/{id}
{ "id": 1, "name": "John" }

GET /properties
{ "items": [...] }

GET /tenants
[...]  // Array at root

// ❌ Metadata missing
GET /properties?page=2
{
  "data": [...]  // No pagination info
}
```

**Correct**:
```typescript
// ✅ Consistent success response (data wrapper)
GET /users/{id}
{
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-01-17T10:00:00Z",
    "updated_at": "2026-01-17T10:00:00Z"
  }
}

// ✅ Collection with metadata
GET /properties?page=2&limit=20
{
  "data": [
    {
      "id": "uuid",
      "name": "Property 1",
      "price": 250000
    }
  ],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  },
  "links": {
    "first": "/api/v1/properties?page=1&limit=20",
    "prev": "/api/v1/properties?page=1&limit=20",
    "next": "/api/v1/properties?page=3&limit=20",
    "last": "/api/v1/properties?page=8&limit=20"
  }
}

// ✅ Empty collection
GET /properties
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "total_pages": 0
  }
}

// Pulwave response wrapper
// packages/data/utils/response.ts
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PaginationLinks {
  first: string;
  prev?: string;
  next?: string;
  last: string;
}

export interface APIResponse<T> {
  data: T;
  meta?: PaginationMeta;
  links?: PaginationLinks;
}

export const createResponse = <T>(data: T): APIResponse<T> => ({
  data,
});

export const createPaginatedResponse = <T>(
  data: T[],
  meta: PaginationMeta,
  baseUrl: string
): APIResponse<T[]> => {
  const { page, limit, total_pages } = meta;

  return {
    data,
    meta,
    links: {
      first: `${baseUrl}?page=1&limit=${limit}`,
      prev: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : undefined,
      next: page < total_pages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : undefined,
      last: `${baseUrl}?page=${total_pages}&limit=${limit}`,
    },
  };
};

// Usage
export const list = async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const { data, total } = await propertyService.list({ page, limit });

  const response = createPaginatedResponse(
    data,
    {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
    '/api/v1/properties'
  );

  return res.status(200).json(response);
};
```

**Response Format Rules**:
1. **Wrap in `data`** for consistency
2. **Include `meta`** for pagination
3. **Include `links`** for navigation (HATEOAS)
4. **ISO 8601 dates**: `2026-01-17T10:00:00Z`
5. **Camel case**: `created_at`, not `createdAt`

---

### 2.3 Error Responses

**Problem**: Inconsistent or vague error responses make debugging difficult.

**Incorrect**:
```typescript
// ❌ Generic error message
{
  "error": "Error"
}

// ❌ No error code
{
  "message": "Something went wrong"
}

// ❌ Exposing internal details
{
  "error": "Error: Cannot read property 'id' of undefined at line 42"
}
```

**Correct**:
```typescript
// ✅ Structured error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}

// ✅ Authentication error
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}

// ✅ Not found error
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Property not found",
    "resource_type": "property",
    "resource_id": "uuid"
  }
}

// ✅ Rate limit error
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retry_after": 60
  }
}

// Pulwave error types
// packages/data/utils/errors.ts
export enum ErrorCode {
  // 4xx errors
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // 5xx errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
    resource_type?: string;
    resource_id?: string;
    retry_after?: number;
  };
}

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public code: ErrorCode,
    public message: string,
    public details?: unknown
  ) {
    super(message);
  }

  toJSON(): ErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

// Usage
throw new APIError(
  404,
  ErrorCode.NOT_FOUND,
  'Property not found',
  { resource_type: 'property', resource_id: id }
);
```

**Error Response Format**:
- Always include `code` (machine-readable)
- Always include `message` (human-readable)
- Include `details` for validation errors
- Don't expose internal errors to users
- Log full error stack server-side

---

### 2.4 Pagination

**Problem**: Returning large datasets without pagination causes performance issues.

**Incorrect**:
```typescript
// ❌ No pagination (returns all records)
GET /properties
{
  "data": [/* 10,000 properties */]
}

// ❌ Offset pagination with large datasets
GET /properties?offset=50000&limit=20  // Slow on large tables
```

**Correct**:
```typescript
// ✅ Cursor-based pagination (for large datasets)
GET /properties?cursor=eyJpZCI6InV1aWQifQ&limit=20
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6Im5leHQtdXVpZCJ9",
    "prev_cursor": "eyJpZCI6InByZXYtdXVpZCJ9",
    "has_more": true
  }
}

// ✅ Offset pagination (for smaller datasets with page numbers)
GET /properties?page=2&limit=20
{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}

// Pulwave cursor pagination
// packages/data/domains/properties/services/propertyService.ts
import { z } from 'zod';
import { propertyRepository } from '../repositories/propertyRepository';

interface CursorPaginationParams {
  cursor?: string;
  limit: number;
}

interface CursorPaginationResult<T> {
  data: T[];
  pagination: {
    next_cursor?: string;
    prev_cursor?: string;
    has_more: boolean;
  };
}

export const listWithCursor = async (
  params: CursorPaginationParams
): Promise<CursorPaginationResult<Property>> => {
  const { cursor, limit } = params;

  // Decode cursor (contains last seen ID)
  const decodedCursor = cursor
    ? JSON.parse(Buffer.from(cursor, 'base64').toString())
    : null;

  // Fetch limit + 1 to check if more exist
  const properties = await propertyRepository.findMany({
    where: decodedCursor ? { id: { gt: decodedCursor.id } } : {},
    orderBy: { id: 'asc' },
    take: limit + 1,
  });

  const hasMore = properties.length > limit;
  const data = hasMore ? properties.slice(0, limit) : properties;

  // Create next cursor from last item
  const nextCursor = hasMore
    ? Buffer.from(JSON.stringify({ id: data[data.length - 1].id })).toString('base64')
    : undefined;

  return {
    data,
    pagination: {
      next_cursor: nextCursor,
      has_more: hasMore,
    },
  };
};

// Offset pagination
interface OffsetPaginationParams {
  page: number;
  limit: number;
}

export const listWithOffset = async (params: OffsetPaginationParams) => {
  const { page, limit } = params;
  const offset = (page - 1) * limit;

  const [data, total] = await Promise.all([
    propertyRepository.findMany({
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    propertyRepository.count(),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};
```

**Pagination Strategies**:

| Type | Use Case | Pros | Cons |
|------|----------|------|------|
| **Offset** | Small datasets, need page numbers | Simple, allows jumping to page | Slow on large datasets, unstable with insertions |
| **Cursor** | Large datasets, infinite scroll | Fast, stable | Can't jump to page, more complex |
| **Keyset** | Time-series data | Very fast | Limited to specific queries |

**Key Points**:
- Use cursor for large datasets (>10k rows)
- Use offset for small datasets with page numbers
- Always include `has_more` or `total_pages`
- Default limit: 20-50 items
- Max limit: 100 items

---

### 2.5 Filtering and Sorting

**Problem**: Insufficient filtering makes APIs hard to use efficiently.

**Incorrect**:
```typescript
// ❌ No filtering
GET /properties  // Returns all properties

// ❌ Custom filter syntax (inconsistent)
GET /properties?filters=price>100000&city=lisbon

// ❌ No sorting options
GET /properties  // Always same order
```

**Correct**:
```typescript
// ✅ Query parameter filtering
GET /properties?status=active&city=lisbon&min_price=100000&max_price=500000

// ✅ Sorting
GET /properties?sort=price_asc
GET /properties?sort=-created_at  // Desc with '-' prefix

// ✅ Multiple filters
GET /properties?type=residential&bedrooms_gte=2&bathrooms_gte=2

// ✅ Text search
GET /properties?search=downtown&city=lisbon

// Pulwave filtering
// packages/data/domains/properties/services/propertyService.ts
import { z } from 'zod';

const filterSchema = z.object({
  // Exact match
  status: z.enum(['draft', 'active', 'sold']).optional(),
  type: z.enum(['residential', 'commercial', 'industrial']).optional(),
  city: z.string().optional(),

  // Range filters
  min_price: z.coerce.number().positive().optional(),
  max_price: z.coerce.number().positive().optional(),
  bedrooms_gte: z.coerce.number().int().min(0).optional(),
  bathrooms_gte: z.coerce.number().int().min(0).optional(),

  // Text search
  search: z.string().min(2).optional(),

  // Sort
  sort: z.enum([
    'price_asc',
    'price_desc',
    'created_asc',
    'created_desc',
    'updated_desc',
  ]).default('created_desc'),

  // Pagination
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

type PropertyFilters = z.infer<typeof filterSchema>;

export const list = async (filters: PropertyFilters) => {
  const {
    status,
    type,
    city,
    min_price,
    max_price,
    bedrooms_gte,
    bathrooms_gte,
    search,
    sort,
    page,
    limit,
  } = filters;

  // Build where clause
  const where: any = {};

  if (status) where.status = status;
  if (type) where.type = type;
  if (city) where.address = { path: ['city'], equals: city };

  if (min_price || max_price) {
    where.price = {};
    if (min_price) where.price.gte = min_price;
    if (max_price) where.price.lte = max_price;
  }

  if (bedrooms_gte) where.bedrooms = { gte: bedrooms_gte };
  if (bathrooms_gte) where.bathrooms = { gte: bathrooms_gte };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Build order by
  const orderBy = parseSort(sort);

  // Query
  const offset = (page - 1) * limit;

  const [data, total] = await Promise.all([
    propertyRepository.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
    }),
    propertyRepository.count({ where }),
  ]);

  return { data, total };
};

const parseSort = (sort: string) => {
  const [field, direction] = sort.split('_');
  return { [field]: direction };
};

// Controller
export const listProperties = async (req: Request, res: Response) => {
  const filters = filterSchema.parse(req.query);
  const { data, total } = await propertyService.list(filters);

  return res.status(200).json(
    createPaginatedResponse(data, {
      page: filters.page,
      limit: filters.limit,
      total,
      total_pages: Math.ceil(total / filters.limit),
    })
  );
};
```

**Filtering Conventions**:
- `field=value` - Exact match
- `field_gte=value` - Greater than or equal
- `field_lte=value` - Less than or equal
- `field_in=val1,val2` - In array
- `search=text` - Full-text search
- `sort=field_asc` or `sort=-field` - Sorting

---

## 3. GraphQL Design (HIGH)

### 3.1 Schema Design

**Problem**: Poorly designed GraphQL schemas lead to N+1 queries and inefficient data fetching.

**Incorrect**:
```graphql
# ❌ Flat types without relationships
type Property {
  id: ID!
  name: String!
  owner_id: ID!  # Client must fetch owner separately
}

# ❌ No pagination
type Query {
  properties: [Property!]!  # Returns all properties
}

# ❌ Overly nested mutations
type Mutation {
  updatePropertyOwnerAddressCity(
    propertyId: ID!
    ownerId: ID!
    addressId: ID!
    city: String!
  ): Property
}
```

**Correct**:
```graphql
# ✅ Well-structured schema with relationships
type Property {
  id: ID!
  name: String!
  description: String
  price: Float!
  status: PropertyStatus!
  type: PropertyType!
  address: Address!
  owner: User!  # Relationship
  units: [Unit!]!  # One-to-many
  created_at: DateTime!
  updated_at: DateTime!
}

enum PropertyStatus {
  DRAFT
  ACTIVE
  SOLD
}

enum PropertyType {
  RESIDENTIAL
  COMMERCIAL
  INDUSTRIAL
}

type Address {
  street: String!
  city: String!
  postal_code: String!
  country: String!
}

type User {
  id: ID!
  name: String!
  email: String!
  properties: PropertyConnection!  # Connection for pagination
}

# ✅ Cursor-based pagination
type PropertyConnection {
  edges: [PropertyEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PropertyEdge {
  node: Property!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# ✅ Well-organized queries
type Query {
  property(id: ID!): Property
  properties(
    first: Int
    after: String
    filter: PropertyFilter
    sort: PropertySort
  ): PropertyConnection!

  me: User
}

input PropertyFilter {
  status: PropertyStatus
  type: PropertyType
  city: String
  min_price: Float
  max_price: Float
}

input PropertySort {
  field: PropertySortField!
  direction: SortDirection!
}

enum PropertySortField {
  PRICE
  CREATED_AT
  UPDATED_AT
}

enum SortDirection {
  ASC
  DESC
}

# ✅ Clear mutation signatures
type Mutation {
  createProperty(input: CreatePropertyInput!): CreatePropertyPayload!
  updateProperty(id: ID!, input: UpdatePropertyInput!): UpdatePropertyPayload!
  deleteProperty(id: ID!): DeletePropertyPayload!
}

input CreatePropertyInput {
  name: String!
  description: String
  price: Float!
  type: PropertyType!
  address: AddressInput!
}

input UpdatePropertyInput {
  name: String
  description: String
  price: Float
  status: PropertyStatus
}

input AddressInput {
  street: String!
  city: String!
  postal_code: String!
  country: String!
}

type CreatePropertyPayload {
  property: Property!
  errors: [UserError!]
}

type UpdatePropertyPayload {
  property: Property
  errors: [UserError!]
}

type DeletePropertyPayload {
  success: Boolean!
  errors: [UserError!]
}

type UserError {
  field: String!
  message: String!
}

# Pulwave GraphQL setup
# packages/data/graphql/schema.graphql
```

**Schema Design Rules**:
1. **Descriptive types** with clear relationships
2. **Pagination** for all lists (Connection pattern)
3. **Enums** for fixed values
4. **Input types** for mutations
5. **Payload types** with `errors` field
6. **Clear naming** (nouns for types, verbs for mutations)

---

### 3.2 Queries

**Incorrect**:
```typescript
// ❌ No DataLoader (causes N+1 queries)
const resolvers = {
  Property: {
    owner: async (property) => {
      return await userRepository.findById(property.owner_id);
      // Called once per property!
    },
  },
};
```

**Correct**:
```typescript
// ✅ DataLoader prevents N+1 queries
import DataLoader from 'dataloader';

const createUserLoader = () => {
  return new DataLoader<string, User>(async (userIds) => {
    const users = await userRepository.findByIds(userIds);
    const userMap = new Map(users.map(u => [u.id, u]));
    return userIds.map(id => userMap.get(id)!);
  });
};

// Context with loaders
interface GraphQLContext {
  loaders: {
    user: DataLoader<string, User>;
    property: DataLoader<string, Property>;
  };
  user: User | null;
}

export const createContext = async ({ req }): Promise<GraphQLContext> => {
  const user = await authenticate(req);

  return {
    loaders: {
      user: createUserLoader(),
      property: createPropertyLoader(),
    },
    user,
  };
};

// Resolvers with DataLoader
const resolvers = {
  Property: {
    owner: async (property, _args, context: GraphQLContext) => {
      return context.loaders.user.load(property.owner_id);
      // Batched! Only 1 query for all properties
    },
  },

  Query: {
    properties: async (_parent, args, context) => {
      const { first = 20, after, filter, sort } = args;

      // Decode cursor
      const cursor = after ? decodeCursor(after) : null;

      // Query with filters
      const where = buildWhere(filter);
      const orderBy = buildOrderBy(sort);

      const properties = await propertyRepository.findMany({
        where: cursor ? { ...where, id: { gt: cursor.id } } : where,
        orderBy,
        take: first + 1,
      });

      const hasNextPage = properties.length > first;
      const edges = properties.slice(0, first).map(property => ({
        node: property,
        cursor: encodeCursor({ id: property.id }),
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!after,
          startCursor: edges[0]?.cursor,
          endCursor: edges[edges.length - 1]?.cursor,
        },
        totalCount: await propertyRepository.count({ where }),
      };
    },
  },
};

// Pulwave GraphQL server
// packages/data/graphql/server.ts
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './context';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  '/graphql',
  express.json(),
  expressMiddleware(server, {
    context: createContext,
  })
);
```

---

### 3.3 Mutations

**Correct**:
```typescript
// ✅ Mutation resolvers
const resolvers = {
  Mutation: {
    createProperty: async (_parent, { input }, context: GraphQLContext) => {
      // Authenticate
      if (!context.user) {
        return {
          property: null,
          errors: [{ field: 'auth', message: 'Authentication required' }],
        };
      }

      try {
        // Validate input
        const validated = createPropertySchema.parse(input);

        // Create property
        const property = await propertyService.create({
          ...validated,
          owner_id: context.user.id,
        });

        return {
          property,
          errors: [],
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            property: null,
            errors: error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          };
        }

        throw error;
      }
    },

    updateProperty: async (_parent, { id, input }, context) => {
      if (!context.user) {
        return {
          property: null,
          errors: [{ field: 'auth', message: 'Authentication required' }],
        };
      }

      // Check ownership
      const property = await propertyRepository.findById(id);
      if (!property || property.owner_id !== context.user.id) {
        return {
          property: null,
          errors: [{ field: 'id', message: 'Property not found' }],
        };
      }

      const updated = await propertyService.update(id, input);

      return {
        property: updated,
        errors: [],
      };
    },
  },
};
```

---

### 3.4 N+1 Problem (DataLoader)

See section 3.2 for complete DataLoader implementation.

**Key Points**:
- Always use DataLoader for relationships
- Batch database queries
- Cache within single request
- One loader per entity type

---

### 3.5 Security (Depth Limiting)

**Problem**: Deeply nested queries can cause DoS attacks.

**Correct**:
```typescript
// ✅ Depth limiting
import depthLimit from 'graphql-depth-limit';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5)],  // Max depth: 5
});

// ✅ Query complexity analysis
import { createComplexityLimitRule } from 'graphql-validation-complexity';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    createComplexityLimitRule(1000, {
      scalarCost: 1,
      objectCost: 2,
      listFactor: 10,
    }),
  ],
});

// ✅ Timeout limit
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    {
      async requestDidStart() {
        return {
          async executionDidStart() {
            const timeout = setTimeout(() => {
              throw new Error('Query timeout');
            }, 5000);  // 5 second timeout

            return {
              async executionDidEnd() {
                clearTimeout(timeout);
              },
            };
          },
        };
      },
    },
  ],
});
```

---

## 4. API Versioning (CRITICAL)

### 4.1 Versioning Strategies

**Problem**: Breaking changes without versioning break existing clients.

**Incorrect**:
```typescript
// ❌ No versioning
GET /properties

// ❌ Breaking change without version bump
// Old: GET /properties returns { id, name }
// New: GET /properties returns { uuid, title }  // BREAKS CLIENTS
```

**Correct**:
```typescript
// ✅ URL versioning (recommended)
GET /api/v1/properties
GET /api/v2/properties

// ✅ Header versioning
GET /properties
Headers:
  API-Version: 2024-01-01

// ✅ Content negotiation
GET /properties
Headers:
  Accept: application/vnd.pulwave.v1+json

// Pulwave versioning pattern (URL-based)
// packages/data/api/v1/routes.ts
import { Router } from 'express';
import { propertyController } from './controllers/propertyController';

const router = Router();

router.get('/api/v1/properties', propertyController.list);
router.post('/api/v1/properties', propertyController.create);

export default router;

// packages/data/api/v2/routes.ts (new version)
import { Router } from 'express';
import { propertyController as propertyControllerV2 } from './controllers/propertyController';

const router = Router();

// Breaking change: renamed fields
router.get('/api/v2/properties', propertyControllerV2.list);
router.post('/api/v2/properties', propertyControllerV2.create);

export default router;

// App setup
import v1Routes from './api/v1/routes';
import v2Routes from './api/v2/routes';

app.use(v1Routes);
app.use(v2Routes);
```

**Versioning Comparison**:

| Strategy | Pros | Cons | Pulwave Choice |
|----------|------|------|----------------|
| **URL** | Clear, cacheable, easy to route | URLs change | ✅ Recommended |
| **Header** | Clean URLs | Harder to test/debug | 🔶 Optional |
| **Content Negotiation** | RESTful | Complex | ❌ Not used |

---

### 4.2 Breaking Changes

**What's a breaking change**:
- ✅ **Breaking**:
  - Removing a field
  - Renaming a field
  - Changing field type
  - Changing required/optional
  - Removing an endpoint
  - Changing status codes
  - Changing error format

- ❌ **Not breaking** (safe):
  - Adding a new field
  - Adding a new endpoint
  - Adding a new optional parameter
  - Making a required field optional
  - Adding enum values (if handled gracefully)

**Correct**:
```typescript
// ✅ v1 - Original API
interface PropertyV1 {
  id: string;
  name: string;
  price: number;
}

GET /api/v1/properties
{
  "data": [
    {
      "id": "uuid",
      "name": "Property 1",
      "price": 250000
    }
  ]
}

// ✅ v2 - Breaking changes in new version
interface PropertyV2 {
  uuid: string;  // Renamed from 'id'
  title: string; // Renamed from 'name'
  price: {       // Changed from number to object
    amount: number;
    currency: string;
  };
  status: PropertyStatus;  // New required field
}

GET /api/v2/properties
{
  "data": [
    {
      "uuid": "uuid",
      "title": "Property 1",
      "price": {
        "amount": 250000,
        "currency": "EUR"
      },
      "status": "active"
    }
  ]
}

// ✅ Non-breaking change (add field to v1)
interface PropertyV1Extended {
  id: string;
  name: string;
  price: number;
  description?: string;  // New optional field (not breaking)
}
```

---

### 4.3 Deprecation Policy

**Correct**:
```typescript
// ✅ Deprecation warning in response headers
res.set('Deprecation', 'true');
res.set('Sunset', 'Sat, 31 Dec 2026 23:59:59 GMT');
res.set('Link', '</api/v2/properties>; rel="successor-version"');

// ✅ Deprecation notice in response
{
  "data": [...],
  "meta": {
    "deprecated": true,
    "sunset_date": "2026-12-31",
    "migration_guide": "https://docs.pulwave.com/api/v1-to-v2"
  }
}

// Pulwave deprecation middleware
// packages/data/middleware/deprecation.ts
export const deprecateEndpoint = (
  sunsetDate: Date,
  successorUrl: string
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.set('Deprecation', 'true');
    res.set('Sunset', sunsetDate.toUTCString());
    res.set('Link', `<${successorUrl}>; rel="successor-version"`);

    next();
  };
};

// Usage
router.get(
  '/api/v1/properties',
  deprecateEndpoint(
    new Date('2026-12-31'),
    '/api/v2/properties'
  ),
  propertyController.list
);
```

**Deprecation Timeline**:
1. **Announce** (T+0): Add deprecation headers
2. **Warn** (T+3 months): Log usage, email users
3. **Sunset** (T+6 months): Remove endpoint

---

### 4.4 Version Communication

**Correct**:
```typescript
// ✅ Version in API root
GET /api/v1
{
  "version": "1.0.0",
  "status": "stable",
  "links": {
    "docs": "https://docs.pulwave.com/api/v1",
    "properties": "/api/v1/properties",
    "users": "/api/v1/users"
  }
}

GET /api/v2
{
  "version": "2.0.0",
  "status": "stable",
  "deprecated_versions": ["1.0.0"],
  "sunset_dates": {
    "v1": "2026-12-31"
  },
  "links": {
    "docs": "https://docs.pulwave.com/api/v2",
    "migration": "https://docs.pulwave.com/api/v1-to-v2"
  }
}
```

---

### 4.5 Migration Path

**Correct**:
```typescript
// ✅ Provide adapter/transformer for migration
// packages/data/api/adapters/v1-to-v2.ts
export const transformPropertyV1toV2 = (propertyV1: PropertyV1): PropertyV2 => {
  return {
    uuid: propertyV1.id,
    title: propertyV1.name,
    price: {
      amount: propertyV1.price,
      currency: 'EUR',  // Default currency
    },
    status: 'active',  // Default status
  };
};

// ✅ Migration endpoint
POST /api/v1/migrate-to-v2
{
  "resource_type": "property",
  "resource_ids": ["uuid1", "uuid2"]
}

Response:
{
  "migrated": 2,
  "failed": 0,
  "details": [...]
}
```

---

## 5. Error Handling (CRITICAL)

See section 2.3 for complete error response patterns.

**Key Points**:
- Structured error responses
- Error codes (machine-readable)
- Error messages (human-readable)
- Validation error details
- Proper HTTP status codes

---

## 6. Security (CRITICAL)

### 6.1 Authentication

**Problem**: Unauthenticated endpoints expose sensitive data.

**Incorrect**:
```typescript
// ❌ No authentication
router.get('/users', userController.list);

// ❌ Weak token validation
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) next();  // Just checks if token exists
};
```

**Correct**:
```typescript
// ✅ JWT authentication
import { verify } from 'jsonwebtoken';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    const token = authHeader.substring(7);

    // Verify JWT
    const payload = verify(token, process.env.JWT_SECRET!) as JWTPayload;

    // Attach user to request
    req.user = await userRepository.findById(payload.userId);

    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid token',
        },
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    });
  }
};

// Pulwave authentication with Supabase
// packages/data/middleware/auth.ts
import { createClient } from '@supabase/supabase-js';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.substring(7);

    if (!token) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid token',
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication failed',
      },
    });
  }
};

// Usage
router.get('/properties', authenticate, propertyController.list);
```

---

### 6.2 Authorization

**Problem**: Authenticated users accessing resources they don't own.

**Incorrect**:
```typescript
// ❌ No ownership check
export const deleteProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  await propertyService.delete(id);  // Anyone can delete any property
  return res.status(204).send();
};
```

**Correct**:
```typescript
// ✅ Ownership check
export const deleteProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  const property = await propertyRepository.findById(id);

  if (!property) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Property not found',
      },
    });
  }

  // Check ownership
  if (property.owner_id !== req.user.id) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to delete this property',
      },
    });
  }

  await propertyService.delete(id);
  return res.status(204).send();
};

// ✅ Role-based authorization
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      });
    }

    next();
  };
};

// Usage
router.delete(
  '/users/:id',
  authenticate,
  authorize(['admin']),
  userController.delete
);
```

---

### 6.3 Input Validation

See section 2.1 for complete validation patterns.

---

### 6.4 Rate Limiting

**Problem**: No rate limiting allows abuse and DoS attacks.

**Correct**:
```typescript
// ✅ Rate limiting
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
    },
  },
});

app.use('/api/', apiLimiter);

// ✅ Different limits for different endpoints
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 accounts per hour per IP
});

router.post('/auth/register', createAccountLimiter, authController.register);

// ✅ User-based rate limiting
import RedisStore from 'rate-limit-redis';
import { redis } from '@pulwave/data/providers/redis';

const userLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:user:',
  }),
  windowMs: 15 * 60 * 1000,
  max: async (req) => {
    // Premium users get higher limits
    return req.user?.subscription === 'premium' ? 1000 : 100;
  },
  keyGenerator: (req) => req.user?.id || req.ip,
});
```

---

### 6.5 CORS

**Problem**: Incorrect CORS configuration blocks legitimate requests or allows unauthorized origins.

**Incorrect**:
```typescript
// ❌ Allow all origins (insecure)
app.use(cors({ origin: '*' }));

// ❌ No CORS headers (blocks browser requests)
// No CORS configuration
```

**Correct**:
```typescript
// ✅ Whitelist specific origins
import cors from 'cors';

const allowedOrigins = [
  'https://pulwave.com',
  'https://app.pulwave.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 hours
}));
```

---

## 7. Documentation (HIGH)

### 7.1 OpenAPI/Swagger

**Correct**:
```yaml
# packages/data/api/openapi.yaml
openapi: 3.0.0
info:
  title: Pulwave API
  version: 1.0.0
  description: Real estate management API
  contact:
    email: api@pulwave.com

servers:
  - url: https://api.pulwave.com/v1
    description: Production
  - url: https://staging-api.pulwave.com/v1
    description: Staging

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Property:
      type: object
      required:
        - id
        - name
        - price
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
          minLength: 1
          maxLength: 200
        description:
          type: string
        price:
          type: number
          format: double
          minimum: 0
        status:
          type: string
          enum: [draft, active, sold]
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    Error:
      type: object
      required:
        - error
      properties:
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: object

paths:
  /properties:
    get:
      summary: List properties
      security:
        - BearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, active, sold]
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Property'
                  meta:
                    type: object
                    properties:
                      page:
                        type: integer
                      limit:
                        type: integer
                      total:
                        type: integer
                      total_pages:
                        type: integer
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    post:
      summary: Create property
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - price
              properties:
                name:
                  type: string
                description:
                  type: string
                price:
                  type: number
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    $ref: '#/components/schemas/Property'

# Serve Swagger UI
# packages/data/api/server.ts
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./openapi.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

---

### 7.2 Request/Response Examples

**Correct**:
```yaml
# OpenAPI with examples
paths:
  /properties:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePropertyInput'
            examples:
              residential:
                summary: Residential property
                value:
                  name: "Modern Apartment in Lisbon"
                  description: "Beautiful 2-bedroom apartment with city view"
                  price: 250000
                  type: "residential"
                  address:
                    street: "Rua Augusta 123"
                    city: "Lisbon"
                    postal_code: "1100-048"
                    country: "PT"
              commercial:
                summary: Commercial property
                value:
                  name: "Downtown Office Space"
                  price: 500000
                  type: "commercial"
```

---

### 7.3 Authentication Documentation

**Correct**:
```markdown
# Authentication

## Getting a Token

POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}

## Using the Token

Include the token in the Authorization header:

GET /properties
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## Token Expiration

Tokens expire after 1 hour. Refresh using:

POST /auth/refresh
Authorization: Bearer <access_token>
```

---

### 7.4 Error Documentation

See Appendix A for complete status codes reference.

---

### 7.5 Changelog

**Correct**:
```markdown
# API Changelog

## v2.0.0 - 2026-01-17

### Breaking Changes
- **BREAKING**: Renamed `Property.id` to `Property.uuid`
- **BREAKING**: Renamed `Property.name` to `Property.title`
- **BREAKING**: Changed `Property.price` from number to object with `amount` and `currency`

### New Features
- Added `Property.status` field
- Added pagination to `/properties` endpoint
- Added filtering by `city` and `price` range

### Deprecations
- Deprecated `/api/v1/properties` (sunset: 2026-12-31)

## v1.0.0 - 2025-06-01

Initial release
```

---

## 8. Performance (HIGH)

### 8.1 Caching

**Correct**:
```typescript
// ✅ HTTP caching headers
export const list = async (req: Request, res: Response) => {
  const properties = await propertyService.list();

  // Cache for 5 minutes
  res.set('Cache-Control', 'public, max-age=300');
  res.set('ETag', generateETag(properties));

  // Check If-None-Match header
  if (req.headers['if-none-match'] === res.getHeader('ETag')) {
    return res.status(304).send();
  }

  return res.status(200).json({ data: properties });
};

// ✅ Redis caching
import { redis } from '@pulwave/data/providers/redis';

export const get = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cacheKey = `property:${id}`;

  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json({ data: JSON.parse(cached) });
  }

  // Fetch from DB
  const property = await propertyRepository.findById(id);

  if (!property) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Property not found' },
    });
  }

  // Cache for 10 minutes
  await redis.set(cacheKey, JSON.stringify(property), 'EX', 600);

  return res.status(200).json({ data: property });
};
```

---

### 8.2 Compression

**Correct**:
```typescript
// ✅ Response compression
import compression from 'compression';

app.use(compression({
  threshold: 1024, // Only compress if > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));
```

---

### 8.3 Payload Size

**Problem**: Large payloads slow down responses.

**Correct**:
```typescript
// ✅ Limit response size
app.use(express.json({ limit: '1mb' }));

// ✅ Field selection (sparse fieldsets)
GET /properties?fields=id,name,price

export const list = async (req: Request, res: Response) => {
  const { fields } = req.query;
  const select = fields ? fields.split(',') : undefined;

  const properties = await propertyRepository.findMany({
    select: select ? Object.fromEntries(select.map(f => [f, true])) : undefined,
  });

  return res.status(200).json({ data: properties });
};
```

---

### 8.4 Query Optimization

**Correct**:
```typescript
// ✅ Select only needed fields
const properties = await propertyRepository.findMany({
  select: {
    id: true,
    name: true,
    price: true,
    // Don't select large fields like description
  },
});

// ✅ Use indexes
await propertyRepository.createIndex({ status: 1, created_at: -1 });
```

---

### 8.5 Rate Limiting

See section 6.4 for complete rate limiting patterns.

---

## 9. Testing (HIGH)

### 9.1 Contract Testing

**Correct**:
```typescript
// ✅ Test against OpenAPI spec
import request from 'supertest';
import { validateResponse } from 'openapi-validator-middleware';
import spec from './openapi.json';

describe('GET /properties', () => {
  it('matches OpenAPI spec', async () => {
    const response = await request(app)
      .get('/api/v1/properties')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(() => validateResponse(response.body, spec, '/properties', 'get')).not.toThrow();
  });
});
```

---

### 9.2 Integration Testing

**Correct**:
```typescript
// ✅ Integration tests
import request from 'supertest';
import { app } from '../server';

describe('Property API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password' });

    authToken = res.body.access_token;
  });

  describe('POST /properties', () => {
    it('creates a property', async () => {
      const response = await request(app)
        .post('/api/v1/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Property',
          price: 100000,
          type: 'residential',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe('Test Property');
    });

    it('returns 422 for invalid input', async () => {
      const response = await request(app)
        .post('/api/v1/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test' }); // Missing price

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/v1/properties')
        .send({ name: 'Test', price: 100000 });

      expect(response.status).toBe(401);
    });
  });
});
```

---

### 9.3 Performance Testing

**Correct**:
```typescript
// ✅ Load testing with k6
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function () {
  const res = http.get('https://api.pulwave.com/v1/properties');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}

// Run: k6 run load-test.js
```

---

### 9.4 Security Testing

**Correct**:
```typescript
// ✅ Security tests
describe('Security', () => {
  it('prevents SQL injection', async () => {
    const response = await request(app)
      .get('/api/v1/properties')
      .query({ city: "'; DROP TABLE properties; --" });

    expect(response.status).not.toBe(500);
  });

  it('rate limits requests', async () => {
    const requests = Array(101).fill(null).map(() =>
      request(app).get('/api/v1/properties')
    );

    const responses = await Promise.all(requests);
    const rateLimited = responses.filter(r => r.status === 429);

    expect(rateLimited.length).toBeGreaterThan(0);
  });

  it('requires authentication', async () => {
    const response = await request(app)
      .post('/api/v1/properties')
      .send({ name: 'Test', price: 100000 });

    expect(response.status).toBe(401);
  });
});
```

---

### 9.5 Documentation Testing

**Correct**:
```typescript
// ✅ Test examples in documentation
import { examples } from './openapi.json';

describe('Documentation Examples', () => {
  it('creates property with example payload', async () => {
    const examplePayload = examples.properties.post.requestBody.residential.value;

    const response = await request(app)
      .post('/api/v1/properties')
      .set('Authorization', `Bearer ${token}`)
      .send(examplePayload);

    expect(response.status).toBe(201);
  });
});
```

---

## 10. Common Patterns (MEDIUM)

### 10.1 HATEOAS

**Correct**:
```typescript
// ✅ Hypermedia links
GET /properties/{id}
{
  "data": {
    "id": "uuid",
    "name": "Property 1",
    "price": 250000,
    "_links": {
      "self": { "href": "/api/v1/properties/uuid" },
      "owner": { "href": "/api/v1/users/uuid" },
      "units": { "href": "/api/v1/properties/uuid/units" },
      "update": { "href": "/api/v1/properties/uuid", "method": "PATCH" },
      "delete": { "href": "/api/v1/properties/uuid", "method": "DELETE" }
    }
  }
}
```

---

### 10.2 Batch Operations

**Correct**:
```typescript
// ✅ Batch create/update/delete
POST /properties/batch
{
  "operations": [
    { "op": "create", "data": { "name": "Property 1", "price": 100000 } },
    { "op": "update", "id": "uuid", "data": { "price": 150000 } },
    { "op": "delete", "id": "uuid2" }
  ]
}

Response:
{
  "results": [
    { "op": "create", "status": "success", "data": { "id": "uuid3", ... } },
    { "op": "update", "status": "success", "data": { "id": "uuid", ... } },
    { "op": "delete", "status": "success" }
  ],
  "summary": {
    "total": 3,
    "success": 3,
    "failed": 0
  }
}
```

---

### 10.3 Webhooks

**Correct**:
```typescript
// ✅ Webhook registration
POST /webhooks
{
  "url": "https://example.com/webhook",
  "events": ["property.created", "property.updated"],
  "secret": "webhook_secret"
}

// ✅ Webhook delivery
POST https://example.com/webhook
Headers:
  X-Webhook-Signature: sha256=...
  X-Webhook-Event: property.created
Request:
{
  "event": "property.created",
  "timestamp": "2026-01-17T10:00:00Z",
  "data": {
    "id": "uuid",
    "name": "Property 1",
    "price": 250000
  }
}
```

---

### 10.4 Long-Running Operations

**Correct**:
```typescript
// ✅ Async operation with polling
POST /properties/import
Response: 202 Accepted
{
  "job_id": "uuid",
  "status": "pending",
  "status_url": "/jobs/uuid"
}

GET /jobs/uuid
{
  "job_id": "uuid",
  "status": "processing",
  "progress": 45,
  "created_at": "2026-01-17T10:00:00Z"
}

GET /jobs/uuid (later)
{
  "job_id": "uuid",
  "status": "completed",
  "progress": 100,
  "result": {
    "imported": 150,
    "failed": 5
  }
}
```

---

### 10.5 File Uploads

**Correct**:
```typescript
// ✅ Multipart upload
import multer from 'multer';

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
});

router.post(
  '/properties/:id/images',
  authenticate,
  upload.single('image'),
  propertyController.uploadImage
);

export const uploadImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      error: { code: 'BAD_REQUEST', message: 'No file provided' },
    });
  }

  // Upload to storage (S3, Supabase Storage, etc.)
  const url = await storageService.upload(file.path, file.filename);

  return res.status(201).json({
    data: {
      url,
      filename: file.filename,
      size: file.size,
    },
  });
};

// ✅ Presigned upload URL (better for large files)
POST /properties/:id/images/upload-url
{
  "filename": "image.jpg",
  "content_type": "image/jpeg",
  "size": 1024000
}

Response:
{
  "upload_url": "https://storage.pulwave.com/presigned-url...",
  "expires_at": "2026-01-17T11:00:00Z",
  "method": "PUT"
}

// Client uploads directly to storage
PUT https://storage.pulwave.com/presigned-url...
Content-Type: image/jpeg
[binary data]

// Client confirms upload
POST /properties/:id/images/confirm
{
  "filename": "image.jpg"
}
```

---

## Appendix

### A. HTTP Status Codes Reference

**2xx - Success**
- `200 OK` - Request succeeded (GET, PATCH)
- `201 Created` - Resource created (POST)
- `202 Accepted` - Request accepted for async processing
- `204 No Content` - Success with no response body (DELETE)

**3xx - Redirection**
- `301 Moved Permanently` - Resource moved
- `304 Not Modified` - Cached version is fresh

**4xx - Client Error**
- `400 Bad Request` - Malformed request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `405 Method Not Allowed` - HTTP method not supported
- `409 Conflict` - Resource conflict (duplicate)
- `422 Unprocessable Entity` - Validation failed
- `429 Too Many Requests` - Rate limit exceeded

**5xx - Server Error**
- `500 Internal Server Error` - Unexpected error
- `502 Bad Gateway` - Invalid response from upstream
- `503 Service Unavailable` - Temporary unavailability
- `504 Gateway Timeout` - Upstream timeout

---

### B. REST vs GraphQL Decision Matrix

| Criteria | REST | GraphQL |
|----------|------|---------|
| **Multiple resources** | ❌ Multiple requests | ✅ Single request |
| **Flexible queries** | ❌ Fixed endpoints | ✅ Client-specified fields |
| **Caching** | ✅ HTTP caching | 🔶 Complex |
| **File uploads** | ✅ Multipart | 🔶 Complex |
| **Learning curve** | ✅ Simple | 🔶 Steep |
| **Tooling** | ✅ Mature | ✅ Good |
| **Real-time** | 🔶 Polling/SSE | ✅ Subscriptions |
| **Versioning** | ✅ URL versioning | 🔶 Schema evolution |

**Pulwave Choice**: REST for public APIs, GraphQL for complex client apps

---

### C. API Design Checklist

**Design**
- [ ] Resource naming (plural nouns, kebab-case)
- [ ] HTTP methods (GET, POST, PUT, PATCH, DELETE)
- [ ] URL structure (max 2-3 levels)
- [ ] Status codes (correct for each operation)
- [ ] Versioning strategy (URL-based)

**Request/Response**
- [ ] Input validation (Zod schemas)
- [ ] Response format (consistent with `data` wrapper)
- [ ] Error format (code, message, details)
- [ ] Pagination (cursor or offset)
- [ ] Filtering and sorting

**Security**
- [ ] Authentication (JWT, Supabase)
- [ ] Authorization (ownership, RBAC)
- [ ] Input validation
- [ ] Rate limiting
- [ ] CORS configuration

**Performance**
- [ ] Caching (HTTP headers, Redis)
- [ ] Compression (gzip)
- [ ] Payload size limits
- [ ] Query optimization
- [ ] N+1 query prevention (DataLoader)

**Documentation**
- [ ] OpenAPI/Swagger spec
- [ ] Request/response examples
- [ ] Authentication docs
- [ ] Error documentation
- [ ] Changelog

**Testing**
- [ ] Contract tests (OpenAPI validation)
- [ ] Integration tests
- [ ] Performance tests (k6)
- [ ] Security tests
- [ ] Documentation tests

---

### D. OpenAPI Specification Template

See section 7.1 for complete OpenAPI template.

---

**Related Guides**:
- [Backend Category](../backend/AGENTS.md) - Complete backend patterns
- [Database](../backend/database/AGENTS.md) - Database optimization
- [Authentication](../crosscutting/authentication/AGENTS.md) - Auth patterns
- [Testing](../testing/AGENTS.md) - Testing strategies

**Version**: 1.0.0
**Last Updated**: 2026-01-17
