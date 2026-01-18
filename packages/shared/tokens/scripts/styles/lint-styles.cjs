const fs = require('fs');
const path = require('path');
const glob = require('glob'); // Assume we can use glob or walk directory manually if package not avail
// Foundation package has limited deps, so let's use recursive readdir

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

const foundationRoot = path.join(__dirname, '../../');
const scssRoot = path.join(foundationRoot, 'styles/scss');
const componentsDir = path.join(scssRoot, 'components');
const abstractDir = path.join(scssRoot, 'abstracts');

let errors = 0;

function lintFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const relativePath = path.relative(foundationRoot, filePath);

    // SKIP CONDITIONS
    // Skip this linter script itself if it scans itself (it won't, looking in styles/)

    // 1. Allow Token Definitions & System Internals
    if (relativePath.includes('abstracts\\variables')) return;
    if (relativePath.includes('abstracts\\functions')) return;
    if (relativePath.includes('abstracts\\mixins')) return;
    if (relativePath.includes('abstracts\\tokens')) return;

    // 2. Allow Utility Generators (they generate the helper classes)
    if (relativePath.includes('utilities\\')) return;

    // 3. Scan specifically generally, but mostly we care about 'components/' and 'layout/'
    // If you want to be strict only on components, you could invert this:
    // if (!relativePath.includes('components\\') && !relativePath.includes('layout\\')) return;

    // 4. Exclude Style Guide (it intentionally shows raw colors)
    if (relativePath.includes('pages\\style-guide')) return;
    // 5. Exclude Backups
    if (relativePath.includes('backup')) return;

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimLine = line.trim();
        if (trimLine.startsWith('//') || trimLine.startsWith('/*')) return;

        // Strip inline comments for content checks (but keep original line for reporting)
        const codeOnly = trimLine.split('//')[0];

        // RULE 1: No Hardcoded Hex/RGB (except in token defs)
        const colorRegex = /(#[0-9a-fA-F]{3,6}|rgb\(|hsl\()/;
        if (colorRegex.test(codeOnly)) {
            // Allow if it's a CSS variable definition e.g. --foo: #fff;
            // But wait, we want to ban defining NEW variables with raw colors too unless in semantic/token files
            // For now, let's ban strictly "property: #hex" usage
            if (!trimLine.includes('var(') && !relativePath.includes('tokens\\_colors.scss')) {
                console.error(`❌ [${relativePath}:${lineNum}] Hardcoded color usage.\n   Code: ${trimLine}\n   Fix: Use a semantic token (var(--color-...)).`);
                errors++;
            }
        }

        // RULE 2: No Forbidden Sass Functions
        // We want to avoid darken/lighten on tokens, and raw rgba() values
        // Note: 'mix' is checked separately to avoid flagging CSS 'color-mix()'
        // Note: 'rgba' with var() is allowed since it uses design tokens
        const forbiddenSimple = ['lighten', 'darken'];
        forbiddenSimple.forEach(fn => {
            if (codeOnly.includes(`${fn}(`)) {
                console.error(`❌ [${relativePath}:${lineNum}] Forbidden Sass function '${fn}'.\n   Code: ${trimLine}\n   Fix: Use a dedicated semantic token for this shade/opacity.`);
                errors++;
            }
        });

        // Check for raw rgba() values - but allow rgba(var(--...), ...) which uses tokens
        if (codeOnly.includes('rgba(') && !codeOnly.includes('rgba(var(')) {
            console.error(`❌ [${relativePath}:${lineNum}] Forbidden raw rgba() value.\n   Code: ${trimLine}\n   Fix: Use rgba(var(--color-*-rgb), opacity) or a semantic token.`);
            errors++;
        }

        // Check for Sass mix() - but NOT CSS color-mix()
        if (codeOnly.includes('mix(') && !codeOnly.includes('color-mix(')) {
            console.error(`❌ [${relativePath}:${lineNum}] Forbidden Sass function 'mix'.\n   Code: ${trimLine}\n   Fix: Use a dedicated semantic token for this shade/opacity.`);
            errors++;
        }

        // RULE 3: No Direct Primitive Usage
        // $color-primary-500 etc should not be used in components
        if (codeOnly.includes('primitives.$color-') || codeOnly.includes('primitives.get-color')) {
            console.error(`❌ [${relativePath}:${lineNum}] Direct primitive usage.\n   Code: ${trimLine}\n   Fix: Use semantics or 'var(--color-...)'.`);
            errors++;
        }

        // RULE 4: No Deprecated Token Names
        // These are old token names that have been replaced by the new system
        const deprecated = [
            '--color-primary-500',
            '--color-on-surface', // banning ALL on-surface variants (default, strong, subtle, muted, etc)
            '--font-weight-semibold', // should be --font-weight-semi-bold or --font-weight-bold
            '--letter-spacing-', // legacy letter spacing
            '--spacing-', // banning --spacing-1 etc in favor of --scale-
            '--radius-m',
            '--radius-s',
            '--radius-l',
            '--color-neutral-', // banning specific neutral usages if mapped to surface
            '--shadow-elevation-', // banning legacy shadows
            '--z-index-dropdown', // banning legacy z-index
            '--color-feedback-', // banning legacy feedback colors
            '--font-family-sans', // banning legacy font family
        ];

        // RULE 6: Enforce Standard T-Shirt Sizes (s, m, l, xl, etc)
        // Ban: sm, md, lg, small, medium, large in variable usage (but allow font-weight-medium)
        const badSizes = /var\(--(?!font-weight)[a-z0-9-]+-(sm|md|lg|small|medium|large|huge)(\)|-)/;
        if (badSizes.test(codeOnly)) {
            // Exception: maybe some specific legacy we can't fix yet? No, strict mode.
            const match = codeOnly.match(badSizes);
            console.error(`❌ [${relativePath}:${lineNum}] Non-standard size '${match[1]}'.\n   Code: ${trimLine}\n   Fix: Use standard sizes: xs, s, m, l, xl, 2xl.`);
            errors++;
        }
        deprecated.forEach(token => {
            // Strict check: Only flag if inside var() to avoid BEM modifier false positives (e.g. divider--spacing-s)
            // Exception: If token itself doesn't start with -- (like $color-...), check directly.
            const isVariable = token.startsWith('--');
            const pattern = isVariable ? `var(${token}` : token;

            if (codeOnly.includes(pattern)) {
                // Exception for scale tokens if checking spacing (legacy comment, not needed if we check var prefix)
                console.error(`❌ [${relativePath}:${lineNum}] Deprecated token '${token}'.\n   Code: ${trimLine}\n   Fix: Use current semantic tokens (var(--color-brand-*), var(--color-text-*), var(--scale-*)). See token_guidelines.md.`);
                errors++;
            }
        });

        // RULE 5: Warn on non-standard color variable patterns
        const colorVarPattern = /var\(--(?!color-|border-|shadow-|scale-|font-|line-|duration-|easing-|focus-|opacity-|icon-|z-|container-|breakpoint-)[a-z]/;
        if (colorVarPattern.test(codeOnly) && (codeOnly.includes('color') || codeOnly.includes('background') || codeOnly.includes('border-color'))) {
            // warning
        }

        // ==============================================================================
        // DEEP AUDIT: HIDDEN LEGACY PATTERNS
        // ==============================================================================

        // 1. Partial Variable Names (e.g. `$color-primary` or `primary-500` used in interpolation or class construction)
        // Matches "primary-500" or "neutral-300" etc appearing OUTSIDE of a var() wrapper
        // We look for common legacy stems: primary-, neutral-, success-, warning-, error-
        // Exclude if preceded by -- (variable definition) or inside var(
        const partialVars = /(?<!var\()(?<!--)(\b(primary|neutral|success|warning|error|info|secondary)-[0-9]{2,3}\b)/;
        if (partialVars.test(codeOnly) && !codeOnly.includes('var(')) {
            // Exception: Class names like .btn--primary-500 (BEM) are technically valid CSS classes but might indicate legacy token naming in classes.
            // We will flag them to be safe, but add exclusions if needed.
            if (!codeOnly.includes('.btn--')) { // Example exclusion
                console.error(`❌ [${relativePath}:${lineNum}] Potential partial legacy variable usage.\n   Code: ${trimLine}\n   Fix: Check if this is a hardcoded legacy design token string.`);
                errors++;
            }
        }

        // 2. Hardcoded Spacing
        // Catch common pixel/rem values that should be tokens: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 0.25rem, 0.5rem, 0.75rem, 1rem, 1.25rem, 1.5rem, 2rem
        // Uses regex boundaries to avoid matching 14px (font-size) or 100%
        const hardcodedSpacing = /\b(4px|8px|12px|16px|20px|24px|32px|40px|48px|0\.25rem|0\.5rem|0\.75rem|1rem|1\.25rem|1\.5rem|2rem)\b/;
        if (hardcodedSpacing.test(codeOnly)) {
            // Only flag if it looks like a spacing property
            if (/(margin|padding|gap|top|bottom|left|right|width|height)/.test(codeOnly)) {
                // Ignore border-width: 1px etc.
                console.error(`❌ [${relativePath}:${lineNum}] Hardcoded spacing/size value.\n   Code: ${trimLine}\n   Fix: Use semantic spacing tokens (var(--scale-*)).`);
                errors++;
            }
        }

        // 3. Raw Z-Index
        // Catch z-index: [number]
        if (/z-index:\s*[0-9]+/.test(codeOnly)) {
            console.error(`❌ [${relativePath}:${lineNum}] Raw z-index value.\n   Code: ${trimLine}\n   Fix: Use semantic z-index tokens (var(--z-index-*)).`);
            errors++;
        }

        // Rule 7: Missing Legacy Items
        checkLegacyMissing(codeOnly, lineNum, relativePath, trimLine);
    });
}

// Load Missing Legacy Report
let legacyMissing = { classes: [], variables: [], mixins: [], cssVars: [] };
try {
    // Load Foundation Definitions
    const foundationPath = path.join(__dirname, 'data/legacy-definitions.json');
    if (fs.existsSync(foundationPath)) {
        const defs = require(foundationPath);
        legacyMissing.classes.push(...defs.classes);
        legacyMissing.variables.push(...defs.variables);
        legacyMissing.mixins.push(...defs.mixins);
        legacyMissing.cssVars.push(...defs.cssVars);
    }

    // Load Component Definitions
    const componentPath = path.join(__dirname, 'data/legacy-component-definitions.json');
    if (fs.existsSync(componentPath)) {
        const defs = require(componentPath);
        legacyMissing.classes.push(...defs.classes);
        legacyMissing.variables.push(...defs.variables);
        legacyMissing.mixins.push(...defs.mixins);
        legacyMissing.cssVars.push(...defs.cssVars);
    }

    // Optimize
    legacyMissing.classesSet = new Set(legacyMissing.classes);
    legacyMissing.variablesSet = new Set(legacyMissing.variables);
    legacyMissing.mixinsSet = new Set(legacyMissing.mixins);
    legacyMissing.cssVarsSet = new Set(legacyMissing.cssVars);
} catch (e) {
    console.warn('⚠️ Could not load legacy_missing_report.json', e.message);
}

function checkLegacyMissing(extract, lineNum, relativePath, trimLine) {
    // Check Classes
    // Avoid matching file extensions or paths in @use/@import (e.g. .base, .scss)
    // Heuristic: Ignore if match is followed by quote or inside generic string context check
    const classRegex = /(\.[a-z0-9-_]+)/gi;
    let match;
    while ((match = classRegex.exec(extract)) !== null) {
        // Skip if matched text starts with . and is immediately followed by quote? No, regex captures .name
        // Skip if the line part containing the match is inside quotes '...' or "..."
        // Simple check: if line has ' or " and the match is part of a path sequence?
        // Better: Exclude if entire line is import/use/forward
        if (trimLine.includes('@use') || trimLine.includes('@import') || trimLine.includes('@forward')) continue;

        // FALSE POSITIVE FIX: Skip class definitions, mixin includes, pseudo-selectors
        if (trimLine.match(/^\s*\.[a-z0-9-_]+\s*[{,]/i)) continue; // .class-name {
        if (trimLine.match(/^\s*&[_\-:\.]/)) continue; // &__element, &--modifier
        if (trimLine.includes('@include')) continue; // mixin calls
        if (trimLine.includes(':not(')) continue; // :not() selectors

        if (legacyMissing.classesSet && legacyMissing.classesSet.has(match[1])) {
            console.error(`❌ [${relativePath}:${lineNum}] Missing Legacy Class '${match[1]}'.\n   Code: ${trimLine}\n   Fix: This class was removed in the new system. Migrate to new utilities or components.`);
            errors++;
        }
    }

    // Check Mixins
    if (extract.includes('@include')) {
        const mixinRegex = /@include\s+([a-z0-9-_]+)/gi;
        while ((match = mixinRegex.exec(extract)) !== null) {
            if (legacyMissing.mixinsSet && legacyMissing.mixinsSet.has(match[1])) {
                console.error(`❌ [${relativePath}:${lineNum}] Missing Legacy Mixin '${match[1]}'.\n   Code: ${trimLine}\n   Fix: This mixin was removed. Check for new equivalents.`);
                errors++;
            }
        }
    }

    // Check Vars
    const varRegex = /([$][a-z0-9-_]+)/gi;
    while ((match = varRegex.exec(extract)) !== null) {
        if (legacyMissing.variablesSet && legacyMissing.variablesSet.has(match[1])) {
            console.error(`❌ [${relativePath}:${lineNum}] Missing Legacy Variable '${match[1]}'.\n   Code: ${trimLine}\n   Fix: This variable was removed.`);
            errors++;
        }
    }

    // Check CSS Vars
    // Strict Mode: Only flag --foo if it is used in var(--foo) or defined as --foo:
    // This avoids matching BEM modifiers (btn--active) or other strings.
    const cssVarUseRegex = /var\((--[a-z0-9-_]+)\)/gi;
    while ((match = cssVarUseRegex.exec(extract)) !== null) {
        if (legacyMissing.cssVarsSet && legacyMissing.cssVarsSet.has(match[1])) {
            console.error(`❌ [${relativePath}:${lineNum}] Missing Legacy CSS Variable Usage '${match[1]}'.\n   Code: ${trimLine}\n   Fix: This token was removed.`);
            errors++;
        }
    }
    // Also check definitions: --foo: ...
    const cssVarDefRegex = /^\s*(--[a-z0-9-_]+):/gi;
    while ((match = cssVarDefRegex.exec(extract)) !== null) {
        if (legacyMissing.cssVarsSet && legacyMissing.cssVarsSet.has(match[1])) {
            console.error(`❌ [${relativePath}:${lineNum}] Re-defining Missing Legacy CSS Variable '${match[1]}'.\n   Code: ${trimLine}\n   Fix: Do not define legacy variables.`);
            errors++;
        }
    }
}

console.log('--- SCSS Lint Started ---');
// Scan foundation styles
walkDir(scssRoot, (filePath) => {
    if (path.extname(filePath) === '.scss') {
        lintFile(filePath);
    }
});

// Scan UI2 styles
const ui2Root = path.join(foundationRoot, '../ui');
if (fs.existsSync(ui2Root)) {
    walkDir(ui2Root, (filePath) => {
        if (path.extname(filePath) === '.scss') lintFile(filePath);
    });
} else {
    console.warn('⚠️ UI2 directory not found, skipping.');
}

// Scan Features
const featuresRoot = path.join(foundationRoot, '../features');
if (fs.existsSync(featuresRoot)) {
    walkDir(featuresRoot, (filePath) => {
        if (path.extname(filePath) === '.scss') lintFile(filePath);
    });
} else {
    console.warn('⚠️ Features directory not found, skipping.');
}

// Scan Experience
const experienceRoot = path.join(foundationRoot, '../experience');
if (fs.existsSync(experienceRoot)) {
    walkDir(experienceRoot, (filePath) => {
        // Exclude specific legacy style-guide if needed, but scanning all for now as requested (excluding ui1/style-guide1)
        // If "style-guide1" refers to packages/experience/style-guide, we might need to exclude it.
        // For now, scanning everything in experience.
        if (path.extname(filePath) === '.scss') lintFile(filePath);
    });
} else {
    console.warn('⚠️ Experience directory not found, skipping.');
}

// Scan Web App
const webRoot = path.join(foundationRoot, '../../apps/web');
if (fs.existsSync(webRoot)) {
    walkDir(webRoot, (filePath) => {
        if (path.extname(filePath) === '.scss') lintFile(filePath);
    });
} else {
    console.warn('⚠️ Web App directory not found, skipping.');
}

if (errors > 0) {
    console.error(`\nFound ${errors} guideline violations.`);
    process.exit(1);
} else {
    console.log('\n✅ All style guidelines passed.');
}
