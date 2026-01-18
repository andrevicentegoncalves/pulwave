# Security & RLS Patterns

---

## 1. Multi-Tenant RLS Policies

```sql
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MULTI-TENANT RLS POLICIES                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  -- Helper function to get current org from JWT                             │
│  CREATE OR REPLACE FUNCTION auth.current_org_id()                           │
│  RETURNS UUID AS $$                                                         │
│    SELECT (auth.jwt() ->> 'org_id')::uuid;                                 │
│  $$ LANGUAGE SQL STABLE;                                                    │
│                                                                              │
│  -- Helper function to check permission                                     │
│  CREATE OR REPLACE FUNCTION auth.has_permission(permission TEXT)            │
│  RETURNS BOOLEAN AS $$                                                      │
│  DECLARE                                                                    │
│    perms TEXT[];                                                            │
│    perm TEXT;                                                               │
│    resource TEXT;                                                           │
│    action TEXT;                                                             │
│  BEGIN                                                                      │
│    perms := ARRAY(                                                          │
│      SELECT jsonb_array_elements_text(auth.jwt() -> 'permissions')         │
│    );                                                                       │
│                                                                              │
│    -- Check wildcard                                                        │
│    IF '*:*' = ANY(perms) THEN RETURN TRUE; END IF;                         │
│                                                                              │
│    -- Parse permission                                                      │
│    resource := split_part(permission, ':', 1);                             │
│    action := split_part(permission, ':', 2);                               │
│                                                                              │
│    -- Check resource wildcard                                               │
│    IF (resource || ':*') = ANY(perms) THEN RETURN TRUE; END IF;           │
│                                                                              │
│    -- Check action wildcard                                                 │
│    IF ('*:' || action) = ANY(perms) THEN RETURN TRUE; END IF;             │
│                                                                              │
│    -- Check exact match                                                     │
│    RETURN permission = ANY(perms);                                          │
│  END;                                                                       │
│  $$ LANGUAGE plpgsql STABLE;                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Global Schema Policies

```sql
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GLOBAL SCHEMA POLICIES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  -- Profiles: Users can read any, update own                                │
│  CREATE POLICY "profiles_select" ON global.profiles                         │
│  FOR SELECT USING (TRUE);  -- Anyone can see basic profile                 │
│                                                                              │
│  CREATE POLICY "profiles_update_own" ON global.profiles                     │
│  FOR UPDATE USING (id = auth.uid());                                       │
│                                                                              │
│  -- Countries, translations: Read-only for all                              │
│  CREATE POLICY "countries_select" ON global.countries                       │
│  FOR SELECT USING (TRUE);                                                   │
│                                                                              │
│  CREATE POLICY "translations_select" ON global.translations                 │
│  FOR SELECT USING (TRUE);                                                   │
│                                                                              │
│  -- Translations: Admins can write                                          │
│  CREATE POLICY "translations_admin" ON global.translations                  │
│  FOR ALL USING (auth.has_permission('translations:write'));                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Platform Schema Policies

```sql
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PLATFORM SCHEMA POLICIES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  -- Organizations: Members can read their own orgs                          │
│  CREATE POLICY "orgs_member_select" ON platform.organizations               │
│  FOR SELECT USING (                                                         │
│    id IN (                                                                  │
│      SELECT org_id FROM platform.org_members                               │
│      WHERE user_id = auth.uid()                                             │
│    )                                                                        │
│  );                                                                         │
│                                                                              │
│  -- Organizations: Owners can update                                        │
│  CREATE POLICY "orgs_owner_update" ON platform.organizations                │
│  FOR UPDATE USING (                                                         │
│    id = auth.current_org_id()                                               │
│    AND auth.has_permission('admin:settings')                               │
│  );                                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. App Schema Policies (Real Estate Example)

```sql
┌─────────────────────────────────────────────────────────────────────────────┐
│                  APP SCHEMA POLICIES (REAL_ESTATE)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  -- Properties: Org members with read permission                            │
│  CREATE POLICY "properties_select" ON real_estate.properties                │
│  FOR SELECT USING (                                                         │
│    org_id = auth.current_org_id()                                           │
│    AND auth.has_permission('properties:read')                              │
│  );                                                                         │
│                                                                              │
│  -- Properties: Members with write permission can insert/update             │
│  CREATE POLICY "properties_insert" ON real_estate.properties                │
│  FOR INSERT WITH CHECK (                                                    │
│    org_id = auth.current_org_id()                                           │
│    AND auth.has_permission('properties:write')                             │
│  );                                                                         │
│                                                                              │
│  CREATE POLICY "properties_update" ON real_estate.properties                │
│  FOR UPDATE USING (                                                         │
│    org_id = auth.current_org_id()                                           │
│    AND auth.has_permission('properties:write')                             │
│  );                                                                         │
│                                                                              │
│  -- Properties: Only admins can delete                                      │
│  CREATE POLICY "properties_delete" ON real_estate.properties                │
│  FOR DELETE USING (                                                         │
│    org_id = auth.current_org_id()                                           │
│    AND auth.has_permission('properties:delete')                            │
│  );                                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Auto-Set Org ID on Insert

```sql
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTO-SET ORG_ID ON INSERT                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  -- Trigger to automatically set org_id from JWT                            │
│  CREATE OR REPLACE FUNCTION set_org_id()                                    │
│  RETURNS TRIGGER AS $$                                                      │
│  BEGIN                                                                      │
│    IF NEW.org_id IS NULL THEN                                              │
│      NEW.org_id := auth.current_org_id();                                  │
│    END IF;                                                                  │
│    RETURN NEW;                                                              │
│  END;                                                                       │
│  $$ LANGUAGE plpgsql;                                                       │
│                                                                              │
│  -- Apply to all app tables                                                 │
│  CREATE TRIGGER set_org_id_trigger                                          │
│  BEFORE INSERT ON real_estate.properties                                    │
│  FOR EACH ROW EXECUTE FUNCTION set_org_id();                               │
│                                                                              │
│  CREATE TRIGGER set_org_id_trigger                                          │
│  BEFORE INSERT ON real_estate.units                                         │
│  FOR EACH ROW EXECUTE FUNCTION set_org_id();                               │
│                                                                              │
│  -- (repeat for all tables with org_id)                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Cross-Schema Security

```sql
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CROSS-SCHEMA SECURITY                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  -- Ensure users can only access app schemas they have permission for       │
│                                                                              │
│  -- Check if user has access to the current app                             │
│  CREATE OR REPLACE FUNCTION auth.has_app_access(app_slug TEXT)              │
│  RETURNS BOOLEAN AS $$                                                      │
│    SELECT (auth.jwt() ->> 'app_slug') = app_slug;                          │
│  $$ LANGUAGE SQL STABLE;                                                    │
│                                                                              │
│  -- Alternative: Check if user's org has the app enabled                    │
│  CREATE OR REPLACE FUNCTION auth.org_has_app(app_slug TEXT)                 │
│  RETURNS BOOLEAN AS $$                                                      │
│    SELECT EXISTS (                                                          │
│      SELECT 1 FROM platform.org_apps oa                                    │
│      JOIN platform.apps a ON a.id = oa.app_id                              │
│      WHERE oa.org_id = auth.current_org_id()                               │
│      AND a.slug = app_slug                                                 │
│    );                                                                       │
│  $$ LANGUAGE SQL STABLE;                                                    │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  -- Example: Prevent real_estate access if org doesn't have the app        │
│                                                                              │
│  CREATE POLICY "app_access_check" ON real_estate.properties                 │
│  FOR ALL USING (                                                            │
│    auth.org_has_app('real-estate')                                          │
│    AND org_id = auth.current_org_id()                                       │
│  );                                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Audit Logging

```sql
┌─────────────────────────────────────────────────────────────────────────────┐
│                            AUDIT LOGGING                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CREATE TABLE platform.audit_log (                                          │
│    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),                          │
│    org_id UUID NOT NULL,                                                   │
│    app_id UUID,                                                            │
│    user_id UUID NOT NULL,                                                  │
│    action TEXT NOT NULL,          -- 'create', 'update', 'delete'          │
│    resource_type TEXT NOT NULL,   -- 'properties', 'users', etc.           │
│    resource_id UUID,                                                       │
│    old_data JSONB,                                                         │
│    new_data JSONB,                                                         │
│    ip_address INET,                                                        │
│    user_agent TEXT,                                                        │
│    created_at TIMESTAMPTZ DEFAULT NOW()                                    │
│  );                                                                         │
│                                                                              │
│  -- Audit trigger function                                                  │
│  CREATE OR REPLACE FUNCTION audit_trigger()                                 │
│  RETURNS TRIGGER AS $$                                                      │
│  BEGIN                                                                      │
│    INSERT INTO platform.audit_log (                                        │
│      org_id, app_id, user_id, action, resource_type, resource_id,         │
│      old_data, new_data                                                    │
│    ) VALUES (                                                               │
│      auth.current_org_id(),                                                │
│      (auth.jwt() ->> 'app_id')::uuid,                                     │
│      auth.uid(),                                                           │
│      TG_OP,                                                                 │
│      TG_TABLE_NAME,                                                        │
│      COALESCE(NEW.id, OLD.id),                                            │
│      CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,        │
│      CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) ELSE NULL END
│    );                                                                       │
│    RETURN COALESCE(NEW, OLD);                                              │
│  END;                                                                       │
│  $$ LANGUAGE plpgsql;                                                       │
│                                                                              │
│  -- Apply to sensitive tables                                               │
│  CREATE TRIGGER audit_properties                                            │
│  AFTER INSERT OR UPDATE OR DELETE ON real_estate.properties                │
│  FOR EACH ROW EXECUTE FUNCTION audit_trigger();                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## See Also

| Related Topic | Document |
|---------------|----------|
| Database design | [03-database-design.md](./03-database-design.md) |
| Supabase integration | [12-supabase-integration.md](./12-supabase-integration.md) |
| Architecture decisions | [09-architecture-decisions.md](./09-architecture-decisions.md) |
| TypeScript patterns | [13-typescript-patterns.md](./13-typescript-patterns.md) |

