// src/services/schemaService.js
import { adminService } from './adminService';
import { supabase } from '../lib/supabaseClient';

/**
 * Schema Service
 * Fetches database schema information (tables, columns)
 * Wraps adminService methods and adds config-based filtering
 */
const schemaService = {
    /**
     * Get all user tables from the database
     * @returns {Promise<Array<{table_name: string}>>}
     */
    async getAllTables() {
        return adminService.getAllDatabaseTables();
    },

    /**
     * Get all columns for a specific table
     * @param {string} tableName - Table name
     * @returns {Promise<Array<{column_name: string, data_type: string}>>}
     */
    async getTableColumns(tableName) {
        if (!tableName) return [];
        return adminService.getAllTableColumns(tableName);
    },

    /**
     * Get translatable tables from config
     * @returns {Promise<string[]>}
     */
    async getTranslatableTables() {
        const { data, error } = await supabase
            .from('app_settings')
            .select('setting_value')
            .eq('setting_key', 'TRANSLATABLE_TABLES')
            .single();

        if (error) return [];

        try {
            const value = data?.setting_value;
            if (Array.isArray(value)) return value;
            if (typeof value === 'string') return JSON.parse(value);
            return [];
        } catch {
            return [];
        }
    },

    /**
     * Get user translatable columns from config
     * @returns {Promise<Object>} - { table_name: [column1, column2] }
     */
    async getUserTranslatableColumns() {
        const { data, error } = await supabase
            .from('app_settings')
            .select('setting_value')
            .eq('setting_key', 'USER_TRANSLATABLE_COLUMNS')
            .single();

        if (error) return {};

        try {
            const value = data?.setting_value;
            if (typeof value === 'object' && !Array.isArray(value)) return value;
            if (typeof value === 'string') return JSON.parse(value);
            return {};
        } catch {
            return {};
        }
    },

    /**
     * Get columns that are translatable for a specific table
     * @param {string} tableName - Table name
     * @returns {Promise<string[]>}
     */
    async getTranslatableColumnsForTable(tableName) {
        const config = await this.getUserTranslatableColumns();
        return config[tableName] || [];
    }
};

export default schemaService;
