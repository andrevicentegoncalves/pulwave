/**
 * @pulwave/mcp-supabase
 *
 * MCP server for Pulwave Supabase database.
 *
 * ## Tools Available
 *
 * ### Profiles
 * - `list_profiles` - List users with filtering
 * - `get_profile` - Get profile by ID
 * - `search_profiles` - Search profiles
 *
 * ### Translations
 * - `list_translations` - List translations
 * - `search_translations` - Search by key/value
 * - `get_missing_translations` - Find translation gaps
 * - `get_translation_stats` - Get translation statistics
 *
 * ### Properties (Real Estate)
 * - `list_properties` - List properties
 * - `get_property` - Get property details
 * - `list_buildings` - List buildings
 * - `list_leases` - List leases
 * - `get_property_stats` - Property statistics
 *
 * ### Admin
 * - `list_master_data` - List master data
 * - `list_feature_flags` - List feature flags
 * - `list_audit_logs` - Query audit logs
 * - `get_system_config` - Get system config
 * - `list_locales` - List locales
 *
 * ### Schema
 * - `list_tables` - List database tables
 * - `describe_table` - Get table columns
 * - `run_query` - Execute read-only SQL
 * - `get_enum_values` - Get enum values
 *
 * @example
 * ```typescript
 * import { createServer } from '@pulwave/mcp-supabase';
 *
 * const server = createServer({
 *   url: process.env.SUPABASE_URL,
 *   anonKey: process.env.SUPABASE_ANON_KEY,
 * });
 *
 * await server.start();
 * ```
 */

export { PulwaveSupabaseMcpServer, createServer } from './server.js';
export { SupabaseProvider, type SupabaseConfig } from './provider.js';
export * from './tools/index.js';
