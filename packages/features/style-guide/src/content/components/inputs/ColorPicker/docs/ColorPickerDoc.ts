import { ComponentDoc } from '@pulwave/features-style-guide';
import { ColorPickerDemo } from '../demos';

const ColorPickerDoc: ComponentDoc = {
    name: 'ColorPicker',
    subtitle: 'Visual color selection with format support.',
    description: 'A color selection input with a popover interface. Supports Hex, RGB, and HSL formats.',
    status: 'stable',
    version: '1.0.0',
    lastUpdated: '2026-01-17',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    whenToUse: [
        'Allowing users to customize theme colors',
        'Selecting color values for data visualization',
        'Design tools or editors',
        'Brand color configuration',
        'User personalization settings',
    ],

    whenNotToUse: [
        { text: 'Limited color options', alternative: 'RadioGroup with color swatches' },
        { text: 'Simple text input needed', alternative: 'Input component' },
        { text: 'Predefined palette only', alternative: 'Select with color options' },
    ],

    overview: {
        description: 'ColorPicker combines a visual swatch trigger with a popover containing a saturation/hue selector and manual input.',
        variants: ['default'],
        demos: [
            {
                name: 'Interactive Example',
                description: 'Pick colors in Hex or RGB formats.',
                component: ColorPickerDemo,
            },
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Color Swatch', description: 'Visual preview of selected color' },
                { name: '2. Input Field', description: 'Text input for color value' },
                { name: '3. Popover', description: 'Container for color selection UI' },
                { name: '4. Saturation/Brightness Area', description: 'Main color selection area' },
                { name: '5. Hue Slider', description: 'Slider to select hue value' },
                { name: '6. Alpha Slider', description: 'Optional opacity control' },
            ]
        },
        emphasis: 'Color swatch provides immediate visual feedback.',
        alignment: 'Popover typically appears below the trigger.',
    },

    content: {
        mainElements: 'Color value displayed in configured format (Hex, RGB, HSL).',
        overflowContent: 'Not applicable (fixed size element).',
        internationalization: 'Format labels should be translatable.',
    },

    designRecommendations: [
        'Show current color clearly in the swatch.',
        'Provide multiple input methods (picker + manual entry).',
        'Consider preset color swatches for common choices.',
        'Show color format selector when multiple formats supported.',
        'Validate color input and show error states.',
    ],

    developmentConsiderations: [
        'Support multiple color formats (Hex, RGB, HSL).',
        'Handle color conversion between formats.',
        'Validate manual input for valid color values.',
        'Consider alpha channel support.',
        'Implement proper popover positioning.',
    ],

    props: [
        { name: 'value', type: 'string', required: true, description: 'Current color value' },
        { name: 'onChange', type: '(value: string) => void', required: true, description: 'Callback when color changes' },
        { name: 'format', type: '"hex" | "rgb" | "hsl"', defaultValue: '"hex"', description: 'Output color format' },
        { name: 'label', type: 'string', description: 'Label above the input' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables interaction' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text for input' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Move focus to/from color picker' },
            { key: 'Enter/Space', action: 'Open color picker popover' },
            { key: 'Escape', action: 'Close popover' },
            { key: 'Arrow Keys', action: 'Adjust color values in popover' },
        ],
        aria: [
            { attribute: 'aria-label', usage: 'Describes the color picker purpose' },
            { attribute: 'aria-expanded', usage: 'Indicates popover state' },
            { attribute: 'aria-haspopup', usage: 'Indicates popover presence' },
        ],
        screenReader: 'Announces color value and picker state.',
        focusIndicator: 'Focus ring on trigger and popover controls.',
    },

    relatedComponents: [
        { name: 'Input', description: 'Basic text input', path: 'components/inputs/input' },
        { name: 'Select', description: 'Dropdown selection', path: 'components/inputs/select' },
        { name: 'Popover', description: 'Floating content container', path: 'components/overlays/popover' },
    ],
};

export default ColorPickerDoc;
