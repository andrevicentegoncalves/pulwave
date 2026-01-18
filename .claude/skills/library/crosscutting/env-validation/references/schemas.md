# Environment Schemas

## Common Patterns

### Required String
```typescript
VITE_API_URL: z.string().url().min(1, 'Required'),
```

### Optional with Default
```typescript
VITE_APP_ENV: z.enum(['dev', 'prod']).default('dev'),
```

### Boolean from String
```typescript
VITE_DEBUG: z.string().transform(v => v === 'true').default('false'),
```

### JWT Validation
```typescript
VITE_SUPABASE_ANON_KEY: z
  .string()
  .min(100, 'Token too short')
  .regex(/^eyJ/, 'Must be valid JWT'),
```

### Number from String
```typescript
VITE_PORT: z.string().transform(Number).pipe(z.number().int().min(1000)),
```

## Error Handling

```typescript
const parseEnv = () => {
  const result = schema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error('❌ Invalid environment:\n' +
      Object.entries(errors)
        .map(([k, v]) => `  ${k}: ${v?.join(', ')}`)
        .join('\n')
    );
    throw new Error('Invalid environment');
  }

  return result.data;
};
```

## Type Inference

```typescript
// Schema
export const clientEnvSchema = z.object({...});

// Type (automatically inferred)
export type ClientEnv = z.infer<typeof clientEnvSchema>;

// Usage - fully typed
const url: string = clientEnv.VITE_SUPABASE_URL;
```

## File Structure

```
packages/internal/env/
├── src/
│   ├── schema.ts     # Zod schemas
│   ├── client.ts     # Browser-safe parsing
│   └── server.ts     # Node-only parsing
├── index.ts          # Client exports
└── server.ts         # Server exports
```
