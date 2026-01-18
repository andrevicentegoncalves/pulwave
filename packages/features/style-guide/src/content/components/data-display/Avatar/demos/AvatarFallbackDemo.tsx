/**
 * Avatar Fallback Demo
 */
import { Avatar } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Avatar src="url" alt="User" />
<Avatar initials="JD" />
<Avatar name="Jane Smith" />
<Avatar />`;

const AvatarFallbackDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Avatar Fallbacks" description="Image, initials, and icon fallbacks">
        <div className="demo-row demo-row--align-center">
            <Avatar src="https://i.pravatar.cc/150?u=1" alt="User with image" />
            <Avatar initials="JD" />
            <Avatar name="Jane Smith" />
            <Avatar />
        </div>
    </DemoCard>
);

export default AvatarFallbackDemo;
