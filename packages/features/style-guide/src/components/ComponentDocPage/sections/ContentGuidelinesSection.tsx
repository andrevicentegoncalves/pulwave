/**
 * ContentGuidelinesSection Component
 * 
 * Displays content guidelines: main elements, overflow, internationalization.
 */
import React from 'react';
import { Text } from "@pulwave/ui";
import { BookOpen } from '@pulwave/ui';

interface ContentGuidelinesSectionProps {
    content?: {
        mainElements?: string;
        overflowContent?: string;
        internationalization?: string;
        furtherGuidance?: string;
    };
}

export const ContentGuidelinesSection = ({ content }: ContentGuidelinesSectionProps) => {
    if (!content || (!content.mainElements && !content.overflowContent && !content.internationalization)) {
        return null;
    }

    return (
        <div className="component-doc__content-guidelines">
            <Text as="h2" category="title" size="l" className="component-doc__section-title">
                <BookOpen size={20} aria-hidden="true" />
                Content Guidelines
            </Text>

            {content.mainElements && (
                <div className="component-doc__content-item">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Main Elements
                    </Text>
                    <Text as="p" category="body" size="m">{content.mainElements}</Text>
                </div>
            )}

            {content.overflowContent && (
                <div className="component-doc__content-item">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Overflow Content
                    </Text>
                    <Text as="p" category="body" size="m">{content.overflowContent}</Text>
                </div>
            )}

            {content.internationalization && (
                <div className="component-doc__content-item">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Internationalization (RTL)
                    </Text>
                    <Text as="p" category="body" size="m">{content.internationalization}</Text>
                </div>
            )}

            {content.furtherGuidance && (
                <Text as="p" category="body" size="m" className="component-doc__further-guidance">
                    {content.furtherGuidance}
                </Text>
            )}
        </div>
    );
};

export default ContentGuidelinesSection;
