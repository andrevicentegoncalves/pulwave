import { cva, type VariantProps } from 'class-variance-authority';

export const statusIndicatorVariants = cva('status-indicator', {
    variants: {
        status: {
            online: 'status-indicator--online',
            offline: 'status-indicator--offline',
            busy: 'status-indicator--busy',
            away: 'status-indicator--away',
            dnd: 'status-indicator--dnd',
            invisible: 'status-indicator--invisible',
        },
        size: {
            xs: 'status-indicator--xs',
            s: 'status-indicator--s',
            m: 'status-indicator--m',
            l: 'status-indicator--l',
            xl: 'status-indicator--xl',
        },
        pulse: {
            true: 'status-indicator--pulse',
        },
    },
    defaultVariants: {
        size: 'm',
        pulse: false,
    },
});

export type StatusType = 'online' | 'offline' | 'busy' | 'away' | 'dnd' | 'invisible';
export type StatusSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface StatusIndicatorProps extends VariantProps<typeof statusIndicatorVariants> {
    status: StatusType;
    label?: string;
    className?: string;
}
