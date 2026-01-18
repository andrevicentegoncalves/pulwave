/**
 * MotionDoc - Foundation documentation for Motion system
 */
import type { DocData } from '@pulwave/features-style-guide';

export const MotionDoc: DocData = {
    name: 'Motion',
    description: 'Guidelines and tokens for creating smooth, consistent animations.',
    sections: [
        {
            id: 'purpose',
            name: 'Motion Choreography',
            content: `Motion tokens define the duration, casing, and physics of animations to ensure they feel natural and consistent.`
        },
        {
            id: 'tokens',
            name: 'Motion Tokens',
            content: `| Token | Description |
|-------|-------------|
| \`--motion-enter-screen-duration\` | Duration for full screen entrances. |
| \`--motion-enter-element-duration\` | Duration for single element entrances. |
| \`--motion-hover-duration\` | Duration for hover transitions. |
| \`--motion-bounce-easing\` | Easing curve for bounce effects. |`
        },
        {
            id: 'usage',
            name: 'Usage',
            content: `Use motion tokens to control transitions:

\`\`\`scss
.button {
    // Always list properties explicitly - never use 'transition: all'
    transition: background-color var(--motion-hover-duration) ease-in-out,
                color var(--motion-hover-duration) ease-in-out,
                border-color var(--motion-hover-duration) ease-in-out;
}
\`\`\``
        }
    ]
};

export default MotionDoc;
