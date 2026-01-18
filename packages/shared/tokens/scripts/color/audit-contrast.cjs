const fs = require('fs');
const path = require('path');
const glob = require('glob'); // You might need to install this or use fs.readdir

const {
    parseColorReference,
    resolveValue,
    getContrastRatio,
    parseCssVars,
    extractBlock
} = require('./utils/color-utils.cjs');

// ============================================================================
// MAIN CHECKER
// ============================================================================

const SEMANTIC_CHECKS = [
    { fg: '--color-text-primary', bg: '--color-surface-default', min: 4.5 },
    { fg: '--color-text-secondary', bg: '--color-surface-default', min: 4.5 },
    { fg: '--color-text-disabled', bg: '--color-surface-default', min: 3.0 },
    { fg: '--color-text-on-primary', bg: '--color-brand-primary', min: 4.5 },
    { fg: '--color-text-inverse', bg: '--color-brand-primary', min: 4.5 },
    { fg: '--color-text-on-error', bg: '--color-status-error', min: 4.5 },
    { fg: '--color-status-error-text', bg: '--color-status-error-subtle', min: 4.5 },
    { fg: '--color-status-success-text', bg: '--color-status-success-subtle', min: 4.5 },
    { fg: '--color-status-warning-text', bg: '--color-status-warning-subtle', min: 3.0 }, // Warning often tricky
    { fg: '--color-status-info-text', bg: '--color-status-info-subtle', min: 4.5 },
];

const generatedDir = path.join(__dirname, '../../styles/tokens/generated');
const tokensFile = path.join(generatedDir, 'tokens.css');

if (!fs.existsSync(tokensFile)) {
    console.error('❌ tokens.css not found.');
    process.exit(1);
}

// 1. Load Base Tokens
const tokensCss = fs.readFileSync(tokensFile, 'utf8');
const baseLightVars = parseCssVars(extractBlock(tokensCss, ':root'));
const baseDarkVars = parseCssVars(extractBlock(tokensCss, ':root:not([data-theme="light"])') || extractBlock(tokensCss, '@media (prefers-color-scheme: dark)'));

// 2. Identify Themes
const themeFiles = fs.readdirSync(generatedDir).filter(f => f.startsWith('theme-') && f.endsWith('.css'));

// 3. Process
let globalFailures = 0;

console.log('🎨 Audit Contrast running on Themes...\n');

themeFiles.forEach(themeFile => {
    const themeName = themeFile.replace('theme-', '').replace('.css', '');
    console.log(`\n📦 Theme: ${themeName.toUpperCase()}`);
    console.log('──────────────────────────────────────');

    const themeCss = fs.readFileSync(path.join(generatedDir, themeFile), 'utf8');

    // Light Mode (Base + Theme Root)
    // Note: theme files might have different selector structures. 
    // Default theme usually has :root. Others might have [data-theme="name"].
    // We'll search for :root or [data-theme="${themeName}"] or [data-organization="${themeName}"]

    let themeRootBlock = extractBlock(themeCss, ':root');
    if (!themeRootBlock) themeRootBlock = extractBlock(themeCss, `:root[data-theme="${themeName}"]`);
    if (!themeRootBlock) themeRootBlock = extractBlock(themeCss, `:root[data-organization="${themeName}"]`);

    const themeLightVars = parseCssVars(themeRootBlock);

    // Dark Mode (Base Dark + Theme Dark)
    // Looking for [data-theme="dark"] or inside standard dark media query
    // In theme files, dark mode overrides are often in :root[data-theme="dark"]

    let themeDarkBlock = extractBlock(themeCss, ':root[data-theme="dark"]');
    // If not found, maybe it's inside media query?
    if (!themeDarkBlock) themeDarkBlock = extractBlock(themeCss, '@media (prefers-color-scheme: dark)');

    const themeDarkVars = parseCssVars(themeDarkBlock);

    // Build Final Maps
    const finalLight = { ...baseLightVars, ...themeLightVars };
    // Dark mode: Start with Final Light, then apply Base Dark, then Theme Dark
    const finalDark = { ...finalLight, ...baseDarkVars, ...themeDarkVars };

    function checkMode(modeName, vars) {
        let failures = 0;
        const resolver = (name) => vars[name];

        if (modeName === 'LIGHT' && vars['--color-text-disabled']) {
            console.log(`[DEBUG] text-disabled raw: ${vars['--color-text-disabled']}`);
            const resolved = resolveValue(vars['--color-text-disabled'], resolver);
            console.log(`[DEBUG] text-disabled resolved: ${resolved}`);
        }

        SEMANTIC_CHECKS.forEach(check => {
            const fgRgb = parseColorReference(vars[check.fg], resolver);
            const bgRgb = parseColorReference(vars[check.bg], resolver);

            if (!fgRgb || !bgRgb) {
                // Silently skip if tokens don't exist in this theme/mode check
                // console.warn(`   ⚠️ Missing: ${check.fg} or ${check.bg}`);
                return;
            }

            const ratio = getContrastRatio(fgRgb, bgRgb);
            if (ratio < check.min) {
                console.error(`   ❌ ${modeName.padEnd(5)} | ${check.fg} on ${check.bg} | Ratio: ${ratio.toFixed(2)} < ${check.min}`);
                failures++;
            } else {
                // console.log(`   ✅ ${modeName.padEnd(5)} | ${check.fg} on ${check.bg} | Ratio: ${ratio.toFixed(2)}`);
            }
        });
        return failures;
    }

    const lightFailures = checkMode('LIGHT', finalLight);
    const darkFailures = checkMode('DARK', finalDark);

    if (lightFailures + darkFailures === 0) {
        console.log('   ✅ All Checks Passed');
    } else {
        globalFailures += (lightFailures + darkFailures);
    }
});

console.log(`\n══════════════════════════════════════`);
if (globalFailures > 0) {
    console.error(`❌ Total Violations: ${globalFailures}`);
    process.exit(1);
} else {
    console.log('✅ Audit Complete. No Violations.');
    process.exit(0);
}
