import { type ReactNode } from 'react';
import { cn } from '@pulwave/utils';
import { Card } from '../Card';
import { TrendingUp, TrendingDown } from '@pulwave/ui';
import type { KpiCardProps } from './types';
import { kpiIconVariants } from './types';
import './styles/_index.scss';

export const KpiCard = ({
    title,
    value,
    icon,
    description,
    trend,
    status = 'neutral',
    className
}: KpiCardProps) => {
    return (
        <Card className={cn('kpi-card', className)}>
            <div className="kpi-card__content">
                <div className="kpi-card__header">
                    <span className="kpi-card__title">{title}</span>
                    {icon && (
                        <div className={kpiIconVariants({ status })} aria-hidden="true">
                            {icon}
                        </div>
                    )}
                </div>
                <div className="kpi-card__value">{value}</div>
                {trend && (
                    <div className={cn('kpi-card__trend', trend.isPositive ? 'kpi-card__trend--positive' : 'kpi-card__trend--negative')}>
                        {trend.isPositive ? <TrendingUp size={14} aria-hidden="true" /> : <TrendingDown size={14} aria-hidden="true" />}
                        <span className="kpi-card__trend-value">{trend.value}</span>
                        {trend.label && <span className="kpi-card__trend-label">{trend.label}</span>}
                    </div>
                )}
                {description && <div className="kpi-card__description">{description}</div>}
            </div>
        </Card>
    );
};
