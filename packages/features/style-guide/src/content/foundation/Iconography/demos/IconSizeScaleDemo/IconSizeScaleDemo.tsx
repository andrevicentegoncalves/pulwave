import { DemoCard } from '@pulwave/features-style-guide';
import { Text } from "@pulwave/ui";
import type { IconComponent } from '@pulwave/ui/icon-library';
import * as LucideIcons from "@pulwave/ui";
import './styles/_index.scss';

type IconLibrary = Record<string, IconComponent> & { default?: Record<string, IconComponent> };

const iconSizeCode = `// Icon Size Scale
// XS: 16px - Small UI elements, inline icons
// S: 20px - Buttons, input fields
// M: 24px - Default, most common usage
// L: 32px - Prominent actions, headers
// XL: 40px - Large displays, hero sections
// 2XL: 48px - Feature icons, splash screens

import { Home } from "@pulwave/ui";

<Home size={16} /> // XS
<Home size={20} /> // S  
<Home size={24} /> // M (default)
<Home size={32} /> // L
<Home size={40} /> // XL
<Home size={48} /> // 2XL`;

const iconSizes = [
    { token: 'XS', size: 16, label: 'XS (16px)', isDefault: false },
    { token: 'S', size: 20, label: 'S (20px)', isDefault: false },
    { token: 'M', size: 24, label: 'M (24px)', isDefault: true },
    { token: 'L', size: 32, label: 'L (32px)', isDefault: false },
    { token: 'XL', size: 40, label: 'XL (40px)', isDefault: false },
    { token: '2XL', size: 48, label: '2XL (48px)', isDefault: false },
];

export const IconSizeScaleDemo = () => {
    const icons = LucideIcons as IconLibrary;
    const HomeIcon = icons.Home || icons.default?.Home;

    if (!HomeIcon) return <div>Icon library unavailable</div>;

    return (
        <DemoCard sourceCode={iconSizeCode} showSourceToggle={true} title="Icon Size Scale" description="Icon sizing tokens from XS (12px) to XXL (48px).">
            {() => (
                <div className="iconography-demo__scale-grid">
                    {iconSizes.map(({ token, size, label, isDefault }) => (
                        <div key={token} className="iconography-demo__scale-item">
                            <div className="iconography-demo__scale-box">
                                <HomeIcon size={size} color="var(--color-brand-primary)" />
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
IconSizeScaleDemo.displayName = 'IconSizeScaleDemo';
