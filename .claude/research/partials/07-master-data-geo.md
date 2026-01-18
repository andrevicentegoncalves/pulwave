# Master Data & Geographic Systems

> Based on existing implementation in schema-ai.md

---

## 1. Master Data Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MASTER DATA SYSTEM ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Master data provides configurable lookup values without hardcoding enums.  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      MASTER_DATA_TYPES                               │   │
│  │  Defines categories of master data                                  │   │
│  │                                                                      │   │
│  │  ├── type_key (PK)    : 'setting_categories'                       │   │
│  │  ├── type_label       : 'Setting Categories'                        │   │
│  │  ├── description      : 'Categories for system settings'            │   │
│  │  └── is_active        : true                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              │ 1:N                                          │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      MASTER_DATA_VALUES                              │   │
│  │  Actual values for each type                                        │   │
│  │                                                                      │   │
│  │  ├── type_key (FK)    : 'setting_categories'                       │   │
│  │  ├── value_key        : 'profile'                                   │   │
│  │  ├── value_label      : 'Profile Settings'                          │   │
│  │  ├── value_data       : { "icon": "user", "order": 1 }             │   │
│  │  ├── display_order    : 1                                           │   │
│  │  └── is_active        : true                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  EXAMPLE MASTER DATA TYPES:                                                 │
│  ──────────────────────────                                                 │
│  ┌─────────────────────────┬───────────────────────────────────────────┐   │
│  │  type_key               │  Example values                           │   │
│  ├─────────────────────────┼───────────────────────────────────────────┤   │
│  │  setting_categories     │  profile, notifications, security, billing│   │
│  │  translation_categories │  common, profile, validation, admin       │   │
│  │  property_types         │  residential, commercial, mixed, land     │   │
│  │  unit_types             │  apartment, studio, penthouse, retail     │   │
│  │  lease_types            │  fixed, month_to_month, weekly            │   │
│  │  maintenance_categories │  plumbing, electrical, hvac, structural   │   │
│  │  payment_methods        │  bank_transfer, credit_card, check, cash  │   │
│  │  industries             │  technology, healthcare, finance, retail  │   │
│  │  relationship_types     │  spouse, parent, sibling, friend, other   │   │
│  └─────────────────────────┴───────────────────────────────────────────┘   │
│                                                                              │
│  BENEFITS OVER HARDCODED ENUMS:                                            │
│  ─────────────────────────────                                              │
│  ✅ Values can be added/modified without code changes                      │
│  ✅ Can be translated (via content_translations)                           │
│  ✅ Can store extra metadata in value_data JSONB                           │
│  ✅ Can be org-specific (for custom categories)                            │
│  ✅ Can be disabled without deleting                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Geographic Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       GEOGRAPHIC DATA ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Three-level hierarchy for address selection:                               │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          COUNTRIES                                   │   │
│  │  ├── id (PK)                                                        │   │
│  │  ├── code              : 'PT' (ISO 3166-1 alpha-2)                 │   │
│  │  ├── name              : 'Portugal'                                 │   │
│  │  ├── phone_code        : '+351'                                    │   │
│  │  └── is_active         : true                                       │   │
│  └───────────────────────────────┬─────────────────────────────────────┘   │
│                                  │ 1:N                                      │
│                                  ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                   ADMINISTRATIVE_DIVISIONS                           │   │
│  │  (States, Provinces, Regions, Districts)                            │   │
│  │  ├── id (PK)                                                        │   │
│  │  ├── country_id (FK)   : → countries                               │   │
│  │  ├── name              : 'Lisboa'                                   │   │
│  │  ├── division_type     : 'district' | 'state' | 'province'         │   │
│  │  ├── code              : 'LIS'                                      │   │
│  │  └── is_active         : true                                       │   │
│  └───────────────────────────────┬─────────────────────────────────────┘   │
│                                  │ 1:N                                      │
│                                  ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        LOCALITIES                                    │   │
│  │  (Cities, Towns, Villages, Municipalities)                          │   │
│  │  ├── id (PK)                                                        │   │
│  │  ├── admin_division_id : → administrative_divisions                │   │
│  │  ├── name              : 'Lisboa'                                   │   │
│  │  ├── place_type        : 'city' | 'town' | 'village'               │   │
│  │  └── is_active         : true                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  USAGE IN ADDRESS SELECTION:                                                │
│  ───────────────────────────                                                │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │  1. User selects Country    →  Load divisions for that country   │      │
│  │  2. User selects Division   →  Load localities for that division │      │
│  │  3. User selects Locality   →  Address is complete               │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                              │
│  CASCADING DROPDOWNS:                                                       │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                   │
│  │   Country ▼   │→ │  District ▼   │→ │    City ▼    │                   │
│  │  [Portugal]   │  │   [Lisboa]    │  │  [Lisboa]    │                   │
│  └───────────────┘  └───────────────┘  └───────────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Timezone Support

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TIMEZONE ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          TIMEZONES                                   │   │
│  │  IANA timezone database                                              │   │
│  │                                                                      │   │
│  │  ├── id (PK)                                                        │   │
│  │  ├── tz_identifier     : 'Europe/Lisbon' (IANA format)             │   │
│  │  ├── display_name      : '(UTC+00:00) Lisbon'                       │   │
│  │  ├── utc_offset        : '+00:00' (current offset)                 │   │
│  │  ├── display_order     : 100 (for UI sorting)                       │   │
│  │  └── is_active         : true                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  PROFILE TIMEZONE:                                                          │
│  ─────────────────                                                          │
│  profiles.timezone → timezones.tz_identifier                               │
│                                                                              │
│  TIMEZONE DISPLAY GROUPS (for UI):                                          │
│  ────────────────────────────────                                          │
│  • Americas                                                                 │
│  • Europe                                                                   │
│  • Asia/Pacific                                                             │
│  • Africa                                                                   │
│                                                                              │
│  DATE/TIME FORMATTING:                                                      │
│  ─────────────────────                                                      │
│  • Server stores all timestamps in UTC (TIMESTAMPTZ)                       │
│  • Client converts to user's timezone for display                          │
│  • API accepts/returns ISO 8601 format with timezone                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Usage Examples

### Master Data Select Component

```tsx
import { useMasterData } from '@pulwave/data';
import { Select } from '@pulwave/ui';

const PropertyTypeSelect = () => {
  const { data: types } = useMasterData('property_types');

  return (
    <Select
      options={types.map(t => ({
        value: t.value_key,
        label: t.value_label,
        icon: t.value_data?.icon
      }))}
    />
  );
};
```

### Geographic Cascading Selects

```tsx
import { useCountries, useDivisions, useLocalities } from '@pulwave/shared-geography';

const AddressForm = () => {
  const [country, setCountry] = useState(null);
  const [division, setDivision] = useState(null);

  const { data: countries } = useCountries();
  const { data: divisions } = useDivisions(country?.id);
  const { data: localities } = useLocalities(division?.id);

  return (
    <>
      <Select label="Country" options={countries} onChange={setCountry} />
      <Select label="Region" options={divisions} onChange={setDivision} disabled={!country} />
      <Select label="City" options={localities} disabled={!division} />
    </>
  );
};
```
