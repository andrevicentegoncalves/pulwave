import React from 'react';
import { cn } from '@pulwave/utils';
import { ratingStarsVariants, type RatingStarsProps } from './types';
import './styles/_index.scss';

import { Star, StarHalf } from '../../icon-library';

// Using Lucide icons for consistency
// StarHalf matches the visual requirement for half-filled stars

const StarFull = ({ size }: { size: number }) => (
    <Star size={size} fill="currentColor" stroke="none" />
);

const StarEmpty = ({ size }: { size: number }) => (
    <Star size={size} color="currentColor" strokeWidth={2} />
);

const StarHalfCustom = ({ size }: { size: number }) => (
    <div className="rating-stars__star-wrapper">
        <Star size={size} color="currentColor" strokeWidth={2} className="rating-stars__star-layered" />
        <StarHalf size={size} fill="currentColor" stroke="none" className="rating-stars__star-layered" />
    </div>
);

export const RatingStars = ({
    value,
    max = 5,
    size = 'm',
    color = 'warning',
    showNumeric = false,
    className,
    ...props
}: RatingStarsProps) => {
    const clampedValue = Math.min(Math.max(value, 0), max);
    const fullStars = Math.floor(clampedValue);
    const hasHalfStar = clampedValue % 1 >= 0.25 && clampedValue % 1 < 0.75;
    const roundedUp = clampedValue % 1 >= 0.75;
    const effectiveFullStars = roundedUp ? fullStars + 1 : fullStars;
    const emptyStars = max - effectiveFullStars - (hasHalfStar ? 1 : 0);
    const sizeMap = { s: 14, m: 18, l: 24 };
    const iconSize = sizeMap[size ?? 'm'];

    return (
        <div
            className={cn(ratingStarsVariants({ size, color }), className)}
            role="img"
            aria-label={`Rating: ${clampedValue} out of ${max} stars`}
            {...props}
        >
            <div className="rating-stars__stars">
                {[...Array(effectiveFullStars)].map((_, i) => <StarFull key={`full-${i}`} size={iconSize} />)}
                {hasHalfStar && <StarHalfCustom size={iconSize} />}
                {[...Array(Math.max(0, emptyStars))].map((_, i) => <StarEmpty key={`empty-${i}`} size={iconSize} />)}
            </div>
            {showNumeric && <span className="rating-stars__numeric">{clampedValue.toFixed(1)}</span>}
        </div>
    );
};

RatingStars.displayName = 'RatingStars';
