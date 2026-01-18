#!/usr/bin/env node
/**
 * Create Package Script
 *
 * Usage:
 *   node scripts/create-package.js <type> <name>
 *
 * Types:
 *   feature    - packages/features/<name>
 *   experience - packages/experience/<name>
 *   internal   - packages/internal/<name>
 *
 * Examples:
 *   node scripts/create-package.js feature notifications
 *   node scripts/create-package.js experience profile
 *   node scripts/create-package.js internal cache
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const [, , type, name] = process.argv;

// Validate arguments
if (!type || !name) {
    console.error('❌ Usage: node scripts/create-package.js <type> <name>\n');
    console.log('Types: feature, experience, internal\n');
    console.log('Example: node scripts/create-package.js feature notifications');
    process.exit(1);
}

const validTypes = ['feature', 'experience', 'internal'];
if (!validTypes.includes(type)) {
    console.error(`❌ Invalid type: ${type}`);
    console.log(`Valid types: ${validTypes.join(', ')}`);
    process.exit(1);
}

// Determine package path and name
const typeFolderMap = {
    feature: 'packages/features',
    experience: 'packages/experience',
    internal: 'packages/internal',
};

const packagePrefix = {
    feature: '@pulwave/features-',
    experience: '@pulwave/experience-',
    internal: '@pulwave/internal-',
};

const packagePath = join(typeFolderMap[type], name);
const packageName = `${packagePrefix[type]}${name}`;

// Check if package already exists
if (existsSync(packagePath)) {
    console.error(`❌ Package already exists: ${packagePath}`);
    process.exit(1);
}

console.log(`\n📦 Creating ${type} package: ${packageName}\n`);

// Create directory structure
const dirs = [packagePath, join(packagePath, 'src')];

if (type === 'feature' || type === 'experience') {
    dirs.push(
        join(packagePath, 'src', 'components'),
        join(packagePath, 'src', 'hooks')
    );
}

dirs.forEach((dir) => {
    mkdirSync(dir, { recursive: true });
    console.log(`  📁 Created: ${dir}`);
});

// Generate package.json
const packageJson = {
    name: packageName,
    version: '0.0.0',
    private: true,
    main: './index.ts',
    module: './index.ts',
    types: './index.ts',
    sideEffects: false,
    license: 'MIT',
    files: ['dist', 'index.ts', 'src'],
    scripts: {
        typecheck: 'tsc --noEmit',
        clean: 'rimraf dist .turbo',
    },
    dependencies:
        type === 'internal'
            ? {}
            : {
                  '@pulwave/ui': '*',
                  '@pulwave/foundation': '*',
              },
    peerDependencies:
        type === 'internal'
            ? {}
            : {
                  react: '^19.0.0',
                  'react-dom': '^19.0.0',
              },
    devDependencies: {
        typescript: '^5.6.3',
    },
};

writeFileSync(join(packagePath, 'package.json'), JSON.stringify(packageJson, null, 4));
console.log(`  📄 Created: ${packagePath}/package.json`);

// Generate tsconfig.json
const tsconfig = {
    extends: type === 'internal' ? '../../../tsconfig.packages.json' : '../../tsconfig.packages.json',
    compilerOptions: {
        baseUrl: '.',
        outDir: './dist',
        rootDir: '.',
        strict: true,
        noEmit: true,
    },
    include: ['**/*.ts', '**/*.tsx'],
    exclude: ['node_modules', 'dist'],
};

writeFileSync(join(packagePath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 4));
console.log(`  📄 Created: ${packagePath}/tsconfig.json`);

// Generate index.ts
const indexContent =
    type === 'internal'
        ? `/**
 * ${packageName}
 *
 * Internal package - not published to npm.
 */

export * from './src';
`
        : `/**
 * ${packageName}
 *
 * ${type.charAt(0).toUpperCase() + type.slice(1)} package for Pulwave.
 */

// Components
export * from './src/components';

// Hooks
export * from './src/hooks';
`;

writeFileSync(join(packagePath, 'index.ts'), indexContent);
console.log(`  📄 Created: ${packagePath}/index.ts`);

// Generate src/index.ts
const srcIndexContent =
    type === 'internal'
        ? `// Export your internal utilities here
`
        : `// Re-export components
export * from './components';

// Re-export hooks
export * from './hooks';
`;

writeFileSync(join(packagePath, 'src', 'index.ts'), srcIndexContent);
console.log(`  📄 Created: ${packagePath}/src/index.ts`);

// Generate component and hook index files for feature/experience
if (type === 'feature' || type === 'experience') {
    writeFileSync(
        join(packagePath, 'src', 'components', 'index.ts'),
        `// Export your components here
// export { MyComponent } from './MyComponent';
`
    );
    console.log(`  📄 Created: ${packagePath}/src/components/index.ts`);

    writeFileSync(
        join(packagePath, 'src', 'hooks', 'index.ts'),
        `// Export your hooks here
// export { useMyHook } from './useMyHook';
`
    );
    console.log(`  📄 Created: ${packagePath}/src/hooks/index.ts`);
}

console.log(`\n✅ Package created successfully!`);
console.log(`\nNext steps:`);
console.log(`  1. Run: npm install`);
console.log(`  2. Add to tsconfig.packages.json paths (if needed)`);
console.log(`  3. Start building your ${type}!\n`);
