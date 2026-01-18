# Data Validation Implementation Guide

**Abstract**: This guide provides comprehensive patterns for ensuring data integrity and security through robust runtime validation and sanitization. Covers Zod schemas, type inference, input sanitization, boundary validation, error handling, form validation, API validation, and security best practices. Every pattern includes incorrect vs correct implementations with full code examples specific to Pulwave's React 19 + TypeScript + Zod + Supabase stack.

---

## Table of Contents

1. **Validation Fundamentals** (CRITICAL)
   - 1.1 Why Runtime Validation
   - 1.2 Validation Boundaries
   - 1.3 Type Safety
   - 1.4 Schema-Driven Development
   - 1.5 Validation vs Sanitization

2. **Zod Schemas** (CRITICAL)
   - 2.1 Basic Schema Definition
   - 2.2 Type Inference
   - 2.3 Schema Composition
   - 2.4 Refinements and Transforms
   - 2.5 Async Validation

3. **Form Validation** (CRITICAL)
   - 3.1 React Hook Form Integration
   - 3.2 Field-Level Validation
   - 3.3 Cross-Field Validation
   - 3.4 Async Field Validation
   - 3.5 Error Display

4. **API Validation** (CRITICAL)
   - 4.1 Request Body Validation
   - 4.2 Query Parameter Validation
   - 4.3 Path Parameter Validation
   - 4.4 Response Validation
   - 4.5 Validation Middleware

5. **Input Sanitization** (CRITICAL)
   - 5.1 XSS Prevention
   - 5.2 SQL Injection Prevention
   - 5.3 HTML Sanitization
   - 5.4 String Trimming
   - 5.5 Encoding

6. **Custom Validators** (HIGH)
   - 6.1 Custom Refinements
   - 6.2 Reusable Validators
   - 6.3 Domain-Specific Rules
   - 6.4 Conditional Validation
   - 6.5 Business Logic Validation

7. **Error Handling** (CRITICAL)
   - 7.1 Error Formatting
   - 7.2 Error Messages
   - 7.3 Field Path Extraction
   - 7.4 Localized Errors
   - 7.5 Error Recovery

8. **Database Validation** (HIGH)
   - 8.1 Unique Constraints
   - 8.2 Foreign Key Validation
   - 8.3 Check Constraints
   - 8.4 Trigger Validation
   - 8.5 RLS Validation

9. **Performance** (MEDIUM)
   - 9.1 Schema Caching
   - 9.2 Lazy Validation
   - 9.3 Partial Validation
   - 9.4 Validation Debouncing
   - 9.5 Validation Memoization

10. **Testing Validation** (HIGH)
    - 10.1 Schema Testing
    - 10.2 Validation Error Testing
    - 10.3 Boundary Testing
    - 10.4 Sanitization Testing
    - 10.5 Security Testing

**Appendix**
- A. Common Validation Patterns
- B. Security Checklist
- C. Zod API Reference
- D. Error Message Templates

---

## 1. Validation Fundamentals (CRITICAL)

**Impact**: Runtime validation is the last line of defense against invalid data. TypeScript provides compile-time safety, but runtime validation ensures data integrity at boundaries.

### 1.1 Why Runtime Validation

**Problem**: TypeScript types are erased at runtime - no protection from external inputs.

**Incorrect**:
```typescript
// ❌ TypeScript types don't validate at runtime
interface CreateUserInput {
  email: string;
  age: number;
}

function createUser(input: CreateUserInput) {
  // TypeScript thinks this is safe, but at runtime:
  // input = { email: 123, age: "invalid" } ← Still passes!
  return database.users.create(input);
}

// Client can send anything
fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ email: 123, age: 'invalid' }),
});
```

**Correct**:
```typescript
// ✅ Runtime validation catches invalid data
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  age: z.number().int().min(18, 'Must be 18 or older'),
});

type CreateUserInput = z.infer<typeof createUserSchema>;

function createUser(input: unknown) {
  // Validate at runtime
  const validated = createUserSchema.parse(input);
  // Now `validated` is guaranteed to match the schema
  return database.users.create(validated);
}

// Invalid data throws ZodError
try {
  createUser({ email: 123, age: 'invalid' });
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log('Validation failed:', error.errors);
  }
}
```

**Key Points**:
- TypeScript types = compile-time only
- Runtime validation = actual data verification
- Always validate at boundaries (API, forms, external data)
- Use Zod for type-safe runtime validation
- Infer TypeScript types from schemas

---

### 1.2 Validation Boundaries

**Problem**: Not validating at all entry points allows invalid data to enter the system.

**Incorrect**:
```typescript
// ❌ No validation at API boundary
router.post('/properties', async (req, res) => {
  // Trusting req.body completely
  const property = await propertyService.create(req.body);
  return res.status(201).json(property);
});

// ❌ No validation on form submission
const handleSubmit = async (data: any) => {
  await api.createProperty(data); // Trusting form data
};
```

**Correct**:
```typescript
// ✅ Validate at API boundary
import { validate } from '@pulwave/data/middleware';

const createPropertySchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  type: z.enum(['residential', 'commercial', 'industrial']),
});

router.post(
  '/properties',
  validate(createPropertySchema), // Middleware validates before handler
  async (req, res) => {
    // req.body is validated and type-safe
    const property = await propertyService.create(req.body);
    return res.status(201).json(property);
  }
);

// ✅ Validate on form submission
const PropertyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePropertyInput>({
    resolver: zodResolver(createPropertySchema), // Validates before submit
  });

  const onSubmit = async (data: CreatePropertyInput) => {
    // data is validated
    await api.createProperty(data);
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
};

// ✅ Validate external API responses
const fetchExternalData = async () => {
  const response = await fetch('https://external-api.com/data');
  const data = await response.json();

  // Don't trust external data
  return externalDataSchema.parse(data);
};
```

**Validation Boundaries**:
1. **API Endpoints**: All request bodies, query params, path params
2. **Forms**: All user input before submission
3. **External APIs**: All responses from third parties
4. **File Uploads**: File type, size, content
5. **WebSocket Messages**: All incoming messages
6. **Database**: Before inserts/updates (defense in depth)

---

### 1.3 Type Safety

**Problem**: Manually typing data after validation leads to type drift.

**Incorrect**:
```typescript
// ❌ Manual types - can drift from schema
const userSchema = z.object({
  email: z.string().email(),
  age: z.number(),
});

interface User {
  email: string;
  age: number;
  // Schema was updated but interface wasn't!
}

const validated = userSchema.parse(input);
const user: User = validated; // Type drift!
```

**Correct**:
```typescript
// ✅ Infer types from schema - single source of truth
const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
  name: z.string().optional(),
});

type User = z.infer<typeof userSchema>;
// Type automatically updates when schema changes

const validated = userSchema.parse(input);
// `validated` is type User - guaranteed to match schema

// ✅ Input vs output types
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().min(18),
  createdAt: z.date().default(() => new Date()),
});

type CreateUserInput = z.input<typeof createUserSchema>;
// { email: string; password: string; age: number; createdAt?: Date }

type CreateUserOutput = z.output<typeof createUserSchema>;
// { email: string; password: string; age: number; createdAt: Date }

// Pulwave pattern: Co-locate schemas with types
// packages/data/domains/properties/schemas.ts
import { z } from 'zod';

export const propertySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  price: z.number().positive(),
  type: z.enum(['residential', 'commercial', 'industrial']),
  status: z.enum(['draft', 'active', 'sold']).default('draft'),
  created_at: z.date(),
  updated_at: z.date(),
});

export const createPropertySchema = propertySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updatePropertySchema = createPropertySchema.partial();

export type Property = z.infer<typeof propertySchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
```

**Key Points**:
- Use `z.infer<typeof schema>` for types
- Types automatically update with schema
- Single source of truth
- No type drift
- Use `z.input` vs `z.output` for transformations

---

### 1.4 Schema-Driven Development

**Problem**: Writing validation logic manually is error-prone and verbose.

**Correct**:
```typescript
// ✅ Schema-driven approach
// 1. Define schema first
const propertySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  price: z.number().positive('Price must be positive'),
  type: z.enum(['residential', 'commercial', 'industrial']),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postal_code: z.string().regex(/^\d{4}-\d{3}$/),
  }),
});

// 2. Infer types
type Property = z.infer<typeof propertySchema>;

// 3. Generate forms
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm<Property>({
  resolver: zodResolver(propertySchema),
});

// 4. Generate API validation
router.post('/properties', validate(propertySchema), handler);

// 5. Generate TypeScript interfaces
type CreatePropertyDTO = z.infer<typeof propertySchema>;

// 6. Generate documentation
const openApiSchema = zodToOpenAPI(propertySchema);
```

**Benefits**:
- Single schema definition
- Auto-generated types
- Auto-generated validation
- Auto-generated documentation
- Reduced boilerplate

---

### 1.5 Validation vs Sanitization

**Problem**: Conflating validation (reject invalid) with sanitization (clean data).

**Correct**:
```typescript
// ✅ Separate validation and sanitization

// Sanitization: Clean/transform data
const sanitizeInput = (input: string) => {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 1000); // Limit length
};

// Validation: Check if data is valid
const nameSchema = z.string()
  .transform(sanitizeInput) // Clean first
  .min(1, 'Name is required') // Then validate
  .max(200, 'Name too long');

// ✅ HTML sanitization
import DOMPurify from 'dompurify';

const descriptionSchema = z.string()
  .transform((html) => DOMPurify.sanitize(html)) // Remove XSS
  .max(5000, 'Description too long');

// Pulwave sanitization utilities
// packages/foundation/utils/sanitize.ts
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
};

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

// Usage in schemas
const createPropertySchema = z.object({
  name: z.string().transform(sanitizeString).min(1).max(200),
  description: z.string().transform(sanitizeHTML).max(5000),
  email: z.string().email().transform(sanitizeEmail),
});
```

**Key Differences**:

| Validation | Sanitization |
|-----------|--------------|
| Rejects invalid data | Cleans data |
| Returns errors | Returns cleaned data |
| Strict enforcement | Permissive transformation |
| "Is this valid?" | "Make this valid" |

**When to use**:
- **Validation**: User input, API requests, external data
- **Sanitization**: Before display (XSS), before storage, data normalization

---

## 2. Zod Schemas (CRITICAL)

### 2.1 Basic Schema Definition

**Incorrect**:
```typescript
// ❌ No schema - manual validation
function createUser(data: any) {
  if (!data.email || typeof data.email !== 'string') {
    throw new Error('Invalid email');
  }
  if (!data.age || typeof data.age !== 'number' || data.age < 18) {
    throw new Error('Invalid age');
  }
  // ... many more checks
}
```

**Correct**:
```typescript
// ✅ Zod schema
import { z } from 'zod';

// Primitives
const emailSchema = z.string().email();
const ageSchema = z.number().int().min(18);
const isActiveSchema = z.boolean();

// Objects
const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  age: z.number().int().min(18, 'Must be 18 or older'),
  name: z.string().min(1, 'Name is required').max(100),
  role: z.enum(['user', 'admin']),
  preferences: z.object({
    theme: z.enum(['light', 'dark']),
    notifications: z.boolean(),
  }).optional(),
});

// Arrays
const tagsSchema = z.array(z.string()).min(1, 'At least one tag required');

// Enums
const propertyTypeSchema = z.enum(['residential', 'commercial', 'industrial']);

// Unions
const idSchema = z.union([z.string().uuid(), z.number().int()]);

// Dates
const dateSchema = z.date();
const isoDateSchema = z.string().datetime();

// Nullable/Optional
const optionalNameSchema = z.string().optional(); // string | undefined
const nullableNameSchema = z.string().nullable(); // string | null
const nullishNameSchema = z.string().nullish(); // string | null | undefined

// Pulwave property schema
// packages/data/domains/properties/schemas.ts
export const propertySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(5000).optional(),
  price: z.number().positive('Price must be positive'),
  type: z.enum(['residential', 'commercial', 'industrial']),
  status: z.enum(['draft', 'active', 'sold']),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  area_sqm: z.number().positive().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postal_code: z.string().regex(/^\d{4}-\d{3}$/, 'Invalid postal code'),
    country: z.string().length(2, 'Use ISO country code'),
  }),
  images: z.array(z.string().url()).max(20),
  tags: z.array(z.string()).max(10),
  owner_id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

type Property = z.infer<typeof propertySchema>;
```

**Zod Types**:
- `z.string()` - String
- `z.number()` - Number
- `z.boolean()` - Boolean
- `z.date()` - Date object
- `z.object({})` - Object with defined shape
- `z.array()` - Array
- `z.enum([])` - Enum values
- `z.union([])` - One of multiple types
- `z.tuple([])` - Fixed-length array
- `z.record()` - Object with dynamic keys
- `z.map()` - Map
- `z.set()` - Set
- `z.literal()` - Exact value
- `z.any()` - Any (avoid)
- `z.unknown()` - Unknown (prefer over any)
- `z.void()` - Void
- `z.undefined()` - Undefined
- `z.null()` - Null

---

### 2.2 Type Inference

**Correct**:
```typescript
// ✅ Type inference patterns
const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});

// Infer type
type User = z.infer<typeof userSchema>;
// { email: string; age: number }

// Input vs output (with transforms)
const createUserSchema = z.object({
  email: z.string().email(),
  age: z.coerce.number().min(18),
  createdAt: z.date().default(() => new Date()),
});

type CreateUserInput = z.input<typeof createUserSchema>;
// { email: string; age: string | number; createdAt?: Date }

type CreateUserOutput = z.output<typeof createUserSchema>;
// { email: string; age: number; createdAt: Date }

// Extract enum values
const statusEnum = z.enum(['draft', 'active', 'sold']);
type Status = z.infer<typeof statusEnum>;
// 'draft' | 'active' | 'sold'

// Pulwave pattern: Export both schema and type
export const propertySchema = z.object({
  name: z.string(),
  price: z.number(),
});

export type Property = z.infer<typeof propertySchema>;
```

---

### 2.3 Schema Composition

**Correct**:
```typescript
// ✅ Compose schemas for reuse
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  postal_code: z.string(),
  country: z.string().length(2),
});

const userSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  address: addressSchema, // Reuse
});

const companySchema = z.object({
  name: z.string(),
  tax_id: z.string(),
  address: addressSchema, // Reuse
});

// Extend schemas
const adminUserSchema = userSchema.extend({
  permissions: z.array(z.string()),
  isAdmin: z.literal(true),
});

// Merge schemas
const mergedSchema = userSchema.merge(z.object({
  phone: z.string(),
}));

// Pick/Omit
const createUserSchema = userSchema.omit({ id: true, created_at: true });
const userSummarySchema = userSchema.pick({ id: true, name: true, email: true });

// Partial/Required
const updateUserSchema = userSchema.partial(); // All fields optional
const requiredUserSchema = userSchema.required(); // All fields required

// Deep partial
const deepPartialSchema = userSchema.deepPartial();

// Passthrough (allow unknown keys)
const passthroughSchema = userSchema.passthrough();

// Strict (forbid unknown keys)
const strictSchema = userSchema.strict();

// Pulwave base schemas
// packages/data/schemas/base.ts
export const timestampsSchema = z.object({
  created_at: z.date(),
  updated_at: z.date(),
});

export const auditSchema = z.object({
  created_by: z.string().uuid(),
  updated_by: z.string().uuid(),
});

export const softDeleteSchema = z.object({
  deleted_at: z.date().nullable(),
  deleted_by: z.string().uuid().nullable(),
});

// Usage
export const propertySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number(),
}).merge(timestampsSchema).merge(auditSchema);
```

---

### 2.4 Refinements and Transforms

**Correct**:
```typescript
// ✅ Refinements (custom validation)
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Password must contain at least one number'
  );

// Superrefine (multiple validations with context)
const userSchema = z.object({
  password: z.string(),
  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
  }
});

// ✅ Transforms (modify data)
const trimmedStringSchema = z.string().transform((str) => str.trim());

const lowercaseEmailSchema = z.string()
  .email()
  .transform((email) => email.toLowerCase());

const priceInCentsSchema = z.number()
  .transform((dollars) => Math.round(dollars * 100));

// Coerce (type conversion)
const numberSchema = z.coerce.number(); // "123" → 123
const dateSchema = z.coerce.date(); // "2024-01-01" → Date

// Preprocess (transform before validation)
const trimmedSchema = z.preprocess(
  (val) => typeof val === 'string' ? val.trim() : val,
  z.string().min(1)
);

// Pulwave phone number validation
export const phoneSchema = z.string()
  .transform((phone) => phone.replace(/\D/g, '')) // Remove non-digits
  .refine(
    (phone) => phone.length >= 9 && phone.length <= 15,
    'Invalid phone number'
  );

// Pulwave postal code (Portugal)
export const postalCodeSchema = z.string()
  .transform((code) => code.replace(/\s/g, '')) // Remove spaces
  .refine(
    (code) => /^\d{4}-?\d{3}$/.test(code),
    'Invalid postal code format'
  )
  .transform((code) => {
    // Normalize to XXXX-XXX
    return code.replace(/(\d{4})(\d{3})/, '$1-$2');
  });

// Email with domain validation
export const emailSchema = z.string()
  .email('Invalid email format')
  .transform((email) => email.toLowerCase())
  .refine(
    (email) => !email.endsWith('@test.com'),
    'Test emails not allowed'
  );
```

---

### 2.5 Async Validation

**Correct**:
```typescript
// ✅ Async refinements (database checks)
const uniqueEmailSchema = z.string()
  .email()
  .refine(
    async (email) => {
      const existing = await database.users.findUnique({ where: { email } });
      return !existing;
    },
    'Email already in use'
  );

// Usage with async parse
const result = await uniqueEmailSchema.parseAsync('user@example.com');

// ✅ Async validation in forms
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
  email: z.string()
    .email()
    .refine(
      async (email) => {
        const response = await fetch(`/api/check-email?email=${email}`);
        const { available } = await response.json();
        return available;
      },
      'Email already registered'
    ),
  password: z.string().min(8),
});

const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema, {
      mode: 'async', // Enable async validation
    }),
  });

  // Email validation happens on blur
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        {...form.register('email')}
        error={form.formState.errors.email?.message}
      />
    </form>
  );
};

// Pulwave pattern: Async validation utility
// packages/foundation/utils/validation.ts
export const createUniqueValidator = <T>(
  checkFn: (value: T) => Promise<boolean>,
  message: string
) => {
  return async (value: T) => {
    const isUnique = await checkFn(value);
    return isUnique;
  };
};

// Usage
const uniquePropertyNameSchema = z.string().refine(
  createUniqueValidator(
    (name) => propertyRepository.isNameAvailable(name),
    'Property name already exists'
  )
);
```

---

## 3. Form Validation (CRITICAL)

### 3.1 React Hook Form Integration

**Incorrect**:
```typescript
// ❌ Manual form validation
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  const errors = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Invalid email';
  }

  if (!formData.password || formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }

  // Submit
};
```

**Correct**:
```typescript
// ✅ React Hook Form with Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createPropertySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  price: z.number().positive('Price must be positive'),
  type: z.enum(['residential', 'commercial', 'industrial']),
  description: z.string().max(5000).optional(),
});

type CreatePropertyInput = z.infer<typeof createPropertySchema>;

const PropertyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreatePropertyInput>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      type: 'residential',
    },
  });

  const onSubmit = async (data: CreatePropertyInput) => {
    try {
      await propertyService.create(data);
      showSuccessToast('Property created');
    } catch (error) {
      if (error instanceof ValidationError) {
        // Set server-side validation errors
        error.details.forEach(({ field, message }) => {
          setError(field as keyof CreatePropertyInput, { message });
        });
      } else {
        showErrorToast('Failed to create property');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Price"
        type="number"
        {...register('price', { valueAsNumber: true })}
        error={errors.price?.message}
      />

      <Select
        label="Type"
        {...register('type')}
        error={errors.type?.message}
        options={[
          { value: 'residential', label: 'Residential' },
          { value: 'commercial', label: 'Commercial' },
          { value: 'industrial', label: 'Industrial' },
        ]}
      />

      <TextArea
        label="Description"
        {...register('description')}
        error={errors.description?.message}
      />

      <Button type="submit" loading={isSubmitting}>
        Create Property
      </Button>
    </form>
  );
};
```

---

### 3.2 Field-Level Validation

**Correct**:
```typescript
// ✅ Field-level validation
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onBlur', // Validate on blur
});

// Validate on change
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange',
});

// Validate on submit only
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onSubmit',
});

// Manual field validation
const { trigger } = form;

<Input
  {...register('email')}
  onBlur={() => trigger('email')} // Validate single field
/>
```

---

### 3.3 Cross-Field Validation

**Correct**:
```typescript
// ✅ Cross-field validation
const passwordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Error on confirmPassword field
  }
);

// Conditional validation
const propertySchema = z.object({
  type: z.enum(['residential', 'commercial']),
  bedrooms: z.number().optional(),
}).refine(
  (data) => {
    if (data.type === 'residential' && !data.bedrooms) {
      return false;
    }
    return true;
  },
  {
    message: 'Bedrooms required for residential properties',
    path: ['bedrooms'],
  }
);

// Pulwave date range validation
const dateRangeSchema = z.object({
  start_date: z.date(),
  end_date: z.date(),
}).refine(
  (data) => data.end_date > data.start_date,
  {
    message: 'End date must be after start date',
    path: ['end_date'],
  }
);
```

---

### 3.4 Async Field Validation

See section 2.5 for complete async validation patterns.

---

### 3.5 Error Display

**Correct**:
```typescript
// ✅ Field error display
<Input
  label="Email"
  {...register('email')}
  error={errors.email?.message}
  aria-invalid={!!errors.email}
/>

// ✅ Form-level error summary
const FormErrorSummary = ({ errors }: { errors: FieldErrors }) => {
  const errorList = Object.entries(errors)
    .filter(([_, error]) => error?.message)
    .map(([field, error]) => ({
      field,
      message: error!.message as string,
    }));

  if (errorList.length === 0) return null;

  return (
    <Alert variant="error" role="alert">
      <h3>Please fix the following errors:</h3>
      <ul>
        {errorList.map(({ field, message }) => (
          <li key={field}>
            <a href={`#${field}`}>{message}</a>
          </li>
        ))}
      </ul>
    </Alert>
  );
};

// Usage
<form onSubmit={handleSubmit(onSubmit)}>
  <FormErrorSummary errors={errors} />
  {/* Form fields */}
</form>
```

---

## 4. API Validation (CRITICAL)

### 4.1 Request Body Validation

See API Design AGENTS.md section 2.1 for complete request validation patterns.

---

### 4.2 Query Parameter Validation

**Correct**:
```typescript
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

type ListPropertiesQuery = z.infer<typeof listPropertiesQuerySchema>;

// Middleware
const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: {
            code: 'INVALID_QUERY',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      next(error);
    }
  };
};

// Usage
router.get(
  '/properties',
  validateQuery(listPropertiesQuerySchema),
  async (req, res) => {
    const query = req.query as ListPropertiesQuery;
    const properties = await propertyService.list(query);
    return res.json({ data: properties });
  }
);
```

---

### 4.3 Path Parameter Validation

**Correct**:
```typescript
// ✅ Path parameter validation
const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid property ID'),
});

router.get(
  '/properties/:id',
  validateParams(uuidParamSchema),
  async (req, res) => {
    const { id } = req.params; // Validated UUID
    const property = await propertyService.findById(id);
    return res.json({ data: property });
  }
);
```

---

### 4.4 Response Validation

**Correct**:
```typescript
// ✅ Validate API responses (defensive)
const propertyResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number(),
});

const fetchProperty = async (id: string): Promise<Property> => {
  const response = await fetch(`/api/properties/${id}`);
  const data = await response.json();

  // Validate response matches expected schema
  return propertyResponseSchema.parse(data.data);
};
```

---

### 4.5 Validation Middleware

See API Design AGENTS.md section 2.1 for complete middleware patterns.

---

## 5. Input Sanitization (CRITICAL)

### 5.1 XSS Prevention

**Incorrect**:
```typescript
// ❌ Raw HTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

**Correct**:
```typescript
// ✅ Sanitize HTML input
import DOMPurify from 'dompurify';

const descriptionSchema = z.string()
  .transform((html) => DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href'],
  }))
  .max(5000);

// Safe to render
<div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />

// Pulwave sanitization utility
// packages/foundation/utils/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'blockquote'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?):\/\/|\/)/, // Only http(s) and relative URLs
  });
};

// Strip all HTML
export const stripHTML = (html: string): string => {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
};
```

---

### 5.2 SQL Injection Prevention

**Correct**:
```typescript
// ✅ Always use parameterized queries
// Supabase automatically escapes parameters
const properties = await supabase
  .from('properties')
  .select('*')
  .eq('city', userInput); // Safe - parameterized

// ✅ With Zod validation first
const citySchema = z.string().max(100);
const city = citySchema.parse(userInput);

const properties = await supabase
  .from('properties')
  .select('*')
  .eq('city', city);

// ❌ NEVER build raw SQL from user input
// const query = `SELECT * FROM properties WHERE city = '${userInput}'`;
```

---

### 5.3 HTML Sanitization

See section 5.1 for HTML sanitization patterns.

---

### 5.4 String Trimming

**Correct**:
```typescript
// ✅ Always trim string inputs
const nameSchema = z.string()
  .transform((str) => str.trim())
  .min(1, 'Name is required')
  .max(200);

// Normalize whitespace
const normalizeWhitespace = (str: string) => {
  return str.trim().replace(/\s+/g, ' ');
};

const descriptionSchema = z.string()
  .transform(normalizeWhitespace)
  .max(5000);
```

---

### 5.5 Encoding

**Correct**:
```typescript
// ✅ Encode for URL
const encodedCity = encodeURIComponent(city);
fetch(`/api/properties?city=${encodedCity}`);

// ✅ Encode for HTML attributes
const escapeHTML = (str: string) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
```

---

## Appendix

### A. Common Validation Patterns

**Email**:
```typescript
z.string().email().toLowerCase()
```

**Password**:
```typescript
z.string()
  .min(8)
  .refine((p) => /[A-Z]/.test(p), 'Uppercase required')
  .refine((p) => /[0-9]/.test(p), 'Number required')
```

**Phone**:
```typescript
z.string()
  .transform((p) => p.replace(/\D/g, ''))
  .refine((p) => p.length >= 9)
```

**URL**:
```typescript
z.string().url()
```

**UUID**:
```typescript
z.string().uuid()
```

**Postal Code (Portugal)**:
```typescript
z.string().regex(/^\d{4}-\d{3}$/)
```

**Date Range**:
```typescript
z.object({
  start: z.date(),
  end: z.date(),
}).refine((d) => d.end > d.start)
```

### B. Security Checklist

- [ ] All user input validated with Zod
- [ ] HTML sanitized with DOMPurify
- [ ] SQL queries parameterized
- [ ] XSS prevention in place
- [ ] CSRF tokens on forms
- [ ] Rate limiting on endpoints
- [ ] Input length limits enforced
- [ ] File uploads validated
- [ ] Email addresses validated
- [ ] URLs validated and sanitized

### C. Zod API Reference

See [Zod Documentation](https://zod.dev) for complete API reference.

### D. Error Message Templates

**Good Messages**:
- "Email is required"
- "Password must be at least 8 characters"
- "Price must be a positive number"
- "End date must be after start date"

**Bad Messages**:
- "Invalid input"
- "Error"
- "Validation failed"

---

**Related Guides**:
- [Error Handling](../crosscutting/error-handling/AGENTS.md) - Error handling patterns
- [API Design](../backend/api-design/AGENTS.md) - API validation
- [Authentication](../crosscutting/authentication/AGENTS.md) - Auth validation
- [Testing](../testing/AGENTS.md) - Testing validation

**Version**: 1.0.0
**Last Updated**: 2026-01-17
