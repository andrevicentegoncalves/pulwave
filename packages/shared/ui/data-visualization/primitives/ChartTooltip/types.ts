import React from 'react';

export interface TooltipPayloadItem {
    value: number | string;
    name: string;
    color: string;
    dataKey?: string;
    payload?: Record<string, unknown>;
}

export interface ChartTooltipProps {
    /** Whether tooltip is active (provided by Recharts) */
    active?: boolean;
    /** Data payload (provided by Recharts) */
    payload?: TooltipPayloadItem[];
    /** Label value (provided by Recharts) */
    label?: string | number;
    /** Custom value formatter */
    formatter?: (
        value: number | string,
        name: string,
        entry: TooltipPayloadItem,
        index: number
    ) => React.ReactNode;
    /** Custom label formatter */
    labelFormatter?: (label: string | number) => React.ReactNode;
    /** Separator between name and value */
    separator?: string;
    /** Hide the label */
    hideLabel?: boolean;
    /** Custom items for manual control */
    items?: Array<{
        name: string;
        value: string | number;
        color: string;
    }>;
}
