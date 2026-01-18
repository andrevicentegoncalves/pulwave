/**
 * Checkbox States Demo
 */
import { Checkbox } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Checkbox } from '@ui';

// Basic states
<Checkbox label="Unchecked" />
<Checkbox label="Checked" defaultChecked />
<Checkbox label="Indeterminate" indeterminate />
<Checkbox label="Disabled" disabled />
<Checkbox label="Disabled checked" disabled defaultChecked />

// Controlled usage
const [checked, setChecked] = useState(false);
<Checkbox
    label="Controlled"
    checked={checked}
    onChange={(e) => setChecked(e.target.checked)}
/>

// Props: label, checked, defaultChecked, indeterminate,
// disabled, error, helperText, size (s/m/l), round, color`;

const CheckboxStatesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Checkbox States" description="Different checkbox states">
        <div className="demo-stack">
            <Checkbox label="Unchecked" />
            <Checkbox label="Checked" defaultChecked />
            <Checkbox label="Indeterminate" indeterminate />
            <Checkbox label="Disabled" disabled />
            <Checkbox label="Disabled checked" disabled defaultChecked />
        </div>
    </DemoCard>
);

export default CheckboxStatesDemo;
