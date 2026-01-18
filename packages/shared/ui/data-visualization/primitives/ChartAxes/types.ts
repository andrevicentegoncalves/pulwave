export interface ChartAxesProps {
    layout?: 'horizontal' | 'vertical';
    /** Data key for X axis (required for ScatterChart) */
    xKey?: string;
    /** Data key for Y axis (required for ScatterChart) */
    yKey?: string;
    showXAxis?: boolean;
    showYAxis?: boolean;
    xAxisFormatter?: (value: any) => string;
    yAxisFormatter?: (value: any) => string;
    /** Type of X axis. Defaults to 'category' for horizontal layout. */
    xAxisType?: 'number' | 'category';
    /** Type of Y axis. Defaults to 'number' for horizontal layout. */
    yAxisType?: 'number' | 'category';
}
