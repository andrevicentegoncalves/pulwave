/**
 * Admin Service
 * Business logic layer for admin backoffice operations.
 * Components → Hooks → Services → Repositories
 */
import { userRepository, translationRepository, systemRepository } from '../repositories';

export const adminService = {
    // ==================== USERS ====================
    async getUsers(options = {}) {
        return userRepository.getUsers(options);
    },

    async getUserById(id) {
        return userRepository.getUserById(id);
    },

    async createUser(userData) {
        // Validate required fields
        if (!userData.email) {
            throw new Error('Email is required');
        }
        return userRepository.createUser(userData);
    },

    async updateUser(id, updates) {
        // Add any business validation here
        // Note: is_suspended moved to profile_auth_state table
        const allowedFields = ['first_name', 'last_name', 'email', 'app_role', 'is_active'];
        const sanitized = Object.keys(updates)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => ({ ...obj, [key]: updates[key] }), {});

        return userRepository.updateUser(id, sanitized);
    },

    async deleteUser(id) {
        // Soft delete - mark as deleted in profiles + suspend in auth_state
        await Promise.all([
            userRepository.updateUser(id, { is_deleted: true, deleted_at: new Date().toISOString() }),
            userRepository.updateAuthState(id, { is_suspended: true })
        ]);
    },

    async suspendUser(id, reason) {
        // Suspension now goes to profile_auth_state table
        return userRepository.updateAuthState(id, {
            is_suspended: true,
            suspension_reason: reason,
            suspended_at: new Date().toISOString()
        });
    },

    async activateUser(id) {
        // Unsuspend in profile_auth_state
        return userRepository.updateAuthState(id, {
            is_suspended: false,
            suspension_reason: null,
            suspended_at: null
        });
    },

    // ==================== DASHBOARD ====================
    async getDashboardData() {
        const [stats, recentActivity] = await Promise.all([
            systemRepository.getDashboardStats(),
            systemRepository.getActivityLogs({ limit: 10 }),
        ]);
        return { stats, recentActivity: recentActivity.data };
    },

    // ==================== TRANSLATIONS ====================
    async getUITranslations(options = {}) {
        return translationRepository.getUITranslations(options);
    },

    async upsertBatchUITranslations(translations) {
        return translationRepository.upsertBatchUITranslations(translations);
    },

    async saveUITranslation(translation) {
        return translationRepository.saveUITranslation(translation);
    },

    async deleteUITranslation(id) {
        return translationRepository.deleteUITranslation(id);
    },

    // ==================== SCHEMA & ENUM TRANSLATIONS ====================
    async getSchemaTranslations(options = {}) {
        return translationRepository.getSchemaTranslations(options);
    },

    async saveSchemaTranslation(translation) {
        return translationRepository.saveSchemaTranslation(translation);
    },

    async getEnumTranslations(options = {}) {
        return translationRepository.getEnumTranslations(options);
    },

    async saveEnumTranslation(translation) {
        return translationRepository.saveEnumTranslation(translation);
    },

    // ==================== CONTENT TRANSLATIONS ====================
    async getContentTranslations(options = {}) {
        return translationRepository.getContentTranslations(options);
    },

    async saveContentTranslation(translation) {
        return translationRepository.saveContentTranslation(translation);
    },

    // ==================== MASTER DATA TRANSLATIONS ====================
    async getMasterDataTranslations(options = {}) {
        return translationRepository.getMasterDataTranslations(options);
    },

    async saveMasterDataTranslation(translation) {
        return translationRepository.saveMasterDataTranslation(translation);
    },

    // ==================== BUNDLES ====================
    async generateTranslationBundles(locale) {
        return translationRepository.generateTranslationBundles(locale);
    },

    async getTranslationBundles(locale) {
        return translationRepository.getTranslationBundles(locale);
    },

    async getSupportedLocales() {
        return translationRepository.getSupportedLocales();
    },

    async getCountries() {
        return systemRepository.getCountries();
    },

    // ==================== PERMISSIONS ====================
    async getPermissions() {
        return systemRepository.getPermissions();
    },

    async getRolePermissions(roleId) {
        return systemRepository.getRolePermissions(roleId);
    },

    // ==================== ACTIVITY LOGS ====================
    async getActivityLogs(options = {}) {
        return systemRepository.getActivityLogs(options);
    },

    // ==================== SYSTEM SETTINGS ====================
    async getSystemSettings() {
        return systemRepository.getSystemSettings();
    },

    async updateSystemSetting(key, value) {
        return systemRepository.updateSystemSetting(key, value);
    },

    async upsertSystemSetting(setting) {
        return systemRepository.upsertSystemSetting(setting);
    },

    // ==================== FEATURE FLAGS ====================
    async getFeatureFlags() {
        return systemRepository.getFeatureFlags();
    },

    async toggleFeatureFlag(id, enabled) {
        return systemRepository.updateFeatureFlag(id, { is_enabled: enabled });
    },

    async createFeatureFlag(flag) {
        return systemRepository.createFeatureFlag(flag);
    },

    async deleteFeatureFlag(id) {
        return systemRepository.deleteFeatureFlag(id);
    },

    // ==================== DATA RETENTION ====================
    async getRetentionPolicies() {
        return systemRepository.getRetentionPolicies();
    },

    async updateRetentionPolicy(id, updates) {
        return systemRepository.updateRetentionPolicy(id, updates);
    },

    // ==================== SCHEMA INTROSPECTION ====================
    /**
     * Get ALL database tables for selection dropdowns
     */
    async getAllDatabaseTables() {
        return translationRepository.getAllDatabaseTables();
    },

    /**
     * Get columns for any table
     */
    async getAllTableColumns(tableName) {
        return translationRepository.getAllTableColumns(tableName);
    },

    /**
     * Get database enums
     */
    async getDatabaseEnums() {
        return translationRepository.getDatabaseEnums();
    },

    /**
     * Get all database tables that can be translated
     * Uses PostgreSQL information_schema
     */
    async getDatabaseTables() {
        return translationRepository.getDatabaseTables();
    },

    /**
     * Get columns for a specific table
     */
    async getTableColumns(tableName) {
        return translationRepository.getTableColumns(tableName);
    },

    // ==================== MASTER DATA ====================
    async getMasterDataTypes() {
        return systemRepository.getMasterDataTypes();
    },

    async saveMasterDataType(type) {
        return systemRepository.upsertMasterDataType(type);
    },

    async getMasterDataValues(typeKey) {
        return systemRepository.getMasterDataValues(typeKey);
    },

    async saveMasterDataValue(value) {
        return systemRepository.upsertMasterDataValue(value);
    },

    async deleteMasterDataValue(id) {
        return systemRepository.deleteMasterDataValue(id);
    },

    // ==================== GENERIC TABLE DATA ====================
    /**
     * Get data from any table dynamically
     * Used by Master Data manager for various lookup tables
     */
    async getTableData(tableName) {
        return systemRepository.getTableData(tableName);
    },

    async saveTableRecord(tableName, data) {
        return systemRepository.saveTableRecord(tableName, data);
    },

    async deleteTableRecord(tableName, id) {
        return systemRepository.deleteTableRecord(tableName, id);
    },

    // ==================== CONTENT TRANSLATION HELPERS ====================
    async getTableRecords(tableName, options = {}) {
        return translationRepository.getTableRecords(tableName, options);
    },
};

export default adminService;
