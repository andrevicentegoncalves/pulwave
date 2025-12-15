# PulWave Profiles Table - Best Practices Audit

## Settings Tables Overview

| Table | Purpose | Audit Trail |
|-------|---------|-------------|
| `profiles` | Core identity, auth state | ✅ |
| `user_preferences` | UI, locale, notifications | ✅ |
| `contacts` | Phones, emergency contacts | ✅ |
| `addresses` | Physical addresses | ✅ |
| `organization_members` | User-org relationships | ✅ |
| `professional_profiles` | Work/career info | To verify |
| `social_profiles` | Social media links | To verify |

---

## Auth User Extension - Industry Best Practices

### Supabase Recommended Pattern

| Best Practice | PulWave Implementation | Status |
|---------------|------------------------|--------|
| Separate `profiles` table (not modifying `auth.users`) | ✅ Yes, `profiles` in `public` schema | ✅ |
| `auth_user_id` FK to `auth.users(id)` | ✅ Yes, with `ON DELETE CASCADE` | ✅ |
| `auth_user_id` is NOT NULL and UNIQUE | ✅ Yes | ✅ |
| Keep `auth.users` minimal | ✅ Only email/password stored there | ✅ |
| Cascade delete on user removal | ✅ `ON DELETE CASCADE` | ✅ |
| Primary business data in extension table | ✅ All profile data in `profiles` | ✅ |
| RLS policies using `auth.uid()` | ✅ Policies reference `auth_user_id = auth.uid()` | ✅ |

### Future-Proof Considerations

| Feature | Current Status | Recommendation |
|---------|----------------|----------------|
| SSO Support | ✅ `sso_provider`, `sso_provider_id` columns | Ready |
| WebAuthn/Passkeys | ✅ `webauthn_enabled`, `webauthn_registered_at` | Ready |
| Phone Verification | ✅ `phone_verified`, `phone_verified_at` | Ready |
| Attribution/Marketing | ✅ `utm_source`, `utm_medium`, etc. | Ready |
| Profile Completeness | ✅ Calculated via trigger | Ready |
| Multi-tenancy | ✅ `organization_id` relationships | Ready |
| Soft Delete | ✅ `is_deleted`, `deleted_at`, `deleted_by` | Ready |
| GDPR Export | ⚠️ Need export function | To Add |

---

## Column Ordering Standard

### Recommended Order (Audit Trail at End)

```
1. IDENTITY (id, auth_user_id, username, email)
2. PERSONAL INFO (names, avatar, bio)
3. PLATFORM ROLE (app_role, user_type)
4. AUTH STATE (is_active, 2FA, verification)
5. FEATURE FLAGS/SSO (webauthn, sso_provider)
6. DELETION WORKFLOW (is_deleted, deleted_at)
7. ACTIVITY (last_activity_at, login_count)
8. BILLING (has_billing_access, stripe_id)
9. ATTRIBUTION (utm_*, referral)
10. COMPLIANCE (completeness_score, tax_id)
11. ORGANIZATION CONTEXT (last_active_org)
12. METADATA (tags, metadata, version)
13. AUDIT TRAIL ← ALWAYS LAST
    - created_at
    - created_by
    - updated_at
    - updated_by
```

---

## Run This SQL

Run `audit_settings_tables.sql` in Supabase SQL Editor to:
1. See current column order for all 7 tables
2. Identify which tables need column reordering
3. Compare against the standard above

---

## Verdict: Is PulWave's `profiles` Future-Proof?

✅ **YES** - The current design follows Supabase best practices:

1. Separate extension table ✅
2. Proper FK with CASCADE ✅
3. NOT NULL auth_user_id ✅
4. SSO/WebAuthn ready ✅
5. Multi-tenant ready ✅
6. GDPR soft-delete ready ✅
7. Audit trail columns ✅

**Minor improvements to consider:**
- Add GDPR export function
- Verify column ordering (run audit SQL)
- Recreate tables with proper order if needed
