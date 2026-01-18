/**
 * ResponsiveSection Component
 * 
 * Displays responsive behavior breakpoints and guidelines.
 */
import React from 'react';
import { Text } from "@pulwave/ui";

interface ResponsiveBehavior {
    breakpoint: string;
    behavior: string;
}

interface ResponsiveSectionProps {
    responsiveBehavior?: ResponsiveBehavior[];
}

export const ResponsiveSection = ({ responsiveBehavior }: ResponsiveSectionProps) => {
    if (!responsiveBehavior || responsiveBehavior.length === 0) return null;

    return (
        <div className="component-doc__responsive">
            <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                Responsive Behavior
            </Text>
            <div className="component-doc__responsive-list">
                {responsiveBehavior.map((item, index) => (
                    <div key={index} className="component-doc__responsive-item">
                        <Text as="span" category="label" size="m" className="component-doc__responsive-breakpoint">
                            {item.breakpoint}
                        </Text>
                        <Text as="span" category="body" size="s" className="component-doc__responsive-behavior">
                            {item.behavior}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResponsiveSection;
