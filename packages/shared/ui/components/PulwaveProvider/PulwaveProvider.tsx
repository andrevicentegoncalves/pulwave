import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LiveRegion } from '../LiveRegion';
import type { Direction, Theme, Density, PulwaveContextType, PulwaveProviderProps } from './types';
import './styles/_index.scss';

const PulwaveContext = createContext<PulwaveContextType | undefined>(undefined);

export const PulwaveProvider = ({
    children,
    defaultDirection = 'ltr',
    defaultTheme = 'system',
    defaultDensity = 'comfortable',
}: PulwaveProviderProps) => {
    const [direction, setDirection] = useState<Direction>(defaultDirection);
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    const [density, setDensity] = useState<Density>(defaultDensity);

    // Sync direction with document
    useEffect(() => {
        document.documentElement.dir = direction;
        document.documentElement.setAttribute('dir', direction);
    }, [direction]);

    // Sync theme with document (basic implementation)
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
        } else {
            root.setAttribute('data-theme', theme);
        }
    }, [theme]);

    // Sync density with document
    useEffect(() => {
        document.documentElement.setAttribute('data-density', density);
    }, [density]);

    const value = useMemo(() => ({
        direction,
        setDirection,
        theme,
        setTheme,
        density,
        setDensity,
    }), [direction, theme, density]);

    return (
        <PulwaveContext.Provider value={value}>
            <LiveRegion>
                {children}
            </LiveRegion>
        </PulwaveContext.Provider>
    );
};

export const usePulwaveContext = () => {
    const context = useContext(PulwaveContext);
    if (!context) {
        throw new Error('usePulwaveContext must be used within a PulwaveProvider');
    }
    return context;
};
