import type { ComponentType } from 'react';
// Named imports for common flags instead of namespace import (avoids loading all 250+ flags)
import {
    // Americas
    US, CA, MX, BR, AR, CL, CO, PE, VE,
    // Europe - Western
    GB, IE, FR, DE, AT, CH, NL, BE, LU,
    // Europe - Southern
    ES, PT, IT, GR, MT, CY,
    // Europe - Northern
    SE, NO, DK, FI, IS,
    // Europe - Eastern
    PL, CZ, SK, HU, RO, BG, HR, SI, EE, LV, LT,
    // Asia-Pacific
    JP, CN, KR, IN, AU, NZ, SG, MY, TH, ID, PH, VN,
    // Middle East & Africa
    AE, SA, IL, TR, ZA, EG, NG,
    // Other G20
    RU
} from 'country-flag-icons/react/3x2';

// Flag registry - only these flags are bundled (~50 most common)
const FLAG_REGISTRY: Record<string, ComponentType<{ title?: string; className?: string }>> = {
    US, CA, MX, BR, AR, CL, CO, PE, VE,
    GB, IE, FR, DE, AT, CH, NL, BE, LU,
    ES, PT, IT, GR, MT, CY,
    SE, NO, DK, FI, IS,
    PL, CZ, SK, HU, RO, BG, HR, SI, EE, LV, LT,
    JP, CN, KR, IN, AU, NZ, SG, MY, TH, ID, PH, VN,
    AE, SA, IL, TR, ZA, EG, NG,
    RU
};

export interface CircleFlagProps {
    countryCode?: string;
    size?: 's' | 'ms' | 'm' | 'l'; // ms was in types but not in scss? I saw s, m, l in scss. I'll support ms if needed or map to m. scss had s, m, l.
    className?: string;
}

const sizeClasses = {
    s: 'w-4 h-4 text-[0.6em]',
    ms: 'w-5 h-5 text-[0.7em]', // intermediate
    m: 'w-6 h-6 text-[0.8em]',
    l: 'w-8 h-8 text-[1em]',
};

export const CircleFlag = ({ countryCode, size = 'm', className = '' }: CircleFlagProps) => {
    const baseClasses = "inline-flex items-center justify-center rounded-full overflow-hidden border border-neutral-200 bg-neutral-100 flex-shrink-0";
    const sizeClass = sizeClasses[size] || sizeClasses.m;

    if (!countryCode) {
        return (
            <div className={`${baseClasses} ${sizeClass} ${className}`} title="Global">
                <span className="leading-none">🌍</span>
            </div>
        );
    }

    // Safety check for flag component
    const code = countryCode.toUpperCase();
    const FlagComponent = FLAG_REGISTRY[code];

    return (
        <div className={`${baseClasses} ${sizeClass} ${className}`}>
            {FlagComponent ? (
                <FlagComponent title={countryCode} className="w-full h-full object-cover" />
            ) : (
                <span className="font-semibold uppercase text-neutral-500 leading-none" style={{ fontSize: '0.6em' }}>{countryCode}</span>
            )}
        </div>
    );
};
