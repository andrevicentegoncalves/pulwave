const fs = require('fs');
const path = require('path');

const foundationRoot = path.join(__dirname, '../../');
const uiRoot = path.join(foundationRoot, '../../packages/ui');
const ui2Root = path.join(foundationRoot, '../../packages/ui2');
const definitionsPath = path.join(__dirname, 'data/legacy-definitions.json');

if (!fs.existsSync(definitionsPath)) {
    console.error('❌ legacy-definitions.json not found.');
    process.exit(1);
}

const legacyDefs = require(definitionsPath);
const originalCounts = {
    classes: legacyDefs.classes.length,
    variables: legacyDefs.variables.length,
    mixins: legacyDefs.mixins.length,
    cssVars: legacyDefs.cssVars.length
};

console.log('--- Pruning Legacy Definitions ---');
console.log(`Original Counts: ${JSON.stringify(originalCounts)}`);

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let stat = fs.statSync(dirPath);
        if (stat.isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

const foundInComponents = {
    classes: new Set(),
    variables: new Set(),
    mixins: new Set(),
    cssVars: new Set()
};

function scanFile(filePath) {
    const ext = path.extname(filePath);
    if (ext !== '.scss' && ext !== '.css' && ext !== '.ts' && ext !== '.tsx') return; // scan TS/TSX too? Maybe inline styles or styled-components, but standard is scss.
    // Stick to SCSS/CSS for definitions mostly.
    if (ext !== '.scss' && ext !== '.css') return;

    const content = fs.readFileSync(filePath, 'utf8');

    // 1. CSS Vars Definition: --foo: ...
    const cssVarDefRegex = /^\s*(--[a-z0-9-_]+):/gim;
    let match;
    while ((match = cssVarDefRegex.exec(content)) !== null) {
        foundInComponents.cssVars.add(match[1]);
    }

    // 2. SCSS Vars Definition: $foo: ...
    const scssVarDefRegex = /^\s*(\$[a-z0-9-_]+):/gim;
    while ((match = scssVarDefRegex.exec(content)) !== null) {
        foundInComponents.variables.add(match[1]);
    }

    // 3. Mixin Definition: @mixin foo
    const mixinDefRegex = /@mixin\s+([a-z0-9-_]+)/gi;
    while ((match = mixinDefRegex.exec(content)) !== null) {
        foundInComponents.mixins.add(match[1]);
    }

    // 4. Class Definition: .foo { ... or .foo,
    // Slightly dumb regex, but matches the "missing" generic names
    const classDefRegex = /(\.[a-z0-9-_]+)(?=\s|\{|,)/gi;
    while ((match = classDefRegex.exec(content)) !== null) {
        foundInComponents.classes.add(match[1]);
    }
}

// Scan UI2
console.log('Scanning UI2...');
walkDir(ui2Root, scanFile);

// Scan UI (Legacy/Unmigrated)
console.log('Scanning UI...');
walkDir(uiRoot, scanFile);

// Prune
const prunedDefs = {
    classes: legacyDefs.classes.filter(i => !foundInComponents.classes.has(i)),
    variables: legacyDefs.variables.filter(i => !foundInComponents.variables.has(i)),
    mixins: legacyDefs.mixins.filter(i => !foundInComponents.mixins.has(i)),
    cssVars: legacyDefs.cssVars.filter(i => !foundInComponents.cssVars.has(i))
};

// Split into Foundation vs Component
const foundationPatterns = {
    classes: /^(\.u-|\.l-|\.t-)/, // utilities, layout, typography/theme
    variables: /^(--spacing|--color|--scale|--z-index|--font|--line-height|--radius|--shadow|--animation|--transition|--duration|--ease)/,
    mixins: /^(break|text-|flex-|grid-|hover|focus)/
};

const foundationDefs = { classes: [], variables: [], mixins: [], cssVars: [] };
const componentDefs = { classes: [], variables: [], mixins: [], cssVars: [] };

function split(type, pattern) {
    prunedDefs[type].forEach(item => {
        if (pattern.test(item)) {
            foundationDefs[type].push(item);
        } else {
            componentDefs[type].push(item);
        }
    });
}

// Variables are $var, CSS vars are --var
// For SCSS vars, we don't have a strict prefix usually, let's assume if it starts with $color, $spacing it is foundation
split('classes', foundationPatterns.classes);
split('cssVars', foundationPatterns.variables);
split('mixins', foundationPatterns.mixins);

// SCSS Vars handling
// Regex for global categories
const scssGlobal = /^(\$color|\$spacing|\$z-index|\$font|\$line-height|\$radius|\$shadow|\$base|\$breakpoint)/;
prunedDefs.variables.forEach(item => {
    if (scssGlobal.test(item)) {
        foundationDefs.variables.push(item);
    } else {
        componentDefs.variables.push(item);
    }
});

const prunedCounts = {
    classes: prunedDefs.classes.length,
    variables: prunedDefs.variables.length,
    mixins: prunedDefs.mixins.length,
    cssVars: prunedDefs.cssVars.length
};

console.log(`\nPruned Counts: ${JSON.stringify(prunedCounts)}`);
console.log(`Removed (Found in UI/UI2): 
    Classes: ${originalCounts.classes - prunedCounts.classes}
    Vars: ${originalCounts.variables - prunedCounts.variables}
    Mixins: ${originalCounts.mixins - prunedCounts.mixins}
    CSS Vars: ${originalCounts.cssVars - prunedCounts.cssVars}
`);

// Overwrite Global
fs.writeFileSync(definitionsPath, JSON.stringify(foundationDefs, null, 2));
console.log(`Updated Foundation Definitions: ${definitionsPath} (${foundationDefs.classes.length} classes)`);

// Write Component
const compPath = path.join(__dirname, 'data/legacy-component-definitions.json');
fs.writeFileSync(compPath, JSON.stringify(componentDefs, null, 2));
console.log(`Created Component Definitions: ${compPath} (${componentDefs.classes.length} classes)`);

