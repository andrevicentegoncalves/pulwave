/**
 * Icon Only Buttons Demo
 * Shows circular icon-only buttons
 */
import { Button } from '@ui';
import { Plus, Settings, Trash2, Edit, Search, Check, AlertTriangle, Info, Bell, Star, Heart, Share, X, AlertOctagon, TrendingUp, Wrench, Compass, Crown, Zap } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Button } from '@ui';
import { Plus, Settings, Trash2, Check } from '@ui';

// Icon-only buttons REQUIRE aria-label for accessibility
// Use shape="circle" for circular buttons

// Filled (default variant)
<Button kind="primary" shape="circle" aria-label="Add">
    <Plus size={20} />
</Button>
<Button kind="success" shape="circle" aria-label="Confirm">
    <Check size={20} />
</Button>
<Button kind="error" shape="circle" aria-label="Delete">
    <Trash2 size={20} />
</Button>

// Outlined variant
<Button kind="primary" variant="outlined" shape="circle" aria-label="Add">
    <Plus size={20} />
</Button>

// Ghost variant (minimal visual presence)
<Button kind="neutral" variant="ghost" shape="circle" aria-label="Settings">
    <Settings size={20} />
</Button>

// Available kinds: primary, secondary, tertiary, neutral,
// success, warning, error, info, critical, urgent,
// promotion, premium, discovery, maintenance, growth`;

const IconOnlyButtonsDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="Icon Only Buttons"
        description="Circular buttons with icons only. Requires aria-label for accessibility."
    >
        <div className="flex flex-col gap-12">
            <div>
                <h4 className="mb-2 text-sm text-on-surface-subtle">Solid (Filled)</h4>
                <div className="flex flex-wrap items-center gap-4">
                    <Button kind="primary" shape="circle" aria-label="Add"><Plus size={20} /></Button>
                    <Button kind="secondary" shape="circle" aria-label="Settings"><Settings size={20} /></Button>
                    <Button kind="success" shape="circle" aria-label="Confirm"><Check size={20} /></Button>
                    <Button kind="warning" shape="circle" aria-label="Warning"><AlertTriangle size={20} /></Button>
                    <Button kind="error" shape="circle" aria-label="Delete"><Trash2 size={20} /></Button>
                    <Button kind="info" shape="circle" aria-label="Info"><Info size={20} /></Button>
                    <Button kind="neutral" shape="circle" aria-label="Notifications"><Bell size={20} /></Button>
                    <Button kind="promotion" shape="circle" aria-label="Favorite"><Star size={20} /></Button>
                    <Button kind="critical" shape="circle" aria-label="Critical"><AlertOctagon size={20} /></Button>
                    <Button kind="growth" shape="circle" aria-label="Growth"><TrendingUp size={20} /></Button>
                    <Button kind="maintenance" shape="circle" aria-label="Maintenance"><Wrench size={20} /></Button>
                    <Button kind="discovery" shape="circle" aria-label="Discovery"><Compass size={20} /></Button>
                    <Button kind="premium" shape="circle" aria-label="Premium"><Crown size={20} /></Button>
                    <Button kind="urgent" shape="circle" aria-label="Urgent"><Zap size={20} /></Button>
                </div>
            </div>

            <div>
                <h4 className="mb-2 text-sm text-on-surface-subtle">Outlined</h4>
                <div className="flex flex-wrap items-center gap-4">
                    <Button kind="primary" variant="outlined" shape="circle" aria-label="Add"><Plus size={20} /></Button>
                    <Button kind="secondary" variant="outlined" shape="circle" aria-label="Settings"><Settings size={20} /></Button>
                    <Button kind="success" variant="outlined" shape="circle" aria-label="Confirm"><Check size={20} /></Button>
                    <Button kind="warning" variant="outlined" shape="circle" aria-label="Warning"><AlertTriangle size={20} /></Button>
                    <Button kind="error" variant="outlined" shape="circle" aria-label="Delete"><Trash2 size={20} /></Button>
                    <Button kind="info" variant="outlined" shape="circle" aria-label="Info"><Info size={20} /></Button>
                    <Button kind="neutral" variant="outlined" shape="circle" aria-label="Notifications"><Bell size={20} /></Button>
                    <Button kind="promotion" variant="outlined" shape="circle" aria-label="Favorite"><Star size={20} /></Button>
                    <Button kind="critical" variant="outlined" shape="circle" aria-label="Critical"><AlertOctagon size={20} /></Button>
                    <Button kind="growth" variant="outlined" shape="circle" aria-label="Growth"><TrendingUp size={20} /></Button>
                    <Button kind="maintenance" variant="outlined" shape="circle" aria-label="Maintenance"><Wrench size={20} /></Button>
                    <Button kind="discovery" variant="outlined" shape="circle" aria-label="Discovery"><Compass size={20} /></Button>
                    <Button kind="premium" variant="outlined" shape="circle" aria-label="Premium"><Crown size={20} /></Button>
                    <Button kind="urgent" variant="outlined" shape="circle" aria-label="Urgent"><Zap size={20} /></Button>
                </div>
            </div>
        </div>
    </DemoCard>
);

export default IconOnlyButtonsDemo;
