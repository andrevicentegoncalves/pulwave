import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminContext } from '../core/AdminContext';

interface TranslationOptions {
    page?: number;
    limit?: number;
    locale?: string;
    search?: string;
    source_type?: string;
    category?: string;
    table?: string;
    enumName?: string;
    key?: string;
    masterDataTarget?: string;
}

interface TranslationItem {
    id?: string;
    source_type?: 'ui' | 'database' | 'enum' | 'content' | 'master_data';
    translation_key?: string;
    locale_code?: string;
    translated_text?: string;
    translated_label?: string;
    status?: string;
    table_name?: string;
    column_name?: string;
    enum_name?: string;
    enum_value?: string;
    record_id?: string;
    [key: string]: unknown;
}

interface TranslationResponse {
    data: TranslationItem[];
    count: number;
}

interface TableRecordOptions {
    limit?: number;
    offset?: number;
    search?: string;
}

interface TableRecord {
    id: string;
    [key: string]: unknown;
}

/**
 * Hook for UI translations
 */
export const useAdminTranslations = (options: TranslationOptions = {}) => {
    const { service } = useAdminContext();
    const { page = 1, limit = 50, locale = '', search = '', source_type = '', category = '', table = '', enumName = '', key = '', masterDataTarget = '' } = options;

    return useQuery({
        queryKey: ['admin', 'translations', { page, limit, locale, search, source_type, category, table, enumName, key, masterDataTarget }],
        queryFn: async () => {
            // Implementation logic copied from original useAdmin.js
            if (source_type === 'database') {
                return service.getSchemaTranslations({ page, limit, locale, search, table });
            } else if (source_type === 'enum') {
                return service.getEnumTranslations({ page, limit, locale, search, enumName });
            } else if (source_type === 'content') {
                return service.getContentTranslations({ page, limit, locale, search, table });
            } else if (source_type === 'master_data') {
                return service.getMasterDataTranslations({ page, limit, locale, search, target: masterDataTarget });
            } else if (source_type === 'ui') {
                return service.getUITranslations({ page, limit, locale, search, source_type, category, key });
            } else {
                // ALL TYPES fetch logic would reside in service or here.
                // For simplicity, assuming service handles the complex 'all' fetch or we simplify for now.
                // The original code had complex logic here. We'll delegate to service if possible or reimplement.
                // Reimplementing complex logic here for safety:

                const [ui, schema, enums, content, masterData] = await Promise.all([
                    service.getUITranslations({ page: 1, limit: 1000, locale, search, source_type: 'ui', category, key }),
                    service.getSchemaTranslations({ page: 1, limit: 1000, locale, search, table }),
                    service.getEnumTranslations({ page: 1, limit: 1000, locale, search, enumName }),
                    service.getContentTranslations({ page: 1, limit: 1000, locale, search, table }),
                    service.getMasterDataTranslations({ page: 1, limit: 1000, locale, search })
                ]);

                const totalCount = (ui.count || 0) + (schema.count || 0) + (enums.count || 0) + (content.count || 0) + (masterData.count || 0);

                const uiItems = (ui.data || []).map((i: TranslationItem) => ({ ...i, source_type: i.source_type || 'ui' }));
                const schemaItems = (schema.data || []).map((i: TranslationItem) => ({ ...i, source_type: 'database' as const }));
                const enumItems = (enums.data || []).map((i: TranslationItem) => ({ ...i, source_type: 'enum' as const }));
                const contentItems = (content.data || []).map((i: TranslationItem) => ({ ...i, source_type: 'content' as const }));
                const masterDataItems = (masterData.data || []).map((i: TranslationItem) => ({ ...i, source_type: 'master_data' as const }));

                const allItems = [...uiItems, ...schemaItems, ...enumItems, ...contentItems, ...masterDataItems];

                // Pagination logic needs to happen here if service doesn't support 'all'
                // Simplification: returning all for now or we need a utility helper. 
                // Given the context, let's return sliced array.
                const startIdx = (page - 1) * limit;
                const endIdx = startIdx + limit;
                const pageItems = allItems.slice(startIdx, endIdx);

                return { data: pageItems, count: totalCount };
            }
        },
        placeholderData: (previousData: TranslationResponse | undefined) => previousData,
    });
};

export const useAdminLocales = () => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'locales'],
        queryFn: () => service.getSupportedLocales(),
        staleTime: 300000,
    });
};

// ==================== CRUD MUTATIONS & HELPERS ====================

/**
 * Hook for creating/updating a translation
 */
export const useSaveAdminTranslation = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (translation: Partial<TranslationItem>) => service.saveUITranslation(translation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] });
        },
    });
};

/**
 * Hook for batch saving translations
 */
export const useSaveBatchAdminTranslations = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (translations: Partial<TranslationItem>[]) => service.upsertBatchUITranslations(translations),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] });
        },
    });
};

export const useSaveAdminSchemaTranslation = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (translation: Partial<TranslationItem>) => service.saveSchemaTranslation(translation),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] }),
    });
};

export const useSaveAdminEnumTranslation = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (translation: Partial<TranslationItem>) => service.saveEnumTranslation(translation),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] }),
    });
};

export const useSaveAdminContentTranslation = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (translation: Partial<TranslationItem>) => service.saveContentTranslation(translation),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] }),
    });
};

export const useSaveAdminMasterDataTranslation = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (translation: Partial<TranslationItem>) => service.saveMasterDataTranslation(translation),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] }),
    });
};

export const useAdminMasterDataTypes = () => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'master-data-types'],
        queryFn: () => service.getMasterDataTypes(),
        staleTime: 300000,
    });
};

export const useAdminMasterDataValues = (typeId: string) => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'master-data-values', typeId],
        queryFn: () => service.getMasterDataValues(typeId),
        enabled: !!typeId,
        staleTime: 300000,
    });
};

export const useGenerateTranslationBundles = () => {
    const { service } = useAdminContext();
    return useMutation({
        mutationFn: (locale: string | null) => service.generateTranslationBundles(locale),
    });
};

/**
 * Hook for fetching translations by key (for pre-filling)
 */
export const useAdminTranslationsByKey = (key: string) => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'translations', 'by-key', key],
        queryFn: () => service.getUITranslations({ key, limit: 100 }),
        enabled: !!key && key.trim().length > 0,
    });
};

/**
 * Hook for deleting a translation
 */
export const useDeleteAdminTranslation = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (translationId: string) => service.deleteUITranslation(translationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] });
        },
    });
};

/**
 * Hook for translatable tables (from master_data_values)
 */
export const useTranslatableTables = () => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'translatable-tables'],
        queryFn: () => service.getTranslatableTables(),
        staleTime: 300000,
    });
};

/**
 * Hook for translatable enums (from master_data_values)
 */
export const useTranslatableEnums = () => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'translatable-enums'],
        queryFn: () => service.getTranslatableEnums(),
        staleTime: 300000,
    });
};

export const useAdminTableRecords = (table: string, options?: TableRecordOptions): ReturnType<typeof useQuery<TableRecord[]>> => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'table-records', table, options],
        queryFn: () => service.getTableRecords(table, options),
        enabled: !!table,
    });
};

