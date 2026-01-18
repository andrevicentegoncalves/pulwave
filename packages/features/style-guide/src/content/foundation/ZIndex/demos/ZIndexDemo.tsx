/**
 * Z-Index Demo - Layer visualization with tooltips
 */
import { DemoCard } from '@pulwave/features-style-guide';
import { Tooltip, Button, Card, Text } from "@pulwave/ui";
import '../../FoundationMiscDemos.scss';

const codeUsage = `// Usage of z-index tokens
// CSS Variables:
// --z-index-base (0)
// --z-index-dropdown (100)
// --z-index-sticky (200)
// --z-index-fixed (300)
// --z-index-drawer (400)
// --z-index-modal-backdrop (500)
// --z-index-modal (600)
// --z-index-popover (700)
// --z-index-tooltip (800)
// --z-index-toast (900)

<div style={{ position: 'sticky', top: 0, zIndex: 'var(--z-index-sticky)' }}>
    Sticky Content
</div>`;

const zIndexLayers = [
    { token: '--z-index-base', value: 0, label: 'Base', color: '#6b7280' },
    { token: '--z-index-dropdown', value: 100, label: 'Dropdown', color: '#8b5cf6' },
    { token: '--z-index-sticky', value: 200, label: 'Sticky', color: '#3b82f6' },
    { token: '--z-index-fixed', value: 300, label: 'Fixed', color: '#06b6d4' },
    { token: '--z-index-drawer', value: 400, label: 'Drawer', color: '#10b981' },
    { token: '--z-index-modal-backdrop', value: 500, label: 'Modal BG', color: '#84cc16' },
    { token: '--z-index-modal', value: 600, label: 'Modal', color: '#eab308' },
    { token: '--z-index-popover', value: 700, label: 'Popover', color: '#f97316' },
    { token: '--z-index-tooltip', value: 800, label: 'Tooltip', color: '#ef4444' },
    { token: '--z-index-toast', value: 900, label: 'Toast', color: '#ec4899' },
];

export const ZIndexDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Z-Index Stacking" description="Visualizing the system's Z-index layers.">
            {() => (
                <div className="z-index-demo">
                    <Card className="z-index-demo__card" padding="none">
                        <div className="card__body z-index-demo__card-body">
                            <Text as="h4" className="z-index-demo__section-title">Sticky Content</Text>
                            <div className="z-index-demo__sticky-container">
                                <div className="z-index-demo__sticky-header">
                                    <Text>Sticky Header (z-index-sticky)</Text>
                                </div>
                                <div className="z-index-demo__content-block"><Text>Scroll content 1</Text></div>
                                <div className="z-index-demo__content-block"><Text>Scroll content 2</Text></div>
                                <div className="z-index-demo__content-block"><Text>Scroll content 3</Text></div>
                            </div>
                        </div>
                    </Card>

                    <Card className="z-index-demo__card" padding="none">
                        <div className="card__body z-index-demo__card-body">
                            <Text as="h4" className="z-index-demo__section-title">Interactive Stacking Context</Text>
                            <div className="z-index-demo__stacking-context">
                                <div className="z-index-demo__modal-mock">
                                    <div className="z-index-demo__modal-header">
                                        <Text>Modal Window (z-index-modal)</Text>
                                    </div>
                                    <div className="z-index-demo__modal-body">
                                        <Text as="p" style={{ marginBottom: 'var(--spacing-4)' }}>
                                            Dropdowns inside modals need to float above the modal content.
                                        </Text>
                                        <div className="z-index-demo__dropdown-trigger">
                                            <Button kind="secondary" variant="outlined" size="s">Open Dropdown</Button>
                                            <div className="z-index-demo__dropdown-menu">
                                                <Text>Dropdown Item (z-index-dropdown)</Text>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="z-index-demo__tooltip-trigger">
                                    <Text>Tooltip / Toast (z-index-tooltip)</Text>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </DemoCard>
    );
};

export const ZIndexScaleDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Z-Index Stacking Order" description="Hover each layer to see its CSS variable and value.">
        {() => (
            <div className="flex flex-col gap-12">
                {/* Visual Stacking */}
                <Card className="z-index-demo__card z-index-demo__visual-stacking" padding="none">
                    <div className="card__body z-index-demo__card-body">
                        <div className="absolute top-4 left-4 z-0 text-neutral-400 text-sm font-medium uppercase tracking-wider">Vertical Stacking Visualization</div>

                        <div className="relative mt-8" style={{ height: '400px', marginLeft: '5%' }}>
                            {zIndexLayers.map(({ token, value, label, color }, index) => (
                                <div
                                    key={token}
                                    style={{
                                        position: 'absolute',
                                        top: `${index * 35}px`,
                                        left: `${index * 30}px`,
                                        zIndex: value === 0 ? 1 : value,
                                        width: '200px',
                                        height: '120px',
                                        backgroundColor: color,
                                        borderRadius: 'var(--border-radius-m)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '16px',
                                        color: 'white',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        transition: 'transform 0.2s',
                                    }}
                                    className="hover:scale-105 hover:!z-[9999]"
                                    title={`z-index: ${value}`}
                                >
                                    <span className="font-bold text-lg mb-1">{label}</span>
                                    <span className="text-xs opacity-90 font-mono bg-black/20 self-start px-2 py-1 rounded">{token}</span>
                                    <span className="mt-auto text-xl font-bold self-end opacity-40">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Grid View */}
                <Card className="z-index-demo__card" padding="none">
                    <div className="card__body z-index-demo__card-body">
                        <h4 className="mb-4 font-semibold text-neutral-500 text-sm uppercase">Tokens List</h4>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 'var(--spacing-4)',
                        }}>
                            {zIndexLayers.map(({ token, value, label, color }) => (
                                <Tooltip key={token} content={`${token}: ${value}`}>
                                    <div
                                        style={{
                                            width: '100px',
                                            height: '60px',
                                            backgroundColor: color,
                                            borderRadius: 'var(--border-radius-m)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: 'var(--font-size-xs)',
                                            cursor: 'help',
                                            boxShadow: 'var(--shadow-s)',
                                        }}
                                    >
                                        <div><Text>{label}</Text></div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}><Text size="s">{value}</Text></div>
                                    </div>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        )}
    </DemoCard>
);

ZIndexScaleDemo.displayName = 'ZIndexScaleDemo';


