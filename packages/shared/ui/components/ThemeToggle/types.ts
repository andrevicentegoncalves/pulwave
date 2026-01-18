import { cva, type VariantProps } from 'class-variance-authority';

export const themeToggleVariants = cva('theme-toggle', {
    variants: {},
    defaultVariants: {}
});

export type ThemeToggleVariants = VariantProps<typeof themeToggleVariants>;

export interface ThemeToggleProps extends ThemeToggleVariants {
    isDark: boolean;
    onToggle: () => void;
    className?: string;
}
