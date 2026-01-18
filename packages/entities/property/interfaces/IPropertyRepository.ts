import { Building, Unit } from './types';

import type { IVersionedRepository } from '../../_infrastructure/interfaces';
export interface IPropertyRepository extends IVersionedRepository {
    readonly version: '1.0.0';
    getBuildingIdsByOwner(userId: string): Promise<string[]>;
    getBuildingsByIds(buildingIds: string[]): Promise<Building[]>;
    getUnitsByBuildingIds(buildingIds: string[]): Promise<Unit[]>;
    countUnitsByStatus(buildingIds: string[], status: string): Promise<number>;
}


