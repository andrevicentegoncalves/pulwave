/**
 * Tag Basic Demo
 * Shows Tag variants and colors
 */
import { Tag } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import { Star, Bookmark, Zap } from '@ui';

const codeUsage = `import { Tag } from '@ui';

<Tag color="neutral">Neutral</Tag>
<Tag color="primary">Primary</Tag>
<Tag color="success">Success</Tag>
<Tag color="warning">Warning</Tag>
<Tag color="error">Error</Tag>
<Tag color="info">Info</Tag>`;

const TagBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Tag Variants"
        description="Tags in different colors and variants"
    >
        <>
            <Tag color="neutral">Neutral</Tag>
            <Tag color="primary">Primary</Tag>
            <Tag color="success">Success</Tag>
            <Tag color="warning">Warning</Tag>
            <Tag color="error">Error</Tag>
            <Tag color="info">Info</Tag>
        </>
    </DemoCard>
);

export default TagBasicDemo;
