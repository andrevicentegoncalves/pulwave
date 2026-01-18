/**
 * Building Query Hooks
 * React Query hooks for building operations
 * @package @pulwave/features/properties
 */

export interface Building {
    id: string;
    name?: string;
    address?: string;
    [key: string]: unknown;
}

export interface Unit {
    id: string;
    building_id: string;
    unit_number: string;
    [key: string]: unknown;
}

export interface BuildingService {
    getAll(): Promise<Building[]>;
    getById(id: string): Promise<Building>;
    getUnits(buildingId: string): Promise<Unit[]>;
    create(data: Partial<Building>): Promise<Building>;
    update(id: string, updates: Partial<Building>): Promise<Building>;
    delete(id: string): Promise<void>;
}

export interface QueryKeys {
    buildings: {
        all: string[];
        detail: (id: string) => string[];
        units: (buildingId: string) => string[];
    };
}

export interface UseQueryFn<T> {
    (options: { queryKey: string[]; queryFn: () => Promise<T>; enabled?: boolean }): {
        data: T | undefined;
        isLoading: boolean;
        error: Error | null;
    };
}

export interface UseMutationFn<TData, TVariables> {
    (options: { mutationFn: (vars: TVariables) => Promise<TData>; onSuccess?: () => void }): {
        mutate: (vars: TVariables) => void;
        isLoading: boolean;
    };
}

export function createBuildingQueries(
    buildingService: BuildingService,
    queryKeys: QueryKeys,
    useQuery: UseQueryFn<Building | Building[] | Unit[]>,
    useMutation: UseMutationFn<Building | void, any>
) {
    return {
        useBuildings(options = {}) {
            return useQuery({
                queryKey: queryKeys.buildings.all,
                queryFn: () => buildingService.getAll(),
                ...options,
            });
        },

        useBuilding(id: string, options = {}) {
            return useQuery({
                queryKey: queryKeys.buildings.detail(id),
                queryFn: () => buildingService.getById(id),
                enabled: !!id,
                ...options,
            });
        },

        useBuildingUnits(buildingId: string, options = {}) {
            return useQuery({
                queryKey: queryKeys.buildings.units(buildingId),
                queryFn: () => buildingService.getUnits(buildingId),
                enabled: !!buildingId,
                ...options,
            });
        },

        useCreateBuilding() {
            return useMutation({
                mutationFn: (data: Partial<Building>) => buildingService.create(data),
            });
        },

        useUpdateBuilding() {
            return useMutation({
                mutationFn: (vars: { id: string; updates: Partial<Building> }) => buildingService.update(vars.id, vars.updates),
            });
        },

        useDeleteBuilding() {
            return useMutation({
                mutationFn: (id: string) => buildingService.delete(id),
            });
        },
    };
}
