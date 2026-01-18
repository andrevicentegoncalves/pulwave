import { systemRepository } from '../../repositories/systemRepository';
import type { Country, MasterDataType, MasterDataValue } from '../../interfaces';

export const masterDataService = {
    async getMasterDataTypes(): Promise<MasterDataType[]> {
        return systemRepository.getMasterDataTypes();
    },

    async saveMasterDataType(type: Partial<MasterDataType>): Promise<MasterDataType> {
        return systemRepository.upsertMasterDataType(type);
    },

    async deleteMasterDataType(id: string): Promise<void> {
        return systemRepository.deleteMasterDataType(id);
    },

    async getMasterDataValues(typeId: string): Promise<MasterDataValue[]> {
        return systemRepository.getMasterDataValues(typeId);
    },

    async saveMasterDataValue(value: Partial<MasterDataValue>): Promise<MasterDataValue> {
        return systemRepository.upsertMasterDataValue(value);
    },

    async deleteMasterDataValue(id: string): Promise<void> {
        return systemRepository.deleteMasterDataValue(id);
    },

    async getTranslatableTables(): Promise<string[]> {
        return systemRepository.getTranslatableTables();
    },

    async getTranslatableEnums(): Promise<string[]> {
        return systemRepository.getTranslatableEnums();
    },

    async getCommonTranslatableColumns(): Promise<string[]> {
        return systemRepository.getCommonTranslatableColumns();
    },

    // Generic Table Data
    async getTableData(tableName: string, params: Record<string, any> = {}): Promise<any[]> {
        return systemRepository.getTableData(tableName, params);
    },

    async saveTableRecord(tableName: string, data: Record<string, any>): Promise<any> {
        return systemRepository.saveTableRecord(tableName, data);
    },

    async deleteTableRecord(tableName: string, id: string): Promise<void> {
        return systemRepository.deleteTableRecord(tableName, id);
    },

    async getCountries(): Promise<Country[]> {
        return systemRepository.getCountries();
    },
};



