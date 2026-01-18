import { Form, FormActions, Button } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const FormActionsDemo = () => {
    return (
        <DemoCard
            title="Actions Alignment"
            description="FormActions supports left, center, right, and space-between alignment."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <FormActions align="left">
                    <Button kind="secondary">Cancel</Button>
                    <Button>Save (Left)</Button>
                </FormActions>
                <FormActions align="center">
                    <Button kind="secondary">Cancel</Button>
                    <Button>Save (Center)</Button>
                </FormActions>
                <FormActions align="right">
                    <Button kind="secondary">Cancel</Button>
                    <Button>Save (Right)</Button>
                </FormActions>
                <FormActions align="space-between">
                    <Button kind="secondary">Cancel</Button>
                    <Button>Save (Space Between)</Button>
                </FormActions>
            </div>
        </DemoCard>
    );
};
export default FormActionsDemo;
