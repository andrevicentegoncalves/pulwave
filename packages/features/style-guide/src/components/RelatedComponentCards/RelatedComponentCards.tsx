/**
 * RelatedComponentCards Component
 * 
 * Displays related components as clickable cards with descriptions.
 * Used in Overview tab for component relationships.
 */
import React from 'react';
import { ArrowRight } from '@pulwave/ui';
import { Card, Text } from "@pulwave/ui";
import './styles/_index.scss';

export interface RelatedComponent {
    name: string;
    description: string;
    href?: string;
    onClick?: (e?: any) => void;
}

export interface RelatedComponentCardsProps {
    components: RelatedComponent[];
    className?: string;
}

export const RelatedComponentCards = ({ components, className = '' }: RelatedComponentCardsProps) => {
    if (!components?.length) return null;

    return (
        <div className={`related-components ${className}`}>
            <div className="related-components__grid">
                {components.map((component, index) => (
                    <Card
                        key={index}
                        className="related-components__card"
                        onClick={component.onClick}
                        as={component.href ? 'a' : 'div'}
                        {...(component.href ? { href: component.href } : {})}
                    >
                        <div className="related-components__content">
                            <Text as="h4" variant="heading-s" className="related-components__name">{component.name}</Text>
                            <Text as="p" variant="body-m" className="related-components__description">{component.description}</Text>
                        </div>
                        <ArrowRight className="related-components__arrow" size={16} aria-hidden="true" />
                    </Card>
                ))}
            </div>
        </div>
    );
};

RelatedComponentCards.displayName = 'RelatedComponentCards';

export default RelatedComponentCards;
