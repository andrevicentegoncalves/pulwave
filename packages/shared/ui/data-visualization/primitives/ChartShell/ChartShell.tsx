import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { Skeleton } from '@pulwave/ui';
import { useChartDimensions } from '../../hooks/useChartDimensions';
import { useChartComponents } from '../../providers/ChartProvider';
import type { ChartShellProps } from './types';
import './styles/_index.scss';

/**
 * ChartShell
 * 
 * A wrapper component that encapsulates the boilerplate for responsive charts.
 * Uses ChartProvider for library abstraction.
 */
export const ChartShell = forwardRef<HTMLDivElement, ChartShellProps>(({
    width = '100%',
    height = 300,
    minWidth = 0,
    minHeight = 0,
    debounce = 1,
    aspectRatio,
    responsive = true,
    loading = false,
    error,
    empty = false,
    emptyMessage = 'No data available',
    emptyIcon,
    title,
    subtitle,
    actions,
    className,
    children,
    ...props
}, ref) => {
    const { ResponsiveContainer } = useChartComponents();
    const { ref: dimensionsRef, width: measuredWidth, height: measuredHeight, isReady } = useChartDimensions({
        defaultHeight: typeof height === 'number' ? height : 300,
        aspectRatio,
    });

    const finalHeight = aspectRatio ? measuredHeight : (typeof height === 'number' ? height : 300);

    // Loading state
    if (loading) {
        return (
            <div
                ref={ref}
                className={cn('chart-shell', 'chart-shell--loading', className)}
                {...props}
            >
                {title && (
                    <div className="chart-shell__header">
                        <Skeleton variant="text" width="40%" height={20} />
                    </div>
                )}
                <div
                    ref={dimensionsRef}
                    className="chart-shell__content"
                    style={{ height: finalHeight }}
                >
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div
                ref={ref}
                className={cn('chart-shell', 'chart-shell--error', className)}
                {...props}
            >
                {title && (
                    <div className="chart-shell__header">
                        <h4 className="chart-shell__title">{title}</h4>
                    </div>
                )}
                <div
                    ref={dimensionsRef}
                    className="chart-shell__content chart-shell__content--centered"
                    style={{ height: finalHeight }}
                >
                    <div className="chart-shell__error">
                        <span className="chart-shell__error-icon">⚠️</span>
                        <p className="chart-shell__error-message">
                            {typeof error === 'string' ? error : 'Failed to load chart'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (empty) {
        return (
            <div
                ref={ref}
                className={cn('chart-shell', 'chart-shell--empty', className)}
                {...props}
            >
                {title && (
                    <div className="chart-shell__header">
                        <h4 className="chart-shell__title">{title}</h4>
                    </div>
                )}
                <div
                    ref={dimensionsRef}
                    className="chart-shell__content chart-shell__content--centered"
                    style={{ height: finalHeight }}
                >
                    <div className="chart-shell__empty">
                        {emptyIcon && <span className="chart-shell__empty-icon">{emptyIcon}</span>}
                        <p className="chart-shell__empty-message">
                            {emptyMessage}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Render children - support render prop pattern
    const renderContent = () => {
        if (typeof children === 'function') {
            return isReady ? children({ width: measuredWidth, height: finalHeight }) : null;
        }
        // When responsive is false, render children directly without ResponsiveContainer
        // Use this for custom HTML/SVG charts that don't use Recharts components
        if (!responsive) {
            return children;
        }
        return (
            <ResponsiveContainer
                width={width}
                height={height}
                minWidth={minWidth}
                minHeight={minHeight}
                debounce={debounce}
            >
                {children}
            </ResponsiveContainer>
        );
    };

    // Normal state
    // Set minHeight on wrapper to prevent collapse in flex containers
    // For non-responsive charts, also apply explicit width/height if needed
    const wrapperStyle = responsive
        ? { minHeight: finalHeight }
        : {
            ...(width !== '100%' ? { width } : undefined),
            minHeight: typeof height === 'number' ? height : undefined,
        };

    return (
        <div
            ref={ref}
            className={cn('chart-shell', className)}
            style={wrapperStyle}
            {...props}
        >
            {(title || actions) && (
                <div className="chart-shell__header">
                    <div className="chart-shell__header-text">
                        {title && <h4 className="chart-shell__title">{title}</h4>}
                        {subtitle && <p className="chart-shell__subtitle">{subtitle}</p>}
                    </div>
                    {actions && <div className="chart-shell__actions">{actions}</div>}
                </div>
            )}
            <div
                ref={dimensionsRef}
                className="chart-shell__content"
                style={{
                    // ResponsiveContainer needs explicit height on parent container
                    // Render prop pattern also needs explicit height
                    // Only skip height when responsive={false} with regular children
                    height: (typeof children === 'function' || responsive) ? finalHeight : undefined
                }}
            >
                {renderContent()}
            </div>
        </div>
    );
});

ChartShell.displayName = 'ChartShell';
