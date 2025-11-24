import fs from 'fs';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'PulwaveApp/1.0';

async function searchCity(query, countryCode = '') {
    console.log(`\n--- Searching for: "${query}" (Country: ${countryCode}) ---`);

    const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '50'
    });

    if (countryCode) {
        params.append('countrycodes', countryCode.toLowerCase());
    }

    const url = `${NOMINATIM_BASE_URL}/search?${params}`;
    console.log(`URL: ${url}`);

    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': USER_AGENT }
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        console.log(`Raw results found: ${data.length}`);

        // Filter to only include cities, towns, villages
        const filtered = data.filter(item => {
            const isMatch = item.type && ['city', 'town', 'village', 'municipality', 'administrative'].includes(item.type);
            return isMatch;
        });

        console.log(`Filtered results: ${filtered.length}`);

        // Log top 5 filtered results
        filtered.slice(0, 5).forEach((item, i) => {
            console.log(`[${i + 1}] ${item.display_name} (Type: ${item.type})`);
        });

        return filtered;

    } catch (error) {
        console.error('Error searching city:', error);
        return [];
    }
}

async function runTests() {
    await searchCity('li', 'PT');
    await searchCity('lis', 'PT');
    await searchCity('lisb', 'PT');
    await searchCity('lisboa', 'PT');
}

runTests();
