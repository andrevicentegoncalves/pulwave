import React from 'react';
/**
 * SubscriptionShell Experience Wrapper
 */
import { Outlet } from 'react-router-dom';

export interface SubscriptionShellProps {
    children?: React.ReactNode;
}

export const SubscriptionShell = ({ children }: SubscriptionShellProps) => {
    return (
        <div className="subscription-shell">
            {children ?? <Outlet />}
        </div>
    );
};

SubscriptionShell.displayName = 'SubscriptionShell';
