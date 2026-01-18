import React from 'react';
import { cn } from '@pulwave/utils';
import { Badge } from '../Badge';
import { verificationBadgeVariants, type VerificationBadgeProps, type VerificationStatus } from './types';
import './styles/_index.scss';

const STATUS_CONFIG: Record<VerificationStatus, { type: 'success' | 'warning' | 'error' | 'neutral'; label: string }> = {
    verified: { type: 'success', label: 'Verified' },
    pending: { type: 'warning', label: 'Pending' },
    failed: { type: 'error', label: 'Failed' },
    requires_action: { type: 'warning', label: 'Action Required' },
    unverified: { type: 'neutral', label: 'Unverified' },
};

export const VerificationBadge = ({
    status,
    size = 's',
    showIcon = true,
    className
}: VerificationBadgeProps) => {
    const config = STATUS_CONFIG[status];
    if (!config) return null;

    return (
        <Badge
            variant="light"
            status={config.type}
            size={size ?? 's'}
            className={cn(verificationBadgeVariants({ status, size }), className)}
        >
            {config.label}
        </Badge>
    );
};

VerificationBadge.displayName = 'VerificationBadge';
