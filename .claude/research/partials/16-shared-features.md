# Shared Features Matrix

> Comprehensive breakdown of features shared across all Pulwave products

---

## Feature Tiers

### TIER 1 - Core Infrastructure (All Apps)

| Package | Description | DB Schema |
|---------|-------------|-----------|
| `shared/auth` | Authentication, guards, session | Uses Supabase Auth |
| `shared/profile` | User profile management | `global.profiles` |
| `shared/shell` | App shell, navigation, layout | - |
| `shared/i18n` | Translations, locale switching | `global.translations` |
| `shared/geography` | Countries, regions, addresses | `global.countries/regions/cities` |
| `shared/org` | Organization management | `platform.organizations` |
| `shared/feature-flags` | Feature flag system | `platform.feature_flags` |
| `shared/theme` | Theme switching, dark mode | - |
| `shared/a11y` | Accessibility utilities | - |
| `shared/uploads` | File upload utilities | Supabase Storage |
| `shared/notifications` | Push + in-app notifications | `platform.notifications` |
| `shared/analytics` | Event tracking, reporting | `platform.analytics_events` |
| `shared/monitoring` | Error tracking, performance | External (Sentry) |
| `shared/security` | CSRF, XSS protection | - |
| `shared/seo` | Meta tags, Open Graph | - |
| `shared/export` | CSV, PDF, Excel export | - |

### TIER 2 - Commerce (All Apps)

| Package | Description | DB Schema |
|---------|-------------|-----------|
| `shared/payments` | Cash, card, terminal, transfers | `platform.payments`, `platform.payment_methods` |
| `shared/commerce` | Cart, checkout flow | `platform.carts`, `platform.cart_items`, `platform.orders` |
| `shared/invoicing` | Invoice generation, PDF | `platform.invoices`, `platform.invoice_items` |
| `shared/promotions` | Discounts, coupons | `platform.promotions`, `platform.coupons` |
| `shared/inventory` | Stock levels, movements | `platform.inventory_items`, `platform.inventory_movements` |

### TIER 3 - Booking

| Package | Description | DB Schema |
|---------|-------------|-----------|
| `shared/booking` | Reservations, scheduling | `platform.reservations`, `platform.booking_slots` |
| `shared/calendar` | Calendar views, availability | Uses booking schema |
| `shared/availability` | Slot checking, capacity | Domain-specific |

### TIER 4 - Customer Engagement

| Package | Description | DB Schema |
|---------|-------------|-----------|
| `shared/reviews` | Customer reviews, ratings | `platform.reviews` |
| `shared/loyalty` | Points, rewards, programs | `platform.loyalty_programs`, `platform.loyalty_points` |
| `shared/engagement` | CRM basics, customer lists | `platform.customers` |

### TIER 5 - SaaS Infrastructure

| Package | Description | DB Schema |
|---------|-------------|-----------|
| `shared/billing` | Subscriptions, plans, Stripe | `platform.subscriptions` |
| `shared/admin` | Admin panel framework | Various |
| `shared/settings` | User/org settings pages | `platform.settings` |

---

## Product Feature Usage

### Real Estate

| Feature | Usage |
|---------|-------|
| Payments | Rent collection, deposits, service fees |
| Invoicing | Monthly rent invoices, expense reports |
| Inventory | Property supplies, maintenance parts |
| Calendar | Maintenance scheduling, lease dates |
| Promotions | Move-in specials, referral discounts |
| Notifications | Rent reminders, maintenance updates |

### Restaurant

| Feature | Usage |
|---------|-------|
| Payments | Order payments (dine-in, takeout, delivery) |
| Commerce | Order taking, cart management |
| Invoicing | Receipt generation, supplier invoices |
| Inventory | Ingredient stock, supplies |
| Booking | Table reservations |
| Reviews | Customer feedback |
| Promotions | Happy hour, daily specials |
| Loyalty | Repeat customer rewards |

### Boleta (E-commerce)

| Feature | Usage |
|---------|-------|
| Payments | Online orders, gift purchases |
| Commerce | Shopping cart, checkout |
| Invoicing | Order receipts, corporate invoices |
| Inventory | Cake production batches, packaging |
| Calendar | Delivery scheduling, pickup slots |
| Reviews | Product reviews, testimonials |
| Promotions | Seasonal specials, bulk discounts |
| Loyalty | Repeat customer rewards, referrals |

### Molhaqui (Marketing & Booking)

| Feature | Usage |
|---------|-------|
| Payments | Reservation deposits, event payments |
| Invoicing | Event invoices, catering quotes |
| Booking | Table reservations, private events |
| Calendar | Availability display, event scheduling |
| Reviews | Restaurant reviews, testimonials |
| Promotions | Special menus, tourism packages |
| Loyalty | Regular guest rewards, wine club |

---

## Polymorphic Patterns

All shared features use **polymorphic references** for maximum flexibility:

| Pattern | Fields | Supports |
|---------|--------|----------|
| **Payable** | `payable_type`, `payable_id` | Orders, rent, invoices, deposits, subscriptions |
| **Orderable** | `item_type`, `item_id` | Products, menu items, services, rentals |
| **Reviewable** | `reviewable_type`, `reviewable_id` | Products, orders, restaurants, properties |
| **Documentable** | `documentable_type`, `documentable_id` | Leases, invoices, orders, products |
| **Inventoriable** | `item_type`, `item_id` | Products, ingredients, supplies, parts |
| **Reservable** | `resource_type`, `resource_id` | Tables, rooms, equipment, service slots |

---

## Future-Proofing

The shared packages are designed to support future verticals:

| Future App | Primary Packages |
|------------|------------------|
| Inventory SaaS | inventory, commerce, invoicing, export |
| Grocery Store | commerce, inventory, payments, promotions, loyalty |
| Retail POS | commerce, payments, inventory, promotions |
| Warehouse | inventory, export, analytics |
| Event Management | booking, calendar, payments, invoicing |
| Service Business | booking, payments, invoicing, calendar |

---

## Theme Strategy

Each app needs:
- **Main Theme**: App-specific primary theme (brand colors, typography)
- **Accessibility Modes**: Minimalist, High Contrast, Compact, Color Blind

| App | Theme Style | Accent Focus |
|-----|-------------|--------------|
| Real Estate | Professional Blue | Trust-evoking |
| Restaurant | Warm/Appetizing | Food-centric |
| Boleta | Traditional/Regional | Alentejo heritage |
| Molhaqui | Évora/Tourism | Portuguese warmth |

---

## See Also

| Related Topic | Document |
|---------------|----------|
| Database design | [03-database-design.md](./03-database-design.md) |
| Code structure | [04-code-structure.md](./04-code-structure.md) |
| Platform overview | [01-overview.md](./01-overview.md) |
| Supabase integration | [12-supabase-integration.md](./12-supabase-integration.md) |
