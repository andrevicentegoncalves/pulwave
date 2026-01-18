/**
 * Pulwave Design System - Token Build Script
 * 
 * Transforms JSON tokens (W3C DTCG format) into:
 * - SCSS maps (_tokens.scss)
 * - CSS custom properties (tokens.css)
 * - TypeScript constants (tokens.ts)
 * - Merged JSON for Figma (tokens.json)
 * 
 * Usage:
 *   node scripts/build-tokens.cjs          # Build once
 *   node scripts/build-tokens.cjs --watch  # Watch mode
 */

const fs = require('fs');
const path = require('path');

// Paths
const TOKENS_DIR = path.join(__dirname, '..', '..', 'tokens');
const SOURCE_DIR = path.join(TOKENS_DIR, 'source');
const OUTPUT_DIR = path.join(TOKENS_DIR, 'generated');

// Validation tracking
let unresolvedRefs = [];
let validateMode = false;

// ============================================================================
// JSON LOADING & MERGING
// ============================================================================

/**
 * Recursively load all JSON files from a directory
 */
function loadJsonFiles(dir, basePath = '') {
    const result = {};

    if (!fs.existsSync(dir)) return result;

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            const nested = loadJsonFiles(fullPath, path.join(basePath, item.name));
            deepMerge(result, nested);
        } else if (item.name.endsWith('.json')) {
            try {
                const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                // Deep merge
                deepMerge(result, content);
                console.log(`  ✓ Loaded: ${path.join(basePath, item.name)}`);
            } catch (e) {
                console.error(`  ✗ Error loading ${item.name}:`, e.message);
            }
        }
    }

    return result;
}

/**
 * Deep merge objects
 */
function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (key.startsWith('$')) {
            // Skip meta fields at merge level
            if (!target[key]) target[key] = source[key];
            continue;
        }

        if (source[key] && typeof source[key] === 'object' && !source[key].$value) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

// ============================================================================
// TOKEN RESOLUTION
// ============================================================================

/**
 * Resolve token references like {color.blue.500} to actual values
 */
function resolveReferences(tokens, allTokens = null) {
    if (!allTokens) allTokens = tokens;

    const resolved = {};

    for (const [key, value] of Object.entries(tokens)) {
        if (key.startsWith('$')) {
            resolved[key] = value;
            continue;
        }

        if (value && typeof value === 'object') {
            if (value.$value !== undefined) {
                // This is a token
                resolved[key] = {
                    ...value,
                    $value: resolveValue(value.$value, allTokens),
                };

                // Resolve dark mode values too
                if (value.$extensions?.mode?.dark) {
                    if (!resolved[key].$extensions) resolved[key].$extensions = {};
                    if (!resolved[key].$extensions.mode) resolved[key].$extensions.mode = {};
                    resolved[key].$extensions.mode.dark = resolveValue(
                        value.$extensions.mode.dark,
                        allTokens
                    );
                }
            } else {
                // Nested object
                resolved[key] = resolveReferences(value, allTokens);
            }
        } else {
            resolved[key] = value;
        }
    }

    return resolved;
}

/**
 * Resolve a single value reference
 */
function resolveValue(value, tokens) {
    if (typeof value !== 'string') return value;

    // Match {path.to.token}
    const refMatch = value.match(/^\{([^}]+)\}$/);
    if (!refMatch) return value;

    const refPath = refMatch[1].split('.');
    let current = tokens;

    for (const part of refPath) {
        if (!current) {
            const msg = `{${refMatch[1]}} (path broken at ${part})`;
            console.warn(`  ⚠ Unresolved reference: ${msg}`);
            unresolvedRefs.push(msg);
            return value;
        }

        // Try to access the property
        if (current[part] !== undefined) {
            current = current[part];
        } else {
            const msg = `{${refMatch[1]}} (missing: ${part})`;
            console.warn(`  ⚠ Unresolved reference: ${msg}`);
            unresolvedRefs.push(msg);
            return value;
        }
    }

    // Return the resolved value
    if (current && current.$value !== undefined) {
        return current.$value;
    }

    // Direct string/number value
    if (typeof current === 'string' || typeof current === 'number') {
        return current;
    }

    console.warn(`  ⚠ Reference {${refMatch[1]}} found but no $value`);
    return value;
}

// ============================================================================
// GENERATORS
// ============================================================================

/**
 * Convert string to kebab-case
 */
function toKebabCase(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Flatten nested tokens to dot-notation paths
 */
function flattenTokens(tokens, prefix = '', result = {}) {
    for (const [key, value] of Object.entries(tokens)) {
        if (key.startsWith('$')) continue;

        const segment = toKebabCase(key);
        const path = prefix ? `${prefix}.${segment}` : segment;

        if (value && typeof value === 'object') {
            if (value.$value !== undefined) {
                result[path] = value;
            } else {
                flattenTokens(value, path, result);
            }
        }
    }

    return result;
}

/**
 * Group tokens by top-level category
 */
function groupTokensByCategory(flatTokens) {
    const groups = {};

    for (const [path, token] of Object.entries(flatTokens)) {
        const category = path.split('.')[0];
        if (!groups[category]) groups[category] = {};
        groups[category][path] = token;
    }

    // Pure alphabetical sort
    const sortedGroups = {};
    Object.keys(groups).sort().forEach(cat => {
        sortedGroups[cat] = groups[cat];
    });

    return sortedGroups;
}

function getSubCategory(path) {
    const parts = path.split('.');
    return parts.length > 1 ? parts[1] : '';
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert dot path to CSS variable name
 */
function toCssVarName(path) {
    return `--${path.replace(/\./g, '-')}`;
}

/**
 * Convert dot path to SCSS map key
 */
function toScssKey(path) {
    return `"${path.replace(/\./g, '-')}"`;
}

/**
 * Generate CSS custom properties
 */
function generateCSS(flatTokens) {
    const groups = groupTokensByCategory(flatTokens);
    const lightVars = [];
    const darkVars = [];

    for (const [category, tokens] of Object.entries(groups)) {
        lightVars.push(`\n  /* ${category.toUpperCase()} */`);

        let currentSub = '';
        const sortedPaths = Object.keys(tokens).sort();

        // Check if category has dark mode entries
        const hasDark = sortedPaths.some(path => tokens[path].$extensions?.mode?.dark);
        if (hasDark) darkVars.push(`\n    /* ${category.toUpperCase()} */`);

        let currentDarkSub = '';

        for (const path of sortedPaths) {
            const token = tokens[path];
            const sub = getSubCategory(path);

            // Add sub-section header if changed
            if (sub && sub !== currentSub) {
                currentSub = sub;
                lightVars.push(`    /* ${capitalize(sub.replace(/-/g, ' '))} */`);
            }

            const varName = toCssVarName(path);
            lightVars.push(`  ${varName}: ${token.$value};`);

            // Dark mode override
            if (token.$extensions?.mode?.dark) {
                if (sub && sub !== currentDarkSub) {
                    currentDarkSub = sub;
                    darkVars.push(`      /* ${capitalize(sub.replace(/-/g, ' '))} */`);
                }
                const darkVal = token.$extensions.mode.dark;
                darkVars.push(`    ${varName}: ${darkVal};`);
            }
        }
    }

    return `/* Auto-generated from JSON tokens - DO NOT EDIT */

:root {
${lightVars.join('\n')}
}

/* Dark mode */
/* Dark mode */
:root[data-theme="dark"] {
${darkVars.join('\n')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${darkVars.join('\n')}
  }
}
`;
}

/**
 * Generate SCSS maps - creates separate category maps to prevent memory exhaustion
 */
function generateSCSS(flatTokens) {
    const groups = groupTokensByCategory(flatTokens);

    // Build separate category maps for efficient iteration
    const categoryMaps = {};
    const allEntries = [];

    for (const [category, tokens] of Object.entries(groups)) {
        const categoryEntries = [];
        allEntries.push(`\n  // ${category.toUpperCase()}`);

        let currentSub = '';
        const sortedPaths = Object.keys(tokens).sort();

        if (category === 'color') {
            const semanticEntries = [];
            const primitiveEntries = [];
            const primitives = ['blue', 'cyan', 'emerald', 'fuschia', 'growth', 'indigo', 'lime', 'maintenance', 'neutral', 'orange', 'pink', 'purple', 'red', 'sky', 'slate', 'stone', 'teal', 'violet', 'yellow', 'zinc', 'gray'];

            for (const path of sortedPaths) {
                const token = tokens[path];
                const sub = getSubCategory(path);
                const isPrimitive = primitives.includes(sub);

                const key = toScssKey(path);
                let value = token.$value;

                if (typeof value === 'string' && value.includes(':') && !value.match(/^(url|http|data|hsl|rgb|calc|var)\(/)) {
                    value = `"${value}"`;
                }

                if (isPrimitive) {
                    if (sub && sub !== currentSub) {
                        primitiveEntries.push(`  // ${capitalize(sub.replace(/-/g, ' '))}`);
                    }
                    primitiveEntries.push(`  ${key}: ${value},`);
                } else {
                    if (sub && sub !== currentSub) {
                        semanticEntries.push(`  // ${capitalize(sub.replace(/-/g, ' '))}`);
                    }
                    semanticEntries.push(`  ${key}: ${value},`);
                }

                // Add to main list (for backwards compat map)
                if (sub && sub !== currentSub) {
                    allEntries.push(`  // ${capitalize(sub.replace(/-/g, ' '))}`);
                    currentSub = sub; // Only update global currentSub here to avoid duplicate headers issues
                }
                allEntries.push(`  ${key}: ${value},`);
            }

            categoryMaps['color'] = semanticEntries;
            categoryMaps['color-primitive'] = primitiveEntries;
            continue; // Skip standard processing for color
        }

        for (const path of sortedPaths) {
            const token = tokens[path];
            const sub = getSubCategory(path);

            if (sub && sub !== currentSub) {
                currentSub = sub;
                allEntries.push(`  // ${capitalize(sub.replace(/-/g, ' '))}`);
                categoryEntries.push(`  // ${capitalize(sub.replace(/-/g, ' '))}`);
            }

            const key = toScssKey(path);
            let value = token.$value;

            // Quote strings that contain ':' (like ratios 7:1) but aren't functions/urls
            if (typeof value === 'string' && value.includes(':') && !value.match(/^(url|http|data|hsl|rgb|calc|var)\(/)) {
                value = `"${value}"`;
            }

            // Quote aspect ratio values containing '/' to prevent Sass slash-div deprecation
            if (typeof value === 'string' && value.includes('/') && !value.match(/^(url|http|data|calc|var)\(/)) {
                value = `"${value}"`;
            }

            // Wrap comma-separated lists (font stacks, shadows, etc) in parens for SCSS maps
            if (typeof value === 'string' && value.includes(',') && !value.trim().startsWith('(')) {
                const isFunction = value.match(/^[a-zA-Z-]+\(/);
                if (path.includes('font-family') || path.includes('shadow') || path.includes('transition')) {
                    value = `(${value})`;
                }
            }

            allEntries.push(`  ${key}: ${value},`);
            categoryEntries.push(`  ${key}: ${value},`);
        }

        categoryMaps[category] = categoryEntries;
    }

    // Build separate category map definitions
    const categoryMapDefs = [];
    for (const [category, entries] of Object.entries(categoryMaps)) {
        const mapName = `$${category}-tokens`;
        categoryMapDefs.push(`// ${category.toUpperCase()} tokens (${entries.length} entries)
${mapName}: (
${entries.join('\n')}
);
`);
    }

    return `// Auto-generated from JSON tokens - DO NOT EDIT
// Use category maps for efficient iteration: $scale-tokens, $color-tokens, etc.
// Or use main $tokens map for lookups: map.get($tokens, "color-primary-default")

@use 'sass:map';

// =============================================================================
// CATEGORY-SPECIFIC MAPS (Use these for @each loops to prevent memory issues)
// =============================================================================

${categoryMapDefs.join('\n')}

// =============================================================================
// MAIN TOKEN MAP (For lookups and backwards compatibility)
// =============================================================================

$tokens: (
${allEntries.join('\n')}
);

// Helper function
@function token($name) {
  @return map.get($tokens, $name);
}

// CSS variable helper
@function var-token($name) {
  @return var(--#{$name});
}
`;
}

/**
 * Generate TypeScript constants
 */
function generateTypeScript(flatTokens) {
    const groups = groupTokensByCategory(flatTokens);
    const entries = [];

    for (const [category, tokens] of Object.entries(groups)) {
        entries.push(`  // ${category.toUpperCase()}`);

        let currentSub = '';
        const sortedPaths = Object.keys(tokens).sort();

        for (const path of sortedPaths) {
            const token = tokens[path];
            const sub = getSubCategory(path);

            if (sub && sub !== currentSub) {
                currentSub = sub;
                entries.push(`  // ${capitalize(sub.replace(/-/g, ' '))}`);
            }

            const key = path.replace(/\./g, '_').replace(/-/g, '_');
            const value = typeof token.$value === 'string'
                ? `"${token.$value}"`
                : token.$value;
            entries.push(`  "${path}": ${value},`);
        }
    }

    return `// Auto-generated from JSON tokens - DO NOT EDIT

export const tokens = {
${entries.join('\n')}
} as const;

export type TokenName = keyof typeof tokens;

// Get token value
export function getToken(name: TokenName): string | number {
  return tokens[name];
}

// Get CSS variable reference
export function cssVar(name: TokenName): string {
  return \`var(--\${name.replace(/\\./g, '-')})\`;
}
`;
}

/**
 * Generate merged JSON for Figma import
 */
function generateFigmaJSON(tokens) {
    // Clean up internal fields for Figma
    const cleanForFigma = (obj) => {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (key === '$description' || key === '$format') continue;

            if (value && typeof value === 'object') {
                if (value.$value !== undefined) {
                    // Token value - keep DTCG format
                    result[key] = {
                        $value: value.$value,
                        $type: value.$type,
                    };
                    if (value.$description) {
                        result[key].$description = value.$description;
                    }
                } else {
                    result[key] = cleanForFigma(value);
                }
            } else {
                result[key] = value;
            }
        }
        return result;
    };

    return JSON.stringify(cleanForFigma(tokens), null, 2);
}

// ============================================================================
// BUILD
// ============================================================================

function build() {
    console.log('\n🔄 Building tokens from JSON...\n');

    // Ensure output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Load all JSON files
    console.log('📂 Loading tokens:');
    const rawTokens = loadJsonFiles(SOURCE_DIR);

    if (rawTokens?.color?.neutral) {
        console.log('DEBUG: color.neutral keys:', Object.keys(rawTokens.color.neutral));
        console.log('DEBUG: color.neutral.0:', rawTokens.color.neutral['0']);
    } else {
        console.log('DEBUG: color.neutral MISSING');
    }

    // Resolve references (multi-pass)
    console.log('\n🔗 Resolving references...');
    let resolvedTokens = rawTokens;
    let iterations = 0;
    const MAX_PASSES = 5;

    // Helper to check for remaining refs
    const hasRefs = (obj) => {
        for (const value of Object.values(obj)) {
            if (typeof value === 'object' && value) {
                if (value.$value && typeof value.$value === 'string' && value.$value.match(/^\{([^}]+)\}$/)) {
                    return true;
                }
                if (hasRefs(value)) return true;
            } else if (typeof value === 'string' && value.match(/^\{([^}]+)\}$/)) {
                return true;
            }
        }
        return false;
    };

    // First pass
    resolvedTokens = resolveReferences(rawTokens);

    // Subsequent passes
    while (hasRefs(resolvedTokens) && iterations < MAX_PASSES) {
        iterations++;
        // console.log(`   Pass ${iterations + 1}...`);
        resolvedTokens = resolveReferences(resolvedTokens);
    }

    console.log(`   Resolved in ${iterations + 1} passes`);

    // Flatten for output
    const flatTokens = flattenTokens(resolvedTokens);
    console.log(`✓ Flattened ${Object.keys(flatTokens).length} tokens\n`);

    // Generate outputs
    console.log('📝 Generating outputs:');

    // CSS
    const css = generateCSS(flatTokens);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'tokens.css'), css);
    console.log('  ✓ tokens.css');

    // SCSS
    const scss = generateSCSS(flatTokens);
    fs.writeFileSync(path.join(OUTPUT_DIR, '_tokens.scss'), scss);
    console.log('  ✓ _tokens.scss');

    // TypeScript
    const ts = generateTypeScript(flatTokens);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'tokens.ts'), ts);
    console.log('  ✓ tokens.ts');

    // Figma JSON (merged, for import)
    const figmaJson = generateFigmaJSON(resolvedTokens);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'tokens.json'), figmaJson);
    console.log('  ✓ tokens.json (Figma-ready)');

    console.log(`\n✅ Build complete! Output: ${OUTPUT_DIR}\n`);
}

// ============================================================================
// WATCH
// ============================================================================

function watch() {
    console.log('\n👀 Watch mode. Press Ctrl+C to stop.\n');
    build();

    let debounce = null;

    fs.watch(SOURCE_DIR, { recursive: true }, (eventType, filename) => {
        if (!filename?.endsWith('.json')) return;

        clearTimeout(debounce);
        debounce = setTimeout(() => {
            console.log(`\n🔄 ${filename} changed\n`);
            try {
                build();
            } catch (e) {
                console.error('Build error:', e.message);
            }
        }, 300);
    });
}

// ============================================================================
// MAIN
// ============================================================================

const args = process.argv.slice(2);
validateMode = args.includes('--validate') || args.includes('-v');

if (args.includes('--watch') || args.includes('-w')) {
    watch();
} else {
    // Reset unresolved refs
    unresolvedRefs = [];
    build();

    // Validation summary
    if (unresolvedRefs.length > 0) {
        console.log(`\n⚠️  ${unresolvedRefs.length} unresolved reference(s) found:`);
        unresolvedRefs.slice(0, 10).forEach(ref => console.log(`   - ${ref}`));
        if (unresolvedRefs.length > 10) {
            console.log(`   ... and ${unresolvedRefs.length - 10} more`);
        }
        if (validateMode) {
            console.log('\n❌ Validation failed!');
            process.exit(1);
        }
    } else if (validateMode) {
        console.log('\n✅ Validation passed! All references resolved.');
    }
}
