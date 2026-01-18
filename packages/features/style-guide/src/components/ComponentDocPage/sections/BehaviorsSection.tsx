/**
 * BehaviorsSection Component
 * 
 * Displays universal behaviors: states, interactions, loading.
 */
import React from 'react';
import { Text } from "@pulwave/ui";

interface BehaviorsSectionProps {
    universalBehaviors?: {
        states?: string;
        interactions?: {
            mouse?: string;
            keyboard?: string;
        };
        loading?: string;
    };
}

export const BehaviorsSection = ({ universalBehaviors }: BehaviorsSectionProps) => {
    if (!universalBehaviors) return null;

    return (
        <div className="component-doc__behaviors">
            <Text as="h2" category="title" size="l" className="component-doc__section-title">
                Universal Behaviors
            </Text>

            {universalBehaviors.states && (
                <div className="component-doc__behavior-item">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        States
                    </Text>
                    <Text as="p" category="body" size="m">{universalBehaviors.states}</Text>
                </div>
            )}

            {universalBehaviors.interactions && (
                <div className="component-doc__behavior-item">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Interactions
                    </Text>
                    {universalBehaviors.interactions.mouse && (
                        <Text as="p" category="body" size="m">
                            <strong>Mouse:</strong> {universalBehaviors.interactions.mouse}
                        </Text>
                    )}
                    {universalBehaviors.interactions.keyboard && (
                        <Text as="p" category="body" size="m">
                            <strong>Keyboard:</strong> {universalBehaviors.interactions.keyboard}
                        </Text>
                    )}
                </div>
            )}

            {universalBehaviors.loading && (
                <div className="component-doc__behavior-item">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Loading
                    </Text>
                    <Text as="p" category="body" size="m">{universalBehaviors.loading}</Text>
                </div>
            )}
        </div>
    );
};

export default BehaviorsSection;
