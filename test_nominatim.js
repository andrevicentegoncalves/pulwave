const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'PulwaveApp/1.0';
const fs = require('fs');

async function runTests() {
    // Test: Generic q=lisb
    await testQuery('Generic q=lisb', {
        q: 'lisb',
        format: 'json',
        addressdetails: '1',
        limit: '20',
        countrycodes: 'pt'
    });
}

async function testQuery(name, paramsObj) {
    const params = new URLSearchParams(paramsObj);
    const url = `${NOMINATIM_BASE_URL}/search?${params}`;
    let output = `\n--- Testing: ${name} ---\nURL: ${url}\n`;

    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': USER_AGENT }
        });

        if (!response.ok) {
            output += `Error: ${response.status} ${response.statusText}\n`;
            fs.writeFileSync('test_output.txt', output);
            return;
        }

        const data = await response.json();
        output += `Results found: ${data.length}\n`;

        const validTypes = ['city', 'town', 'village', 'municipality', 'administrative'];

        data.forEach((item, index) => {
            const isValid = item.type && validTypes.includes(item.type);
            output += `Result ${index + 1}: Name="${item.display_name}"\n`;
            output += `   Type="${item.type}", Class="${item.class}"\n`;
            output += `   Passes Filter? ${isValid ? 'YES' : 'NO'}\n`;
        });

        fs.writeFileSync('test_output.txt', output);
        console.log('Output written to test_output.txt');
    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

runTests();
