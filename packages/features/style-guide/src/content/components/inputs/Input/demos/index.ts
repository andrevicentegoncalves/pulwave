/**
 * Input Component - Demo Registry
 * 
 * Exports all input demos in the correct display order
 */
import InputTypesDemo from './InputTypesDemo';
import InputSizesDemo from './InputSizesDemo';
import InputStatesDemo from './InputStatesDemo';
import InputWithIconsDemo from './InputWithIconsDemo';
import InputHelperTextDemo from './InputHelperTextDemo';
import InputRequiredDemo from './InputRequiredDemo';
import InputFullWidthDemo from './InputFullWidthDemo';

// Named exports for individual imports
export {
    InputTypesDemo,
    InputSizesDemo,
    InputStatesDemo,
    InputWithIconsDemo,
    InputHelperTextDemo,
    InputRequiredDemo,
    InputFullWidthDemo
};

// Ordered array for filterDemos to respect
export const InputDemos = [
    { component: InputSizesDemo, title: 'Sizes', description: 'Size variants (xs, s, m, l, xl)' },
    { component: InputTypesDemo, title: 'Types', description: 'Text, email, password, number, tel, url' },
    { component: InputStatesDemo, title: 'States', description: 'Default, disabled, error, success states' },
    { component: InputWithIconsDemo, title: 'With Icons', description: 'Leading and trailing icons' },
    { component: InputHelperTextDemo, title: 'Helper Text', description: 'Guidance text below input' },
    { component: InputRequiredDemo, title: 'Required', description: 'Required field indicator' },
    { component: InputFullWidthDemo, title: 'Full Width', description: 'Full-width layout' },
];

export default InputDemos;
