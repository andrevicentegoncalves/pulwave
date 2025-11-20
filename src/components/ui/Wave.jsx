import React from 'react';

/**
 * Wave - Decorative animated wave for sidebar
 * 
 * Pure decorative element with smooth animation.
 * Only visible when sidebar is expanded and has sufficient space.
 * 
 * @example
 * <Wave />
 */
const Wave = () => {
    return (
        <svg
            className="sidebar-wave"
            viewBox="0 0 280 370"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M0 100C0 100 50 50 100 100C150 150 200 50 250 100C280 130 280 370 280 370H0V100Z"
                fill="rgba(255, 255, 255, 0.05)"
            >
                <animate
                    attributeName="d"
                    dur="8s"
                    repeatCount="indefinite"
                    values="
                        M0 100C0 100 50 50 100 100C150 150 200 50 250 100C280 130 280 370 280 370H0V100Z;
                        M0 120C0 120 50 70 100 120C150 170 200 70 250 120C280 150 280 370 280 370H0V120Z;
                        M0 100C0 100 50 50 100 100C150 150 200 50 250 100C280 130 280 370 280 370H0V100Z
                    "
                />
            </path>
            <path
                d="M0 150C0 150 50 100 100 150C150 200 200 100 250 150C280 180 280 370 280 370H0V150Z"
                fill="rgba(255, 255, 255, 0.03)"
            >
                <animate
                    attributeName="d"
                    dur="10s"
                    repeatCount="indefinite"
                    values="
                        M0 150C0 150 50 100 100 150C150 200 200 100 250 150C280 180 280 370 280 370H0V150Z;
                        M0 170C0 170 50 120 100 170C150 220 200 120 250 170C280 200 280 370 280 370H0V170Z;
                        M0 150C0 150 50 100 100 150C150 200 200 100 250 150C280 180 280 370 280 370H0V150Z
                    "
                />
            </path>
        </svg>
    );
};

export default Wave;