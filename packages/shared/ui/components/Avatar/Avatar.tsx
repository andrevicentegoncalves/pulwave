
import React, { useState } from 'react';
import { User } from '../../icon-library';
import { cn } from '@pulwave/utils';
import {
    avatarVariants,
    avatarImageVariants,
    avatarInitialsVariants,
    avatarPlaceholderVariants,
    type AvatarProps
} from './types';
import './styles/_index.scss';

/**
 * Get initials from a name string
 */
const getInitialsFromName = (name: string): string => {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Size to icon size mapping
const iconSizeMap = {
    xs: 14,
    s: 16,
    m: 20,
    l: 28,
    xl: 36,
};

/**
 * Avatar component for user profile images
 * 
 * @example
 * <Avatar src="/user.jpg" alt="John Doe" size="m" />
 * <Avatar initials="JD" size="l" />
 * <Avatar fallback="A" size="m" /> // Shows 'A' as initials
 */
export const Avatar = ({
    src,
    alt = '',
    size = 'm',
    initials = '',
    name = '',
    fallback,
    className,
}: AvatarProps) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    // Use name as base for initials/alt if they are missing
    const effectiveAlt = alt || name;

    // Get initials from prop, fallback prop, or derive from alt/name text
    const displayInitials = initials || fallback || (effectiveAlt ? getInitialsFromName(effectiveAlt) : null);

    const showImage = src && !imageError;

    const sizePixels: Record<string, number> = {
        xs: 24,
        s: 32,
        m: 40,
        l: 48,
        xl: 64,
    };

    const currentSize = sizePixels[size as string] || 40;

    return (
        <div className={cn(avatarVariants({ size }), className)}>
            {showImage ? (
                <img
                    src={src}
                    alt={effectiveAlt}
                    width={currentSize}
                    height={currentSize}
                    onError={handleImageError}
                    className={cn(avatarImageVariants())}
                />
            ) : displayInitials ? (
                <div className={cn(avatarInitialsVariants())}>{displayInitials}</div>
            ) : (
                <div className={cn(avatarPlaceholderVariants())}>
                    <User size={iconSizeMap[size as keyof typeof iconSizeMap] || 20} aria-hidden="true" />
                </div>
            )}
        </div>
    );
};

Avatar.displayName = 'Avatar';
