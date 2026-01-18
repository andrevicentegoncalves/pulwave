import React, { memo } from 'react';
// Named imports for common flags instead of namespace import (avoids loading all 250+ flags)
// Includes: EU countries, G20, major economies, common regions
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
import { cn } from '@pulwave/utils';
import { circleFlagVariants, type CircleFlagProps } from './types';
import './styles/_index.scss';

// Flag registry - only these flags are bundled (~50 most common)
const FLAG_REGISTRY: Record<string, React.ComponentType<{ title?: string }>> = {
    US, CA, MX, BR, AR, CL, CO, PE, VE,
    GB, IE, FR, DE, AT, CH, NL, BE, LU,
    ES, PT, IT, GR, MT, CY,
    SE, NO, DK, FI, IS,
    PL, CZ, SK, HU, RO, BG, HR, SI, EE, LV, LT,
    JP, CN, KR, IN, AU, NZ, SG, MY, TH, ID, PH, VN,
    AE, SA, IL, TR, ZA, EG, NG,
    RU
};

export const CircleFlag = memo(({ countryCode, size = 'm', className }: CircleFlagProps) => {
    if (!countryCode) {
        return (
            <div className={cn(circleFlagVariants({ size }), 'circle-flag--globe', className)}>
                <span className="circle-flag__globe">🌍</span>
            </div>
        );
    }
    const FlagComponent = FLAG_REGISTRY[countryCode.toUpperCase()];
    return (
        <div className={cn(circleFlagVariants({ size }), className)}>
            {FlagComponent ? (
                <FlagComponent title={countryCode} />
            ) : (
                <span className="circle-flag__fallback">{countryCode}</span>
            )}
        </div>
    );
});

CircleFlag.displayName = 'CircleFlag';
