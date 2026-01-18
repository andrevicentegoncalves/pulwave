/**
 * Button Component - Comprehensive Demos
 * 
 * All button variants, sizes, states, and modifiers
 */
import { ButtonMatrixDemo } from './ButtonMatrixDemo';
import ButtonSizesDemo from './ButtonSizesDemo';
import ButtonStatesDemo from './ButtonStatesDemo';
import ButtonWithIconsDemo from './ButtonWithIconsDemo';
import IconOnlyButtonsDemo from './IconOnlyButtonsDemo';
import FullWidthButtonsDemo from './FullWidthButtonsDemo';
import ButtonGroupDemo from './ButtonGroupDemo';
import { ButtonShapesDemo } from './ButtonShapesDemo';

export const ButtonDemos = [
    { component: ButtonMatrixDemo, title: 'Button Variants', description: 'Comprehensive grid of all variants' },
    { component: ButtonShapesDemo, title: 'Shapes', description: 'Pill, square, and circle shapes' },
    { component: ButtonSizesDemo, title: 'Sizes', description: 'Size options from xs to xl' },
    { component: ButtonStatesDemo, title: 'States', description: 'Disabled and loading states' },
    { component: ButtonWithIconsDemo, title: 'With Icons', description: 'Leading and trailing icons' },
    { component: IconOnlyButtonsDemo, title: 'Icon Only', description: 'Circular icon-only action buttons' },
    { component: FullWidthButtonsDemo, title: 'Full Width', description: 'Full-width buttons for mobile/forms' },
    { component: ButtonGroupDemo, title: 'Button Groups', description: 'Common button combinations' },
];

export default ButtonDemos;
