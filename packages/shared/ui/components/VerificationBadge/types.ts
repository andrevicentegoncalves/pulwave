import { cva, type VariantProps } from 'class-variance-authority';

export const verificationBadgeVariants = cva('verification-badge', {
    variants: {
        status: {
            verified: 'verification-badge--verified',
            pending: 'verification-badge--pending',
            failed: 'verification-badge--failed',
            requires_action: 'verification-badge--requires-action',
            unverified: 'verification-badge--unverified',
        },
        size: {
            s: 'verification-badge--s',
            m: 'verification-badge--m',
            l: 'verification-badge--l',
        },
    },
    defaultVariants: {
        size: 's',
    },
});

export type VerificationStatus = 'verified' | 'pending' | 'failed' | 'requires_action' | 'unverified';

export interface VerificationBadgeProps extends VariantProps<typeof verificationBadgeVariants> {
    status: VerificationStatus;
    showIcon?: boolean;
    className?: string;
}
