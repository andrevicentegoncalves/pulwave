import { describe, it, expect } from 'vitest';
import {
    escapeHtml,
    stripHtml,
    sanitizeInput,
    sanitizeEmail,
    sanitizeUrl,
    sanitizePhone,
    sanitizeFilename,
    detectMaliciousInput,
    encodeForHtmlAttribute,
    encodeForJavaScript,
} from '../sanitize';

describe('sanitize utilities', () => {
    describe('escapeHtml', () => {
        it('should escape HTML entities', () => {
            expect(escapeHtml('<script>alert("xss")</script>')).toBe(
                '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
            );
        });

        it('should escape all dangerous characters', () => {
            expect(escapeHtml('<>&"\'/`=')).toBe('&lt;&gt;&amp;&quot;&#39;&#x2F;&#x60;&#x3D;');
        });

        it('should handle empty string', () => {
            expect(escapeHtml('')).toBe('');
        });

        it('should handle non-string input', () => {
            // @ts-expect-error testing runtime handling of invalid input
            expect(escapeHtml(null)).toBe('');
            // @ts-expect-error testing runtime handling of invalid input
            expect(escapeHtml(undefined)).toBe('');
        });
    });

    describe('stripHtml', () => {
        it('should remove HTML tags', () => {
            expect(stripHtml('<p>Hello <b>World</b></p>')).toBe('Hello World');
        });

        it('should handle self-closing tags', () => {
            expect(stripHtml('Hello<br/>World')).toBe('HelloWorld');
        });

        it('should handle empty string', () => {
            expect(stripHtml('')).toBe('');
        });
    });

    describe('sanitizeInput', () => {
        it('should trim whitespace', () => {
            expect(sanitizeInput('  hello  ')).toBe('hello');
        });

        it('should remove control characters', () => {
            expect(sanitizeInput('hello\x00world\x1F')).toBe('helloworld');
        });

        it('should respect maxLength', () => {
            expect(sanitizeInput('12345678901', 5)).toBe('12345');
        });

        it('should handle non-string input', () => {
            // @ts-expect-error testing runtime handling of invalid input
            expect(sanitizeInput(null)).toBe('');
        });
    });

    describe('sanitizeEmail', () => {
        it('should validate and lowercase valid email', () => {
            expect(sanitizeEmail('Test@Example.COM')).toBe('test@example.com');
        });

        it('should return null for invalid email', () => {
            expect(sanitizeEmail('not-an-email')).toBeNull();
            expect(sanitizeEmail('missing@domain')).toBeNull();
            expect(sanitizeEmail('@nodomain.com')).toBeNull();
        });

        it('should handle non-string input', () => {
            // @ts-expect-error testing runtime handling of invalid input
            expect(sanitizeEmail(null)).toBeNull();
        });
    });

    describe('sanitizeUrl', () => {
        it('should allow http URLs', () => {
            expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
        });

        it('should allow https URLs', () => {
            expect(sanitizeUrl('https://example.com/path?query=1')).toBe(
                'https://example.com/path?query=1'
            );
        });

        it('should reject javascript URLs', () => {
            expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
        });

        it('should reject data URLs', () => {
            expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
        });

        it('should handle invalid URLs', () => {
            expect(sanitizeUrl('not-a-url')).toBeNull();
        });
    });

    describe('sanitizePhone', () => {
        it('should keep digits and common separators', () => {
            expect(sanitizePhone('+1 (555) 123-4567')).toBe('+1 (555) 123-4567');
        });

        it('should remove letters and special characters', () => {
            expect(sanitizePhone('Call: 555-1234 ext123')).toBe('555-1234 123');
        });
    });

    describe('sanitizeFilename', () => {
        it('should remove dangerous characters', () => {
            expect(sanitizeFilename('file<>:"/\\|?*.txt')).toBe('file.txt');
        });

        it('should prevent directory traversal', () => {
            expect(sanitizeFilename('../../../etc/passwd')).toBe('etcpasswd');
        });

        it('should limit filename length', () => {
            const longName = 'a'.repeat(300) + '.txt';
            expect(sanitizeFilename(longName).length).toBeLessThanOrEqual(255);
        });
    });

    describe('detectMaliciousInput', () => {
        it('should detect script tags', () => {
            expect(detectMaliciousInput('<script>alert(1)</script>')).toBe(true);
        });

        it('should detect javascript protocol', () => {
            expect(detectMaliciousInput('javascript:alert(1)')).toBe(true);
        });

        it('should detect event handlers', () => {
            expect(detectMaliciousInput('<img onerror="alert(1)">')).toBe(true);
            expect(detectMaliciousInput('<div onmouseover = "evil()">')).toBe(true);
        });

        it('should detect SQL injection patterns', () => {
            expect(detectMaliciousInput("' OR '1'='1")).toBe(true);
            expect(detectMaliciousInput('; DROP TABLE users--')).toBe(true);
        });

        it('should not flag normal input', () => {
            expect(detectMaliciousInput('Hello World')).toBe(false);
            expect(detectMaliciousInput('user@example.com')).toBe(false);
            expect(detectMaliciousInput('The price is $19.99')).toBe(false);
        });
    });

    describe('encodeForHtmlAttribute', () => {
        it('should encode for attribute context', () => {
            expect(encodeForHtmlAttribute('value with "quotes"\'here')).toBe(
                'value with &quot;quotes&quot;&#39;here'
            );
        });
    });

    describe('encodeForJavaScript', () => {
        it('should escape JavaScript special characters', () => {
            expect(encodeForJavaScript("line1\nline2")).toBe('line1\\nline2');
            expect(encodeForJavaScript('quote\'s')).toBe("quote\\'s");
            expect(encodeForJavaScript('path\\to\\file')).toBe('path\\\\to\\\\file');
        });

        it('should handle non-string input', () => {
            // @ts-expect-error testing runtime handling of invalid input
            expect(encodeForJavaScript(null)).toBe('');
        });
    });
});
