import React from 'react';

export interface MobileDrawerProps {
    /** Whether drawer is open */
    isOpen: boolean;
    /** Close handler */
    onClose: () => void;
    /** Drawer content */
    children: React.ReactNode;
    /** Additional class name */
    className?: string;
}
