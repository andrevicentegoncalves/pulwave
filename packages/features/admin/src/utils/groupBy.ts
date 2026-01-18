/**
 * Group an array of items by a key or key function
 * @param {Array} items - Array of items to group
 * @param {string|function} keyFn - Property name or function to extract key
 * @returns {Object} Object with keys mapping to arrays of items
 */
export const groupBy = (items: any[], keyFn: string | ((item: any) => string)) =>
    items.reduce((acc, item) => {
        const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
        (acc[key] ??= []).push(item);
        return acc;
    }, {});

/**
 * Group items and also count unique keys
 * @param {Array} items - Array of items to group
 * @param {string|function} keyFn - Property name or function to extract key
 * @returns {{ groups: Object, count: number }}
 */
export const groupByWithCount = (items: any[], keyFn: string | ((item: any) => string)) => {
    const groups = groupBy(items, keyFn);
    return { groups, count: Object.keys(groups).length };
};

export default groupBy;
