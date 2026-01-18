/**
 * Tag Component - Demo Registry
 * 
 * Exports all tag demos in the correct display order
 */
import TagBasicDemo from './TagBasicDemo';
import TagRemovableDemo from './TagRemovableDemo';

// Named exports for individual imports
export {
    TagBasicDemo,
    TagRemovableDemo,
};

// Ordered array for filterDemos to respect
export const TagDemos = [
    { component: TagBasicDemo, title: 'Basic Usage', description: 'All color and variant combinations' },
    { component: TagRemovableDemo, title: 'Removable Tags', description: 'Tags that can be dismissed' },
];

export default TagDemos;
