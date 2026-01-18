/**
 * VariantDocsSection Component
 * 
 * Displays per-variant documentation with best practices.
 */
import React from 'react';
import { Text } from "@pulwave/ui";
import { Layers } from '@pulwave/ui';

interface VariantDoc {
    name: string;
    description: string;
    bestPractices?: string[];
    image?: string;
}

interface VariantDocsSectionProps {
    variantDocs?: VariantDoc[];
}

export const VariantDocsSection = ({ variantDocs }: VariantDocsSectionProps) => {
    if (!variantDocs || variantDocs.length === 0) return null;

    return (
        <div className="component-doc__variant-docs">
            <Text as="h2" category="title" size="l" className="component-doc__section-title">
                <Layers size={20} aria-hidden="true" />
                Variant Documentation
            </Text>

            {variantDocs.map((variant, idx) => (
                <div key={idx} className="component-doc__variant-doc">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        {variant.name}
                    </Text>
                    <Text as="p" category="body" size="m">{variant.description}</Text>

                    {variant.bestPractices && variant.bestPractices.length > 0 && (
                        <div className="component-doc__best-practices">
                            <Text as="h4" category="title" size="s">Best Practices</Text>
                            <ul>
                                {variant.bestPractices.map((practice, pIdx) => (
                                    <li key={pIdx}>{practice}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default VariantDocsSection;
