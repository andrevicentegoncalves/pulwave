/**
 * Date Helpers
 * Shared helpers for date calculations and formatting
 * 
 * @package @foundation/shared
 */

export const DEFAULT_EXPIRY_WARNING_DAYS = 60;

export interface CardExpiryStatus {
    isExpired: boolean;
    isExpiringSoon: boolean;
    daysRemaining: number;
    expiryDate: Date;
}

export function getCardExpiryStatus(
    expiryMonth: string | number,
    expiryYear: string | number,
    warningDays = DEFAULT_EXPIRY_WARNING_DAYS
): CardExpiryStatus | null {
    if (!expiryMonth || !expiryYear) return null;

    const month = parseInt(String(expiryMonth), 10);
    let year = parseInt(String(expiryYear), 10);

    if (year < 100) year = 2000 + year;

    const now = new Date();
    const expiryDate = new Date(year, month, 0, 23, 59, 59);
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
        isExpired: daysUntilExpiry < 0,
        isExpiringSoon: daysUntilExpiry >= 0 && daysUntilExpiry <= warningDays,
        daysRemaining: daysUntilExpiry,
        expiryDate,
    };
}

export function isCardExpired(expiryMonth: string | number, expiryYear: string | number): boolean {
    const status = getCardExpiryStatus(expiryMonth, expiryYear);
    return status?.isExpired ?? false;
}

export function isCardExpiringSoon(
    expiryMonth: string | number,
    expiryYear: string | number,
    warningDays = DEFAULT_EXPIRY_WARNING_DAYS
): boolean {
    const status = getCardExpiryStatus(expiryMonth, expiryYear, warningDays);
    return status?.isExpiringSoon ?? false;
}

export function formatLastUsed(dateString: string | Date | null): string {
    if (!dateString) return 'Never used';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

export function formatExpiryDate(month: string | number, year: string | number): string {
    if (!month || !year) return '';
    const m = String(month).padStart(2, '0');
    let y = String(year);
    if (y.length === 4) y = y.slice(-2);
    return `${m}/${y}`;
}

export function formatDate(date: string | Date | null, options: Intl.DateTimeFormatOptions = {}): string {
    if (!date) return '';
    const d = new Date(date);
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return d.toLocaleDateString(undefined, { ...defaultOptions, ...options });
}

export function formatDateTime(date: string | Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
