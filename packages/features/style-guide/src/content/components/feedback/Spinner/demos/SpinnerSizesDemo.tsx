/**
 * Spinner Sizes Demo
 */
import { Spinner } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import demoCode from './SpinnerSizesDemo.tsx?raw';

const SpinnerSizesDemo = () => (
    <DemoCard sourceCode={demoCode} showSourceToggle={true} title="Spinner Sizes" description="Size variants">
        <div className="demo-row">
            <Spinner size="xs" />
            <Spinner size="s" />
            <Spinner size="m" />
            <Spinner size="l" />
            <Spinner size="xl" />
        </div>
    </DemoCard>
);

export default SpinnerSizesDemo;
