
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

function getLuminance(r, g, b) {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

const rgb = hslToRgb(30, 5, 54);
console.log('RGB:', rgb);
const lum = getLuminance(rgb.r, rgb.g, rgb.b);
console.log('Luminance:', lum);

const whiteLum = 1.0;
const contrast = (whiteLum + 0.05) / (lum + 0.05);
console.log('Contrast with White:', contrast);
