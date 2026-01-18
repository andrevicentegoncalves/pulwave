
import React from 'react';

export interface FocusTrapProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Whether the trap is active */
    active?: boolean;
    /** Element to focus when the trap is activated */
    initialFocus?: string | HTMLElement;
    /** Whether to return focus to the previously focused element when trap deactivates */
    returnFocus?: boolean | string | HTMLElement;
    /** Whether to allow clicks outside the trap */
    allowOutsideClick?: boolean | ((event: MouseEvent | TouchEvent) => boolean);
    /** Callback when user presses Escape */
    onEscape?: () => void;
    /** Callback when trap activates */
    onActivate?: () => void;
    /** Callback when trap deactivates */
    onDeactivate?: () => void;
}
