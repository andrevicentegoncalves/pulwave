/**
 * useProperties Hook
 * Fetches properties/buildings for the current user using React Query.
 */
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import { propertyKeys } from '../keys';

/**
 * useProperties - Standard hook with loading states
 * @deprecated Prefer usePropertiesSuspense for better UX with Suspense boundaries
 */
export const useProperties = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: propertyKeys.list(),
        queryFn: () => propertyService.getProperties(),
    });

    return {
        properties: data || [],
        loading: isLoading,
        error: error as Error | null
    };
};

/**
 * usePropertiesSuspense - Suspense-enabled hook
 * Use with React Suspense boundary for progressive loading
 *
 * @example
 * ```tsx
 * <Suspense fallback={<PropertiesSkeleton />}>
 *   <PropertiesList />
 * </Suspense>
 *
 * function PropertiesList() {
 *   const { properties } = usePropertiesSuspense();
 *   return <div>{properties.map(...)}</div>
 * }
 * ```
 */
export const usePropertiesSuspense = () => {
    const { data } = useSuspenseQuery({
        queryKey: propertyKeys.list(),
        queryFn: () => propertyService.getProperties(),
    });

    return {
        properties: data || [],
    };
};
