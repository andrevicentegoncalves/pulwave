import React, { memo } from 'react';
import { cn } from '@pulwave/utils';
import { GeoChart } from '../GeoChart/GeoChart';
import { countryMapChartVariants, type CountryMapChartProps } from './types';

/**
 * CountryMapChart Component
 * 
 * Specialized wrapper for GeoChart to display specific country maps.
 */
export function CountryMapChart({
    country,
    className,
    ...props
}: CountryMapChartProps) {
    return (
        <GeoChart
            mapType={country}
            className={cn(countryMapChartVariants(), className)}
            {...props}
        />
    );
}

export const CountryMapChartMemo = memo(CountryMapChart);
export default CountryMapChartMemo;
