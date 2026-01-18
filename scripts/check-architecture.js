#!/usr/bin/env node
/**
 * Architecture Linting Script
 * Validates architectural rules across the monorepo
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

const errors = [];
const warnings = [];

console.log('🏗️  Checking architecture rules...\n');

/**
 * Rule 1: UI components should not import from features
 */
async function checkUIImports() {
    const uiFiles = await glob('packages/ui/**/*.{ts,tsx}', { ignore: ['**/__tests__/**', '**/node_modules/**'] });

    for (const file of uiFiles) {
        if (!existsSync(file)) continue;
        const content = readFileSync(file, 'utf-8');

        // Check for imports from features
        if (content.match(/from ['"]@pulwave\/features/)) {
            errors.push(`${file}: UI components should not import from @pulwave/features`);
        }

        // Check for imports from experience
        if (content.match(/from ['"]@pulwave\/experience/)) {
            errors.push(`${file}: UI components should not import from @pulwave/experience`);
        }
    }
}

/**
 * Rule 2: Experience packages should not import from providers
 */
async function checkExperienceImports() {
    const experienceFiles = await glob('packages/experience/**/*.{ts,tsx}', {
        ignore: ['**/__tests__/**', '**/node_modules/**', '**/dist/**']
    });

    for (const file of experienceFiles) {
        if (!existsSync(file)) continue;
        const content = readFileSync(file, 'utf-8');

        // Direct imports from supabase client
        if (content.match(/from ['"]@supabase\/supabase-js/)) {
            errors.push(`${file}: Experience packages should not directly import from @supabase/supabase-js. Use @pulwave/entities instead.`);
        }

        // Direct imports from provider implementations
        if (content.match(/from ['"].*\/providers\/(supabase|firebase|prisma)/)) {
            errors.push(`${file}: Experience packages should not import from provider implementations`);
        }
    }
}

/**
 * Rule 3: Foundation should not import from UI, Patterns, Features, or Experience
 */
async function checkFoundationImports() {
    const foundationFiles = await glob('packages/foundation/**/*.{ts,tsx}', {
        ignore: ['**/__tests__/**', '**/node_modules/**']
    });

    for (const file of foundationFiles) {
        if (!existsSync(file)) continue;
        const content = readFileSync(file, 'utf-8');

        if (content.match(/from ['"]@pulwave\/(ui|patterns|features|experience)/)) {
            errors.push(`${file}: Foundation should not import from UI, Patterns, Features, or Experience`);
        }
    }
}

/**
 * Rule 4: All test files should be in __tests__ folders
 */
async function checkTestLocation() {
    const testFiles = await glob('packages/**/*.test.{ts,tsx}', {
        ignore: ['**/node_modules/**', '**/__tests__/**']
    });

    for (const file of testFiles) {
        warnings.push(`${file}: Test files should be in __tests__/ folders`);
    }
}

/**
 * Rule 5: Check for proper barrel exports
 */
async function checkBarrelExports() {
    const indexFiles = await glob('packages/**/index.ts', {
        ignore: ['**/node_modules/**', '**/dist/**', '**/__tests__/**']
    });

    for (const file of indexFiles) {
        if (!existsSync(file)) continue;
        const content = readFileSync(file, 'utf-8');

        // Check if index.ts has actual implementation instead of just exports
        if (content.match(/^(const|let|var|function|class)\s+/m) && !content.includes('export')) {
            warnings.push(`${file}: Index files should only contain re-exports, not implementations`);
        }
    }
}

// Run all checks
try {
    await checkUIImports();
    await checkExperienceImports();
    await checkFoundationImports();
    await checkTestLocation();
    await checkBarrelExports();

    // Report results
    console.log('📊 Results:\n');

    if (errors.length === 0 && warnings.length === 0) {
        console.log('✅ All architecture rules passed!\n');
        process.exit(0);
    }

    if (errors.length > 0) {
        console.log(`❌ ${errors.length} error(s) found:\n`);
        errors.forEach(err => console.log(`  ${err}`));
        console.log('');
    }

    if (warnings.length > 0) {
        console.log(`⚠️  ${warnings.length} warning(s):\n`);
        warnings.forEach(warn => console.log(`  ${warn}`));
        console.log('');
    }

    if (errors.length > 0) {
        console.log('💡 Tip: Review docs/ARCHITECTURE.md for architectural guidelines\n');
        process.exit(1);
    }

    process.exit(0);

} catch (error) {
    console.error('Error running architecture checks:', error);
    process.exit(1);
}
