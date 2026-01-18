import { createContext, useContext } from 'react';
import type { ComponentRegistry } from './types';

interface RegistryContextType {
    registry: ComponentRegistry;
}

export const RegistryContext = createContext<RegistryContextType | undefined>(undefined);

export const useRegistry = () => {
    const context = useContext(RegistryContext);
    if (!context) {
        throw new Error('useRegistry must be used within a RegistryProvider');
    }
    return context.registry;
};
