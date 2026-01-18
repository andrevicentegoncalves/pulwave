/**
 * ModifiersSection Component
 * 
 * Displays component modifiers with optional demos.
 */
import React from 'react';
import { Text } from "@pulwave/ui";

interface Modifier {
    name: string;
    description: string;
    demo?: React.ElementType;
}

interface ModifiersSectionProps {
    modifiers?: Modifier[];
}

export const ModifiersSection = ({ modifiers }: ModifiersSectionProps) => {
    if (!modifiers || modifiers.length === 0) return null;

    return (
        <div className="component-doc__modifiers">
            <Text as="h2" category="title" size="l" className="component-doc__section-title">
                Modifiers
            </Text>

            {modifiers.map((modifier, idx) => (
                <div key={idx} className="component-doc__modifier">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        {modifier.name}
                    </Text>
                    <Text as="p" category="body" size="m">{modifier.description}</Text>
                    {modifier.demo && <modifier.demo />}
                </div>
            ))}
        </div>
    );
};

export default ModifiersSection;
