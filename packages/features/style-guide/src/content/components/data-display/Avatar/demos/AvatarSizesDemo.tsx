/**
 * Avatar Sizes Demo
 */
import { Avatar } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Avatar size="xs" name="User" />
<Avatar size="s" name="User" />
<Avatar size="m" name="User" />
<Avatar size="l" name="User" />
<Avatar size="xl" name="User" />`;

const AvatarSizesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Avatar Sizes" description="Size variants from xs to xl">
        <div className="demo-row demo-row--align-center">
            <Avatar size="xs" name="John Doe" />
            <Avatar size="s" name="John Doe" />
            <Avatar size="m" name="John Doe" />
            <Avatar size="l" name="John Doe" />
            <Avatar size="xl" name="John Doe" />
        </div>
    </DemoCard>
);

export default AvatarSizesDemo;
