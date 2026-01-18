export interface ChartLegendPayloadItem {
    value: string;
    id?: string;
    type?: string;
    color?: string;
    dataKey?: string;
    inactive?: boolean;
}

export interface ChartLegendProps {
    /** Legend payload (provided by Recharts or manually) */
    payload?: ChartLegendPayloadItem[];
    /** Click handler for toggling series */
    onClick?: (data: { dataKey?: string; value: string }, index: number) => void;
    /** Hover enter handler for bidirectional chart-legend highlighting */
    onItemHover?: (index: number) => void;
    /** Hover leave handler for bidirectional chart-legend highlighting */
    onItemLeave?: () => void;
    /** Layout direction */
    layout?: 'horizontal' | 'vertical';
    /** Horizontal alignment */
    align?: 'left' | 'center' | 'right';
    /** Vertical alignment */
    verticalAlign?: 'top' | 'middle' | 'bottom';
    /** Icon type */
    iconType?: 'circle' | 'square' | 'line';
    /** Array of inactive dataKeys */
    inactiveKeys?: string[];
    /** Active index for hover highlight */
    activeIndex?: number | null;
}
