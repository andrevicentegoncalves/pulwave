/**
 * Button Demos Index
 * Exports all atomic button demos in display order
 */

// Named exports for direct imports
export { default as ButtonSizesDemo } from './ButtonSizesDemo';
export { ButtonMatrixDemo } from './ButtonMatrixDemo';
export { default as ButtonStatesDemo } from './ButtonStatesDemo';
export { ButtonShapesDemo } from './ButtonShapesDemo';
export { default as FullWidthButtonsDemo } from './FullWidthButtonsDemo';
export { default as ButtonWithIconsDemo } from './ButtonWithIconsDemo';
export { default as IconOnlyButtonsDemo } from './IconOnlyButtonsDemo';
export { default as ButtonDotDemo } from './ButtonDotDemo';
export { default as ButtonGroupDemo } from './ButtonGroupDemo';
export { default as SplitButtonDemo } from './SplitButtonDemo';

// Import demos for ordered default export
import ButtonSizesDemo from './ButtonSizesDemo';
import { ButtonMatrixDemo } from './ButtonMatrixDemo';
import ButtonStatesDemo from './ButtonStatesDemo';
import { ButtonShapesDemo } from './ButtonShapesDemo';
import FullWidthButtonsDemo from './FullWidthButtonsDemo';
import ButtonWithIconsDemo from './ButtonWithIconsDemo';
import IconOnlyButtonsDemo from './IconOnlyButtonsDemo';
import ButtonDotDemo from './ButtonDotDemo';
import ButtonGroupDemo from './ButtonGroupDemo';
import SplitButtonDemo from './SplitButtonDemo';

/**
 * Ordered default export for filterDemos() to use
 * This guarantees the display order in the style guide
 */
export default [
    ButtonSizesDemo,         // 1. Button Sizes
    ButtonMatrixDemo,        // 2. Button Variants (Matrix)
    ButtonStatesDemo,        // 3. Button States
    ButtonShapesDemo,        // 4. Shapes & Sizes
    FullWidthButtonsDemo,    // 5. Full Width Buttons
    ButtonWithIconsDemo,     // 6. Buttons with Icons
    IconOnlyButtonsDemo,     // 7. Icon Only Buttons
    ButtonDotDemo,           // 8. Dot Shape
    ButtonGroupDemo,         // 9. Button Groups
    SplitButtonDemo,         // 10. Split Button
];
