/**
 * Group an array of items by a key or key function
 * @param {Array} items - Array of items to group
 * @param {string|function} keyFn - Property name or function to extract key
 * @returns {Object} Object with keys mapping to arrays of items
 * 
 * @example
 * groupBy([{type: 'a', v: 1}, {type: 'b', v: 2}, {type: 'a', v: 3}], 'type')
 * // => { a: [{type: 'a', v: 1}, {type: 'a', v: 3}], b: [{type: 'b', v: 2}] }
 * 
 * @example
 * groupBy(items, item => item.table_name || 'unknown')
 */
export const groupBy = (items, keyFn) =>
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
export const groupByWithCount = (items, keyFn) => {
    const groups = groupBy(items, keyFn);
    return { groups, count: Object.keys(groups).length };
};

export default groupBy;
