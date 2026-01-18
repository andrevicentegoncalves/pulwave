/**
 * Icon Basic Demo
 */
import { Icon } from '@ui';
import { Zap, Heart, Settings } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Icon icon={Zap} />
<Icon icon={Heart} color="red" />
<Icon icon={Settings} size="l" />`;

const IconBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Icon" description="Icon wrapper usage">
        <div className="demo-row">
            <Icon icon={Zap} />
            <Icon icon={Heart} color="red" />
            <Icon icon={Settings} size="l" />
        </div>
    </DemoCard>
);

export default IconBasicDemo;
