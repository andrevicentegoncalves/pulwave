/**
 * useProperties Hook Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProperties } from '../useProperties';
import { propertyService, type PropertyWithStats } from '../../services/propertyService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock('../../services/propertyService', () => ({
    propertyService: {
        getProperties: vi.fn(),
    }
}));

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return function TestWrapper({ children }: { children: ReactNode }) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
}

function createMockPropertyWithStats(overrides: Partial<PropertyWithStats> = {}): PropertyWithStats {
    return {
        id: 'p1',
        owner_id: 'user-1',
        name: 'Property 1',
        address: '123 Main St',
        unitsCount: 0,
        status: 'Active',
        ...overrides,
    };
}

describe('useProperties', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch properties', async () => {
        const mockProperties: PropertyWithStats[] = [
            createMockPropertyWithStats({ id: 'p1', name: 'Prop 1' }),
        ];
        vi.mocked(propertyService.getProperties).mockResolvedValue(mockProperties);

        const { result } = renderHook(() => useProperties(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.properties).toEqual(mockProperties);
        expect(propertyService.getProperties).toHaveBeenCalled();
    });
});

