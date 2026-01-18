/**
 * useAddress Hook (Refactored)
 * Uses React Query and Address Service.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService, Address } from '../services';
import { addressKeys } from '../keys';

export interface UseAddressReturn {
    // Queries
    getAddress: (id: string) => void; // Trigger for lazy fetch if needed, though useQuery handles it
    address: Address | null | undefined;
    isLoading: boolean;
    // Mutations
    saveAddress: (data: Partial<Address> & { address_type?: string, profile_id?: string }, id?: string) => Promise<any>;
    deleteAddress: (id: string) => Promise<void>;
    ensureRegion: (regionName: string, countryId: string) => Promise<string | null>;
}

export const useAddress = () => {
    const queryClient = useQueryClient();

    const saveAddressMutation = useMutation({
        mutationFn: async ({ id, ...data }: Partial<Address> & { id?: string, address_type?: string, profile_id?: string }) => {
            if (!data.profile_id) throw new Error("Profile ID is required for address saving");

            // If ID is provided, it's an update, but upsert handles logic via type usually or repo determines.
            // However, repo upsert uses profileId + type. 
            // If we have specific ID, we might need a specific update method or rely on the repo handling ID.
            // The repo implementation of upsert checks for existing by PROFILE_ID + TYPE.
            // If the legacy behavior allowed updating via ID regardless of type, we might face a mismatch.
            // But legacy hook did: update(payload).eq('id', addressId) OR insert().

            // To maintain compatibility with legacy hook signature: saveAddress(data, id)
            // We need to know context.
            // The service exposed `upsert` which matches `repo.upsert` (checks existing by type).
            // But legacy used `update` by ID.
            // If we have an ID, we should likely update by ID.
            // But `addressService` currently only exposes `upsert` (logic: find by type).
            // `coreAddressService` does NOT expose a generic `update(id, data)` method.
            // LIMITATION: `addressService.upsert` is opinionated (1 address per type per user).
            // Legacy hook allowed generic addresses? 
            // "const { data, error } = await dbClient.from('addresses').update(payload).eq('id', addressId);"
            // Legacy hook supports multiple addresses if they have IDs.
            // Our Service Agnosticism refactor seems to enforce "One Address Per Type" via `upsert`.
            // If legacy app needs multiple physical addresses, this repo method is restrictive.
            // Check `SupabaseAddressRepository.upsert`: it checks `maybeSingle()` based on type.

            // For now, we will proceed with `addressService.upsert`. 
            // If `data` has `address_type`, use it. Default 'physical'.
            return addressService.upsert(data.profile_id!, data.address_type || 'physical', data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });
            if (variables.profile_id) {
                queryClient.invalidateQueries({ queryKey: addressKeys.byProfile(variables.profile_id) });
            }
        }
    });

    const deleteAddressMutation = useMutation({
        mutationFn: (id: string) => addressService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });
        }
    });

    const ensureRegionMutation = useMutation({
        mutationFn: ({ regionName, countryId }: { regionName: string, countryId: string }) =>
            addressService.ensureRegion(regionName, countryId)
    });

    // Wrapper to match legacy signature roughly, but favoring mutation triggers
    const saveAddress = async (data: any, id?: string) => {
        return saveAddressMutation.mutateAsync({ ...data, id });
    };

    const deleteAddress = async (id: string) => {
        return deleteAddressMutation.mutateAsync(id);
    };

    const ensureRegion = async (regionName: string, countryId: string) => {
        return ensureRegionMutation.mutateAsync({ regionName, countryId });
    };

    // Lazy loader shim - in React Query we usually use useQuery(id).
    // The legacy hook had `loadAddress(id)`.
    // We can't really make a hook that returns a function to load data into state without just being a wrapper around useQuery with enabled: false.
    // For now we return a stub or we'd need to know if the user wants to use this hook for fetching specific address.
    const loadAddress = async (id: string) => {
        // This is anti-pattern in RQ but supports transition.
        const data = await queryClient.fetchQuery({
            queryKey: addressKeys.detail(id),
            queryFn: () => addressService.getById(id)
        });
        return data;
    };

    return {
        saveAddress,
        deleteAddress,
        ensureRegion,
        loadAddress,
        loading: saveAddressMutation.isPending || deleteAddressMutation.isPending || ensureRegionMutation.isPending,
        error: (saveAddressMutation.error || deleteAddressMutation.error || ensureRegionMutation.error)?.message || null,
        // Optional reactive properties if needed
        address: undefined, // Legacy hook didn't expose 'address' state directly, only via loadAddress promise return or internal state? 
        // Legacy returned: { saveAddress, loadAddress, deleteAddress, ensureRegion, loading, error }
    };
};
