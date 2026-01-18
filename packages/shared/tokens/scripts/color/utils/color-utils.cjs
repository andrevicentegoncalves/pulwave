const fs = require('fs');

// ============================================================================
// COLOR UTILITIES
// ============================================================================

function hslToRgb(h, s, l) {
    if (String(s).includes('%')) s = parseFloat(s);
    if (String(l).includes('%')) l = parseFloat(l);
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
        r: Math.round(255 * f(0)),
        g: Math.round(255 * f(8)),
        b: Math.round(255 * f(4))
    };
}

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function resolveValue(val, resolver) {
    if (String(val).startsWith('var(')) {
        const match = val.match(/var\((--[\w-]+)\)/);
        if (match) {
            const resolved = resolver(match[1]);
            return resolved ? resolveValue(resolved, resolver) : 0;
        }
    }
    return val;
}

function parseColorReference(val, resolver) {
    if (!val) return null;
    val = val.trim();

    // 1. Check for var(...)
    if (val.startsWith('var(')) {
        const match = val.match(/var\((--[\w-]+)\)/);
        if (match) {
            const refName = match[1];
            const resolved = resolver(refName);
            // Protect against circular or missing
            if (resolved && resolved !== val) {
                return parseColorReference(resolved, resolver);
            }
        }
    }

    // 2. HSL with vars inside? e.g. hsl(var(--h), ...)
    if (val.startsWith('hsl')) {
        const inner = val.substring(4, val.length - 1);
        const parts = inner.split(',').map(p => p.trim());
        if (parts.length >= 3) {
            const h = resolveValue(parts[0], resolver);
            const s = resolveValue(parts[1], resolver);
            const l = resolveValue(parts[2], resolver);
            return hslToRgb(parseFloat(h), parseFloat(s), parseFloat(l));
        }
    }

    // 3. Hex / Standard HSL
    if (val.startsWith('#')) return hexToRgb(val);
    if (val.startsWith('rgba')) {
        const match = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
    }

    // Color name?
    if (val === 'white') return { r: 255, g: 255, b: 255 };
    if (val === 'black') return { r: 0, g: 0, b: 0 };

    return null;
}

function getLuminance(r, g, b) {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(rgb1, rgb2) {
    if (!rgb1 || !rgb2) return null;
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

// ============================================================================
// CSS PARSING UTILITIES
// ============================================================================

function parseCssVars(css) {
    const vars = {};
    const regex = /--[\w-]+:\s*([^;]+);/g;
    let match;
    while ((match = regex.exec(css)) !== null) {
        vars[match[0].split(':')[0].trim()] = match[1].trim();
    }
    return vars;
}

function extractBlock(css, selector) {
    const startIndex = css.indexOf(selector + ' {');
    if (startIndex === -1) return '';

    let depth = 0;
    let content = '';
    let foundStart = false;

    for (let i = startIndex; i < css.length; i++) {
        const char = css[i];
        if (char === '{') {
            if (!foundStart) {
                foundStart = true;
                depth = 1;
                continue;
            }
            depth++;
        } else if (char === '}') {
            depth--;
            if (depth === 0 && foundStart) {
                return content;
            }
        } else if (foundStart) {
            content += char;
        }
    }
    return content;
}

module.exports = {
    hslToRgb,
    hexToRgb,
    resolveValue,
    parseColorReference,
    getLuminance,
    getContrastRatio,
    parseCssVars,
    extractBlock
};
