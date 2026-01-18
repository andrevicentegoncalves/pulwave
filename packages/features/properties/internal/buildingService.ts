/**
 * Building Service
 * CRUD for buildings/properties
 * 
 * @package @pulwave/features/properties
 */

export interface Building {
    id: string;
    name?: string;
    address?: string;
    created_at: string;
    [key: string]: unknown;
}

export interface Unit {
    id: string;
    building_id: string;
    unit_number: string;
    [key: string]: unknown;
}

export interface BuildingRepository {
    findAll(): Promise<Building[]>;
    findById(id: string): Promise<Building>;
    create(data: Partial<Building>): Promise<Building>;
    update(id: string, data: Partial<Building>): Promise<Building>;
    delete(id: string): Promise<void>;
    findUnitsByBuildingId(buildingId: string): Promise<Unit[]>;
}

export interface BuildingService {
    getAll(): Promise<Building[]>;
    getById(id: string): Promise<Building>;
    create(buildingData: Partial<Building>): Promise<Building>;
    update(id: string, updates: Partial<Building>): Promise<Building>;
    delete(id: string): Promise<void>;
    getUnits(buildingId: string): Promise<Unit[]>;
}

/**
 * Factory function to create building service
 */
export function createBuildingService(repository: BuildingRepository): BuildingService {
    return {
        async getAll(): Promise<Building[]> {
            return repository.findAll();
        },

        async getById(id: string): Promise<Building> {
            return repository.findById(id);
        },

        async create(buildingData: Partial<Building>): Promise<Building> {
            return repository.create(buildingData);
        },

        async update(id: string, updates: Partial<Building>): Promise<Building> {
            return repository.update(id, updates);
        },

        async delete(id: string): Promise<void> {
            await repository.delete(id);
        },

        async getUnits(buildingId: string): Promise<Unit[]> {
            return repository.findUnitsByBuildingId(buildingId);
        },
    };
}
