/**
 * AccessibilityTabContent Component
 * 
 * Displays accessibility information: keyboard shortcuts, ARIA, screen reader, focus, and recommendations.
 */
import React from 'react';
import { Text } from "@pulwave/ui";
import { Keyboard, Volume2 } from '@pulwave/ui';
import { KeyboardShortcutTable } from '../../KeyboardShortcutTable/KeyboardShortcutTable';
import { AccessibilityStatusBadges, AccessibilityStatus } from '../../AccessibilityStatusBadges/AccessibilityStatusBadges';

interface AccessibilityData {
    keyboard?: { key: string; action: string }[];
    aria?: { attribute: string; usage: string }[];
    screenReader?: string;
    focusIndicator?: string;
}

interface AccessibilityTabContentProps {
    accessibilityStatus?: AccessibilityStatus;
    accessibility?: AccessibilityData;
    designRecommendations?: string[];
    developmentConsiderations?: string[];
}

export const AccessibilityTabContent = ({
    accessibilityStatus,
    accessibility,
    designRecommendations,
    developmentConsiderations,
}: AccessibilityTabContentProps) => {
    const hasContent = accessibilityStatus || accessibility || designRecommendations || developmentConsiderations;

    if (!hasContent) {
        return (
            <div className="component-doc__section">
                <Text as="p" category="body" size="m" color="muted">
                    Accessibility documentation coming soon.
                </Text>
            </div>
        );
    }

    return (
        <div className="component-doc__section">
            {/* Accessibility Status Badges */}
            {accessibilityStatus && (
                <div className="component-doc__a11y-status">
                    <AccessibilityStatusBadges status={accessibilityStatus} />
                </div>
            )}

            {/* Keyboard Section */}
            {accessibility?.keyboard && accessibility.keyboard.length > 0 && (
                <div className="component-doc__a11y-keyboard">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        <Keyboard size={16} aria-hidden="true" />
                        Keyboard Navigation
                    </Text>
                    <KeyboardShortcutTable shortcuts={accessibility.keyboard} />
                </div>
            )}

            {/* ARIA Section */}
            {accessibility?.aria && accessibility.aria.length > 0 && (
                <div className="component-doc__a11y-aria">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        ARIA Attributes
                    </Text>
                    <table className="component-doc__aria-table">
                        <thead>
                            <tr>
                                <th>Attribute</th>
                                <th>Usage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accessibility.aria.map((item, idx) => (
                                <tr key={idx}>
                                    <td><code>{item.attribute}</code></td>
                                    <td>{item.usage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Screen Reader Section */}
            {accessibility?.screenReader && (
                <div className="component-doc__a11y-sr">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        <Volume2 size={16} aria-hidden="true" />
                        Screen Reader Behavior
                    </Text>
                    <Text as="p" category="body" size="m" className="component-doc__a11y-text">
                        {accessibility.screenReader}
                    </Text>
                </div>
            )}

            {/* Focus Indicator */}
            {accessibility?.focusIndicator && (
                <div className="component-doc__a11y-focus">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Focus Indicator
                    </Text>
                    <Text as="p" category="body" size="m" className="component-doc__a11y-text">
                        {accessibility.focusIndicator}
                    </Text>
                </div>
            )}

            {/* Design Recommendations */}
            {designRecommendations && designRecommendations.length > 0 && (
                <div className="component-doc__a11y-design">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Design Recommendations
                    </Text>
                    <ul>
                        {designRecommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Development Considerations */}
            {developmentConsiderations && developmentConsiderations.length > 0 && (
                <div className="component-doc__a11y-dev">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Development Considerations
                    </Text>
                    <ul>
                        {developmentConsiderations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AccessibilityTabContent;
