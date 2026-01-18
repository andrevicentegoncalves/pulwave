import type { ReactNode } from 'react';
import { cva } from 'class-variance-authority';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type TabsVariant = 'line' | 'pills' | 'segmented' | 'slider' | 'slider-soft' | 'slider-soft-full' | 'icon';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsSize = 's' | 'm' | 'l';
export type TabsColorScheme = 'primary' | 'secondary' | 'tertiary' | 'neutral';

export interface TabsProps {
    children: ReactNode;
    defaultTab?: number;
    onChange?: (index: number) => void;
    variant?: TabsVariant;
    orientation?: TabsOrientation;
    size?: TabsSize;
    fullWidth?: boolean;
    colorScheme?: TabsColorScheme;
    showBorder?: boolean;
    className?: string;
}

export interface TabPanelProps {
    children: ReactNode;
    label: string | ReactNode;
    icon?: ReactNode;
}

// ─────────────────────────────────────────────────────────────
// CVA Definitions
// ─────────────────────────────────────────────────────────────

export const tabsVariants = cva('tabs', {
    variants: {
        variant: {
            line: '',
            pills: 'tabs--pills',
            segmented: 'tabs--segmented',
            slider: 'tabs--slider',
            'slider-soft': 'tabs--slider-soft',
            'slider-soft-full': 'tabs--slider-soft tabs--slider-soft-full',
            icon: 'tabs--icon',
        },
        orientation: {
            horizontal: '',
            vertical: 'tabs--vertical',
        },
        size: {
            s: 'tabs--small',
            m: '',
            l: 'tabs--large',
        },
        fullWidth: {
            true: 'tabs--full-width',
            false: '',
        },
        colorScheme: {
            primary: 'tabs--color-primary',
            secondary: 'tabs--color-secondary',
            tertiary: 'tabs--color-tertiary',
            neutral: 'tabs--color-neutral',
        },
        showBorder: {
            true: 'tabs--bordered',
            false: 'tabs--no-border',
        },
    },
    defaultVariants: {
        variant: 'line',
        orientation: 'horizontal',
        size: 'm',
        fullWidth: false,
        colorScheme: 'primary',
        showBorder: true,
    },
});

export const tabVariants = cva('tabs__tab', {
    variants: {
        active: {
            true: 'tabs__tab--active',
            false: '',
        },
    },
    defaultVariants: {
        active: false,
    },
});
