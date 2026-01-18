import { type ReactNode } from 'react';
import { Sun, Moon } from '../../icon-library';
import { cn } from '@pulwave/utils';
import { themeToggleVariants, type ThemeToggleProps } from './types';
import './styles/_index.scss';

export const ThemeToggle = ({ isDark, onToggle, className }: ThemeToggleProps) => {
    return (
        <button
            className={cn(themeToggleVariants(), className)}
            onClick={onToggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            type="button"
        >
            {isDark ? (
                <Sun size={20} aria-hidden="true" />
            ) : (
                <Moon size={20} aria-hidden="true" />
            )}
        </button>
    );
};
