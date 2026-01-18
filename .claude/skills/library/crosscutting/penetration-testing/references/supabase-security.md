# Supabase Security Testing

## Supabase-Specific Attack Vectors

### 1. Row Level Security (RLS) Testing

#### RLS Disabled (CRITICAL)
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Test accessing data without RLS
SELECT * FROM users WHERE id != current_user_id();
```

```javascript
// Automated test
const { data, error } = await supabase
  .from('sensitive_table')
  .select('*');

// If data returned without authentication or with wrong user:
// VULNERABILITY: RLS not enabled
```

#### RLS with USING (true) - Always Bypass
```sql
-- Bad RLS policy that always returns true
CREATE POLICY "bad_policy" ON users
  FOR SELECT
  USING (true);  -- ❌ ALLOWS ALL ACCESS
```

```javascript
// Test: Login as User A, try to access User B's data
const userASession = await supabase.auth.signIn({
  email: 'userA@test.com',
  password: 'password'
});

const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', 'userB_id');

// If data returned: VULNERABILITY
```

#### RLS Policy Bypass via NULL
```sql
-- Test NULL bypass
SELECT * FROM posts WHERE user_id IS NULL;
```

### 2. Multi-Tenant Isolation

#### Tenant ID Manipulation
```javascript
// User in Tenant A tries to access Tenant B data
const { data } = await supabase
  .from('documents')
  .select('*')
  .eq('tenant_id', 'tenantB_id');  // Different tenant

// Should be blocked by RLS, test if vulnerable
```

#### Shared Table Leakage
```javascript
// Test if shared tables expose cross-tenant data
const { data } = await supabase
  .from('lookup_table')  // Shared across tenants
  .select('*, tenant_specific_data');

// Check for tenant data leakage
```

### 3. Supabase Storage Security

#### Public Bucket Access
```javascript
// Test unauthorized access to storage buckets
const { data } = await supabase
  .storage
  .from('private-documents')
  .download('secret.pdf');

// Should fail without auth
```

#### File Upload Bypass
```javascript
// Test file type validation
const maliciousFile = new File(
  ['<?php system($_GET["cmd"]); ?>'],
  'shell.php',
  { type: 'image/jpeg' }  // Fake MIME type
);

const { data, error } = await supabase
  .storage
  .from('uploads')
  .upload('shell.php', maliciousFile);

// Check if PHP/executable files blocked
```

### 4. Supabase Auth Bypass

#### Email Verification Bypass
```javascript
// Register without verifying email
const { user } = await supabase.auth.signUp({
  email: 'test@test.com',
  password: 'password'
});

// Immediately try to access protected resources
const { data } = await supabase
  .from('protected_table')
  .select('*');

// Should be blocked if email not verified
```

#### Magic Link Reuse
```javascript
// Request magic link
await supabase.auth.signIn({
  email: 'test@test.com'
});

// Get magic link token (from email/logs)
const token = 'captured_token';

// Test if token can be used multiple times
await supabase.auth.verifyOTP({ token, type: 'magiclink' });
await supabase.auth.verifyOTP({ token, type: 'magiclink' }); // Should fail

// Test if token expires
```

### 5. Database Function Exploits

#### Function Privilege Escalation
```sql
-- Test if functions run with elevated privileges
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS SETOF users AS $$
  SELECT * FROM users;  -- Bypasses RLS?
$$ LANGUAGE sql SECURITY DEFINER;

SELECT * FROM get_all_users();
```

```javascript
// Test via RPC
const { data } = await supabase
  .rpc('get_all_users');

// Should respect RLS, not return all users
```

#### SQL Injection in RPC
```javascript
// Test SQL injection in custom functions
const { data } = await supabase
  .rpc('search_users', {
    search_term: "'; DROP TABLE users--"
  });

// Should be sanitized
```

### 6. Realtime Security

#### Channel Hijacking
```javascript
// Subscribe to another user's private channel
const channel = supabase
  .channel('user:otherUserId:private')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'messages' },
    (payload) => console.log(payload)  // Should not receive
  )
  .subscribe();
```

#### Broadcast Message Spoofing
```javascript
// Try to send messages as another user
const channel = supabase.channel('public-room');

await channel.send({
  type: 'broadcast',
  event: 'message',
  payload: { 
    user_id: 'victim_id',  // Impersonation
    message: 'Fake message'
  }
});
```

### 7. API Key Exposure

#### Anon Key Misuse
```javascript
// Test if anon key allows unauthorized operations
const supabaseClient = createClient(
  'https://project.supabase.co',
  'ANON_KEY'  // Public key
);

// Try admin operations
const { data } = await supabaseClient
  .from('users')
  .delete()
  .eq('role', 'admin');

// Should fail - RLS should prevent
```

#### Service Role Key in Client
```javascript
// Check if service_role key accidentally exposed in frontend
// Scan client-side code for:
const patterns = [
  /service_role/i,
  /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.*role.*service_role/,
];

// This would be CRITICAL vulnerability
```

### 8. Vault Secrets Exposure

#### Secrets in Logs
```javascript
// Test if secrets appear in error messages
const { data, error } = await supabase
  .rpc('function_using_secret');

// Check error.message for leaked secrets
if (error?.message?.includes('API_KEY') || 
    error?.message?.includes('password')) {
  // VULNERABILITY: Secrets in error messages
}
```

### 9. Backup & Point-in-Time Recovery

#### Backup Exposure
```javascript
// Test if database backups are publicly accessible
const backupUrls = [
  'https://project.supabase.co/backups/latest.sql',
  'https://project.supabase.co/storage/v1/object/public/backups/db.dump',
];

for (const url of backupUrls) {
  const res = await fetch(url);
  if (res.ok) {
    // VULNERABILITY: Backup publicly accessible
  }
}
```

## Supabase Security Checklist

### RLS Configuration
- [ ] RLS enabled on all tables with sensitive data
- [ ] No policies with `USING (true)`
- [ ] Policies tested for each user role
- [ ] NULL values handled in policies
- [ ] Foreign key relationships respect RLS

### Multi-Tenancy
- [ ] Tenant ID in all sensitive tables
- [ ] RLS policies filter by tenant_id
- [ ] Shared tables don't leak tenant data
- [ ] Tenant switching blocked

### Storage Security
- [ ] Private buckets require authentication
- [ ] File type validation enforced
- [ ] File size limits configured
- [ ] Virus scanning enabled
- [ ] Public URLs expire

### Auth Security
- [ ] Email verification required
- [ ] Magic links expire and single-use
- [ ] Rate limiting on auth endpoints
- [ ] Strong password policy
- [ ] MFA available for sensitive operations

### Database Functions
- [ ] Functions use SECURITY INVOKER (not DEFINER)
- [ ] Input sanitization in all functions
- [ ] No privilege escalation via functions
- [ ] RLS respected in functions

### API Keys
- [ ] Anon key protected by RLS
- [ ] Service role key never in client code
- [ ] API keys rotated regularly
- [ ] Key usage monitored

### Realtime
- [ ] Channel access controlled by RLS
- [ ] Broadcast authentication required
- [ ] Presence validated
- [ ] Message size limits

## Automated Tests

```javascript
// Example: Comprehensive Supabase security test
async function testSupabaseSecurity() {
  // 1. Test RLS
  await testRLSEnabled();
  await testRLSPolicies();
  
  // 2. Test Multi-tenancy
  await testTenantIsolation();
  
  // 3. Test Storage
  await testStorageSecurity();
  
  // 4. Test Auth
  await testAuthSecurity();
  
  // 5. Test Database Functions
  await testFunctionSecurity();
  
  // 6. Test Realtime
  await testRealtimeSecurity();
  
  // 7. Test API Keys
  await testAPIKeySecurity();
}
```

## References

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [SupaRalph Testing Tool](https://suparalph.vibeship.co)
