const fs = require('fs');

try {
    const schemaContent = fs.readFileSync('src/schema.md', 'utf8');
    let jsonString = schemaContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const schemaData = JSON.parse(jsonString);

    let tables = [];
    if (Array.isArray(schemaData) && schemaData[0] && schemaData[0].complete_schema) {
        const innerSchema = JSON.parse(schemaData[0].complete_schema);
        if (innerSchema.complete_schema && innerSchema.complete_schema.tables) {
            tables = innerSchema.complete_schema.tables;
        } else if (innerSchema.tables) {
            tables = innerSchema.tables;
        }
    } else if (schemaData.tables) {
        tables = schemaData.tables;
    }

    const targetTables = ['roles', 'permissions', 'building_translations', 'land_parcel_translations'];

    targetTables.forEach(target => {
        const table = tables.find(t => t.name === target);
        if (table) {
            console.log(`\n--- TABLE: ${target} ---`);
            table.columns.forEach(c => console.log(` - ${c.name} (${c.type})`));
        } else {
            console.log(`\n--- TABLE: ${target} NOT FOUND ---`);
        }
    });

} catch (e) {
    console.error('Error parsing schema:', e);
}
