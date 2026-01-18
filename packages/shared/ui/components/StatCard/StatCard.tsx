import React from 'react';
import { cn } from '@pulwave/utils';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { statCardVariants, statCardIconVariants, type StatCardProps, type StatCardRootProps } from './types';
import './styles/_index.scss';


export const StatCardRoot = React.forwardRef<HTMLDivElement, StatCardRootProps & React.HTMLAttributes<HTMLDivElement>>(
    ({ variant = 'primary', className, children, ...props }, ref) => (
        <Card variant="elevated" ref={ref} className={cn(statCardVariants({ variant }), className)} {...props}>
            {children}
        </Card>
    )
);
StatCardRoot.displayName = 'StatCard.Root';

export const StatCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("stat-card__header", className)} {...props}>{children}</div>
));
StatCardHeader.displayName = 'StatCard.Header';

export const StatCardIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: StatCardProps['variant'] }>(
    ({ className, variant = 'primary', children, ...props }, ref) => (
        <div ref={ref} className={cn(statCardIconVariants({ variant }), className)} {...props}>
            <Icon size="l">{children}</Icon>
        </div>
    )
);
StatCardIcon.displayName = 'StatCard.Icon';

export const StatCardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("stat-card__body", className)} {...props}>{children}</div>
));
StatCardBody.displayName = 'StatCard.Body';

export const StatCardValue = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn("stat-card__value", className)} {...props}>{children}</div>
    )
);
StatCardValue.displayName = 'StatCard.Value';

export const StatCardLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn("stat-card__label", className)} {...props}>{children}</div>
    )
);
StatCardLabel.displayName = 'StatCard.Label';

export const StatCardSubtext = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn("stat-card__subtext", className)} {...props}>{children}</div>
    )
);
StatCardSubtext.displayName = 'StatCard.Subtext';

const StatCardMain = ({
    icon,
    value,
    label,
    subtext,
    variant = 'primary',
    loading = false,
    className,
    ...props
}: StatCardProps) => (
    <StatCardRoot variant={variant} className={className} {...props}>
        <StatCardHeader>
            <StatCardIcon variant={variant}>
                {icon}
            </StatCardIcon>
        </StatCardHeader>
        <StatCardBody>
            <StatCardValue>{loading ? '-' : value}</StatCardValue>
            <StatCardLabel>{label}</StatCardLabel>
            {subtext && <StatCardSubtext>{subtext}</StatCardSubtext>}
        </StatCardBody>
    </StatCardRoot>
);

StatCardMain.displayName = 'StatCard';

export const StatCard = Object.assign(StatCardMain, {
    Root: StatCardRoot,
    Header: StatCardHeader,
    Icon: StatCardIcon,
    Body: StatCardBody,
    Value: StatCardValue,
    Label: StatCardLabel,
    Subtext: StatCardSubtext,
});


