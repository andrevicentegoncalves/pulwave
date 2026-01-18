/**
 * Tag Removable Demo
 * Shows removable tags
 */
import { useState } from 'react';
import { Tag } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Tag } from '@ui';

// Standard removable tag
<Tag removable onRemove={handleRemove}>Tag</Tag>

// Custom variant
<Tag color="primary" variant="subtle" removable onRemove={handleRemove}>
    Filter
</Tag>`;

const TagRemovableDemo = () => {
    const [tags, setTags] = useState(['React', 'TypeScript', 'SCSS', 'Node.js']);

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const resetTags = () => {
        setTags(['React', 'TypeScript', 'SCSS', 'Node.js']);
    };

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Removable Tags"
            description="Tags that can be removed by clicking the X"
        >
            <>
                {tags.map(tag => (
                    <Tag
                        key={tag}
                        color="primary"
                        variant="subtle"
                        removable
                        onRemove={() => removeTag(tag)}
                    >
                        {tag}
                    </Tag>
                ))}
                {tags.length === 0 && (
                    <Tag color="neutral" onClick={resetTags}>
                        Click to reset
                    </Tag>
                )}
            </>
        </DemoCard>
    );
};

export default TagRemovableDemo;
