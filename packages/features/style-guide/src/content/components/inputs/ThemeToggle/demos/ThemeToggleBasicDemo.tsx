import { useState } from 'react';
import { ThemeToggle, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<ThemeToggle
    isDark={isDark}
    onToggle={handleToggle}
/>`;

const ThemeToggleBasicDemo = () => {
    const [isDark, setIsDark] = useState(false);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Theme Toggle" description="Click to switch theme">
            <div style={{ padding: '20px', background: isDark ? '#1a1a1a' : '#ffffff', borderRadius: '8px', border: '1px solid #ddd' }}>
                <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
                <Text style={{ marginTop: '10px', color: isDark ? '#fff' : '#000' }}>
                    Current theme: <Text as="strong" weight="bold">{isDark ? 'Dark' : 'Light'}</Text>
                </Text>
            </div>
        </DemoCard>
    );
};

export default ThemeToggleBasicDemo;
