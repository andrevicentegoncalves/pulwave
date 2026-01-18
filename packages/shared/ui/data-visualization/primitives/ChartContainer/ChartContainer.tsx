import React from 'react';
import { cn } from '@pulwave/utils';
import { Skeleton } from '@pulwave/ui';
import { useChartDimensions } from '../../hooks/useChartDimensions';
import './styles/_index.scss';

export interface ChartContainerProps {
    children: React.ReactNode | ((props: { width: number; height: number }) => React.ReactNode);
    className?: string;
    height?: number;
    aspectRatio?: number;
    loading?: boolean;
    empty?: boolean;
    error?: string | boolean;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

/**
 * @deprecated Use ChartShell instead. ChartContainer will be removed in a future version.
 *
 * Migration guide:
 * ```tsx
 * // Before
 * <ChartContainer loading={isLoading} empty={!data.length}>
 *   <LineChart data={data} />
 * </ChartContainer>
 *
 * // After
 * <ChartShell loading={isLoading} empty={!data.length}>
 *   <LineChart data={data} />
 * </ChartShell>
 * ```
 */
export function ChartContainer({
    children,
    className,
    height = 300,
    aspectRatio,
    loading = false,
    empty = false,
    error = null,
    emptyMessage = 'No data available',
    emptyIcon,
    title,
    subtitle,
    actions,
}: ChartContainerProps) {
    const { ref, width, height: calculatedHeight, isReady } = useChartDimensions({
        defaultHeight: height,
        aspectRatio,
    });

    const finalHeight = aspectRatio ? calculatedHeight : height;

    // Loading state
    if (loading) {
        return (
            <div
                ref={ref}
                className={cn('chart-container', 'chart-container--loading', className)}
            >
                {title && (
                    <div className="chart-container__header">
                        <Skeleton variant="text" width="40%" height={20} />
                    </div>
                )}
                <div
                    className="chart-container__content"
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
                className={cn('chart-container', 'chart-container--error', className)}
            >
                {title && (
                    <div className="chart-container__header">
                        <h4 className="chart-container__title">{title}</h4>
                    </div>
                )}
                <div
                    className="chart-container__content chart-container__content--centered"
                    style={{ height: finalHeight }}
                >
                    <div className="chart-container__error">
                        <span className="chart-container__error-icon">⚠️</span>
                        <p className="chart-container__error-message">
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
                className={cn('chart-container', 'chart-container--empty', className)}
            >
                {title && (
                    <div className="chart-container__header">
                        <h4 className="chart-container__title">{title}</h4>
                    </div>
                )}
                <div
                    className="chart-container__content chart-container__content--centered"
                    style={{ height: finalHeight }}
                >
                    <div className="chart-container__empty">
                        {emptyIcon && <span className="chart-container__empty-icon">{emptyIcon}</span>}
                        <p className="chart-container__empty-message">{emptyMessage}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Normal state
    return (
        <div
            ref={ref}
            className={cn('chart-container', className)}
        >
            {(title || actions) && (
                <div className="chart-container__header">
                    <div className="chart-container__header-text">
                        {title && <h4 className="chart-container__title">{title}</h4>}
                        {subtitle && <p className="chart-container__subtitle">{subtitle}</p>}
                    </div>
                    {actions && <div className="chart-container__actions">{actions}</div>}
                </div>
            )}
            <div
                className="chart-container__content"
                style={{ height: finalHeight }}
            >
                {isReady && typeof children === 'function'
                    ? children({ width, height: finalHeight })
                    : (children as React.ReactNode)
                }
            </div>
        </div>
    );
}

export default ChartContainer;
