import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * VisualEffect Component
 * Consolidates various decorative animations used throughout the application.
 * 
 * Variants:
 * - 'sidebar-wave': The wave animation used in the sidebar.
 * - 'pulse-wave': The line-based wave animation (formerly ProfileWave).
 * - 'ring-wave': The rotating ring animation (formerly ProfileRingWave).
 */
const VisualEffect = ({ variant = 'sidebar-wave', className, ...props }) => {

    // Sidebar Wave Implementation
    if (variant === 'sidebar-wave') {
        return (
            <svg
                className={clsx("sidebar-wave", className)}
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

                {/* Wave 1 - Moving Left */}
                <g>
                    <use href="#wave-path" fill="rgba(255, 255, 255, 0.1)" x="0" y="0">
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            from="0 0"
                            to="-280 0"
                            dur="10s"
                            repeatCount="indefinite"
                        />
                    </use>
                </g>

                {/* Wave 2 - Moving Right (offset start) */}
                <g>
                    <use href="#wave-path" fill="rgba(255, 255, 255, 0.07)" x="-280" y="15">
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            from="0 0"
                            to="280 0"
                            dur="15s"
                            repeatCount="indefinite"
                        />
                    </use>
                </g>
            </svg>
        );
    }

    // Pulse Wave Implementation (formerly ProfileWave)
    if (variant === 'pulse-wave') {
        return (
            <svg
                className={clsx("profile-wave", className)}
                viewBox="0 0 1440 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                preserveAspectRatio="none"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    minWidth: '800px',
                    zIndex: 0,
                    ...props.style
                }}
                {...props}
            >
                <path
                    d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    fill="none"
                >
                    <animate
                        attributeName="d"
                        values="
                            M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192;
                            M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,208C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160;
                            M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192"
                        dur="10s"
                        repeatCount="indefinite"
                    />
                </path>
                <path
                    d="M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,128C672,117,768,139,864,165.3C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeOpacity="0.2"
                    fill="none"
                >
                    <animate
                        attributeName="d"
                        values="
                            M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,128C672,117,768,139,864,165.3C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160;
                            M0,192L48,186.7C96,181,192,171,288,165.3C384,160,480,160,576,170.7C672,181,768,203,864,208C960,213,1056,203,1152,186.7C1248,171,1344,149,1392,138.7L1440,128;
                            M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,128C672,117,768,139,864,165.3C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160"
                        dur="15s"
                        repeatCount="indefinite"
                    />
                </path>
            </svg>
        );
    }

    // Ring Wave Implementation (formerly ProfileRingWave)
    if (variant === 'ring-wave') {
        return (
            <div className={clsx("profile-ring-wave", className)} {...props}>
                <svg
                    viewBox="0 0 400 400"
                    xmlns="http://www.w3.org/2000/svg"
                    className="profile-ring-wave__svg"
                >
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-primary-light)" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="var(--color-primary-dark)" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>

                    {/* Ring 1 - Slow rotation, slightly eccentric */}
                    <g className="ring ring--1">
                        <ellipse cx="200" cy="200" rx="180" ry="160" stroke="var(--color-primary-subtle)" strokeWidth="1.5" fill="none" transform="rotate(15 200 200)" />
                    </g>

                    {/* Ring 2 - Medium rotation, reverse, smaller */}
                    <g className="ring ring--2">
                        <ellipse cx="200" cy="200" rx="140" ry="165" stroke="var(--color-primary-light)" strokeWidth="1.5" fill="none" transform="rotate(-30 200 200)" />
                    </g>

                    {/* Ring 3 - Fast rotation, larger and thinner */}
                    <g className="ring ring--3">
                        <ellipse cx="200" cy="200" rx="190" ry="150" stroke="var(--color-primary)" strokeWidth="1" fill="none" transform="rotate(60 200 200)" />
                    </g>

                    {/* Ring 4 - Offset rotation, gradient */}
                    <g className="ring ring--4">
                        <ellipse cx="200" cy="200" rx="160" ry="185" stroke="url(#grad1)" strokeWidth="2" fill="none" transform="rotate(90 200 200)" />
                    </g>

                    {/* Ring 5 - Large outer ring, gradient */}
                    <g className="ring ring--5">
                        <ellipse cx="200" cy="200" rx="195" ry="170" stroke="url(#grad2)" strokeWidth="1.5" fill="none" transform="rotate(-45 200 200)" />
                    </g>

                    {/* Decorative Dots - Scattered more organically */}
                    <g className="ring ring--dots">
                        <circle cx="200" cy="20" r="2" fill="var(--color-primary)" opacity="0.4" />
                        <circle cx="20" cy="200" r="2" fill="var(--color-primary-light)" opacity="0.3" />
                        <circle cx="380" cy="200" r="2" fill="var(--color-primary-light)" opacity="0.3" />
                        <circle cx="200" cy="380" r="2" fill="var(--color-primary)" opacity="0.4" />
                        <circle cx="320" cy="80" r="1.5" fill="var(--color-primary)" opacity="0.3" />
                        <circle cx="80" cy="320" r="1.5" fill="var(--color-primary)" opacity="0.3" />
                    </g>
                </svg>
            </div>
        );
    }

    return null;
};

VisualEffect.propTypes = {
    variant: PropTypes.oneOf(['sidebar-wave', 'pulse-wave', 'ring-wave']),
    className: PropTypes.string,
};

export default VisualEffect;
