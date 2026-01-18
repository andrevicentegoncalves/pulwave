# Supabase Specifics

## Database Functions (RPC)

Stored procedures accessible via API. Only `logic` goes here, not UI concerns.

```sql
create or replace function get_planets()
returns setof planets
language sql
security invoker -- Important: Runs with permissions of caller (respects RLS)
as $$
  select * from planets;
$$;
```
*Call via JS*: `supabase.rpc('get_planets')`

### Security Definer vs Invoker
- **Invoker** (Default): Runs with permissions of the user calling it. Respects RLS. Safe.
- **Definer**: Runs with permissions of the creator (usually Admin/Postgres). Bypasses RLS. **Dangerous**. Use carefully.

## Triggers

Automate actions on DB changes.

```sql
-- Create Function
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- specific Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

## Realtime

Supabase broadcasts DB changes via Websockets.

### Performance Warning
Replica Identity `FULL` sends the *entire* row on update.
Replica Identity `DEFAULT` sends only Primary Key.

*Rule*: Only enable Realtime on tables that absolutely need it. It puts load on the DB (WAL reader).

## Foreign Data Wrappers (FDW)

Connect external DBs to Postgres.
*Supabase*: `postgres_fdw` is available.
Can query a remote Stripe DB (if wrapper available) or another Postgres instance as if it were a local table.
