import React from 'react';
import { Switch, Text } from '@pulwave/ui';
import './styles.scss';

export type ChartLibraryType = 'recharts' | 'visx';

export interface LibraryToggleProps {
    value: ChartLibraryType;
    onChange: (library: ChartLibraryType) => void;
    className?: string;
}

/**
 * LibraryToggle
 *
 * Toggle between Recharts and visx chart libraries in demos.
 */
export const LibraryToggle = ({
    value,
    onChange,
    className = '',
}: LibraryToggleProps) => {
    const handleToggle = (checked: boolean) => {
        onChange(checked ? 'visx' : 'recharts');
    };

    return (
        <div className={`library-toggle ${className}`}>
            <div className="library-toggle__container">
                <Text
                    className={`library-toggle__label ${value === 'recharts' ? 'library-toggle__label--active' : ''}`}
                    size="s"
                    weight={value === 'recharts' ? 'semibold' : 'regular'}
                >
                    Recharts
                </Text>
                <Switch
                    checked={value === 'visx'}
                    onCheckedChange={handleToggle}
                    size="m"
                    colorVariant="primary"
                    className="library-toggle__switch"
                />
                <Text
                    className={`library-toggle__label ${value === 'visx' ? 'library-toggle__label--active' : ''}`}
                    size="s"
                    weight={value === 'visx' ? 'semibold' : 'regular'}
                >
                    visx
                </Text>
            </div>
        </div>
    );
};

export default LibraryToggle;
