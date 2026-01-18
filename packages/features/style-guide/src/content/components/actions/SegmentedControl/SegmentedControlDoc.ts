import { ComponentDoc } from '@pulwave/features-style-guide';

const SegmentedControlDoc: ComponentDoc = {
    name: 'SegmentedControl',
    description: 'A linear set of exclusive options, functioning like a radio group but with button-like styling.',
    status: 'stable',
    props: [
        { name: 'options', type: 'SegmentedControlOption[]', description: 'Array of options to display.' },
        { name: 'value', type: 'string', description: 'Currently selected value.' },
        { name: 'onChange', type: '(value: string) => void', description: 'Callback when selection changes.' },
        { name: 'fullWidth', type: 'boolean', description: 'Whether the control expands to fill container width.' },
        { name: 'size', type: '"s" | "m" | "l"', description: 'Size of the control.' },
    ]
};

export default SegmentedControlDoc;

