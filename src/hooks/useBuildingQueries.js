/**
 * Building Query Hooks
 * React Query hooks for building data fetching and mutations
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buildingService } from '../services';
import { queryKeys } from './queryKeys';

/**
 * Fetch all buildings
 */
export function useBuildings(options = {}) {
    return useQuery({
        queryKey: queryKeys.buildings.all,
        queryFn: () => buildingService.getAll(),
        ...options,
    });
}

/**
 * Fetch single building by ID
 */
export function useBuilding(id, options = {}) {
    return useQuery({
        queryKey: queryKeys.buildings.detail(id),
        queryFn: () => buildingService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Fetch units for a building
 */
export function useBuildingUnits(buildingId, options = {}) {
    return useQuery({
        queryKey: queryKeys.buildings.units(buildingId),
        queryFn: () => buildingService.getUnits(buildingId),
        enabled: !!buildingId,
        ...options,
    });
}

/**
 * Create building mutation
 */
export function useCreateBuilding() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (buildingData) => buildingService.create(buildingData),
        onSuccess: () => {
            // Invalidate buildings list to refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.buildings.all });
        },
    });
}

/**
 * Update building mutation
 */
export function useUpdateBuilding() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }) => buildingService.update(id, updates),
        onSuccess: (_, variables) => {
            // Invalidate specific building and list
            queryClient.invalidateQueries({ queryKey: queryKeys.buildings.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.buildings.all });
        },
    });
}

/**
 * Delete building mutation
 */
export function useDeleteBuilding() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => buildingService.delete(id),
        onSuccess: () => {
            // Invalidate buildings list
            queryClient.invalidateQueries({ queryKey: queryKeys.buildings.all });
        },
    });
}
