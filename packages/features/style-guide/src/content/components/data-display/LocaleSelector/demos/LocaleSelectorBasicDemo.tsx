import React, { useState } from 'react';
import { LocaleSelector, Stack, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `    locale={locale}
    onLocaleChange={setLocale}
    availableLocales={[{ code: 'en-US', name: 'English' }, { code: 'pt-BR', name: 'Portuguese' }]}
/>

<LocaleSelector
    value={locale}
    onChange={setLocale}
    showLabel={false}
    variant="outlined"
/>`;

const LocaleSelectorBasicDemo = () => {
    const [locale, setLocale] = useState('en-US');

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Locale Selector" description="Language switcher">
            <Stack spacing="8">
                <Stack spacing="4">
                    <Text>
                        Current Locale: <Text as="span" weight="bold">{locale}</Text>
                    </Text>
                    <LocaleSelector
                        locale={locale}
                        onLocaleChange={setLocale}
                        availableLocales={[{ code: 'en-US', name: 'English' }, { code: 'pt-BR', name: 'Portuguese' }]}
                    />
                </Stack>

                <Stack spacing="4">
                    <Text weight="bold">Compact (Icon Only)</Text>
                    <LocaleSelector
                        locale={locale}
                        onLocaleChange={setLocale}
                        availableLocales={[{ code: 'en-US', name: 'English' }, { code: 'pt-BR', name: 'Portuguese' }]}
                        showLabel={false}
                        variant="default"
                    />
                </Stack>
            </Stack>
        </DemoCard>
    );
};

export default LocaleSelectorBasicDemo;

