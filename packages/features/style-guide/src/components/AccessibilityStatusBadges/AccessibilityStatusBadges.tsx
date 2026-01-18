/**
 * AccessibilityStatusBadges Component
 * 
 * Displays accessibility testing status badges (pass/partial/fail).
 */
import React from 'react';
import { Badge, Text } from "@pulwave/ui";
import { Check, X, CircleDashed } from '@pulwave/ui';

export interface AccessibilityStatus {
    keyboard?: 'pass' | 'partial' | 'fail';
    focusManagement?: 'pass' | 'partial' | 'fail';
    colorContrast?: 'pass' | 'partial' | 'fail';
    screenReader?: 'pass' | 'partial' | 'fail';
}

const a11yStatusIcons: Record<string, { icon: React.ReactNode; color?: string }> = {
    pass: { icon: <Check size={14} aria-hidden="true" /> },
    partial: { icon: <CircleDashed size={14} aria-hidden="true" /> },
    fail: { icon: <X size={14} aria-hidden="true" /> },
};

const a11yStatusVariants: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
    pass: 'success',
    partial: 'warning',
    fail: 'error',
};

export interface AccessibilityStatusBadgesProps {
    status: AccessibilityStatus;
    className?: string;
}

export const AccessibilityStatusBadges = ({ status, className = '' }: AccessibilityStatusBadgesProps) => (
    <div className={`component-doc__a11y-status ${className}`}>
        <Text as="h4" className="component-doc__a11y-status-title">Accessibility Testing Status</Text>
        <div className="component-doc__a11y-status-badges">
            {Object.entries(status).map(([key, value]) => {
                const statusValue = value || 'pass';
                const variant = a11yStatusVariants[statusValue] || 'neutral';
                const iconData = a11yStatusIcons[statusValue];
                return (
                    <div key={key} className="component-doc__a11y-badge-wrapper">
                        <Badge
                            type={variant}
                            size="m"
                            icon={iconData?.icon}
                        >
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                    </div>
                );
            })}
        </div>
    </div>
);

export default AccessibilityStatusBadges;
