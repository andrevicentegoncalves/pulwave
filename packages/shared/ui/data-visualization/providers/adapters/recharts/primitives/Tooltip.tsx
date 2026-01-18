/**
 * Recharts Tooltip Primitive
 *
 * Wraps Recharts Tooltip component with unified props.
 */

import React from 'react';
import { Tooltip as RechartsTooltip } from 'recharts';
import type { TooltipTrigger } from 'recharts/types/chart/types';
import type {
    Formatter,
    NameType,
    Payload,
    ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import type { TooltipProps } from '../../../../primitives/types';

/** Recharts-compatible formatter type */
type RechartsFormatter = Formatter<ValueType, NameType>;

/** Recharts-compatible label formatter type */
type RechartsLabelFormatter = (
    label: unknown,
    payload: ReadonlyArray<Payload<ValueType, NameType>>
) => React.ReactNode;

/**
 * Tooltip for Recharts
 *
 * Note: formatter and labelFormatter are adapted to Recharts-compatible types.
 * The unified API uses a simplified signature; Recharts expects specific return types.
 */
export function Tooltip({
    active,
    content,
    cursor = true,
    trigger = 'hover',
    offset = 10,
    allowEscapeViewBox,
    formatter,
    labelFormatter,
}: TooltipProps) {
    // Convert cursor prop
    const cursorProp =
        cursor === false
            ? false
            : cursor === true
              ? { stroke: 'var(--color-border-default)' }
              : cursor;

    // Recharts only supports 'hover' | 'click', not 'none'
    // Map unified trigger to Recharts-compatible trigger
    const triggerProp: TooltipTrigger =
        trigger === 'click' ? 'click' : 'hover';

    // Adapt unified formatter to Recharts formatter signature
    const formatterProp: RechartsFormatter | undefined = formatter
        ? (value, name, item, _index, _payload) => formatter(value, String(name ?? ''), item)
        : undefined;

    // Adapt unified labelFormatter to Recharts labelFormatter signature
    const labelFormatterProp: RechartsLabelFormatter | undefined = labelFormatter
        ? (label, _payload) => labelFormatter(label)
        : undefined;

    return (
        <RechartsTooltip
            active={active}
            content={content as React.ReactElement}
            cursor={cursorProp}
            trigger={triggerProp}
            offset={offset}
            allowEscapeViewBox={allowEscapeViewBox}
            formatter={formatterProp}
            labelFormatter={labelFormatterProp}
            contentStyle={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-m)',
                boxShadow: 'var(--shadow-tooltip)',
            }}
            labelStyle={{
                color: 'var(--color-text-primary)',
                fontWeight: 600,
            }}
            itemStyle={{
                color: 'var(--color-text-secondary)',
            }}
        />
    );
}

export default Tooltip;
