import { Button } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import { ButtonKind, ButtonVariant } from '@ui/components/Button/types';

const demoCode = `import { Button } from '@ui';

// Available kinds: primary, secondary, tertiary, neutral, 
// success, warning, error, info, critical, urgent, 
// promotion, premium, discovery, maintenance, growth

// Available variants: filled, outlined, ghost, soft, link

// Brand buttons
<Button kind="primary" variant="filled">Primary Filled</Button>
<Button kind="secondary" variant="outlined">Secondary Outlined</Button>
<Button kind="tertiary" variant="ghost">Tertiary Ghost</Button>

// Semantic/Functional buttons
<Button kind="success" variant="soft">Success Soft</Button>
<Button kind="error" variant="filled">Error Filled</Button>

// All Button props:
// - kind: semantic color intent
// - variant: visual style (filled/outlined/ghost/soft/link)
// - size: 'xs' | 's' | 'm' | 'l' | 'xl'
// - shape: 'default' | 'round' | 'square'
// - disabled: boolean
// - loading: boolean
// - fullWidth: boolean
// - leftIcon / rightIcon: ReactNode`;

export const ButtonMatrixDemo = () => {
    const brandKinds: ButtonKind[] = ['primary', 'secondary', 'tertiary'];
    const neutralKinds: ButtonKind[] = ['neutral'];
    const functionalKinds: ButtonKind[] = [
        'success', 'warning', 'error', 'info',
        'critical', 'urgent',
        'promotion', 'premium', 'discovery', 'maintenance', 'growth'
    ];

    // Ensure 'ghost' is clearly visible as a column
    const variants: ButtonVariant[] = ['filled', 'outlined', 'ghost', 'soft', 'link'];

    const renderTable = (title: string, kinds: ButtonKind[], description?: string) => (
        <div className="mb-10">
            <h4 className="mb-2">{title}</h4>
            {description && <p className="mb-4 text-s text-secondary">{description}</p>}
            <div className="overflow-x-auto">
                <table style={{ borderSpacing: '8px', borderCollapse: 'separate', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', minWidth: '100px', paddingBottom: '16px' }}>Kind</th>
                            {variants.map(v => (
                                <th key={v} style={{ textTransform: 'capitalize', textAlign: 'center', minWidth: '100px', paddingBottom: '16px' }}>{v}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {kinds.map(kind => (
                            <tr key={kind}>
                                <td style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{kind}</td>
                                {variants.map(variant => (
                                    <td key={variant} style={{ textAlign: 'center' }}>
                                        <Button kind={kind} variant={variant}>
                                            Button
                                        </Button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <DemoCard
            title="Button Variants"
            description="Comprehensive view of all button kinds versus valid visual variants."
            sourceCode={demoCode}
            showSourceToggle={true}
        >
            <div className="button-demo">
                {renderTable('Brand Colors', brandKinds, 'Core brand identity colors.')}
                {renderTable('Neutral', neutralKinds, 'Grayscale buttons for less emphasis. Includes Ghost variant.')}
                {renderTable('Functional Colors', functionalKinds, 'Semantic colors for feedback, status, and features.')}
            </div>
        </DemoCard>
    );
};
