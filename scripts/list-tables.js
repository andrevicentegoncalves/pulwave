#!/usr/bin/env node
/**
 * List All Supabase Table Names
 *
 * Usage:
 *   node scripts/list-tables.js
 *   node scripts/list-tables.js --json    # Output as JSON
 *   node scripts/list-tables.js --csv     # Output as CSV
 *
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from root .env
config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables:');
    if (!supabaseUrl) console.error('   - VITE_SUPABASE_URL');
    if (!supabaseKey) console.error('   - VITE_SUPABASE_ANON_KEY');
    console.error('\nMake sure your .env file contains these variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
    const args = process.argv.slice(2);
    const outputJson = args.includes('--json');
    const outputCsv = args.includes('--csv');

    console.log('🔄 Fetching table names from Supabase...\n');

    // Query information_schema for public tables
    const { data, error } = await supabase.rpc('get_all_tables').select('*');

    // If RPC doesn't exist, try direct query via REST
    if (error?.code === 'PGRST202') {
        // Fall back to querying pg_tables directly
        const { data: tables, error: queryError } = await supabase
            .from('pg_tables')
            .select('tablename')
            .eq('schemaname', 'public');

        if (queryError) {
            // Last resort: use raw SQL via edge function or provide instructions
            console.error('❌ Cannot query tables directly.');
            console.log('\nTo enable this, create an RPC function in Supabase:');
            console.log(`
CREATE OR REPLACE FUNCTION get_all_tables()
RETURNS TABLE(table_name text, table_type text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    table_name::text,
    table_type::text
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name;
$$;
`);
            process.exit(1);
        }

        outputResults(
            tables?.map((t) => ({ table_name: t.tablename, table_type: 'BASE TABLE' })) || [],
            outputJson,
            outputCsv
        );
        return;
    }

    if (error) {
        console.error('❌ Error fetching tables:', error.message);
        process.exit(1);
    }

    outputResults(data || [], outputJson, outputCsv);
}

function outputResults(tables, outputJson, outputCsv) {
    if (tables.length === 0) {
        console.log('No tables found in public schema.');
        return;
    }

    if (outputJson) {
        console.log(JSON.stringify(tables, null, 2));
        return;
    }

    if (outputCsv) {
        console.log('table_name,table_type');
        tables.forEach((t) => console.log(`${t.table_name},${t.table_type || 'BASE TABLE'}`));
        return;
    }

    // Default: formatted output
    console.log(`Found ${tables.length} tables in public schema:\n`);
    console.log('┌─────────────────────────────────────────┬──────────────┐');
    console.log('│ Table Name                              │ Type         │');
    console.log('├─────────────────────────────────────────┼──────────────┤');

    tables.forEach((t) => {
        const name = (t.table_name || '').padEnd(39);
        const type = (t.table_type || 'BASE TABLE').padEnd(12);
        console.log(`│ ${name} │ ${type} │`);
    });

    console.log('└─────────────────────────────────────────┴──────────────┘');
    console.log(`\nTotal: ${tables.length} tables`);
}

listTables().catch((err) => {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
});
