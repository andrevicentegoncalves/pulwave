const fs = require('fs');

try {
    const schemaContent = fs.readFileSync('src/schema.md', 'utf8');
    // Remove markdown code block markers if present
    let jsonString = schemaContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    // Sometimes the file might be just the JSON array or object. 
    // The previous view_file showed it starts with `[ { "complete_schema": ...`
    // Let's try to parse it.

    const schemaData = JSON.parse(jsonString);

    // Access the tables list. 
    // Based on previous view_file: schemaData[0].complete_schema is a string containing JSON? 
    // Wait, line 3 of previous view_file: "complete_schema": "{\n ...
    // It seems `complete_schema` value is a STRINGIFIED JSON.

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

    const missingOrgId = [];
    const missingTranslations = [];

    // Tables that are global or system-level and don't need organization_id
    const globalTables = [
        'schema_migrations',
        'spatial_ref_sys',
        'subscription_plans',
        'supported_locales',
        'countries',
        'regions',
        'localities', // Maybe? Geography is usually global
        'currencies',
        'languages'
    ];

    // Tables that might need translations (heuristic: has name/title/description)
    const translatableFields = ['name', 'title', 'description', 'label', 'type_name'];

    tables.forEach(table => {
        const tableName = table.name;
        const columns = table.columns.map(c => c.name);

        // Check Organization ID
        if (!columns.includes('organization_id') && !globalTables.includes(tableName)) {
            missingOrgId.push(tableName);
        }

        // Check Translations
        // Only check if it has text fields that look translatable
        const hasTranslatableContent = columns.some(c => translatableFields.includes(c));
        if (hasTranslatableContent && !columns.includes('translations') && !globalTables.includes(tableName)) {
            // Exclude some technical tables
            if (!tableName.includes('_log') && !tableName.includes('_assignment') && !tableName.includes('_member')) {
                missingTranslations.push(tableName);
            }
        }
    });

    console.log('--- MISSING ORGANIZATION_ID ---');
    console.log(missingOrgId.join('\n'));
    console.log('\n--- POTENTIALLY MISSING TRANSLATIONS ---');
    console.log(missingTranslations.join('\n'));

} catch (e) {
    console.error('Error parsing schema:', e);
}
