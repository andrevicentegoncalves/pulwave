import { Stepper } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Stepper
    activeStep={1}
    steps={[
        { id: '1', title: 'Account', description: 'Create account' },
        { id: '2', title: 'Profile', description: 'Setup profile' },
        { id: '3', title: 'Review', description: 'Review details' },
        { id: '4', title: 'Complete', description: 'Finish setup' },
    ]}
/>`;

const StepperDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Stepper" description="Multi-step progress indicator">
        <Stepper
            activeStep={1}
            steps={[
                { id: '1', title: 'Account', description: 'Create account' },
                { id: '2', title: 'Profile', description: 'Setup profile' },
                { id: '3', title: 'Review', description: 'Review details' },
                { id: '4', title: 'Complete', description: 'Finish setup' },
            ]}
        />
    </DemoCard>
);

export default StepperDemo;
