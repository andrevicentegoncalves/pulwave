import React, { useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { pictogramChartVariants, type PictogramChartProps, type PictogramIconData, type GridIconItem } from './types';
import './styles/_index.scss';

/**
 * PictogramChart Component
 * 
 * Displays data using icons/symbols where each icon represents a unit.
 */
export const PictogramChart = ({
    data = [],
    total,
    iconPerUnit = 1,
    icon = '●',
    iconSize = 20,
    iconsPerRow = 10,
    iconGap = 4,
    showLegend = true,
    showValues = true,
    valueFormatter = (v: number) => v.toLocaleString(),
    layout = 'grid',
    className,
}: PictogramChartProps) => {
    const { getColor } = useChartContext();
    const { tooltip, getHandlers } = useSVGTooltip();
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

    const iconData = useMemo((): PictogramIconData[] => {
        return data.map((item, index) => {
            const iconCount = Math.ceil(item.value / (iconPerUnit as number));
            const color = item.color || getColor(index);

            return {
                ...item,
                iconCount,
                color,
                icons: Array(iconCount).fill(null),
            };
        });
    }, [data, iconPerUnit, getColor]);

    const allIcons = useMemo((): GridIconItem[] => {
        const icons: GridIconItem[] = [];
        iconData.forEach((item, itemIndex) => {
            item.icons.forEach(() => {
                icons.push({
                    color: item.color as string,
                    name: item.name,
                    itemIndex,
                });
            });
        });
        return icons;
    }, [iconData]);

    const handleLegendHover = React.useCallback((index: number) => {
        setHoveredIndex(index);
    }, []);

    const handleLegendLeave = React.useCallback(() => {
        setHoveredIndex(null);
    }, []);

    if (layout === 'row') {
        return (
            <div className={cn(pictogramChartVariants({ layout }), className)}>
                {iconData.map((item, idx) => {
                    const isHovered = hoveredIndex === idx;
                    const tooltipHandlers = getHandlers(item.name);

                    return (
                        <div
                            key={idx}
                            className={cn('chart--pictogram__row', {
                                'chart--pictogram__row--hovered': isHovered,
                            })}
                            data-item-index={idx}
                            onMouseEnter={(e) => {
                                setHoveredIndex(idx);
                                tooltipHandlers.onMouseEnter(e);
                            }}
                            onMouseLeave={() => {
                                setHoveredIndex(null);
                                tooltipHandlers.onMouseLeave();
                            }}
                        >
                            <div className="chart--pictogram__label">
                                <span className="chart--pictogram__label-name">{item.name}</span>
                                {showValues && (
                                    <span className="chart--pictogram__label-value">{valueFormatter(item.value)}</span>
                                )}
                            </div>
                            <div
                                className="chart--pictogram__icons"
                                style={{ '--icon-gap': `${iconGap}px` } as React.CSSProperties}
                            >
                                {item.icons.map((_, i) => (
                                    <span
                                        key={i}
                                        className="chart--pictogram__icon"
                                        style={{
                                            '--icon-color': item.color,
                                            '--icon-size': `${iconSize}px`,
                                        } as React.CSSProperties}
                                    >
                                        {icon}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}

                <SVGTooltip tooltip={tooltip} />
            </div>
        );
    }

    return (
        <div className={cn(pictogramChartVariants({ layout }), className)}>
            <div
                className="chart--pictogram__grid"
                style={{
                    '--icons-per-row': iconsPerRow,
                    '--icon-size': `${iconSize}px`,
                    '--icon-gap': `${iconGap}px`,
                } as React.CSSProperties}
            >
                {allIcons.map((item, i) => {
                    const tooltipHandlers = getHandlers(item.name);
                    const isHovered = hoveredIndex === item.itemIndex;

                    return (
                        <span
                            key={i}
                            className={cn('chart--pictogram__icon', {
                                'chart--pictogram__icon--hovered': isHovered,
                            })}
                            style={{
                                '--icon-color': item.color,
                                '--icon-size': `${iconSize}px`,
                            } as React.CSSProperties}
                            data-item-index={item.itemIndex}
                            onMouseEnter={(e: React.MouseEvent<HTMLSpanElement>) => {
                                setHoveredIndex(item.itemIndex);
                                tooltipHandlers.onMouseEnter(e as React.MouseEvent<Element>);
                            }}
                            onMouseLeave={() => {
                                setHoveredIndex(null);
                                tooltipHandlers.onMouseLeave();
                            }}
                        >
                            {icon}
                        </span>
                    );
                })}
            </div>

            {showLegend && (
                <ChartLegend
                    payload={iconData.map((item, idx) => ({
                        id: String(idx),
                        value: showValues ? `${item.name} (${valueFormatter(item.value)})` : item.name,
                        color: typeof item.color === 'string' ? item.color : 'var(--chart-color-empty)',
                    }))}
                    activeIndex={hoveredIndex}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                />
            )}

            <SVGTooltip tooltip={tooltip} />
        </div>
    );
};

export default PictogramChart;
