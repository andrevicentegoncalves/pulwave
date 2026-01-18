/**
 * FoundationDocPage Component
 * 
 * Page template for foundation elements (Color, Typography, Spacing, etc.)
 * Follows IBM Carbon pattern with scrollable sections.
 */
import React from 'react';
import { Text } from "@pulwave/ui";
import { Guidance } from '../Guidance/Guidance';
import './styles/_index.scss';

export interface FoundationSection {
    id: string;
    title: string;
    content: string;
    subsections?: { id: string; title: string; content: string }[];
}

export interface FoundationDocProps {
    doc: {
        name: string;
        description: string;
        sections: FoundationSection[];
        dos?: string[];
        donts?: string[];
        component?: React.ComponentType; // Custom page component
    };
    demos?: Record<string, React.ReactNode>;
}

export const FoundationDocPage = ({ doc, demos }: FoundationDocProps) => {
    if (!doc) {
        return (
            <div className="foundation-doc">
                <Text>Select a foundation element from the sidebar.</Text>
            </div>
        );
    }

    // Render markdown-like content
    const renderContent = (content: string) => {
        // Split by code blocks and render
        const parts = content.split(/```(\w+)?\n([\s\S]*?)```/g);

        return parts.map((part, index) => {
            // Every 3rd part (index 2, 5, 8...) is code content
            if (index % 3 === 2) {
                const lang = parts[index - 1] || '';
                return (
                    <pre key={index} className="foundation-doc__code">
                        <code className={`language-${lang}`}>{part.trim()}</code>
                    </pre>
                );
            }
            // Skip language identifiers
            if (index % 3 === 1) return null;

            // Regular content - handle basic markdown
            return (
                <div
                    key={index}
                    className="foundation-doc__text"
                    // SECURITY: Content is static from internal documentation files, safe to render.
                    dangerouslySetInnerHTML={{
                        __html: part
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/`([^`]+)`/g, '<code>$1</code>')
                            .replace(/\n\n/g, '</p><p>')
                            .replace(/\n- /g, '</p><li>')
                            .replace(/^\s*\|.*\|$/gm, (match) => {
                                return `<tr>${match.split('|').filter(Boolean).map(cell =>
                                    `<td>${cell.trim()}</td>`
                                ).join('')}</tr>`;
                            })
                    }}
                />
            );
        });
    };

    return (
        <div className="foundation-doc">
            {/* Header */}
            <header className="foundation-doc__header">
                <Text as="p" category="body" size="l" className="foundation-doc__description">{doc.description}</Text>
            </header>

            {/* Custom Component (if provided) */}
            {doc.component && (
                <div className="foundation-doc__custom-component">
                    {React.createElement(doc.component)}
                </div>
            )}

            {/* Table of Contents - Only if sections exist */}
            {doc.sections.length > 0 && (
                <nav className="foundation-doc__toc">
                    <Text as="h2" category="title" size="m" weight="bold" className="foundation-doc__toc-title">On this page</Text>
                    <ul className="foundation-doc__toc-list">
                        {doc.sections.map((section) => (
                            <li key={section.id}>
                                <a href={`#${section.id}`}>{section.title}</a>
                                {section.subsections && (
                                    <ul>
                                        {section.subsections.map((sub) => (
                                            <li key={sub.id}>
                                                <a href={`#${sub.id}`}>{sub.title}</a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                        {(doc.dos || doc.donts) && (
                            <li><a href="#best-practices">Best Practices</a></li>
                        )}
                    </ul>
                </nav>
            )}

            {/* Sections */}
            {doc.sections.length > 0 && (
                <div className="foundation-doc__content">
                    {doc.sections.map((section) => (
                        <section key={section.id} id={section.id} className="foundation-doc__section">
                            <Text as="h2" category="title" size="2xl" weight="bold" className="foundation-doc__section-title">{section.title}</Text>
                            <div className="foundation-doc__section-content">
                                {renderContent(section.content)}
                            </div>

                            {/* Demo slot */}
                            {demos?.[section.id] && (
                                <div className="foundation-doc__demo">
                                    {(() => {
                                        const Demo = demos[section.id];
                                        return React.isValidElement(Demo) ? Demo : React.createElement(Demo as React.ElementType);
                                    })()}
                                </div>
                            )}

                            {/* Subsections */}
                            {section.subsections?.map((sub) => (
                                <div key={sub.id} id={sub.id} className="foundation-doc__subsection">
                                    <Text as="h3" category="title" size="xl" weight="bold" className="foundation-doc__subsection-title">{sub.title}</Text>
                                    <div className="foundation-doc__subsection-content">
                                        {renderContent(sub.content)}
                                    </div>
                                </div>
                            ))}
                        </section>
                    ))}

                    {/* Do / Don'ts Section */}
                    {((doc.dos && doc.dos.length > 0) || (doc.donts && doc.donts.length > 0)) && (
                        <section id="best-practices" className="foundation-doc__section mt-12 pt-8 border-t border-neutral-200">
                            <Text as="h2" category="title" size="2xl" weight="bold" className="foundation-doc__section-title mb-8">Best Practices</Text>
                            <Guidance
                                positive={doc.dos && doc.dos.length > 0 ? {
                                    title: 'Do',
                                    items: doc.dos
                                } : undefined}
                                negative={doc.donts && doc.donts.length > 0 ? {
                                    title: "Don't",
                                    items: doc.donts
                                } : undefined}
                            />
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};

FoundationDocPage.displayName = 'FoundationDocPage';

export default FoundationDocPage;
