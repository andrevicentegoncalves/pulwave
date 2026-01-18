const fs = require('fs');
const path = require('path');

const {
    parseColorReference,
    resolveValue,
    getContrastRatio,
    parseCssVars,
    extractBlock
} = require('./utils/color-utils.cjs');

function getWcagLevel(ratio) {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3) return 'AA Large';
    return 'FAIL';
}


// ============================================================================
// MAIN GENERATOR
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
    { fg: '--color-status-warning-text', bg: '--color-status-warning-subtle', min: 3.0 },
    { fg: '--color-status-info-text', bg: '--color-status-info-subtle', min: 4.5 },
];

const generatedDir = path.join(__dirname, '../../tokens/generated');
const tokensFile = path.join(generatedDir, 'tokens.css');

if (!fs.existsSync(tokensFile)) {
    console.error('❌ tokens.css not found.');
    process.exit(1);
}

const tokensCss = fs.readFileSync(tokensFile, 'utf8');
const baseLightVars = parseCssVars(extractBlock(tokensCss, ':root'));
const baseDarkVars = parseCssVars(
    extractBlock(tokensCss, ':root[data-theme="dark"]') ||
    extractBlock(tokensCss, ':root:not([data-theme="light"])') ||
    extractBlock(tokensCss, '@media (prefers-color-scheme: dark)')
);

const themeFiles = fs.readdirSync(generatedDir).filter(f => f.startsWith('theme-') && f.endsWith('.css'));

const report = {
    generated: new Date().toISOString(),
    themes: []
};

console.log('📊 Generating Color Report...\n');

themeFiles.forEach(themeFile => {
    const themeName = themeFile.replace('theme-', '').replace('.css', '');
    const themeCss = fs.readFileSync(path.join(generatedDir, themeFile), 'utf8');

    let themeRootBlock = extractBlock(themeCss, ':root');
    if (!themeRootBlock) themeRootBlock = extractBlock(themeCss, `:root[data-theme="${themeName}"]`);
    if (!themeRootBlock) themeRootBlock = extractBlock(themeCss, `:root[data-organization="${themeName}"]`);

    const themeLightVars = parseCssVars(themeRootBlock);

    let themeDarkBlock = extractBlock(themeCss, ':root[data-theme="dark"]');
    if (!themeDarkBlock) themeDarkBlock = extractBlock(themeCss, '@media (prefers-color-scheme: dark)');

    const themeDarkVars = parseCssVars(themeDarkBlock);

    // Contexts
    const finalLight = { ...baseLightVars, ...themeLightVars };
    const finalDark = { ...finalLight, ...baseDarkVars, ...themeDarkVars };

    const themeReport = {
        name: themeName,
        modes: {
            light: { checks: [], passRate: 0 },
            dark: { checks: [], passRate: 0 }
        }
    };

    function analyzeMode(vars, modeObj) {
        const resolver = (name) => vars[name];
        let passes = 0, total = 0;

        SEMANTIC_CHECKS.forEach(check => {
            const fgRgb = parseColorReference(vars[check.fg], resolver);
            const bgRgb = parseColorReference(vars[check.bg], resolver);

            if (!fgRgb || !bgRgb) return;

            const ratio = getContrastRatio(fgRgb, bgRgb);
            const level = getWcagLevel(ratio);
            const passed = ratio >= check.min;

            if (passed) passes++;
            total++;

            modeObj.checks.push({
                pair: `${check.fg} on ${check.bg}`,
                ratio: ratio.toFixed(2),
                wcag: level,
                status: passed ? 'PASS' : 'FAIL',
                min: check.min
            });
        });

        modeObj.passRate = total === 0 ? 100 : Math.round((passes / total) * 100);
    }

    analyzeMode(finalLight, themeReport.modes.light);
    analyzeMode(finalDark, themeReport.modes.dark);

    report.themes.push(themeReport);
});

// Output
console.log('═══════════════════════════════════════════════════════════════');
console.log('                    COLOR TOKEN COMBINED REPORT                 ');
console.log('═══════════════════════════════════════════════════════════════\n');

report.themes.forEach(theme => {
    console.log(`📦 THEME: ${theme.name.toUpperCase()}`);
    console.log(`   Light Pass Rate: ${theme.modes.light.passRate}%`);
    console.log(`   Dark Pass Rate:  ${theme.modes.dark.passRate}%`);

    // List failures if any
    const failures = [
        ...theme.modes.light.checks.filter(c => c.status === 'FAIL').map(c => `[LIGHT] ${c.pair} (${c.ratio} < ${c.min})`),
        ...theme.modes.dark.checks.filter(c => c.status === 'FAIL').map(c => `[DARK]  ${c.pair} (${c.ratio} < ${c.min})`)
    ];

    if (failures.length > 0) {
        console.log('   ⚠️ Violations:');
        failures.forEach(f => console.log(`      ${f}`));
    } else {
        console.log('   ✅ Clean');
    }
    console.log('');
});

const reportPath = path.join(__dirname, '../../tokens/color-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`📄 Check full JSON report at: ${reportPath}\n`);
