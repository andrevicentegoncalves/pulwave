/**
 * GeographySelectsDemo
 * 
 * Showcases the actual geography-related Select extensions from @pulwave/features-forms:
 * - CountriesSelect, PhoneSelect, LocaleSelect, TimezoneSelect
 * 
 * These are self-contained components that fetch data from the database or use static fallbacks.
 */
import React, { useState } from 'react';
import { DemoCard } from '@pulwave/features-style-guide';
import { Icon, Text } from '@pulwave/ui';
import { Globe, Phone, Languages, Clock } from '@pulwave/ui';
import {
    CountriesSelect,
    PhoneSelect,
    LocaleSelect,
    TimezoneSelect
} from '@pulwave/features-shared';

const labelStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-2)'
};

const codeUsage = `import {
    CountriesSelect,
    PhoneSelect,
    LocaleSelect,
    TimezoneSelect
} from '@pulwave/features-shared';

<CountriesSelect value={country} onChange={setCountry} fullWidth />
<PhoneSelect value={phoneCode} onChange={setPhoneCode} fullWidth />
<LocaleSelect value={locale} onChange={setLocale} options={localeOptions} fullWidth />
<TimezoneSelect value={timezone} onChange={setTimezone} fullWidth />`;

const GeographySelectsDemo = () => {
    // State for each select
    const [country, setCountry] = useState<string>('');
    const [phoneCode, setPhoneCode] = useState<string>('');
    const [locale, setLocale] = useState<string>('');
    const [timezone, setTimezone] = useState<string>('');

    return (
        <DemoCard
            title="Geography Selects"
            description="Self-contained location and locale selection components. Features include auto-locate, country flags, and searchable options. Data is fetched from the database with static fallbacks."
            showPrimaryToggle
            sourceCode={codeUsage}
            showSourceToggle
        >
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-6)' }}>
                {/* Countries */}
                <div>
                    <Text category="label" style={labelStyle}>
                        <Icon size="s"><Globe /></Icon> Countries Select
                    </Text>
                    <CountriesSelect
                        label=""
                        value={country}
                        onChange={setCountry}
                        fullWidth
                    />
                </div>

                {/* Phone Codes */}
                <div>
                    <Text category="label" style={labelStyle}>
                        <Icon size="s"><Phone /></Icon> Phone Select
                    </Text>
                    <PhoneSelect
                        label=""
                        value={phoneCode}
                        onChange={setPhoneCode}
                        fullWidth
                    />
                </div>

                {/* Locales */}
                <div>
                    <Text category="label" style={labelStyle}>
                        <Icon size="s"><Languages /></Icon> Locale Select
                    </Text>
                    <LocaleSelect
                        label=""
                        value={locale}
                        onChange={setLocale}
                        options={[
                            { value: 'en-US', label: 'English (US)', countryCode: 'US' },
                            { value: 'en-GB', label: 'English (UK)', countryCode: 'GB' },
                            { value: 'de-DE', label: 'Deutsch', countryCode: 'DE' },
                            { value: 'fr-FR', label: 'Français', countryCode: 'FR' },
                            { value: 'pt-PT', label: 'Português', countryCode: 'PT' },
                            { value: 'es-ES', label: 'Español', countryCode: 'ES' },
                        ]}
                        fullWidth
                    />
                </div>

                {/* Timezones */}
                <div>
                    <Text category="label" style={labelStyle}>
                        <Icon size="s"><Clock /></Icon> Timezone Select
                    </Text>
                    <TimezoneSelect
                        label=""
                        value={timezone}
                        onChange={setTimezone}
                        fullWidth
                    />
                </div>
            </div>
        </DemoCard>
    );
};

export default GeographySelectsDemo;
