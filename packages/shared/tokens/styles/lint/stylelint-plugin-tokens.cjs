/**
 * Token Migration Linter Plugin for Stylelint
 * 
 * Detects deprecated CSS custom properties and suggests modern replacements
 * from the styles2 token system.
 */

const stylelint = require('stylelint');

const ruleName = 'pulwave/no-legacy-tokens';
const messages = stylelint.utils.ruleMessages(ruleName, {
    deprecated: (old, replacement) =>
        `Deprecated token "${old}". Use "${replacement}" instead.`,
    unknown: (property) =>
        `Unknown CSS custom property "${property}". Check if it exists in styles2 tokens.`,
});

const meta = {
    url: 'https://github.com/pulwave/design-system/docs/stylelint-rules.md',
};

// Legacy token → Modern replacement mapping
const LEGACY_TOKEN_MAP = {
    // Brand Colors (Primary)
    '--primary-color': '--color-brand-primary',
    '--primary': '--color-brand-primary',
    '--color-primary': '--color-primary-500',
    '--color-primary-default': '--color-primary-500',
    '--primary-color-hover': '--color-brand-primary-hover',
    '--primary-color-active': '--color-brand-primary-active',
    '--primary-color-light': '--color-primary-50',
    '--primary-color-dark': '--color-primary-700',

    // Brand Colors (Secondary)
    '--secondary-color': '--color-brand-secondary',
    '--secondary': '--color-brand-secondary',
    '--color-secondary': '--color-secondary-500',
    '--color-secondary-default': '--color-secondary-500',
    '--secondary-color-hover': '--color-brand-secondary-hover',
    '--secondary-color-light': '--color-secondary-50',

    // Brand Colors (Tertiary)
    '--tertiary-color': '--color-brand-tertiary',
    '--tertiary': '--color-brand-tertiary',
    '--color-tertiary': '--color-tertiary-500',
    '--tertiary-color-light': '--color-tertiary-50',

    // Feedback/Status Colors
    '--success-color': '--color-status-success',
    '--success': '--color-status-success',
    '--color-success': '--color-success-500',
    '--error-color': '--color-status-error',
    '--error': '--color-status-error',
    '--color-error': '--color-error-500',
    '--danger-color': '--color-status-error',
    '--danger': '--color-status-error',
    '--color-danger': '--color-error-500',
    '--warning-color': '--color-status-warning',
    '--warning': '--color-status-warning',
    '--color-warning': '--color-warning-500',
    '--info-color': '--color-status-info',
    '--info': '--color-status-info',
    '--color-info': '--color-info-500',

    // Text Colors
    '--text-color': '--color-text-primary',
    '--text-primary': '--color-text-primary',
    '--text-secondary': '--color-text-secondary',
    '--text-tertiary': '--color-text-tertiary',
    '--text-muted': '--color-text-tertiary',
    '--text-disabled': '--color-text-disabled',
    '--text-inverse': '--color-text-inverse',

    // Background/Surface Colors
    '--bg-color': '--color-surface-default',
    '--background-color': '--color-surface-default',
    '--bg-primary': '--color-surface-default',
    '--bg-secondary': '--color-surface-subtle',
    '--bg-tertiary': '--color-surface-strong',
    '--bg-hover': '--color-surface-hover',
    '--bg-selected': '--color-surface-selected',

    // Border Colors
    '--border-color': '--color-border-default',
    '--border': '--color-border-default',
    '--border-light': '--color-border-subtle',
    '--border-dark': '--color-border-strong',
    '--border-hover': '--color-border-hover',

    // Neutral/Gray Colors
    '--gray-50': '--color-neutral-50',
    '--gray-100': '--color-neutral-100',
    '--gray-200': '--color-neutral-200',
    '--gray-300': '--color-neutral-300',
    '--gray-400': '--color-neutral-400',
    '--gray-500': '--color-neutral-500',
    '--gray-600': '--color-neutral-600',
    '--gray-700': '--color-neutral-700',
    '--gray-800': '--color-neutral-800',
    '--gray-900': '--color-neutral-900',
    '--grey-50': '--color-neutral-50',
    '--grey-100': '--color-neutral-100',
    '--grey-200': '--color-neutral-200',
    '--grey-300': '--color-neutral-300',
    '--grey-400': '--color-neutral-400',
    '--grey-500': '--color-neutral-500',
    '--grey-600': '--color-neutral-600',
    '--grey-700': '--color-neutral-700',
    '--grey-800': '--color-neutral-800',
    '--grey-900': '--color-neutral-900',

    // Spacing
    '--spacing-xs': '--spacing-micro',
    '--spacing-sm': '--spacing-tight',
    '--spacing-md': '--spacing-base',
    '--spacing-lg': '--spacing-spacious',
    '--spacing-xl': '--spacing-generous',

    // Border Radius
    '--radius-sm': '--border-radius-s',
    '--radius-md': '--border-radius-m',
    '--radius-lg': '--border-radius-l',
    '--radius-xl': '--border-radius-xl',
    '--radius-full': '--border-radius-pill',
    '--border-radius-full': '--border-radius-pill',

    // Shadow
    '--shadow-sm': '--shadow-s',
    '--shadow-md': '--shadow-m',
    '--shadow-lg': '--shadow-l',

    // Z-Index
    '--z-modal': '--z-index-overlay-modal',
    '--z-dropdown': '--z-index-overlay-dropdown',
    '--z-tooltip': '--z-index-overlay-tooltip',
    '--z-header': '--z-index-component-header',
    '--z-sidebar': '--z-index-component-sidebar',

    // Transitions/Animation
    '--transition-fast': '--duration-fast',
    '--transition-normal': '--duration-normal',
    '--transition-slow': '--duration-slow',
    '--ease-in-out': '--easing-ease-in-out',
    '--ease-out': '--easing-ease-out',

    // Typography
    '--font-family-base': '--font-family-sans',
    '--font-family-heading': '--font-family-sans',
    '--font-family-code': '--font-family-mono',
    '--font-size-xs': '--font-size-ui-xs',
    '--font-size-sm': '--font-size-ui-s',
    '--font-size-md': '--font-size-body-m',
    '--font-size-lg': '--font-size-body-l',
    '--font-size-xl': '--font-size-title-l',
    '--font-weight-normal': '--font-weight-regular',
    '--font-weight-semibold': '--font-weight-semi-bold',
    '--line-height-normal': '--line-height-base',
    '--line-height-tight': '--line-height-tight',

    // Material Design on-surface → styles2 text/surface
    '--color-on-surface': '--color-text-primary',
    '--color-on-surface-default': '--color-text-primary',
    '--color-on-surface-subtle': '--color-text-secondary',
    '--color-on-surface-muted': '--color-text-tertiary',
    '--color-on-surface-disabled': '--color-text-disabled',

    // Material Design danger → error
    '--color-danger': '--color-status-error',
    '--color-danger-default': '--color-error-500',
    '--color-danger-surface': '--color-error-50',
    '--color-danger-200': '--color-error-200',
    '--color-danger-500': '--color-error-500',
    '--color-danger-700': '--color-error-700',

    // Material Design color-critical (if used standalone)
    '--color-critical': '--color-critical-500',

    // text-muted → text-tertiary
    '--color-text-muted': '--color-text-tertiary',

    // Border radius legacy (sm/md/lg)
    '--border-radius-sm': '--border-radius-s',
    '--border-radius-md': '--border-radius-m',
    '--border-radius-lg': '--border-radius-l',

    // Legacy font-family patterns
    '--font-family-base': '--font-family-sans',
    '--font-family-heading': '--font-family-sans',
    '--font-family-code': '--font-family-mono',
    '--font-family-mono-code': '--font-family-mono',

    // Legacy background patterns
    '--color-background': '--color-surface-default',
    '--color-background-default': '--color-surface-default',
    '--color-background-primary': '--color-surface-default',
    '--color-background-secondary': '--color-surface-subtle',
    '--color-background-hover': '--color-surface-hover',
    '--color-background-neutral-subtle': '--color-surface-subtle',
    '--color-background-neutral-hover': '--color-surface-hover',

    // Legacy neutral/gray patterns
    '--color-neutral-light': '--color-neutral-100',
    '--color-neutral-lighter': '--color-neutral-50',
    '--color-neutral-dark': '--color-neutral-700',
    '--color-neutral-darker': '--color-neutral-900',

    // Legacy interaction patterns  
    '--border-width-1': '--border-width-2xs',
};

// Common typos and incorrect patterns → Correct token
const TYPO_CORRECTIONS = {
    // Border Radius typos (xl2 → 2xl pattern)
    '--border-radius-xl2': '--border-radius-2xl',
    '--border-radius-xs2': '--border-radius-2xs',
    '--radius-2l': '--border-radius-2xl',
    '--radius-xl2': '--border-radius-2xl',
    '--radius-2xs': '--border-radius-2xs',
    '--border-radius-xlarge': '--border-radius-xl',
    '--border-radius-medium': '--border-radius-m',
    '--border-radius-small': '--border-radius-s',
    '--border-radius-large': '--border-radius-l',

    // Blur typos
    '--blur-xl2': '--blur-2xl',
    '--blur-xl3': '--blur-3xl',

    // Color typos (common misspellings)
    '--color-nuetral-500': '--color-neutral-500',  // nuetral → neutral
    '--color-nutral-500': '--color-neutral-500',
    '--color-netural-500': '--color-neutral-500',
    '--color-grey-500': '--color-neutral-500',     // grey → neutral

    // Size typos
    '--scale-0.25': '--scale-0-25',
    '--scale-0.5': '--scale-0-5',

    // Shadow typos
    '--shadow-medium': '--shadow-m',
    '--shadow-small': '--shadow-s',
    '--shadow-large': '--shadow-l',
    '--shadow-extra-large': '--shadow-xl',

    // Spacing typos
    '--spacing-small': '--spacing-tight',
    '--spacing-medium': '--spacing-base',
    '--spacing-large': '--spacing-spacious',

    // Z-index typos
    '--z-index-modal': '--z-index-overlay-modal',
    '--z-index-dropdown': '--z-index-overlay-dropdown',
    '--z-index-tooltip': '--z-index-overlay-tooltip',
    '--zindex-modal': '--z-index-overlay-modal',
    '--zindex-dropdown': '--z-index-overlay-dropdown',

    // Duration/Animation typos
    '--duration-fast-150': '--duration-fast',
    '--transition-duration-fast': '--duration-fast',
    '--transition-duration-normal': '--duration-normal',
    '--animation-duration-fast': '--duration-fast',

    // Easing typos
    '--easing-in-out': '--easing-ease-in-out',
    '--ease-in-out': '--easing-ease-in-out',
    '--easing-ease': '--easing-ease',

    // Font typos
    '--font-size-extra-small': '--font-size-ui-xs',
    '--font-size-extra-large': '--font-size-title-xl',
    '--font-weight-semiBold': '--font-weight-semi-bold',
    '--font-weight-extraBold': '--font-weight-extra-bold',
    '--font-weight-extrabold': '--font-weight-extra-bold',

    // Opacity typos (percentage-like)
    '--opacity-100percent': '--opacity-100',
    '--opacity-50percent': '--opacity-50',

    // Breakpoint typos
    '--breakpoint-extra-small': '--breakpoint-xs',
    '--breakpoint-extra-large': '--breakpoint-xl',
    '--breakpoint-small': '--breakpoint-s',
    '--breakpoint-medium': '--breakpoint-m',
    '--breakpoint-large': '--breakpoint-l',

    // Container typos
    '--container-small': '--container-s',
    '--container-medium': '--container-m',
    '--container-large': '--container-l',
    '--container-extra-large': '--container-xl',
};

// Merge all corrections into one map
const ALL_TOKEN_CORRECTIONS = { ...LEGACY_TOKEN_MAP, ...TYPO_CORRECTIONS };

const ruleFunction = (primaryOption, secondaryOptions, context) => {
    return (root, result) => {
        const validOptions = stylelint.utils.validateOptions(
            result,
            ruleName,
            {
                actual: primaryOption,
                possible: [true, false],
            },
        );

        if (!validOptions || !primaryOption) {
            return;
        }

        // Extract var() usages
        const varRegex = /var\(\s*(--[\w-]+)/g;

        root.walkDecls((decl) => {
            const value = decl.value;
            let match;

            while ((match = varRegex.exec(value)) !== null) {
                const cssVar = match[1];

                // Check if it's a legacy token or typo
                if (ALL_TOKEN_CORRECTIONS[cssVar]) {
                    const replacement = ALL_TOKEN_CORRECTIONS[cssVar];

                    // Auto-fix if context.fix is enabled
                    if (context.fix) {
                        decl.value = decl.value.replace(
                            new RegExp(`var\\(\\s*${cssVar.replace(/[-]/g, '\\-')}`, 'g'),
                            `var(${replacement}`
                        );
                    } else {
                        stylelint.utils.report({
                            message: messages.deprecated(cssVar, replacement),
                            node: decl,
                            result,
                            ruleName,
                            word: cssVar,
                        });
                    }
                }
            }
        });
    };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
