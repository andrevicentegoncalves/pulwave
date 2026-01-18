import React from 'react';

export type Direction = 'ltr' | 'rtl';
export type Theme = 'light' | 'dark' | 'system';
export type Density = 'compact' | 'comfortable' | 'spacious';

export interface PulwaveContextType {
    direction: Direction;
    setDirection: (dir: Direction) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    density: Density;
    setDensity: (density: Density) => void;
}

export interface PulwaveProviderProps {
    children: React.ReactNode;
    defaultDirection?: Direction;
    defaultTheme?: Theme;
    defaultDensity?: Density;
}
