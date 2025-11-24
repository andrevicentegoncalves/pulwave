# Profile.jsx Fix Instructions

After running the SQL migration `03_fix_rls_recursion.sql`, you need to make ONE small change to `src/pages/Profile.jsx`:

## Change Line 57

**Find this line (around line 57):**
```javascript
.eq('id', user.id)
```

**Replace with:**
```javascript
.eq('auth_user_id', user.id)
```

That's it! This single change will fix the profile data loading issue.

## Why this fix is needed

After the profiles table normalization:
- The `auth_user_id` column now links to Supabase Auth users
- The `id` column is the profile's own UUID
- The query needs to use `auth_user_id` to find the profile for the logged-in user

## Full context (lines 54-58)

```javascript
const { data: profileData } = await supabase
  .from('profiles')
  .select('*')
  .eq('auth_user_id', user.id)  // <-- Changed from 'id' to 'auth_user_id'
  .single();
```
