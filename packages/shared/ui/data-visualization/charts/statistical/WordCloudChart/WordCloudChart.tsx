import React, { useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { wordCloudChartVariants, type WordCloudChartProps, type WordCloudItem } from './types';
import './styles/_index.scss';

/**
 * WordCloudChart Component
 * 
 * Displays words sized by frequency/value in a cloud arrangement.
 */
export const WordCloudChart = ({
    data = [],
    width = 600,
    height = 400,
    minFontSize = 12,
    maxFontSize = 64,
    fontFamily = 'inherit',
    colorScheme = 'categorical',
    baseColor,
    spiral = 'archimedean',
    padding = 2,
    rotations = [0, -45, 45, 90],
    showCount = false,
    className,
}: WordCloudChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const resolvedBaseColor = baseColor ?? semanticColors.primary;
    const { tooltip, getHandlers } = useSVGTooltip();

    // Sort by value and calculate font sizes
    const processedWords = useMemo(() => {
        if (!data.length) return [];

        const sorted = [...data].sort((a, b) => b.value - a.value);
        const maxVal = sorted[0]?.value || 1;
        const minVal = sorted[sorted.length - 1]?.value || 0;
        const range = (maxVal - minVal) || 1;

        return sorted.map((word, idx) => {
            const normalized = (word.value - minVal) / range;
            const fontSize = minFontSize + normalized * (maxFontSize - minFontSize);

            let color;
            if (colorScheme === 'categorical') {
                color = getColor(idx % 10);
            } else if (colorScheme === 'monochrome') {
                color = resolvedBaseColor;
            } else {
                const hue = 220 - normalized * 60;
                color = `hsl(${hue}, 70%, 50%)`;
            }

            const rotation = rotations[Math.floor(Math.random() * rotations.length)];

            return {
                ...word,
                fontSize,
                color,
                rotation,
                opacity: colorScheme === 'monochrome' ? 0.4 + normalized * 0.6 : 1,
            };
        });
    }, [data, minFontSize, maxFontSize, colorScheme, resolvedBaseColor, rotations, getColor]);

    // Simple placement algorithm
    const placedWords = useMemo(() => {
        const placed: any[] = [];
        const centerX = (width as number) / 2;
        const centerY = (height as number) / 2;
        const occupiedRects: any[] = [];

        const intersects = (rect: any) => {
            return occupiedRects.some((r: any) =>
                rect.x < r.x + r.width + (padding as number) &&
                rect.x + rect.width + (padding as number) > r.x &&
                rect.y < r.y + r.height + (padding as number) &&
                rect.y + rect.height + (padding as number) > r.y
            );
        };

        processedWords.forEach((word) => {
            const approxWidth = word.text.length * word.fontSize * 0.6;
            const approxHeight = word.fontSize * 1.2;

            let x = centerX - approxWidth / 2;
            let y = centerY - approxHeight / 2;
            let angle = 0;
            let radius = 0;
            let placedWord = false;

            // Spiral outward to find placement
            for (let i = 0; i < 500 && !placedWord; i++) {
                const rect = { x, y, width: approxWidth, height: approxHeight };

                if (!intersects(rect) &&
                    x >= 0 && x + approxWidth <= (width as number) &&
                    y >= 0 && y + approxHeight <= (height as number)) {
                    occupiedRects.push(rect);
                    placed.push({ ...word, x, y });
                    placedWord = true;
                } else {
                    angle += 0.5;
                    radius += 0.5;
                    x = centerX + radius * Math.cos(angle) - approxWidth / 2;
                    y = centerY + radius * Math.sin(angle) - approxHeight / 2;
                }
            }
        });

        return placed;
    }, [processedWords, width, height, padding]);

    return (
        <div
            className={cn(wordCloudChartVariants({ colorScheme }), className)}
            style={{
                height: typeof height === 'number' ? `${height}px` : height,
                width: typeof width === 'number' ? `${width}px` : width
            }}
        >
            <div className="chart--word-cloud__container">
                <svg
                    width={width}
                    height={height}
                    className="chart--word-cloud__svg"
                >
                    {placedWords.map((word: any, idx: number) => {
                        const tooltipHandlers = getHandlers(`${word.text}: ${word.value}`);
                        return (
                            <text
                                key={idx}
                                x={word.x}
                                y={word.y + word.fontSize}
                                fontSize={word.fontSize}
                                fontFamily={fontFamily}
                                fontWeight={word.value > (data[0]?.value * 0.7) ? '600' : '400'}
                                fill={word.color}
                                fillOpacity={word.opacity}
                                className="chart--word-cloud__word"
                                {...tooltipHandlers}
                            >
                                {word.text}
                            </text>
                        );
                    })}
                </svg>

                <SVGTooltip tooltip={tooltip} />
                {showCount && data.length > 0 && (
                    <div className="chart--word-cloud__footer">
                        Count: {data.reduce((sum: number, d: WordCloudItem) => sum + d.value, 0)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WordCloudChart;
