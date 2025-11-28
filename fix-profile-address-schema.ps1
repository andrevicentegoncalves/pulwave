$file = "src\pages\Profile.jsx"
$content = Get-Content $file -Raw

# Update address state structure (lines 62-71)
$content = $content -replace "city_name: '',\s+street_name: ''", "country_id: '',`r`n    region_id: '',`r`n    city_name: '',`r`n    street_address: '',`r`n    street_address_2: ''"

# Update billing address state structure (lines 73-82)
$content = $content -replace "(?<=billingAddressData.*?country_id: '',\s+region_id: '',\s+)city_name: '',\s+street_name: ''", "city_name: '',`r`n    street_address: '',`r`n    street_address_2: ''"

# Update fetching logic - primary address (lines 154-164)
$content = $content -replace "city_name: address\.city \|\| '',\s+street_name: address\.street \|\| ''", "country_id: address.country_id || '',`r`n                region_id: address.region_id || '',`r`n                city_name: address.city_name || '',`r`n                street_address: address.street_address || '',`r`n                street_address_2: address.street_address_2 || ''"

# Update fetching logic - billing address (lines 176-186)
$content = $content -replace "(?<=billingAddressData.*?country_id: billingAddress\.country_id.*?)city_name: billingAddress\.city \|\| '',\s+street_name: billingAddress\.street \|\| ''", "city_name: billingAddress.city_name || '',`r`n                street_address: billingAddress.street_address || '',`r`n                street_address_2: billingAddress.street_address_2 || ''"

# Update submission logic - primary address (lines 298-307)
$content = $content -replace "const \{ country_id, region_id, street_name, city_name, \.\.\.restAddressData \} = addressData;", "const { country_id, region_id, city_name, street_address, street_address_2, ...restAddressData } = addressData;"
$content = $content -replace "(?<=addressPayload = \{.*?country_id,\s+region_id,\s+)city: city_name,\s+street: street_name,", "city_name,`r`n        street_address,`r`n        street_address_2,"

# Update submission logic - billing address (lines 330-339)
$content = $content -replace "const \{ country_id: billing_country_id, region_id: billing_region_id, street_name: billing_street_name, city_name: billing_city_name, \.\.\.restBillingAddressData \} = billingAddressData;", "const { country_id: billing_country_id, region_id: billing_region_id, city_name: billing_city_name, street_address: billing_street_address, street_address_2: billing_street_address_2, ...restBillingAddressData } = billingAddressData;"
$content = $content -replace "(?<=billingAddressPayload = \{.*?region_id: billing_region_id,\s+)city: billing_city_name,\s+street: billing_street_name,", "city_name: billing_city_name,`r`n        street_address: billing_street_address,`r`n        street_address_2: billing_street_address_2,"

# Add audit columns to submission
$content = $content -replace "(?<=const addressPayload = \{[^}]+)\}", "  created_by: addressId ? undefined : user.id,`r`n        updated_by: user.id,`r`n      }"
$content = $content -replace "(?<=const billingAddressPayload = \{[^}]+)\}", "  created_by: billingAddressId ? undefined : user.id,`r`n        updated_by: user.id,`r`n      }"

Set-Content $file $content -NoNewline

Write-Host "Profile.jsx updated successfully!"
