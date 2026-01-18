import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@pulwave/utils';
import { visualEffectVariants, type VisualEffectProps } from './types';
import './styles/_index.scss';

/**
 * Hook to detect prefers-reduced-motion preference
 */
const useReducedMotion = (): boolean => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handler = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return prefersReducedMotion;
};

/**
 * VisualEffect - Decorative animations
 * Respects prefers-reduced-motion by disabling animations
 */
export const VisualEffect = ({
    variant = 'sidebar-wave',
    size,
    className,
    ...props
}: VisualEffectProps) => {
    const prefersReducedMotion = useReducedMotion();
    // Sidebar Wave
    if (variant === 'sidebar-wave') {
        return (
            <svg
                className={cn(visualEffectVariants({ variant, size }), className)}
                viewBox="0 0 280 370"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                preserveAspectRatio="none"
                {...props}
            >
                <defs>
                    <path id="wave-path" d="M0 100 Q 70 50 140 100 T 280 100 T 420 100 T 560 100 T 700 100 T 840 100 V 370 H 0 Z" />
                </defs>
                <g>
                    <use href="#wave-path" fill="rgba(255, 255, 255, 0.1)" x="0" y="0">
                        {!prefersReducedMotion && (
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                from="0 0"
                                to="-280 0"
                                dur="10s"
                                repeatCount="indefinite"
                            />
                        )}
                    </use>
                </g>
                <g>
                    <use href="#wave-path" fill="rgba(255, 255, 255, 0.07)" x="-280" y="15">
                        {!prefersReducedMotion && (
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                from="0 0"
                                to="280 0"
                                dur="15s"
                                repeatCount="indefinite"
                            />
                        )}
                    </use>
                </g>
            </svg>
        );
    }

    // Pulse Wave
    if (variant === 'pulse-wave') {
        return (
            <svg
                className={cn(visualEffectVariants({ variant, size }), className)}
                viewBox="0 0 1440 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                preserveAspectRatio="none"
                {...props}
            >
                <path
                    d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192"
                    stroke="var(--color-primary-500)"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    fill="none"
                >
                    {!prefersReducedMotion && (
                        <animate
                            attributeName="d"
                            values="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,192,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192;M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,208C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160;M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192"
                            dur="10s"
                            repeatCount="indefinite"
                        />
                    )}
                </path>
            </svg>
        );
    }

    // Ring Wave
    if (variant === 'ring-wave') {
        return (
            <div
                className={cn(visualEffectVariants({ variant, size }), className)}
                {...props as React.HTMLAttributes<HTMLDivElement>}
            >
                <svg
                    viewBox="0 0 400 400"
                    xmlns="http://www.w3.org/2000/svg"
                    className="visual-effect--ring-wave__svg"
                >
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-primary-light)" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="var(--color-primary-dark)" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>
                    <g className="ring ring--1">
                        <ellipse cx="200" cy="200" rx="180" ry="160" stroke="var(--color-primary-subtle)" strokeWidth="1.5" fill="none" transform="rotate(15 200 200)" />
                    </g>
                    <g className="ring ring--2">
                        <ellipse cx="200" cy="200" rx="140" ry="165" stroke="var(--color-primary-light)" strokeWidth="1.5" fill="none" transform="rotate(-30 200 200)" />
                    </g>
                    <g className="ring ring--3">
                        <ellipse cx="200" cy="200" rx="190" ry="150" stroke="var(--color-primary-500)" strokeWidth="1" fill="none" transform="rotate(60 200 200)" />
                    </g>
                    <g className="ring ring--4">
                        <ellipse cx="200" cy="200" rx="160" ry="185" stroke="url(#grad1)" strokeWidth="2" fill="none" transform="rotate(90 200 200)" />
                    </g>
                    <g className="ring ring--5">
                        <ellipse cx="200" cy="200" rx="195" ry="170" stroke="url(#grad2)" strokeWidth="1.5" fill="none" transform="rotate(-45 200 200)" />
                    </g>
                </svg>
            </div>
        );
    }

    return null;
};

export default VisualEffect;
