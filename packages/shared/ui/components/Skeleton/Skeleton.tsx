import React from 'react';
import { cn } from '@pulwave/utils';
import { skeletonVariants, type SkeletonProps } from './types';
import './styles/_index.scss';

const SkeletonRoot = ({
    variant = 'text',
    width,
    height,
    className,
    animation = 'pulse',
    dark = false,
    style: externalStyle,
    ...props
}: SkeletonProps) => (
    <div
        className={cn(skeletonVariants({ variant, animation, dark }), className)}
        style={{ width, height, ...externalStyle }}
        {...props}
    />
);
SkeletonRoot.displayName = 'Skeleton';

// Compound Sub-components for common patterns
const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
    <div className={cn('flex flex-col gap-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
            <SkeletonRoot
                key={i}
                variant="text"
                width={i === lines - 1 ? '60%' : '100%'}
                height={16}
            />
        ))}
    </div>
);
SkeletonText.displayName = 'Skeleton.Text';

const SkeletonCircle = ({ size = 40, className }: { size?: number; className?: string }) => (
    <SkeletonRoot
        variant="circular"
        width={size}
        height={size}
        className={className}
    />
);
SkeletonCircle.displayName = 'Skeleton.Circle';

const SkeletonCard = ({ className }: { className?: string }) => (
    <div className={cn('flex flex-col gap-3', className)}>
        <SkeletonRoot variant="rectangular" width="100%" height={200} />
        <SkeletonRoot variant="text" width="80%" height={24} />
        <SkeletonRoot variant="text" width="60%" height={16} />
    </div>
);
SkeletonCard.displayName = 'Skeleton.Card';

export const Skeleton = Object.assign(SkeletonRoot, {
    Text: SkeletonText,
    Circle: SkeletonCircle,
    Card: SkeletonCard,
});
