/**
 * Badge Component - Demo Registry
 * 
 * Exports all badge demos in the correct display order
 */
import BadgeSizesDemo from './BadgeSizesDemo';
import BadgeVariantsDemo from './BadgeVariantsDemo';
import BadgeStatusDemo from './BadgeStatusDemo';
import BadgeOutlineDemo from './BadgeOutlineDemo';
import BadgeCountDemo from './BadgeCountDemo';
import BadgeWithIconsDemo from './BadgeWithIconsDemo';
import BadgeIconCircleDemo from './BadgeIconCircleDemo';
import BadgeDotDemo from './BadgeDotDemo';

// Named exports for individual imports
export {
    BadgeSizesDemo,
    BadgeVariantsDemo,
    BadgeStatusDemo,
    BadgeOutlineDemo,
    BadgeCountDemo,
    BadgeWithIconsDemo,
    BadgeIconCircleDemo,
    BadgeDotDemo
};

// Ordered array for filterDemos to respect
export const BadgeDemos = [
    { component: BadgeSizesDemo, title: 'Sizes', description: 'Size variants from extra-small to extra-large' },
    { component: BadgeVariantsDemo, title: 'Variants', description: 'All color variants (Brand & Functional)' },
    { component: BadgeStatusDemo, title: 'Status', description: 'Real-world status examples' },
    { component: BadgeOutlineDemo, title: 'Outline', description: 'Bordered outline style' },
    { component: BadgeCountDemo, title: 'Count', description: 'Numeric count badges' },
    { component: BadgeWithIconsDemo, title: 'With Icons', description: 'Badges with leading icons' },
    { component: BadgeIconCircleDemo, title: 'Circle Icon', description: 'Circular icon-only badges' },
    { component: BadgeDotDemo, title: 'Dot', description: 'Minimal dot indicators' },
];

export default BadgeDemos;
