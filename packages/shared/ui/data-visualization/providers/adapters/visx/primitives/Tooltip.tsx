/**
 * VISX Tooltip Primitive
 *
 * Wraps visx Tooltip with unified props.
 */

import React from 'react';
import { Tooltip as VISXTooltip } from '@visx/xychart';
import type { TooltipDatum } from '@visx/xychart/lib/types/tooltip';

import type { TooltipProps as PrimitiveTooltipProps } from '../../../../primitives/types';

/** Generic datum type for VISX charts */
type ChartDatum = Record<string, unknown>;

/** Typed accessor for TooltipDatum */
function getDatumValue(tooltipDatum: TooltipDatum<ChartDatum>, key: string): unknown {
    return tooltipDatum.datum[key];
}

/**
 * Tooltip for VISX
 *
 * VISX tooltips work differently - they're rendered at the chart level
 * and use render props. This component provides a unified interface.
 */
export function Tooltip({
    content,
    cursor = true,
}: PrimitiveTooltipProps) {
    // If custom content provided, use it as render function
    const renderTooltip = content
        ? typeof content === 'function'
            ? content
            : () => content
        : undefined;

    return (
        <VISXTooltip<ChartDatum>
            showVerticalCrosshair={cursor !== false}
            showHorizontalCrosshair={false}
            snapTooltipToDatumX
            snapTooltipToDatumY
            showDatumGlyph
            glyphStyle={{
                fill: 'var(--color-brand)',
                stroke: 'var(--color-surface-default)',
                strokeWidth: 2,
            }}
            renderTooltip={({ tooltipData }) => {
                if (!tooltipData?.nearestDatum) return null;

                // Use custom render if provided
                if (renderTooltip) {
                    return renderTooltip({
                        active: true,
                        payload: tooltipData.datumByKey
                            ? Object.entries(tooltipData.datumByKey).map(
                                  ([key, tooltipDatum]: [string, TooltipDatum<ChartDatum>]) => ({
                                      name: key,
                                      value: getDatumValue(tooltipDatum, key),
                                      dataKey: key,
                                      color: 'var(--color-brand)',
                                      payload: tooltipDatum.datum,
                                  })
                              )
                            : [],
                        label: String(tooltipData.nearestDatum.key ?? ''),
                    });
                }

                // Default tooltip content
                const datum = tooltipData.nearestDatum.datum;

                return (
                    <div
                        style={{
                            backgroundColor: 'var(--color-surface-elevated)',
                            border: '1px solid var(--color-border-default)',
                            borderRadius: 'var(--radius-m)',
                            padding: 'var(--spacing-2) var(--spacing-3)',
                            boxShadow: 'var(--shadow-tooltip)',
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 600,
                                color: 'var(--color-text-primary)',
                                marginBottom: 'var(--spacing-1)',
                            }}
                        >
                            {String(datum.name ?? datum.label ?? '')}
                        </div>
                        {tooltipData.datumByKey &&
                            Object.entries(tooltipData.datumByKey).map(
                                ([key, tooltipDatum]: [string, TooltipDatum<ChartDatum>]) => (
                                    <div
                                        key={key}
                                        style={{
                                            display: 'flex',
                                            gap: 'var(--spacing-2)',
                                            color: 'var(--color-text-secondary)',
                                        }}
                                    >
                                        <span>{key}:</span>
                                        <span style={{ fontWeight: 500 }}>
                                            {String(getDatumValue(tooltipDatum, key) ?? '')}
                                        </span>
                                    </div>
                                )
                            )}
                    </div>
                );
            }}
        />
    );
}

export default Tooltip;
