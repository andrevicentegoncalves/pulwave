const fs = require('fs');
const path = require('path');

const foundationRoot = path.join(__dirname, '../../');

const MAPPINGS = [
    // Spacing -> Scale
    { regex: /var\(--spacing-0\)/g, replace: 'var(--scale-0)' },
    { regex: /var\(--spacing-1\)/g, replace: 'var(--scale-1)' },
    { regex: /var\(--spacing-2\)/g, replace: 'var(--scale-2)' },
    { regex: /var\(--spacing-3\)/g, replace: 'var(--scale-3)' },
    { regex: /var\(--spacing-4\)/g, replace: 'var(--scale-4)' },
    { regex: /var\(--spacing-5\)/g, replace: 'var(--scale-5)' },
    { regex: /var\(--spacing-6\)/g, replace: 'var(--scale-6)' },
    { regex: /var\(--spacing-8\)/g, replace: 'var(--scale-8)' },
    { regex: /var\(--spacing-10\)/g, replace: 'var(--scale-10)' },
    { regex: /var\(--spacing-12\)/g, replace: 'var(--scale-12)' },
    { regex: /var\(--spacing-16\)/g, replace: 'var(--scale-16)' },

    // Radius -> Border Radius
    { regex: /var\(--radius-s\)/g, replace: 'var(--border-radius-s)' },
    { regex: /var\(--radius-m\)/g, replace: 'var(--border-radius-m)' },
    { regex: /var\(--radius-l\)/g, replace: 'var(--border-radius-l)' },
    { regex: /var\(--radius-full\)/g, replace: 'var(--border-radius-pill)' },

    // Colors - Primary
    { regex: /var\(--color-primary-500\)/g, replace: 'var(--color-brand-primary)' },
    { regex: /var\(--color-primary-600\)/g, replace: 'var(--color-brand-primary-hover)' },

    // Colors - Neutral & Text
    // Assuming neutral-0 is White/Inverse/Surface
    { regex: /var\(--color-neutral-0\)/g, replace: 'var(--color-surface-default)' },
    { regex: /var\(--color-on-surface\)/g, replace: 'var(--color-text-primary)' },
    { regex: /var\(--color-on-surface-default\)/g, replace: 'var(--color-text-primary)' },
    { regex: /var\(--color-on-surface-subtle\)/g, replace: 'var(--color-text-secondary)' },
    { regex: /var\(--color-on-surface-muted\)/g, replace: 'var(--color-text-tertiary)' },
    { regex: /var\(--color-on-surface-disabled\)/g, replace: 'var(--color-text-disabled)' },

    // Shadows
    { regex: /var\(--shadow-elevation-low\)/g, replace: 'var(--elevation-card)' },
    { regex: /var\(--shadow-elevation-medium\)/g, replace: 'var(--elevation-dropdown)' },
    { regex: /var\(--shadow-elevation-high\)/g, replace: 'var(--elevation-modal)' },

    // Typography
    { regex: /var\(--font-weight-semibold\)/g, replace: 'var(--font-weight-semi-bold)' },
    { regex: /var\(--font-family-sans\)/g, replace: 'var(--font-family-base)' },

    // Legacy Feedback/Status
    { regex: /var\(--color-feedback-success\)/g, replace: 'var(--color-status-success)' },
    { regex: /var\(--color-feedback-success-subtle\)/g, replace: 'var(--color-status-success-subtle)' },
    { regex: /var\(--color-feedback-warning\)/g, replace: 'var(--color-status-warning)' },
    { regex: /var\(--color-feedback-warning-subtle\)/g, replace: 'var(--color-status-warning-subtle)' },
    { regex: /var\(--color-feedback-error\)/g, replace: 'var(--color-status-error)' },
    { regex: /var\(--color-feedback-error-subtle\)/g, replace: 'var(--color-status-error-subtle)' },
    { regex: /var\(--color-feedback-info\)/g, replace: 'var(--color-status-info)' },
    { regex: /var\(--color-feedback-info-subtle\)/g, replace: 'var(--color-status-info-subtle)' },

    // Neutral Mappings
    { regex: /var\(--color-neutral-3\)/g, replace: 'var(--color-border-subtle)' }, // Assumption
    { regex: /var\(--color-neutral-0\)/g, replace: 'var(--color-surface-default)' },

    // Light/Dark Variants (Legacy or Ad-hoc)
    { regex: /var\(--color-success-light\)/g, replace: 'var(--color-status-success-subtle)' },
    { regex: /var\(--color-success-dark\)/g, replace: 'var(--color-status-success-text)' },
    { regex: /var\(--color-error-light\)/g, replace: 'var(--color-status-error-subtle)' },
    { regex: /var\(--color-error-dark\)/g, replace: 'var(--color-status-error-text)' },
    { regex: /var\(--color-primary-dark\)/g, replace: 'var(--color-brand-primary-active)' }, // Assumption

    { regex: /var\(--color-neutral-50\)/g, replace: 'var(--color-surface-subtle)' },
    { regex: /var\(--color-neutral-100\)/g, replace: 'var(--color-surface-muted)' },
    { regex: /var\(--color-neutral-200\)/g, replace: 'var(--color-surface-strong)' },
    { regex: /var\(--color-neutral-300\)/g, replace: 'var(--color-border-default)' }, // Assumption: 300 is often border
    { regex: /var\(--color-neutral-400\)/g, replace: 'var(--color-text-disabled)' },
    { regex: /var\(--color-neutral-500\)/g, replace: 'var(--color-text-tertiary)' },
    { regex: /var\(--color-neutral-600\)/g, replace: 'var(--color-text-secondary)' },
    { regex: /var\(--color-neutral-700\)/g, replace: 'var(--color-text-secondary)' }, // Fallback
    { regex: /var\(--color-neutral-800\)/g, replace: 'var(--color-text-primary)' },
    { regex: /var\(--color-neutral-900\)/g, replace: 'var(--color-text-primary)' },

    // Legacy Semantic Spacing
    { regex: /var\(--spacing-tight\)/g, replace: 'var(--scale-2)' }, // 0.5rem -> 8px
    { regex: /var\(--spacing-compact\)/g, replace: 'var(--scale-3)' }, // 0.75rem -> 12px
    { regex: /var\(--spacing-base\)/g, replace: 'var(--scale-4)' }, // 1rem -> 16px
    { regex: /var\(--spacing-comfortable\)/g, replace: 'var(--scale-5)' }, // 1.25rem -> 20px
    { regex: /var\(--spacing-spacious\)/g, replace: 'var(--scale-6)' }, // 1.5rem -> 24px
    { regex: /var\(--spacing-generous\)/g, replace: 'var(--scale-8)' }, // 2rem -> 32px
    { regex: /var\(--spacing-section\)/g, replace: 'var(--scale-10)' }, // 2.5rem -> 40px
    { regex: /var\(--spacing-section-large\)/g, replace: 'var(--scale-12)' }, // 3rem -> 48px
    { regex: /var\(--spacing-20\)/g, replace: 'var(--scale-20)' },
    { regex: /var\(--spacing-24\)/g, replace: 'var(--scale-24)' },
    { regex: /var\(--spacing-32\)/g, replace: 'var(--scale-32)' },

    // Feedback Dark
    { regex: /var\(--color-feedback-warning-dark\)/g, replace: 'var(--color-status-warning-text)' },
    { regex: /var\(--color-feedback-success-dark\)/g, replace: 'var(--color-status-success-text)' },
    { regex: /var\(--color-feedback-error-dark\)/g, replace: 'var(--color-status-error-text)' },
    { regex: /var\(--color-feedback-info-dark\)/g, replace: 'var(--color-status-info-text)' },

    // Spacing Decimals
    { regex: /var\(--spacing-0-5\)/g, replace: 'var(--scale-0-5)' },
    { regex: /var\(--spacing-1-5\)/g, replace: 'var(--scale-1-5)' },
    { regex: /var\(--spacing-2-5\)/g, replace: 'var(--scale-2-5)' },

    // Spacing Negatives
    { regex: /var\(--spacing-n0-5\)/g, replace: 'calc(var(--scale-0-5) * -1)' },
    { regex: /var\(--spacing-n1\)/g, replace: 'calc(var(--scale-1) * -1)' },
    { regex: /var\(--spacing-n2\)/g, replace: 'calc(var(--scale-2) * -1)' },
    { regex: /var\(--spacing-n3\)/g, replace: 'calc(var(--scale-3) * -1)' },
    { regex: /var\(--spacing-n4\)/g, replace: 'calc(var(--scale-4) * -1)' },

    // Components Size Suffixes (Generic Fix for Rule 6)
    { regex: /var\((--[a-z0-9-]+)-lg\)/g, replace: 'var($1-l)' },
    { regex: /var\((--[a-z0-9-]+)-md\)/g, replace: 'var($1-m)' },
    { regex: /var\((--[a-z0-9-]+)-sm\)/g, replace: 'var($1-s)' },
    { regex: /var\((--[a-z0-9-]+)-small\)/g, replace: 'var($1-s)' },
    { regex: /var\((--[a-z0-9-]+)-medium\)/g, replace: 'var($1-m)' },
    { regex: /var\((--[a-z0-9-]+)-large\)/g, replace: 'var($1-l)' },

    { regex: /var\(--z-index-dropdown\)/g, replace: 'var(--z-index-overlay)' }, // Assumption

    // Deep Audit Fixes - Hardcoded Spacing (Specific values found in audit)
    // Using word boundaries to catch values inside shorthand properties (e.g. padding: 8px 16px)
    { regex: /\b120px\b/g, replace: 'var(--scale-30)' },
    { regex: /\b48px\b/g, replace: 'var(--scale-12)' },
    { regex: /\b40px\b/g, replace: 'var(--scale-10)' },
    { regex: /\b32px\b/g, replace: 'var(--scale-8)' },
    { regex: /\b24px\b/g, replace: 'var(--scale-6)' },
    { regex: /\b20px\b/g, replace: 'var(--scale-5)' },
    { regex: /\b16px\b/g, replace: 'var(--scale-4)' },
    { regex: /\b12px\b/g, replace: 'var(--scale-3)' },
    { regex: /\b8px\b/g, replace: 'var(--scale-2)' },
    { regex: /\b4px\b/g, replace: 'var(--scale-1)' },
    { regex: /\b2px\b/g, replace: 'var(--scale-0-5)' },

    // Rem Spacing
    { regex: /\b1\.5rem\b/g, replace: 'var(--scale-6)' },
    { regex: /\b1\.25rem\b/g, replace: 'var(--scale-5)' },
    { regex: /\b1rem\b/g, replace: 'var(--scale-4)' },

    // Negative Spacing
    // Handling negative values specifically since \b might treat - as boundary
    { regex: /:\s*-4px/g, replace: ': calc(var(--scale-1) * -1)' },
    { regex: /\s+-4px/g, replace: ' calc(var(--scale-1) * -1)' }, // padding: 0 -4px;

    // Raw Z-Index (Contextual assumptions based on common usage)
    { regex: /z-index:\s*9999\b/g, replace: 'z-index: var(--z-index-tooltip)' }, // Highest
    { regex: /z-index:\s*1001\b/g, replace: 'z-index: var(--z-index-tooltip)' },
    { regex: /z-index:\s*1000\b/g, replace: 'z-index: var(--z-index-overlay)' },
    { regex: /z-index:\s*999\b/g, replace: 'z-index: var(--z-index-overlay)' },
    { regex: /z-index:\s*100\b/g, replace: 'z-index: var(--z-index-modal)' },
    { regex: /z-index:\s*40\b/g, replace: 'z-index: var(--z-index-sticky)' },
    { regex: /z-index:\s*10\b/g, replace: 'z-index: var(--z-index-dropdown)' },
    { regex: /z-index:\s*1\b/g, replace: 'z-index: var(--z-index-default)' },
    { regex: /z-index:\s*0\b/g, replace: 'z-index: var(--z-index-base)' },

    // Legacy Parity Mappings (Verified from Deep Audit)
    { regex: /var\(--opacity-disabled\)/g, replace: 'var(--opacity-action-disabled)' },
    { regex: /var\(--tooltip-arrow-size\)/g, replace: 'var(--scale-2)' },
    { regex: /var\(--content-max-width\)/g, replace: 'var(--container-xl)' }, // Assumption based on usage 1280px

    // Generic Numeric Spacing (Catch-all for integers 0-999)
    // Must come last to allow specific overrides if defined above (though regex order doesn't matter if strings don't overlap, but decimals/negatives are distinct patterns)
    { regex: /var\(--spacing-([0-9]+)\)/g, replace: 'var(--scale-$1)' },
    // Specific Layout Fixes
    { regex: /280px/g, replace: 'var(--scale-70)' },
    { regex: /80px/g, replace: 'var(--scale-20)' },
];

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

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    MAPPINGS.forEach(map => {
        content = content.replace(map.regex, map.replace);
    });

    if (content !== original) {
        console.log(`Fixed: ${path.relative(foundationRoot, filePath)}`);
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

// Target Directories
const targets = [
    path.join(foundationRoot, '../ui'),
    path.join(foundationRoot, '../features'),
    path.join(foundationRoot, '../experience'),
    path.join(foundationRoot, '../../apps/web')
];

console.log('--- Fix Styles Started ---');

targets.forEach(target => {
    if (fs.existsSync(target)) {
        walkDir(target, (filePath) => {
            if (path.extname(filePath) === '.scss') {
                processFile(filePath);
            }
        });
    } else {
        console.warn(`Target not found: ${target}`);
    }
});

console.log('--- Fix Styles Complete ---');
