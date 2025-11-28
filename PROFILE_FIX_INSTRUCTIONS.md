# Profile.jsx Manual Fix Instructions

The file editing tool keeps corrupting Profile.jsx. Here are the exact find-and-replace operations needed:

## 1. State Definitions (Lines 62-82)

**Find:**
```jsx
street_name: '',
```

**Replace with:**
```jsx
street_address: '',
```

**Occurrences:** 2 (in addressData and billingAddressData)

## 2. Fetching Logic - Primary Address (Lines 154-164)

**Find:**
```jsx
city_name: address.city || '',
street_name: address.street || '',
```

**Replace with:**
```jsx
city_name: address.city_name || '',
street_address: address.street_address || '',
```

## 3. Fetching Logic - Billing Address (Lines 176-186)

**Find:**
```jsx
city_name: billingAddress.city || '',
street_name: billingAddress.street || '',
```

**Replace with:**
```jsx
city_name: billingAddress.city_name || '',
street_address: billingAddress.street_address || '',
```

## 4. Submission Logic - Primary Address (Lines 298-307)

**Find:**
```jsx
const { country_id, region_id, street_name, city_name, ...restAddressData } = addressData;

const addressPayload = {
  ...restAddressData,
  country_id,
  region_id,
  city: city_name,
  street: street_name,
};
```

**Replace with:**
```jsx
const { country_id, region_id, street_address, city_name, ...restAddressData } = addressData;

const addressPayload = {
  ...restAddressData,
  country_id,
  region_id,
  city_name,
  street_address,
};
```

## 5. Submission Logic - Billing Address (Lines 330-339)

**Find:**
```jsx
const { country_id: billing_country_id, region_id: billing_region_id, street_name: billing_street_name, city_name: billing_city_name, ...restBillingAddressData } = billingAddressData;

const billingAddressPayload = {
  ...restBillingAddressData,
  country_id: billing_country_id,
  region_id: billing_region_id,
  city: billing_city_name,
  street: billing_street_name,
};
```

**Replace with:**
```jsx
const { country_id: billing_country_id, region_id: billing_region_id, street_address: billing_street_address, city_name: billing_city_name, ...restBillingAddressData } = billingAddressData;

const billingAddressPayload = {
  ...restBillingAddressData,
  country_id: billing_country_id,
  region_id: billing_region_id,
  city_name: billing_city_name,
  street_address: billing_street_address,
};
```

## Summary

Total replacements needed:
- `street_name` → `street_address` (in state definitions)
- `address.city` → `address.city_name` (in fetching)
- `address.street` → `address.street_address` (in fetching)
- `city: city_name` → `city_name` (in submission)
- `street: street_name` → `street_address` (in submission)
