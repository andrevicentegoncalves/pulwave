import { DemoCard } from '@pulwave/features-style-guide';
import { Text } from "@pulwave/ui";
import type { IconComponent } from '@pulwave/ui/icon-library';
import * as LucideIcons from "@pulwave/ui";
import './styles/_index.scss';

type IconLibrary = Record<string, IconComponent> & { default?: Record<string, IconComponent> };

const strokeCode = `// Stroke Width Options
import { Settings } from "@pulwave/ui";

<Settings size={24} strokeWidth={1} />   // Thin
<Settings size={24} strokeWidth={1.5} /> // Regular
<Settings size={24} strokeWidth={2} />   // Medium (default)
<Settings size={24} strokeWidth={2.5} /> // Bold`;

const strokeWidths = [
    { value: 1, label: 'Thin (1px)', isDefault: false },
    { value: 1.5, label: 'Regular (1.5px)', isDefault: false },
    { value: 2, label: 'Medium (2px)', isDefault: true },
    { value: 2.5, label: 'Bold (2.5px)', isDefault: false },
];

export const IconStrokeWidthDemo = () => {
    const icons = LucideIcons as IconLibrary;
    const SettingsIcon = icons.Settings || icons.default?.Settings;

    if (!SettingsIcon) return <div>Icon library unavailable</div>;

    return (
        <DemoCard sourceCode={strokeCode} showSourceToggle={true} title="Stroke Width" description="Adjust stroke weight for different visual emphasis.">
            {() => (
                <div className="iconography-demo__scale-grid">
                    {strokeWidths.map(({ value, label, isDefault }) => (
                        <div key={value} className="iconography-demo__scale-item">
                            <div className="iconography-demo__scale-box">
                                <SettingsIcon size={32} strokeWidth={value} color="var(--color-brand-primary)" />
                            </div>
                            <Text as="p" variant="body-s" align="center" className="iconography-demo__scale-label">
                                {label}
                            </Text>
                            {isDefault && (
                                <Text as="span" variant="caption-s" align="center" className="iconography-demo__scale-label-default">
                                    Default
                                </Text>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </DemoCard>
    );
};
IconStrokeWidthDemo.displayName = 'IconStrokeWidthDemo';
