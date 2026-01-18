import { cloneElement, Children, isValidElement } from 'react';
import { cn } from '@pulwave/utils';
import { avatarGroupVariants, avatarGroupExcessVariants, type AvatarGroupProps } from './types';
import type { AvatarProps } from '../Avatar/types';
import './styles/_index.scss';

/**
 * AvatarGroup Component
 * 
 * Displays a stack of avatars with optional overflow count.
 */
export const AvatarGroup = ({
    children,
    limit,
    size = 'm',
    className,
}: AvatarGroupProps) => {
    const childrenArray = Children.toArray(children).filter(isValidElement);

    const count = childrenArray.length;
    const max = limit ? Math.min(limit, count) : count;

    // Determine how many to show
    // If limit is 3 and count is 4, show 2 avatars + 1 excess (+2) ?
    // Standard pattern: if limit is 3, show 3 items. If count > 3, show 2 items + excess bubble.
    // OR show limit items, where the last one is the overflow?
    // Let's go with: show `limit` bubbles total. So if limit=3, we show 2 avatars + 1 "+N".

    const itemsToShow = limit && count > limit ? max - 1 : max;
    const excess = count - itemsToShow;

    // Use token size for excess bubble if needed. Mapping size string to px dimensions isn't ideal in JS.
    // SCSS handles .avatar--size sizing.
    // The excess bubble acts like an avatar.

    return (
        <div className={cn(avatarGroupVariants(), className)} role="group">
            {childrenArray.slice(0, itemsToShow).map((child, index) => {
                return cloneElement(child as React.ReactElement<AvatarProps>, {
                    size: size,
                    key: index,
                });
            })}

            {limit && count > limit && (
                <div
                    className={cn(avatarGroupExcessVariants({ size }))}
                    style={{ width: undefined, height: undefined }} // Let class handle it, but reset if needed
                    aria-label={`${excess} more users`}
                >
                    +{excess}
                </div>
            )}
        </div>
    );
};
