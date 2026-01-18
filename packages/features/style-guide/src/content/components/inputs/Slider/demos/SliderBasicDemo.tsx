/**
 * Slider Basic Demo
 */
import { Slider } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Slider min={0} max={100} defaultValue={50} />
<Slider min={0} max={100} defaultValue={75} showValue />`;

const SliderBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Slider" description="Basic slider with value">
        <div className="demo-stack" style={{ maxWidth: 300 }}>
            <Slider min={0} max={100} defaultValue={50} />
            <Slider min={0} max={100} defaultValue={75} showValue />
        </div>
    </DemoCard>
);

export default SliderBasicDemo;
