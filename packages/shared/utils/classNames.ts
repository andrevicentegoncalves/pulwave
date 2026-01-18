/**
 * Utility for conditionally joining classNames together
 * Similar to the 'classnames' or 'clsx' packages but lightweight
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, boolean | undefined | null>;

/**
 * Conditionally join classNames together (Alias for brevity, matching standard pattern shadcn/ui etc)
 * 
 * @example
 * cn('btn', 'btn--primary') // => 'btn btn--primary'
 * cn('btn', { 'btn--active': true, 'btn--disabled': false }) // => 'btn btn--active'
 * cn('btn', ['btn--lg', 'btn--rounded']) // => 'btn btn--lg btn--rounded'
 */
export function cn(...inputs: ClassValue[]): string {
    const classes: string[] = [];

    for (const input of inputs) {
        if (!input) continue;

        if (typeof input === 'string' || typeof input === 'number') {
            classes.push(String(input));
        } else if (Array.isArray(input)) {
            const nested = cn(...input);
            if (nested) classes.push(nested);
        } else if (typeof input === 'object') {
            for (const [key, value] of Object.entries(input)) {
                if (value) classes.push(key);
            }
        }
    }

    return classes.join(' ');
}

/**
 * Standard alias for the cn utility
 */
export const classNames = cn;

/**
 * Merge multiple className props, handling undefined values
 */
export function mergeClassNames(...classNames: (string | undefined)[]): string {
    return classNames.filter(Boolean).join(' ');
}
