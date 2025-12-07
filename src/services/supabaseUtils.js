/**
 * Supabase Utility Functions
 * 
 * Common patterns for database operations to reduce code duplication.
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Generic upsert operation that checks for existing record and updates or inserts.
 * Reduces the repeated "check-if-exists-then-update-or-insert" pattern.
 * 
 * @param {string} table - Table name
 * @param {Object} matchColumns - Columns to match for finding existing record (e.g., { profile_id: 123 })
 * @param {Object} payload - Data to insert or update
 * @param {Object} options - Additional options
 * @param {string} options.selectColumn - Column to select for existence check (default: 'id')
 * @param {boolean} options.returnData - Whether to return the upserted data (default: false)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const upsertRecord = async (table, matchColumns, payload, options = {}) => {
    const { selectColumn = 'id', returnData = false } = options;

    try {
        // Build query to check for existing record
        let query = supabase.from(table).select(selectColumn);

        Object.entries(matchColumns).forEach(([column, value]) => {
            query = query.eq(column, value);
        });

        const { data: existing, error: selectError } = await query.maybeSingle();

        if (selectError) {
            return { data: null, error: selectError };
        }

        let result;

        if (existing) {
            // Update existing record
            let updateQuery = supabase
                .from(table)
                .update({
                    ...payload,
                    updated_at: new Date().toISOString(),
                })
                .eq(selectColumn, existing[selectColumn]);

            if (returnData) {
                updateQuery = updateQuery.select().single();
            }

            result = await updateQuery;
        } else {
            // Insert new record
            let insertQuery = supabase
                .from(table)
                .insert([{
                    ...matchColumns,
                    ...payload,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }]);

            if (returnData) {
                insertQuery = insertQuery.select().single();
            }

            result = await insertQuery;
        }

        return { data: result.data || null, error: result.error || null };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Batch upsert multiple records
 * 
 * @param {string} table - Table name
 * @param {string} matchColumn - Single column to match (e.g., 'id' or 'profile_id')
 * @param {Array<Object>} records - Array of records, each containing match value and payload
 * @returns {Promise<{success: boolean, errors: Array}>}
 */
export const batchUpsert = async (table, matchColumn, records) => {
    const errors = [];

    await Promise.all(
        records.map(async (record) => {
            const { [matchColumn]: matchValue, ...payload } = record;
            const result = await upsertRecord(
                table,
                { [matchColumn]: matchValue },
                payload
            );

            if (result.error) {
                errors.push({ record, error: result.error });
            }
        })
    );

    return { success: errors.length === 0, errors };
};

/**
 * Delete a record if it exists
 * 
 * @param {string} table - Table name
 * @param {Object} matchColumns - Columns to match for finding record to delete
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const deleteIfExists = async (table, matchColumns) => {
    try {
        let query = supabase.from(table).delete();

        Object.entries(matchColumns).forEach(([column, value]) => {
            query = query.eq(column, value);
        });

        const { error } = await query;

        return { success: !error, error };
    } catch (error) {
        return { success: false, error };
    }
};

/**
 * Get a single record or null if not found
 * 
 * @param {string} table - Table name
 * @param {Object} matchColumns - Columns to match
 * @param {string} selectFields - Fields to select (default: '*')
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getRecord = async (table, matchColumns, selectFields = '*') => {
    try {
        let query = supabase.from(table).select(selectFields);

        Object.entries(matchColumns).forEach(([column, value]) => {
            query = query.eq(column, value);
        });

        const { data, error } = await query.maybeSingle();

        if (error && error.code !== 'PGRST116') {
            return { data: null, error };
        }

        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

export default {
    upsertRecord,
    batchUpsert,
    deleteIfExists,
    getRecord,
};
