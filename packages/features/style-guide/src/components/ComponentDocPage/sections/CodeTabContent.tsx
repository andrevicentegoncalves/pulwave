/**
 * CodeTabContent Component
 * 
 * Displays code tab content: props table, style tokens, structure specs, and code examples.
 */
import React from 'react';
import { Text, DataTable } from "@pulwave/ui";
import { Palette } from '@pulwave/ui';
import { TokenTable } from '../../TokenTable/TokenTable';
import { StructureSpec } from '../../StructureSpec/StructureSpec';

interface StyleToken {
    variant: string;
    states: {
        state: string;
        textToken: string;
        backgroundToken: string;
        borderToken?: string;
    }[];
}

interface StructureSpecItem {
    part: string;
    token: string;
    value: string;
    [key: string]: unknown;
}

interface InUseExample {
    title: string;
    description: string;
    code?: string;
    component?: React.ElementType;
}

interface CodeTabContentProps {
    propsColumns: any[];
    propsData: any[];
    styleTokens?: StyleToken[];
    structure?: StructureSpecItem[];
    inUse?: {
        examples?: InUseExample[];
    };
}

export const CodeTabContent = ({
    propsColumns,
    propsData,
    styleTokens,
    structure,
    inUse,
}: CodeTabContentProps) => {
    return (
        <div className="component-doc__section">
            {/* Props Table */}
            <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                Props
            </Text>
            {propsData.length > 0 ? (
                <DataTable columns={propsColumns} data={propsData} className="component-doc__data-table" />
            ) : (
                <Text as="p" category="body" size="m" color="muted">
                    No props defined for this component.
                </Text>
            )}

            {/* Style Tokens */}
            {styleTokens && styleTokens.length > 0 && (
                <div className="component-doc__style-tokens">
                    <Text as="h2" category="title" size="l" className="component-doc__section-title">
                        <Palette size={20} aria-hidden="true" />
                        Style Tokens
                    </Text>
                    <TokenTable tokens={styleTokens} />
                </div>
            )}

            {/* Structure Specs */}
            {structure && structure.length > 0 && (
                <div className="component-doc__structure">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Structure
                    </Text>
                    <StructureSpec specs={structure} />
                </div>
            )}

            {/* Code Examples */}
            {inUse?.examples && inUse.examples.length > 0 && (
                <div className="component-doc__examples">
                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">
                        Examples
                    </Text>
                    {inUse.examples.map((example, idx) => (
                        <div key={idx} className="component-doc__example">
                            <Text as="h4" category="title" size="s">{example.title}</Text>
                            <Text as="p" category="body" size="m">{example.description}</Text>
                            {example.code && (
                                <pre className="component-doc__code">
                                    <code>{example.code}</code>
                                </pre>
                            )}
                            {example.component && <example.component />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CodeTabContent;
