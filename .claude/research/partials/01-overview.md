# Pulwave Platform Overview

> Multi-App, Multi-Tenant Platform with Shared Services

---

## Requirements

| Requirement | Description |
|-------------|-------------|
| **Multi-App** | Platform supports N apps (real-estate, restaurant, goncalvinhos/*) |
| **Multi-Tenant** | Each app supports N tenants (organizations) |
| **Shared Global Tables** | profiles, translations, geography, master_data |
| **Shared Style Guide** | One design system across all apps |
| **Shared Admin** | One admin panel with app-specific sections |
| **Extractable** | Any app can be extracted to standalone with minimal effort |

---

## Products

### Real Estate (`products/real-estate/`)
**SaaS for comprehensive property management**

A full-featured property management platform covering:
- **Residential**: Apartments, houses, condominiums
- **Commercial**: Office spaces, retail locations
- **Personal Assets**: Garages, parking spaces, storage units
- **Community Management**: HOA/condominium administration, common areas

Key features: Tenant management, lease tracking, maintenance requests, rent collection, financial reporting, document management.

---

### Restaurant (`products/restaurant/`)
**SaaS for restaurant operations management**

Complete restaurant management solution:
- Menu management and pricing
- Table reservations and floor planning
- Order processing (dine-in, takeout, delivery)
- Kitchen display and workflow
- Inventory and supplier management
- Staff scheduling

---

### Goncalvinhos Family Business (`products/goncalvinhos/`)
Two apps for a family business based in Évora, Portugal:

#### Boleta (`goncalvinhos/boleta/`)
**Regional delicacy e-commerce and promotion**

Dedicated app for **Boleta de Évora** - a traditional regional cake from Évora, Alentejo. Features:
- Product showcase and storytelling (history, tradition, craftsmanship)
- Online ordering and delivery scheduling
- Gift packaging and corporate orders
- Event catering (weddings, festivals, corporate events)
- Local pickup coordination
- Seasonal promotions and limited editions

#### Molhaqui (`goncalvinhos/molhaqui/`)
**Restaurant marketing and booking platform**

App for **Molhaqui** - a restaurant in Évora, Portugal. Features:
- Restaurant presentation and menu showcase
- Online table reservations
- Special events and private dining bookings
- Marketing campaigns and loyalty programs
- Customer reviews and feedback
- Integration with local tourism (Évora UNESCO heritage)
- Wine pairing recommendations (Alentejo wines)

---

## Key Entities

```
PLATFORM
├── Apps
│   ├── real-estate      ← Property management SaaS
│   ├── restaurant       ← Restaurant operations SaaS
│   └── goncalvinhos/    ← Family business (Évora, Portugal)
│       ├── boleta       ← Regional cake e-commerce
│       └── molhaqui     ← Restaurant marketing & booking
├── Tenants/Organizations (per app or cross-app)
├── Users/Profiles (global, can access multiple apps)
└── Shared Services (auth, billing, translations, geography)
```

---

## Core Principles

1. **Single Database, Multiple Schemas** - Cost-effective, easy cross-schema joins
2. **Soft References** - App tables use org_id without FK constraints for extraction flexibility
3. **Hard References** - Global tables (profiles, countries) can have FK constraints
4. **Per-Org-Per-App Billing** - Subscriptions tied to (org_id, app_id) tuple
5. **Per-Org-Per-App Roles** - Users can have different roles in different orgs/apps

---

## Shared Features Matrix

All products share common platform capabilities:

| Feature | Real Estate | Restaurant | Boleta | Molhaqui |
|---------|:-----------:|:----------:|:------:|:--------:|
| **TIER 1 - Core (All Apps)** |
| Authentication | ✅ | ✅ | ✅ | ✅ |
| User Profile | ✅ | ✅ | ✅ | ✅ |
| i18n/Translations | ✅ | ✅ | ✅ | ✅ |
| Geography/Address | ✅ | ✅ | ✅ | ✅ |
| Organizations | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ |
| **TIER 2 - Commerce** |
| Payments | ✅ | ✅ | ✅ | ✅ |
| Invoicing | ✅ | ✅ | ✅ | ✅ |
| Inventory | ✅ | ✅ | ✅ | ✅ |
| Promotions | ✅ | ✅ | ✅ | ✅ |
| **TIER 3 - Booking** |
| Reservations | ⚪ | ✅ | ⚪ | ✅ |
| Calendar | ✅ | ✅ | ✅ | ✅ |
| **TIER 4 - Engagement** |
| Reviews | ⚪ | ✅ | ✅ | ✅ |
| Loyalty | ⚪ | ⚪ | ✅ | ✅ |
| **TIER 5 - SaaS Only** |
| Billing/Subscriptions | ✅ | ✅ | ⚪ | ⚪ |
| Admin Panel | ✅ | ✅ | ⚪ | ⚪ |

**Legend**: ✅ Active | ⚪ Future/Optional

> See [16-shared-features.md](./16-shared-features.md) for detailed feature breakdown.

---

## Agnostic Design Philosophy

The platform is designed to support **future vertical apps** beyond the initial 4:

- **Inventory Management SaaS** - Standalone warehouse/stock management
- **Grocery Store** - Supermarket operations
- **Retail POS** - Point of sale for any retail business
- **Event Management** - Event booking and coordination

All platform tables use **polymorphic references** to enable cross-domain linking without hard dependencies.

> See [03-database-design.md](./03-database-design.md) for polymorphic patterns.

---

## See Also

| Related Topic | Document |
|---------------|----------|
| Database design | [03-database-design.md](./03-database-design.md) |
| Code structure | [04-code-structure.md](./04-code-structure.md) |
| Architecture decisions | [09-architecture-decisions.md](./09-architecture-decisions.md) |
| Shared features matrix | [16-shared-features.md](./16-shared-features.md) |
