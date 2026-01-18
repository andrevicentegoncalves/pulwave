/**
 * FormattingSection Component
 * 
 * Displays anatomy, sizes, emphasis, and alignment formatting guidelines.
 */
import React from 'react';
import { Text, NumberedList, Badge } from "@pulwave/ui";

interface AnatomyPart {
    name: string;
    description: string;
}

interface SizeSpec {
    name: string;
    height?: string;
    description: string;
}

interface FormattingSectionProps {
    anatomy?: {
        image?: string;
        parts?: AnatomyPart[];
    };
    formatting?: {
        anatomy?: {
            image?: string;
            parts?: AnatomyPart[];
        };
        sizes?: SizeSpec[];
        emphasis?: string;
        alignment?: string;
    };
    componentName: string;
}

export const FormattingSection = ({
    anatomy,
    formatting,
    componentName,
}: FormattingSectionProps) => {
    const hasContent = anatomy?.image || anatomy?.parts || formatting?.anatomy || formatting?.sizes || formatting?.emphasis || formatting?.alignment;

    if (!hasContent) return null;

    return (
        <div className="component-doc__formatting-section">
            <Text as="h2" category="title" size="l" className="component-doc__section-title">
                Formatting
            </Text>

            {/* Anatomy Image */}
            {(anatomy?.image || formatting?.anatomy?.image) && (
                <div className="component-doc__anatomy-image">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Anatomy
                    </Text>
                    <img
                        src={anatomy?.image || formatting?.anatomy?.image}
                        alt={`${componentName} anatomy`}
                        width={800}
                        height={400}
                    />
                </div>
            )}

            {/* Anatomy Parts */}
            {(anatomy?.parts || formatting?.anatomy?.parts) && (
                <div className="component-doc__anatomy-parts">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Component Parts
                    </Text>
                    <NumberedList items={anatomy?.parts || formatting?.anatomy?.parts || []} />
                </div>
            )}

            {/* Sizes */}
            {formatting?.sizes && formatting.sizes.length > 0 && (
                <div className="component-doc__sizes">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Sizes
                    </Text>
                    <div className="component-doc__sizes-grid">
                        {formatting.sizes.map((size, idx) => (
                            <div key={idx} className="component-doc__size-item">
                                <div className="mb-2">
                                    <Badge size="s" status="neutral">{size.name}</Badge>
                                </div>
                                {size.height && <code>{size.height}</code>}
                                <Text as="span" category="body" size="s">{size.description}</Text>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Emphasis & Alignment */}
            {(formatting?.emphasis || formatting?.alignment) && (
                <div className="component-doc__formatting-text">
                    {formatting.emphasis && (
                        <div className="component-doc__emphasis">
                            <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                                Emphasis
                            </Text>
                            <Text as="p" category="body" size="m">{formatting.emphasis}</Text>
                        </div>
                    )}
                    {formatting.alignment && (
                        <div className="component-doc__alignment">
                            <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                                Alignment
                            </Text>
                            <Text as="p" category="body" size="m">{formatting.alignment}</Text>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FormattingSection;
