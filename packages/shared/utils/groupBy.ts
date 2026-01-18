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
 * 
 * @package @foundation/utils
 */
export const groupBy = <T extends Record<string, unknown>>(items: T[], keyFn: string | ((item: T) => string)): Record<string, T[]> =>
    items.reduce((acc, item) => {
        const key = typeof keyFn === 'function' ? keyFn(item) : String(item[keyFn] ?? '');
        (acc[key] ??= []).push(item);
        return acc;
    }, {} as Record<string, T[]>);

/**
 * Group items and also count unique keys
 * @returns {{ groups: Object, count: number }}
 */
export const groupByWithCount = <T extends Record<string, unknown>>(items: T[], keyFn: string | ((item: T) => string)): { groups: Record<string, T[]>, count: number } => {
    const groups = groupBy(items, keyFn);
    return { groups, count: Object.keys(groups).length };
};

export default groupBy;
