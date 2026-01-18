/**
 * ComponentDocPage Component
 * 
 * Enhanced documentation page layout following IBM Carbon patterns.
 * 
 * Tabs: Overview | Guidelines | Code | Accessibility
 * 
 * Complete Carbon-style sections:
 * - Live Demo (interactive playground)
 * - Accessibility Status badges
 * - When to use / When not to use
 * - Variants, States, Demos
 * - Formatting (Anatomy, Sizes, Emphasis, Alignment)
 * - Content Guidelines (Main elements, Overflow, Internationalization)
 * - Universal Behaviors (States, Interactions, Loading)
 * - Per-variant documentation with best practices
 * - Modifiers (Button with icon, Icon-only buttons)
 * - Style Tokens and Structure specs
 * - Related Components
 */
import React from 'react';
import { Check, X, ArrowRight, Keyboard, Code, Volume2, ExternalLink, BookOpen, MessageSquare, Palette, Layers, CircleDashed } from '@pulwave/ui';
import { Tabs, TabPanel, Card, Badge, DataTable, NumberedList, Text } from "@pulwave/ui";
import './styles/_index.scss';
import { Guidance } from '../Guidance/Guidance';
import { TokenTable } from '../TokenTable/TokenTable';
import { StructureSpec } from '../StructureSpec/StructureSpec';
import { AccessibilityStatusBadges, AccessibilityStatus } from '../AccessibilityStatusBadges/AccessibilityStatusBadges';
import { KeyboardShortcutTable } from '../KeyboardShortcutTable/KeyboardShortcutTable';
import { StyleGuideLink } from '../StyleGuideLink/StyleGuideLink';
import { RelatedComponentCards } from '../RelatedComponentCards/RelatedComponentCards';
import { Reference } from '../../core/types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AccessibilityData {
    keyboard?: { key: string; action: string }[];
    aria?: { attribute: string; usage: string }[];
    screenReader?: string;
    focusIndicator?: string;
    colorContrast?: { state: string; ratio: string; level: string }[];
}

// AccessibilityStatus imported

export interface WhenNotToUseItem {
    text: string;
    alternative?: string;
    link?: string;
}

export interface VariantDoc {
    name: string;
    description: string;
    bestPractices?: string[];
    image?: string;
}

export interface Modifier {
    name: string;
    description: string;
    demo?: React.ElementType;
}

export interface StyleToken {
    variant: string;
    states: {
        state: string;
        textToken: string;
        backgroundToken: string;
        borderToken?: string;
    }[];
}

export interface StructureSpec {
    part: string;
    token: string;
    value: string;
    [key: string]: unknown;
}

export interface ComponentDocProps {
    docs: {
        name: string;
        description: string;
        status?: 'stable' | 'beta' | 'deprecated' | 'experimental';
        version?: string;
        lastUpdated?: string;

        // Carbon-style: Accessibility Testing Status
        accessibilityStatus?: AccessibilityStatus;

        // Carbon-style: Live Demo (interactive component playground)
        liveDemo?: React.ElementType;

        // When to use / not use
        whenToUse?: string[];
        whenNotToUse?: (string | WhenNotToUseItem)[];

        overview?: {
            demo?: React.ElementType;
            demos?: React.ElementType[];
            description?: string;
            variants?: string[];
        };

        // Carbon-style: Formatting (anatomy, sizes, emphasis, alignment)
        formatting?: {
            anatomy?: { image?: string; parts?: { name?: string; description: string }[] };
            sizes?: { name: string; description: string; height?: string; demo?: React.ElementType }[];
            emphasis?: string;
            alignment?: string;
            buttonGroups?: string;
        };

        // Carbon-style: Content guidelines (ENHANCED)
        content?: {
            mainElements?: string;
            overflowContent?: string;
            internationalization?: string;
            furtherGuidance?: string;
        };

        // Carbon-style: Universal behaviors
        universalBehaviors?: {
            states?: string;
            interactions?: { mouse?: string; keyboard?: string };
            loading?: string;
        };

        // Carbon-style: Per-variant documentation (ENHANCED)
        variantDocs?: VariantDoc[];

        // Carbon-style: Modifiers (NEW)
        modifiers?: Modifier[];

        states?: {
            component?: React.ElementType;
            baseProps?: Record<string, unknown>;
            items?: { name: string; props?: Record<string, unknown>; description?: string }[];
        };

        props?: {
            name: string;
            type: string;
            default?: string;
            required?: boolean;
            description: string;
        }[];

        anatomy?: {
            image?: string;
            parts?: { name?: string; description: string }[];
        };

        inUse?: {
            dos?: string[];
            donts?: string[];
            examples?: { title?: string; description?: string; code?: string }[];
        };

        accessibility?: AccessibilityData;
        designRecommendations?: string[];
        developmentConsiderations?: string[];

        extensions?: {
            description?: string;
            demos?: React.ElementType[];
        };

        relatedComponents?: {
            name: string;
            description: string;
            path?: string;
        }[];

        responsiveBehavior?: {
            breakpoint: string;
            behavior: string;
        }[];

        // Carbon-style: Style Tab (NEW)
        styleTokens?: StyleToken[];
        typography?: { element: string; token: string }[];
        structure?: StructureSpec[];

        // Carbon-style: References and Feedback (ENHANCED)
        references?: Reference[];
        feedbackUrl?: string;
    };
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const statusVariants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
    stable: 'success',
    beta: 'warning',
    deprecated: 'error',
    experimental: 'info',
};

// Helpers removed (imported)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

// Helper to auto-link component names
/* const parseTextWithLinks = (text: string): React.ReactNode => {
    if (!text) return text;

    const components = Object.entries(componentRegistry)
        .map(([path, reg]) => ({ title: reg.title, path }))
        .filter(c => c.title)
        .sort((a, b) => b.title.length - a.title.length);

    if (components.length === 0) return text;

    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(${components.map(c => escapeRegExp(c.title)).join('|')})`, 'g');

    const parts = text.split(pattern);

    return (
        <>
            {parts.map((part, i) => {
                const comp = components.find(c => c.title === part);
                if (comp) {
                    return (
                        <a key={i} href={`/${comp.path}`} className="component-doc__alternative-link hover:underline">
                            {part}
                        </a>
                    );
                }
                return part;
            })}
        </>
    );
}; */

export const ComponentDocPage = ({ docs }: ComponentDocProps) => {
    if (!docs) {
        return (
            <div className="component-doc">
                <p>Select a component from the sidebar to view its documentation.</p>
            </div>
        );
    }

    const {
        name,
        description,
        status,
        version,
        lastUpdated,
        accessibilityStatus,
        liveDemo: LiveDemo,
        whenToUse,
        whenNotToUse,
        overview,
        content,
        universalBehaviors,
        variantDocs,
        modifiers,
        states,
        props,
        anatomy,
        formatting,
        inUse,
        accessibility,
        designRecommendations,
        developmentConsiderations,
        extensions,
        relatedComponents,
        responsiveBehavior,
        styleTokens,
        structure,
        references,
        feedbackUrl,
    } = docs;

    // Props table configuration
    const propsColumns = [
        { key: 'name', header: 'Property', width: 120 },
        { key: 'type', header: 'Type', width: 180, render: (value: string) => value ? <code className="component-doc__type">{value}</code> : '' },
        { key: 'default', header: 'Default', width: 100 },
        { key: 'required', header: 'Required', width: 80, render: (value: boolean) => value ? <Badge status="error" size="s">Yes</Badge> : 'No' },
        { key: 'description', header: 'Description' },
    ];

    const propsData = props?.map((prop, index) => ({
        id: `prop-${index}`,
        name: String(prop.name || ''),
        type: String(prop.type || ''),
        default: String(prop.default || '—'),
        required: prop.required,
        description: String(prop.description || ''),
    })) || [];

    // ARIA table
    const ariaColumns = [
        { key: 'attribute', header: 'Attribute', width: 160, render: (value: string) => value ? <code className="component-doc__code-inline">{value}</code> : '' },
        { key: 'usage', header: 'Usage' },
    ];

    const ariaData = accessibility?.aria?.map((item, index) => ({
        id: `aria-${index}`,
        attribute: item.attribute,
        usage: item.usage,
    })) || [];

    return (
        <div className="component-doc">
            {/* Header with description, status, version */}
            <div className="component-doc__header">
                <Text
                    as="p"
                    category="body"
                    size="l"
                    className="component-doc__description"
                >
                    {description}
                </Text>
                <div className="component-doc__meta">
                    {status && (
                        <Badge status={statusVariants[status] || 'neutral'} size="s">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    )}
                    {version && (
                        <Text as="span" size="s" color="muted" className="component-doc__version">v{version}</Text>
                    )}
                    {lastUpdated && (
                        <Text as="span" size="s" color="muted" className="component-doc__last-updated">Updated {lastUpdated}</Text>
                    )}
                </div>
            </div>

            {/* Live Demo Section (Carbon-style) */}
            {
                LiveDemo && (
                    <section className="component-doc__live-demo">
                        <Text
                            as="h2"
                            category="title"
                            size="xl"
                            weight="bold"
                            className="component-doc__section-title"
                        >
                            Live Demo
                        </Text>
                        <div className="component-doc__live-demo-container">
                            <LiveDemo />
                        </div>
                    </section>
                )
            }

            {/* Accessibility Testing Status (Carbon-style) */}
            {accessibilityStatus && <AccessibilityStatusBadges status={accessibilityStatus} />}

            <Tabs defaultTab={0}>
                {/* ================================================================
                    OVERVIEW TAB
                ================================================================ */}
                <TabPanel label="Overview">
                    <div className="component-doc__section">
                        {(whenToUse?.length || whenNotToUse?.length) && (
                            <div className="component-doc__when-to-use-wrapper mb-8">
                                <Guidance
                                    positive={whenToUse && whenToUse.length > 0 ? {
                                        title: 'When to use',
                                        items: whenToUse
                                    } : undefined}
                                    negative={whenNotToUse && whenNotToUse.length > 0 ? {
                                        title: 'When not to use',
                                        items: whenNotToUse.map(item => {
                                            if (typeof item === 'string') return item;

                                            // Auto-link alternative text if it's a string and no explicit link
                                            const linkedAlternative = !item.link && typeof item.alternative === 'string'
                                                ? <StyleGuideLink text={item.alternative} />
                                                : item.alternative;

                                            return {
                                                text: item.text,
                                                alternative: linkedAlternative,
                                                link: item.link
                                            };
                                        })
                                    } : undefined}
                                />
                            </div>
                        )}

                        {
                            overview?.description && (
                                <p className="component-doc__overview-text">{overview.description}</p>
                            )
                        }

                        {
                            overview?.variants && (
                                <div className="component-doc__variants">
                                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">Variants</Text>
                                    <div className="component-doc__variant-list">
                                        {overview.variants.map((variant) => (
                                            <Badge key={variant} status="neutral" size="s">{variant}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )
                        }

                        {/* States Demo */}
                        {
                            states?.component && states?.items && states.items.length > 0 && (
                                <div className="component-doc__states">
                                    <Text as="h3" category="title" size="m" className="component-doc__subtitle">States</Text>
                                    <div className="component-doc__states-grid">
                                        {states.items.map((state) => (
                                            <div key={state.name} className="component-doc__state-item">
                                                <div className="component-doc__state-preview">
                                                    {React.createElement(states.component as React.ElementType, {
                                                        ...states.baseProps,
                                                        ...state.props,
                                                    })}
                                                </div>
                                                <Text as="span" category="label" size="m" className="component-doc__state-label">{state.name}</Text>
                                                {state.description && (
                                                    <Text as="span" category="body" size="s" className="component-doc__state-description">{state.description}</Text>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }


                        {/* Demos are now rendered outside tabs via StyleGuideApp */}
                    </div >
                </TabPanel >

                {/* ================================================================
                    GUIDELINES TAB
                ================================================================ */}
                < TabPanel label="Guidelines" >
                    <div className="component-doc__section">
                        {/* Formatting: Anatomy */}
                        {(anatomy?.image || anatomy?.parts || formatting?.anatomy) && (
                            <div className="component-doc__formatting-section">
                                <Text as="h2" category="title" size="l" className="component-doc__section-title">Formatting</Text>

                                {/* Anatomy Image */}
                                {(anatomy?.image || formatting?.anatomy?.image) && (
                                    <div className="component-doc__anatomy-image">
                                        <Text as="h3" category="title" size="m" className="component-doc__subtitle">Anatomy</Text>
                                        <img src={anatomy?.image || formatting?.anatomy?.image} alt={`${name} anatomy`} width={800} height={400} />
                                    </div>
                                )}

                                {/* Anatomy Parts */}
                                {(anatomy?.parts || formatting?.anatomy?.parts) && (
                                    <div className="component-doc__anatomy-parts">
                                        <Text as="h3" category="title" size="m" className="component-doc__subtitle">Component Parts</Text>
                                        <NumberedList items={anatomy?.parts || formatting?.anatomy?.parts || []} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Formatting: Sizes */}
                        {formatting?.sizes && formatting.sizes.length > 0 && (
                            <div className="component-doc__sizes">
                                <Text as="h3" category="title" size="m" className="component-doc__subtitle">Sizes</Text>
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

                        {/* Formatting: Emphasis & Alignment */}
                        {(formatting?.emphasis || formatting?.alignment) && (
                            <div className="component-doc__formatting-text">
                                {formatting.emphasis && (
                                    <div className="component-doc__emphasis">
                                        <Text as="h3" category="title" size="m" className="component-doc__subtitle">Emphasis</Text>
                                        <Text as="p" category="body" size="m">{formatting.emphasis}</Text>
                                    </div>
                                )}
                                {formatting.alignment && (
                                    <div className="component-doc__alignment">
                                        <Text as="h3" category="title" size="m" className="component-doc__subtitle">Alignment</Text>
                                        <Text as="p" category="body" size="m">{formatting.alignment}</Text>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Content Guidelines (Carbon-style) */}
                        {content && (content.mainElements || content.overflowContent || content.internationalization) && (
                            <div className="component-doc__content-guidelines">
                                <Text as="h2" category="title" size="l" className="component-doc__section-title">
                                    <BookOpen size={20} aria-hidden="true" />
                                    Content Guidelines
                                </Text>
                                {content.mainElements && (
                                    <div className="component-doc__content-item">
                                        <Text as="h3" category="title" size="m" className="component-doc__subtitle">Main Elements</Text>
                                        <Text as="p" category="body" size="m">{content.mainElements}</Text>
                                    </div>
                                )}
                                {content.overflowContent && (
                                    <div className="component-doc__content-item">
                                        <Text as="h3" category="title" size="m" className="component-doc__subtitle">Overflow Content</Text>
                                        <Text as="p" category="body" size="m">{content.overflowContent}</Text>
                                    </div>
                                )}
                                {content.internationalization && (
                                    <div className="component-doc__content-item">
                                        <Text as="h3" category="title" size="m" className="component-doc__subtitle">Internationalization (RTL)</Text>
                                        <Text as="p" category="body" size="m">{content.internationalization}</Text>
                                    </div>
                                )}
                                {content.furtherGuidance && (
                                    <Text as="p" category="body" size="m" className="component-doc__further-guidance">{content.furtherGuidance}</Text>
                                )}
                            </div>
                        )}

                        {/* Universal Behaviors (Carbon-style) */}
                        {universalBehaviors && (
                            <div className="component-doc__behaviors">
                                <Text as="h2" category="title" size="l" className="component-doc__section-title">Universal Behaviors</Text>
                                {universalBehaviors.states && (
                                    <div className="component-doc__behavior-item">
                                        <Text as="h3" category="title" size="m" className="component-doc__subtitle">States</Text>
                                        <Text as="p" category="body" size="m">{universalBehaviors.states}</Text>
                                    </div>
                                )}
                                {universalBehaviors.interactions && (
                                    <div className="component-doc__behavior-item">
                                        <Text as="h3" category="title" size="m" className="component-doc__subtitle">Interactions</Text>
                                        {universalBehaviors.interactions.mouse && (
                                            <Text as="p" category="body" size="m"><strong>Mouse:</strong> {universalBehaviors.interactions.mouse}</Text>
                                        )}
                                        {universalBehaviors.interactions.keyboard && (
                                            <Text as="p" category="body" size="m"><strong>Keyboard:</strong> {universalBehaviors.interactions.keyboard}</Text>
                                        )}
                                    </div>
                                )}
                                {universalBehaviors.loading && (
                                    <div className="component-doc__behavior-item">
                                        <Text as="h3" category="title" size="m" className="component-doc__subtitle">Loading</Text>
                                        <Text as="p" category="body" size="m">{universalBehaviors.loading}</Text>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Per-Variant Documentation (Carbon-style) */}
                        {variantDocs && variantDocs.length > 0 && (
                            <div className="component-doc__variant-docs">
                                <h2 className="component-doc__section-title">
                                    <Layers size={20} aria-hidden="true" />
                                    Variant Documentation
                                </h2>
                                {variantDocs.map((variant, idx) => (
                                    <div key={idx} className="component-doc__variant-doc">
                                        <h3 className="component-doc__subtitle">{variant.name}</h3>
                                        <p>{variant.description}</p>
                                        {variant.bestPractices && variant.bestPractices.length > 0 && (
                                            <div className="component-doc__best-practices">
                                                <h4>Best Practices</h4>
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
                        )}

                        {/* Modifiers (Carbon-style - NEW) */}
                        {modifiers && modifiers.length > 0 && (
                            <div className="component-doc__modifiers">
                                <h2 className="component-doc__section-title">Modifiers</h2>
                                {modifiers.map((modifier, idx) => (
                                    <div key={idx} className="component-doc__modifier">
                                        <h3 className="component-doc__subtitle">{modifier.name}</h3>
                                        <p>{modifier.description}</p>
                                        {modifier.demo && <modifier.demo />}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Do / Don't */}
                        {((inUse?.dos && inUse.dos.length > 0) || (inUse?.donts && inUse.donts.length > 0)) && (
                            <div className="component-doc__usage-block">
                                <Guidance
                                    positive={inUse.dos && inUse.dos.length > 0 ? {
                                        title: 'Do',
                                        items: inUse.dos
                                    } : undefined}
                                    negative={inUse.donts && inUse.donts.length > 0 ? {
                                        title: "Don't",
                                        items: inUse.donts
                                    } : undefined}
                                />
                            </div>
                        )}

                        {/* Responsive Behavior */}
                        {responsiveBehavior && responsiveBehavior.length > 0 && (
                            <div className="component-doc__responsive">
                                <h3 className="component-doc__subtitle">Responsive Behavior</h3>
                                <div className="component-doc__responsive-list">
                                    {responsiveBehavior.map((item, index) => (
                                        <div key={index} className="component-doc__responsive-item">
                                            <span className="component-doc__responsive-breakpoint">{item.breakpoint}</span>
                                            <span className="component-doc__responsive-behavior">{item.behavior}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Components */}
                        {relatedComponents && relatedComponents.length > 0 && (
                            <div className="component-doc__related">
                                <h3 className="component-doc__subtitle">Related Components</h3>
                                <RelatedComponentCards
                                    components={relatedComponents.map(c => {
                                        const cleanPath = c.path?.startsWith('/') ? c.path.slice(1) : c.path;
                                        return {
                                            ...c,
                                            href: cleanPath ? `#${cleanPath}` : undefined,
                                            onClick: cleanPath ? (e: any) => {
                                                if (e?.preventDefault) e.preventDefault();
                                                window.dispatchEvent(new CustomEvent('style-guide-navigate', {
                                                    detail: { path: cleanPath }
                                                }));
                                            } : undefined
                                        };
                                    })}
                                />
                            </div>
                        )}

                        {/* Empty state */}
                        {(!anatomy && !formatting && !content && !universalBehaviors && !variantDocs && !modifiers && !inUse?.dos && !inUse?.donts && !relatedComponents && !responsiveBehavior) && (
                            <p className="text-muted">Guidelines documentation coming soon.</p>
                        )}
                    </div>
                </TabPanel >

                {/* ================================================================
                    CODE TAB
                ================================================================ */}
                < TabPanel label="Code" >
                    <div className="component-doc__section">
                        <h3 className="component-doc__subtitle">Props</h3>
                        {propsData.length > 0 ? (
                            <DataTable columns={propsColumns} data={propsData} className="component-doc__data-table" />
                        ) : (
                            <p>No props defined for this component.</p>
                        )}

                        {/* Style Tokens (Carbon-style - NEW) */}
                        {styleTokens && styleTokens.length > 0 && (
                            <div className="component-doc__style-tokens">
                                <h2 className="component-doc__section-title">
                                    <Palette size={20} aria-hidden="true" />
                                    Style Tokens
                                </h2>
                                <TokenTable tokens={styleTokens} />
                            </div>
                        )}

                        {/* Structure Specs (Carbon-style - NEW) */}
                        {structure && structure.length > 0 && (
                            <div className="component-doc__structure">
                                <h3 className="component-doc__subtitle">Structure</h3>
                                <StructureSpec specs={structure} />
                            </div>
                        )}

                        {/* Code Examples */}
                        {inUse?.examples && inUse.examples.length > 0 && (
                            <div className="component-doc__examples">
                                <h3 className="component-doc__subtitle">Examples</h3>
                                {inUse.examples.map((example, index) => (
                                    <Card key={index} className="component-doc__example-card">
                                        <h4>{example.title}</h4>
                                        <p>{example.description}</p>
                                        {example.code && (
                                            <pre className="component-doc__code"><code>{example.code}</code></pre>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </TabPanel >

                {/* ================================================================
                    ACCESSIBILITY TAB
                ================================================================ */}
                < TabPanel label="Accessibility" >
                    <div className="component-doc__section">
                        {accessibility ? (
                            <div className="component-doc__accessibility">
                                {/* Keyboard Navigation */}
                                {accessibility.keyboard && accessibility.keyboard.length > 0 && (
                                    <section className="component-doc__a11y-section">
                                        <h3 className="component-doc__subtitle">
                                            <Keyboard size={18} aria-hidden="true" />
                                            Keyboard Navigation
                                        </h3>
                                        <KeyboardShortcutTable shortcuts={accessibility.keyboard} />
                                    </section>
                                )}

                                {/* ARIA Attributes */}
                                {ariaData.length > 0 && (
                                    <section className="component-doc__a11y-section">
                                        <h3 className="component-doc__subtitle">
                                            <Code size={18} aria-hidden="true" />
                                            ARIA Attributes
                                        </h3>
                                        <DataTable columns={ariaColumns} data={ariaData} className="component-doc__a11y-table" />
                                    </section>
                                )}

                                {/* Screen Reader */}
                                {accessibility.screenReader && (
                                    <section className="component-doc__a11y-section">
                                        <h3 className="component-doc__subtitle">
                                            <Volume2 size={18} aria-hidden="true" />
                                            Screen Reader Behavior
                                        </h3>
                                        <p className="component-doc__a11y-text">{accessibility.screenReader}</p>
                                    </section>
                                )}

                                {/* Focus Indicator */}
                                {accessibility.focusIndicator && (
                                    <section className="component-doc__a11y-section">
                                        <h3 className="component-doc__subtitle">Focus Indicator</h3>
                                        <p className="component-doc__a11y-text">{accessibility.focusIndicator}</p>
                                    </section>
                                )}

                                {/* Design Recommendations (Carbon-style - NEW) */}
                                {designRecommendations && designRecommendations.length > 0 && (
                                    <section className="component-doc__a11y-section">
                                        <h3 className="component-doc__subtitle">Design Recommendations</h3>
                                        <ul className="component-doc__recommendations">
                                            {designRecommendations.map((rec, idx) => (
                                                <li key={idx}>{rec}</li>
                                            ))}
                                        </ul>
                                    </section>
                                )}

                                {/* Development Considerations (Carbon-style - NEW) */}
                                {developmentConsiderations && developmentConsiderations.length > 0 && (
                                    <section className="component-doc__a11y-section">
                                        <h3 className="component-doc__subtitle">Development Considerations</h3>
                                        <ul className="component-doc__considerations">
                                            {developmentConsiderations.map((con, idx) => (
                                                <li key={idx}>{con}</li>
                                            ))}
                                        </ul>
                                    </section>
                                )}
                            </div>
                        ) : (
                            <p className="text-muted">Accessibility documentation coming soon.</p>
                        )}
                    </div>
                </TabPanel >
            </Tabs >

            {/* ================================================================
                FOOTER SECTIONS (Carbon-style)
            ================================================================ */}

            {/* References Section */}
            {
                references && references.length > 0 && (
                    <section className="component-doc__references">
                        <h2 className="component-doc__section-title">
                            <ExternalLink size={20} aria-hidden="true" />
                            References
                        </h2>
                        <ul className="component-doc__references-list">
                            {references.map((ref, idx) => (
                                <li key={idx}>
                                    <a href={ref.url} target="_blank" rel="noopener noreferrer">
                                        {ref.title}
                                    </a>
                                    {ref.author && <span className="component-doc__ref-author"> — {ref.author}</span>}
                                    {ref.source && <span className="component-doc__ref-source"> ({ref.source})</span>}
                                </li>
                            ))}
                        </ul>
                    </section>
                )
            }

            {/* Feedback Section */}
            {
                feedbackUrl && (
                    <section className="component-doc__feedback">
                        <h2 className="component-doc__section-title">
                            <MessageSquare size={20} aria-hidden="true" />
                            Feedback
                        </h2>
                        <p>
                            Have feedback on {name}?{' '}
                            <a href={feedbackUrl} target="_blank" rel="noopener noreferrer">
                                Submit an issue or proposal on GitHub
                            </a>
                            .
                        </p>
                    </section>
                )
            }
        </div >
    );
};

ComponentDocPage.displayName = 'ComponentDocPage';
