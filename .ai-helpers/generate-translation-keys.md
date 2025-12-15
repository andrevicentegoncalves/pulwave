# Translation Key Generation Script

## Purpose
This document provides scripts and methods for extracting translation keys from the codebase to create SQL seed data.

## Method 1: Extract Keys from Codebase (Bash/PowerShell)

### Extract all translation keys used in code:
```bash
# Linux/Mac
grep -rn "\\bt(['\"]" src --include="*.jsx" --include="*.js" | \
  grep -oP "t\(['\"]([a-z_\.]+)['\"]" | \
  sed "s/t(['\"]//" | sed "s/['\"]$//" | \
  sort -u > translation-keys.txt

# PowerShell (Windows)
Select-String -Path src\**\*.jsx,src\**\*.js -Pattern "t\(['\`"]([a-z_\.]+)['\`"]" | `
  ForEach-Object { $_.Matches.Groups[1].Value } | `
  Sort-Object -Unique > translation-keys.txt
```

### Generate SQL from extracted keys:
```bash
# Linux/Mac
cat translation-keys.txt | while read key; do
  category=$(echo $key | cut -d'.' -f1)
  label=$(echo $key | cut -d'.' -f2- | sed 's/_/ /g' | sed 's/\b\(.\)/\u\1/g')
  echo "('$key', 'en-US', '$label', '$category', 'ui', 'published', true),"
done
```

## Method 2: Manual Key List

### Common Patterns for Translation Keys

#### Common Category
```
common.save
common.cancel
common.edit
common.delete
common.add
common.close
common.submit
common.confirm
common.back
common.next
common.previous
common.loading
common.yes
common.no
common.ok
common.search
common.filter
common.reset
common.clear
common.export
common.import
```

#### Navigation Category
```
navigation.home
navigation.dashboard
navigation.profile
navigation.settings
navigation.logout
navigation.admin
navigation.help
navigation.about
```

#### Forms Category
```
forms.required
forms.optional
forms.placeholder
forms.select_option
forms.enter_value
forms.choose_file
forms.drag_drop
```

#### Actions Category
```
actions.create
actions.update
actions.remove
actions.view
actions.download
actions.upload
actions.print
actions.share
```

#### Validation Category
```
validation.required
validation.invalid_email
validation.invalid_phone
validation.invalid_url
validation.min_length
validation.max_length
validation.min_value
validation.max_value
validation.must_match
validation.must_be_unique
```

#### Messages Category
```
messages.success
messages.error
messages.warning
messages.info
messages.saved
messages.deleted
messages.updated
messages.created
messages.loading
messages.processing
```

#### Tables Category
```
tables.no_data
tables.loading
tables.showing_results
tables.per_page
tables.page_of
tables.sort_by
tables.filter_by
tables.search_in
```

## Method 3: SQL Template for Bulk Insert

```sql
-- Template for adding new translation keys
INSERT INTO ui_translations (translation_key, locale_code, translated_text, category, source_type, status, is_active)
VALUES
    -- Category: common
    ('common.new_key', 'en-US', 'New Key Label', 'common', 'ui', 'published', true),

    -- Category: profile
    ('profile.new_field', 'en-US', 'New Field', 'profile', 'ui', 'published', true),

    -- Add more keys here...

ON CONFLICT (translation_key, locale_code) DO NOTHING;
```

## Method 4: Using Node.js Script

Create a file `scripts/extract-translation-keys.js`:

```javascript
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all JS/JSX files
const files = glob.sync('src/**/*.{js,jsx}');

const keys = new Set();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Match t('key') or t("key")
  const matches = content.matchAll(/\bt\(['\`"]([a-z_\.]+)['\`"]\)/g);

  for (const match of matches) {
    keys.add(match[1]);
  }
});

// Group by category
const grouped = {};
Array.from(keys).sort().forEach(key => {
  const category = key.split('.')[0];
  if (!grouped[category]) grouped[category] = [];
  grouped[category].push(key);
});

// Generate SQL
console.log('INSERT INTO ui_translations (translation_key, locale_code, translated_text, category, source_type, status, is_active)');
console.log('VALUES');

const entries = [];
Object.entries(grouped).forEach(([category, categoryKeys]) => {
  categoryKeys.forEach(key => {
    const label = key.split('.').slice(1).join('.')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    entries.push(`    ('${key}', 'en-US', '${label}', '${category}', 'ui', 'published', true)`);
  });
});

console.log(entries.join(',\n'));
console.log('ON CONFLICT (translation_key, locale_code) DO NOTHING;');
```

Run with:
```bash
node scripts/extract-translation-keys.js > translation-keys.sql
```

## Method 5: Python Script

Create `scripts/extract_translation_keys.py`:

```python
import os
import re
from collections import defaultdict

def extract_keys(directory='src'):
    keys = set()

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Find t('key') or t("key")
                    matches = re.findall(r"\bt\(['\"]([a-z_\.]+)['\"]\)", content)
                    keys.update(matches)

    return sorted(keys)

def generate_sql(keys):
    grouped = defaultdict(list)
    for key in keys:
        category = key.split('.')[0]
        grouped[category].append(key)

    print("INSERT INTO ui_translations (translation_key, locale_code, translated_text, category, source_type, status, is_active)")
    print("VALUES")

    entries = []
    for category, category_keys in sorted(grouped.items()):
        for key in category_keys:
            label = ' '.join(word.capitalize() for word in key.split('.')[1:])
            label = label.replace('_', ' ').title()
            entries.append(f"    ('{key}', 'en-US', '{label}', '{category}', 'ui', 'published', true)")

    print(',\n'.join(entries))
    print("ON CONFLICT (translation_key, locale_code) DO NOTHING;")

if __name__ == '__main__':
    keys = extract_keys()
    generate_sql(keys)
```

Run with:
```bash
python scripts/extract_translation_keys.py > translation-keys.sql
```

## Best Practices

1. **Naming Convention**: Always use dot notation: `category.key_name`
2. **Categories**: Group related keys under the same category
3. **Key Names**: Use lowercase with underscores: `profile.first_name`
4. **Labels**: Use Title Case for English: "First Name"
5. **Consistency**: Reuse existing keys when possible
6. **Documentation**: Comment your SQL with categories

## Example Workflow

1. Write code using translation keys:
   ```javascript
   const { t } = useTranslation();
   <Button>{t('actions.save')}</Button>
   ```

2. Extract keys from codebase:
   ```bash
   grep -rn "\\bt(['\"]" src --include="*.jsx" | grep -oP "t\(['\"]([a-z_\.]+)['\"]"
   ```

3. Generate SQL:
   ```bash
   # Run one of the scripts above
   ```

4. Add to migration file or run directly in Supabase

5. Test in UI to verify translations appear

## Notes

- Always check for duplicates before inserting (use `ON CONFLICT DO NOTHING`)
- Start with en-US, then add other locales
- Use the admin translation panel to manage translations after initial seed
- Consider using translation bundles for better performance
