import React from 'react';

export interface ChartShellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    /** The width of the chart container. Defaults to '100%'. */
    width?: string | number;
    /** The height of the chart container. Defaults to 300. */
    height?: string | number;
    /** Minimum width constraint. */
    minWidth?: string | number;
    /** Minimum height constraint. */
    minHeight?: string | number;
    /** Debounce time for resize events in milliseconds. */
    debounce?: number;
    /** Aspect ratio (width/height) for responsive height. */
    aspectRatio?: number;
    /**
     * Use ResponsiveContainer for Recharts charts. Set to false for custom HTML/SVG charts.
     * Defaults to true.
     */
    responsive?: boolean;
    /** Loading state - shows skeleton. */
    loading?: boolean;
    /** Error state - shows error message. */
    error?: string | boolean;
    /** Empty state - shows empty message. */
    empty?: boolean;
    /** Message to show when empty. */
    emptyMessage?: string;
    /** Icon to show when empty. */
    emptyIcon?: React.ReactNode;
    /** Chart title. */
    title?: string;
    /** Chart subtitle. */
    subtitle?: string;
    /** Action buttons in header. */
    actions?: React.ReactNode;
    /** The Recharts component to render, or custom content. */
    children: React.ReactNode | ((props: { width: number; height: number }) => React.ReactNode);
}
