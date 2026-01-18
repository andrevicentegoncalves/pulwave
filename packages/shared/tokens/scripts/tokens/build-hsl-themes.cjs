/**
 * Pulwave Design System - HSL Multi-Theme Token Build Script
 * 
 * Generates HSL-based CSS with:
 * - Separate H/S/L variables for runtime theme switching
 * - Multi-theme support (tenant theming)
 * - Light/Dark mode support
 * 
 * Usage:
 *   node scripts/build-hsl-themes.cjs                    # Build default theme
 *   node scripts/build-hsl-themes.cjs --theme=acme       # Build specific theme
 *   node scripts/build-hsl-themes.cjs --all              # Build all themes
 */

const fs = require('fs');
const path = require('path');

// Paths
const TOKENS_DIR = path.join(__dirname, '..', '..', 'tokens');
const SOURCE_DIR = path.join(TOKENS_DIR, 'source');
const THEMES_DIR = path.join(SOURCE_DIR, 'themes');
const OUTPUT_DIR = path.join(TOKENS_DIR, 'generated');

// Default lightness scale for feedback colors
const DEFAULT_LIGHTNESS = {
    '50': '95%', '100': '90%', '200': '80%', '300': '68%', '400': '55%',
    '500': '45%', '600': '38%', '700': '30%', '800': '22%', '900': '12%', '950': '5%'
};

// Dark mode lightness inversion map
const DARK_LIGHTNESS_MAP = {
    '50': '950', '100': '900', '200': '800', '300': '700', '400': '600',
    '500': '500', '600': '400', '700': '300', '800': '200', '900': '100', '950': '50',
    '0': '950', '150': '800', '250': '700'
};

// ============================================================================
// THEME LOADING
// ============================================================================

function loadTheme(themeName) {
    const themePath = path.join(THEMES_DIR, `${themeName}.json`);
    if (!fs.existsSync(themePath)) {
        console.error(`Error: Theme file not found: ${themePath}`);
        return null;
    }
    return JSON.parse(fs.readFileSync(themePath, 'utf8'));
}

function getAllThemes() {
    if (!fs.existsSync(THEMES_DIR)) return [];
    return fs.readdirSync(THEMES_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));
}

// ============================================================================
// HSL CSS GENERATION
// ============================================================================

function generateHSLComponents(themeData, themeName = 'default') {
    const lines = [];
    // Handle both wrapped and unwrapped theme structures
    const theme = themeData.theme || themeData;

    // Helper to find color in potentially different structures
    const getColor = (name) => {
        if (theme[name]) return theme[name];
        if (theme.brand && theme.brand[name]) return theme.brand[name];
        if (theme.colors && theme.colors[name]) return theme.colors[name];
        return null;
    };

    // Brand colors: primary, secondary, tertiary
    const brandColors = ['primary', 'secondary', 'tertiary'];

    for (const colorName of brandColors) {
        const color = getColor(colorName);
        if (!color) continue;

        const h = color.h?.$value ?? color.h;
        const s = color.s?.$value ?? color.s;

        // HSL components
        lines.push(`  --${colorName}-h: ${h};`);
        lines.push(`  --${colorName}-s: ${s};`);

        // Generate color scale using HSL
        const lightness = color.lightness || DEFAULT_LIGHTNESS;
        for (const [weight, l] of Object.entries(lightness)) {
            const lValue = l.$value ?? l;
            lines.push(`  --color-${colorName}-${weight}: hsl(var(--${colorName}-h), var(--${colorName}-s), ${lValue});`);
        }
        lines.push('');
    }

    // Neutral
    const neutral = getColor('neutral');
    if (neutral) {
        const h = neutral.h?.$value ?? neutral.h;
        const s = neutral.s?.$value ?? neutral.s;

        lines.push(`  --neutral-h: ${h};`);
        lines.push(`  --neutral-s: ${s};`);

        const lightness = neutral.lightness || DEFAULT_LIGHTNESS;
        for (const [weight, l] of Object.entries(lightness)) {
            const lValue = l.$value ?? l;
            lines.push(`  --color-neutral-${weight}: hsl(var(--neutral-h), var(--neutral-s), ${lValue});`);
        }
        lines.push('');
    }

    // Feedback colors: success, warning, error, info
    const feedbackColors = ['success', 'warning', 'error', 'info'];

    for (const colorName of feedbackColors) {
        const color = getColor(colorName);
        if (!color) continue;

        const h = color.h?.$value ?? color.h;
        const s = color.s?.$value ?? color.s;

        lines.push(`  --${colorName}-h: ${h};`);
        lines.push(`  --${colorName}-s: ${s};`);

        // Generate scale with default lightness if not specified
        const lightness = color.lightness || DEFAULT_LIGHTNESS;
        for (const [weight, l] of Object.entries(lightness)) {
            const lValue = l.$value ?? l;
            lines.push(`  --color-${colorName}-${weight}: hsl(var(--${colorName}-h), var(--${colorName}-s), ${lValue});`);
        }
        lines.push('');
    }

    return lines;
}

function generateDarkModeOverrides(themeData) {
    const lines = [];
    const theme = themeData.theme || themeData;

    const getColor = (name) => {
        if (theme[name]) return theme[name];
        if (theme.brand && theme.brand[name]) return theme.brand[name];
        if (theme.colors && theme.colors[name]) return theme.colors[name];
        return null;
    };

    // For dark mode, we invert the lightness scale
    const allColors = ['primary', 'secondary', 'tertiary', 'neutral', 'success', 'warning', 'error', 'info'];

    for (const colorName of allColors) {
        const color = getColor(colorName);
        if (!color) continue;

        const lightness = color.lightness || DEFAULT_LIGHTNESS;

        for (const [weight, l] of Object.entries(lightness)) {
            const darkWeight = DARK_LIGHTNESS_MAP[weight];
            if (darkWeight && lightness[darkWeight]) {
                const darkL = lightness[darkWeight].$value ?? lightness[darkWeight];
                lines.push(`  --color-${colorName}-${weight}: hsl(var(--${colorName}-h), var(--${colorName}-s), ${darkL});`);
            }
        }
    }

    return lines;
}


function generateSemanticColors() {
    // These use the generated HSL colors
    return `
  /* Semantic: Text */
  --color-text-primary: var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-600);
  --color-text-tertiary: var(--color-neutral-500);
  --color-text-disabled: var(--color-neutral-600);
  --color-text-inverse: var(--color-neutral-0);
  --color-text-on-primary: white;
  --color-text-on-error: white;
  
  /* Semantic: Surface */
  --color-surface-default: var(--color-neutral-0);
  --color-surface-subtle: var(--color-neutral-50);
  --color-surface-muted: var(--color-neutral-100);
  --color-surface-strong: var(--color-neutral-200);
  --color-surface-hover: var(--color-neutral-100);
  --color-surface-pressed: var(--color-neutral-200);
  --color-surface-inverse: var(--color-neutral-900);
  
  /* Semantic: Border */
  --color-border-default: var(--color-neutral-200);
  --color-border-subtle: var(--color-neutral-100);
  --color-border-strong: var(--color-neutral-300);
  --color-border-focus: var(--color-primary-500);
  --color-border-error: var(--color-error-500);
  
  /* Semantic: Brand */
  --color-brand-primary: var(--color-primary-600);
  --color-brand-primary-hover: var(--color-primary-700);
  --color-brand-primary-subtle: var(--color-primary-50);
  --color-brand-secondary: var(--color-secondary-500);
  --color-brand-tertiary: var(--color-tertiary-500);
  
  /* Semantic: Feedback */
  --color-feedback-success: var(--color-success-600);
  --color-feedback-success-subtle: var(--color-success-50);
  --color-feedback-warning: var(--color-warning-500);
  --color-feedback-warning-subtle: var(--color-warning-50);
  --color-feedback-error: var(--color-error-500);
  --color-feedback-error-subtle: var(--color-error-50);
  --color-feedback-info: var(--color-info-600);
  --color-feedback-info-subtle: var(--color-info-50);
`;
}

function generateDarkSemanticOverrides() {
    return `
  /* Dark mode semantic overrides */
  --color-text-primary: var(--color-neutral-50);
  --color-text-secondary: var(--color-neutral-400);
  --color-text-tertiary: var(--color-neutral-500);
  --color-text-disabled: var(--color-neutral-400);
  --color-text-inverse: var(--color-neutral-950);
  --color-text-on-primary: white;
  
  --color-surface-default: var(--color-neutral-950);
  --color-surface-subtle: var(--color-neutral-900);
  --color-surface-muted: var(--color-neutral-800);
  --color-surface-strong: var(--color-neutral-700);
  --color-surface-hover: var(--color-neutral-800);
  --color-surface-pressed: var(--color-neutral-700);
  --color-surface-inverse: var(--color-neutral-100);
  
  --color-border-default: var(--color-neutral-700);
  --color-border-subtle: var(--color-neutral-800);
  --color-border-strong: var(--color-neutral-600);
  
  --color-brand-primary: var(--color-primary-300);
  --color-brand-primary-hover: var(--color-primary-200);
  --color-brand-primary-subtle: var(--color-primary-950);
  
  --color-feedback-success-subtle: var(--color-success-950);
  --color-feedback-warning-subtle: var(--color-warning-950);
  --color-feedback-error-subtle: var(--color-error-950);
  --color-feedback-info-subtle: var(--color-info-950);
  
  /* Semantic Status Text overrides for dark mode */
  --color-status-warning-text: var(--color-warning-400);
`;
}

// ============================================================================
// FULL CSS GENERATION
// ============================================================================

function resolveValue(value, primitives) {
    if (typeof value !== 'string') return value;
    const match = value.match(/\{([^}]+)\}/);
    if (!match) return value;

    // Simple resolution for fontFamily (specific fix)
    const path = match[1];
    if (path.startsWith('fontFamily.')) {
        const key = path.split('.')[1];
        if (primitives.fontFamily && primitives.fontFamily[key]) {
            return primitives.fontFamily[key].$value;
        }
    }
    return value;
}

function loadPrimitives() {
    try {
        const familyPath = path.join(SOURCE_DIR, 'primitives', 'typography', 'family.json');
        if (fs.existsSync(familyPath)) {
            return JSON.parse(fs.readFileSync(familyPath, 'utf8'));
        }
    } catch (e) {
        console.warn('Warning: Could not load primitives', e);
    }
    return {};
}

function generateTypographyTokens(themeData, primitives) {
    const lines = [];
    // Typography might be at root or inside theme
    const getCategory = (cat) => {
        if (themeData[cat]) return themeData[cat];
        if (themeData.theme && themeData.theme[cat]) return themeData.theme[cat];
        return null;
    };

    // Typography categories to include
    const categories = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];

    lines.push(`  /* Typography Tokens */`);

    for (const cat of categories) {
        const tokenGroup = getCategory(cat);
        if (!tokenGroup) continue;

        for (const [key, value] of Object.entries(tokenGroup)) {
            if (key.startsWith('$')) continue;

            let tokenVal = value.$value ?? value;
            tokenVal = resolveValue(tokenVal, primitives);

            // Convert camelCase to kebab-case for var name
            const varName = `--${cat.replace(/([A-Z])/g, '-$1').toLowerCase()}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

            lines.push(`  ${varName}: ${tokenVal};`);
        }
    }
    lines.push('');
    return lines;
}

function generateFullCSS(themeData, themeName = 'default') {
    const hslComponents = generateHSLComponents(themeData, themeName);
    const darkOverrides = generateDarkModeOverrides(themeData);
    const primitives = loadPrimitives();
    const typography = generateTypographyTokens(themeData, primitives);

    const darkCss = `
${darkOverrides.join('\n')}
${generateDarkSemanticOverrides()}
    `.trim();

    return `/* Pulwave Design System - HSL Theme: ${themeName} */
/* Auto-generated - DO NOT EDIT */

:root {
  /* HSL Components (modify these for runtime theming) */
${hslComponents.join('\n')}

  /* Semantic Color Tokens */
${generateSemanticColors()}

  /* Typography */
${typography.join('\n')}
}

/* Dark Mode */
:root[data-theme="dark"] {
  ${darkCss}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    ${darkCss}
  }
}
`;
}

function generateOrganizationOverride(themeData, themeName) {
    const lines = [];
    const theme = themeData.theme || themeData;

    const getColor = (name) => {
        if (theme[name]) return theme[name];
        if (theme.brand && theme.brand[name]) return theme.brand[name];
        if (theme.colors && theme.colors[name]) return theme.colors[name];
        return null;
    };

    // Only output the HSL component overrides
    const allColors = ['primary', 'secondary', 'tertiary', 'neutral', 'success', 'warning', 'error', 'info'];

    for (const colorName of allColors) {
        const color = getColor(colorName);
        if (!color) continue;

        const h = color.h?.$value ?? color.h;
        const s = color.s?.$value ?? color.s;

        if (h !== undefined) lines.push(`  --${colorName}-h: ${h};`);
        if (s !== undefined) lines.push(`  --${colorName}-s: ${s};`);
    }

    return `/* Organization Theme: ${themeName} */
:root[data-organization="${themeName}"] {
${lines.join('\n')}
}
`;
}

// ============================================================================
// BUILD
// ============================================================================

function build(themeName = 'default') {
    console.log(`\n🎨 Building HSL theme: ${themeName}\n`);

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Load theme
    const themeData = loadTheme(themeName);
    if (!themeData) return;

    // Generate CSS
    const css = generateFullCSS(themeData, themeName);
    const outputPath = path.join(OUTPUT_DIR, `theme-${themeName}.css`);
    fs.writeFileSync(outputPath, css);
    console.log(`  ✓ Generated: theme-${themeName}.css`);

    console.log(`\n✅ Theme build complete!\n`);
}

function buildAll() {
    console.log('\n🎨 Building all HSL themes...\n');

    const themes = getAllThemes();
    if (themes.length === 0) {
        console.log('  No themes found in themes/ directory');
        return;
    }

    // Build default theme first (full CSS)
    const defaultTheme = loadTheme('default');
    if (defaultTheme) {
        const css = generateFullCSS(defaultTheme, 'default');
        fs.writeFileSync(path.join(OUTPUT_DIR, 'theme-default.css'), css);
        console.log('  ✓ Generated: theme-default.css (base theme)');
    }

    // Build organization overrides
    let organizationOverrides = '';
    for (const themeName of themes) {
        if (themeName === 'default') continue;

        const themeData = loadTheme(themeName);
        if (themeData) {
            try {
                organizationOverrides += generateOrganizationOverride(themeData, themeName) + '\n';
                console.log(`  ✓ Generated: organization override for "${themeName}"`);
            } catch (e) {
                console.error(`  ✗ Error generating override for "${themeName}":`, e.message);
                console.error(e.stack);
            }
        }
    }

    // Write combined organization overrides
    if (organizationOverrides) {
        fs.writeFileSync(path.join(OUTPUT_DIR, 'theme-organizations.css'),
            `/* Organization Theme Overrides */\n/* Auto-generated - DO NOT EDIT */\n\n${organizationOverrides}`);
        console.log('  ✓ Generated: theme-organizations.css (all organization overrides)');
    }

    console.log(`\n✅ All themes built! (${themes.length} themes)\n`);
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);

if (args.includes('--all')) {
    buildAll();
} else {
    const themeArg = args.find(a => a.startsWith('--theme='));
    const themeName = themeArg ? themeArg.replace('--theme=', '') : 'default';
    build(themeName);
}
