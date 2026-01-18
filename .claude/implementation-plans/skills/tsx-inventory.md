# Pulwave TSX Component Inventory

> Complete inventory of all TSX files in the monorepo
> Generated: 2026-01-18
> **Total Files: 794** (39 apps + 755 packages)

---

## Summary Statistics

| Category | Count |
|----------|-------|
| **Apps** | 39 |
| ├─ apps/web/src | 5 |
| ├─ apps/web/real-estate | 20 |
| └─ apps/web/restaurant | 14 |
| **Packages** | 755 |
| ├─ packages/entities (tests) | 31 |
| ├─ packages/features | 534 |
| ├─ packages/pages | 23 |
| ├─ packages/shared/ui | 178 |
| └─ packages/widgets | 16 |
| **TOTAL** | **794** |

---

## 1. Apps Layer (39 files)

### 1.1 apps/web/src (5 files)
```
apps/web/src/App.tsx
apps/web/src/main.tsx
apps/web/src/providers/index.tsx
apps/web/src/routes/adminRoutes.tsx
apps/web/src/routes/appRoutes.tsx
```

### 1.2 apps/web/real-estate (20 files)
```
apps/web/real-estate/src/App.tsx
apps/web/real-estate/src/main.tsx
apps/web/real-estate/src/pages/AdminPage.tsx
apps/web/real-estate/src/pages/AssetsPage.tsx
apps/web/real-estate/src/pages/AuthCallbackPage.tsx
apps/web/real-estate/src/pages/CommunicationsPage.tsx
apps/web/real-estate/src/pages/CondominiumsPage.tsx
apps/web/real-estate/src/pages/DashboardPage.tsx
apps/web/real-estate/src/pages/DebugTestPage.tsx
apps/web/real-estate/src/pages/DiagnosticPage.tsx
apps/web/real-estate/src/pages/DocumentsPage.tsx
apps/web/real-estate/src/pages/FinancePage.tsx
apps/web/real-estate/src/pages/LeasesPage.tsx
apps/web/real-estate/src/pages/LoginPage.tsx
apps/web/real-estate/src/pages/MaintenancePage.tsx
apps/web/real-estate/src/pages/OnboardingPage.tsx
apps/web/real-estate/src/pages/PropertiesPage.tsx
apps/web/real-estate/src/pages/SettingsPage.tsx
apps/web/real-estate/src/pages/StyleGuidePage.tsx
apps/web/real-estate/src/pages/TenantsPage.tsx
```

### 1.3 apps/web/restaurant (14 files)
```
apps/web/restaurant/src/App.tsx
apps/web/restaurant/src/main.tsx
apps/web/restaurant/src/pages/AdminDashboardPage.tsx
apps/web/restaurant/src/pages/DashboardPage.tsx
apps/web/restaurant/src/pages/InventoryPage.tsx
apps/web/restaurant/src/pages/LoginPage.tsx
apps/web/restaurant/src/pages/MenuPage.tsx
apps/web/restaurant/src/pages/OnboardingPage.tsx
apps/web/restaurant/src/pages/OrdersPage.tsx
apps/web/restaurant/src/pages/ReportsPage.tsx
apps/web/restaurant/src/pages/ReservationsPage.tsx
apps/web/restaurant/src/pages/SettingsPage.tsx
apps/web/restaurant/src/pages/StaffPage.tsx
apps/web/restaurant/src/pages/TablesPage.tsx
```

---

## 2. Packages/Entities - Tests (31 files)

### 2.1 Address, Billing, Feature Flags (3 files)
```
packages/entities/address/hooks/__tests__/useAddress.test.tsx
packages/entities/billing/hooks/__tests__/useBilling.test.tsx
packages/entities/feature-flags/hooks/__tests__/useFeatureFlag.test.tsx
```

### 2.2 Payment (2 files)
```
packages/entities/payment/hooks/__tests__/useCardValidation.test.tsx
packages/entities/payment/hooks/__tests__/usePaymentMethods.test.tsx
```

### 2.3 Profile (15 files)
```
packages/entities/profile/hooks/__tests__/useAddressingData.test.tsx
packages/entities/profile/hooks/__tests__/useAvatarUpload.test.tsx
packages/entities/profile/hooks/__tests__/usePersonalData.test.tsx
packages/entities/profile/hooks/__tests__/usePrivacyData.test.tsx
packages/entities/profile/hooks/__tests__/useProfessionalData.test.tsx
packages/entities/profile/hooks/__tests__/useProfileData.test.tsx
packages/entities/profile/hooks/__tests__/useProfileSubmit.test.tsx
packages/entities/profile/hooks/__tests__/useSecurityData.test.tsx
packages/entities/profile/hooks/__tests__/useSettingsData.test.tsx
packages/entities/profile/hooks/partials/__tests__/useAddressingData.test.tsx
packages/entities/profile/hooks/partials/__tests__/usePersonalData.test.tsx
packages/entities/profile/hooks/partials/__tests__/usePrivacyData.test.tsx
packages/entities/profile/hooks/partials/__tests__/useProfessionalData.test.tsx
packages/entities/profile/hooks/partials/__tests__/useSecurityData.test.tsx
packages/entities/profile/hooks/partials/__tests__/useSettingsData.test.tsx
```

### 2.4 Property, Storage, Subscription (3 files)
```
packages/entities/property/hooks/__tests__/useProperties.test.tsx
packages/entities/storage/hooks/__tests__/useStorage.test.tsx
packages/entities/subscription/hooks/__tests__/useSubscription.test.tsx
```

### 2.5 System (7 files)
```
packages/entities/system/hooks/__tests__/useAdmin.test.tsx
packages/entities/system/hooks/__tests__/useTimezones.test.tsx
packages/entities/system/hooks/admin/__tests__/useAdminDashboard.test.tsx
packages/entities/system/hooks/admin/__tests__/useAdminGenericData.test.tsx
packages/entities/system/hooks/admin/__tests__/useAdminPermissions.test.tsx
packages/entities/system/hooks/admin/__tests__/useAdminTranslations.test.tsx
packages/entities/system/hooks/admin/__tests__/useAdminUsers.test.tsx
```

### 2.6 Translation (1 file)
```
packages/entities/translation/hooks/__tests__/useTranslation.test.tsx
```

---

## 3. Packages/Features (534 files)

### 3.1 Admin (27 files)
```
packages/features/admin/src/audit-logs/RecentActivityTable.tsx
packages/features/admin/src/core/AdminContext.tsx
packages/features/admin/src/core/AdminLoadingState/AdminLoadingState.tsx
packages/features/admin/src/master-data/ColumnTreeSelect/ColumnTreeSelect.tsx
packages/features/admin/src/master-data/EnumMultiSelect/EnumMultiSelect.tsx
packages/features/admin/src/master-data/FullColumnMultiSelect/FullColumnMultiSelect.tsx
packages/features/admin/src/master-data/FullTableMultiSelect/FullTableMultiSelect.tsx
packages/features/admin/src/master-data/MasterDataTypeSelect/MasterDataTypeSelect.tsx
packages/features/admin/src/master-data/MasterDataTypeSelect/MasterDataTypeSelect/MasterDataTypeSelect.tsx
packages/features/admin/src/master-data/MasterDataValueSelect/MasterDataValueSelect.tsx
packages/features/admin/src/master-data/MasterDataValueSelect/MasterDataValueSelect/MasterDataValueSelect.tsx
packages/features/admin/src/permissions/PermissionsMultiSelect/PermissionsMultiSelect.tsx
packages/features/admin/src/permissions/UserPermissionsModal/UserPermissionsModal.tsx
packages/features/admin/src/shell/AdminShell.tsx
packages/features/admin/src/translations/AllTranslationsList.tsx
packages/features/admin/src/translations/components/CircleFlag.tsx
packages/features/admin/src/translations/components/GroupRow.tsx
packages/features/admin/src/translations/forms/ContentTranslationForm.tsx
packages/features/admin/src/translations/forms/EnumTranslationForm.tsx
packages/features/admin/src/translations/forms/MasterDataTranslationForm.tsx
packages/features/admin/src/translations/forms/SchemaTranslationForm.tsx
packages/features/admin/src/translations/forms/TranslationsList.tsx
packages/features/admin/src/translations/forms/UITranslationForm.tsx
packages/features/admin/src/translations/GroupedTranslationList.tsx
packages/features/admin/src/translations/index.tsx
packages/features/admin/src/translations/TranslationFormModal.tsx
packages/features/admin/src/users/UsersList.tsx
```

### 3.2 Auth (8 files)
```
packages/features/auth/src/AuthContext.tsx
packages/features/auth/src/components/AuthSentView.tsx
packages/features/auth/src/components/EmailOtpForm.tsx
packages/features/auth/src/components/MergeAccountModal/MergeAccountModal.tsx
packages/features/auth/src/components/OtpVerifyForm.tsx
packages/features/auth/src/components/WalletConnect.tsx
packages/features/auth/src/wrappers/AuthShell/index.tsx
packages/features/auth/src/wrappers/AuthWrapper/AuthWrapper.tsx
```

### 3.3 Dashboard (1 file)
```
packages/features/dashboard/src/real-estate/RealEstateDashboard.tsx
```

### 3.4 Feedback (1 file)
```
packages/features/feedback/src/ToastProvider.tsx
```

### 3.5 i18n (1 file)
```
packages/features/i18n/src/TranslationContext.tsx
```

### 3.6 Layout (8 files)
```
packages/features/layout/src/components/Header/Header.tsx
packages/features/layout/src/components/Menu/Menu.tsx
packages/features/layout/src/components/MobileBottomNav/MobileBottomNav.tsx
packages/features/layout/src/components/MobileDrawer/MobileDrawer.tsx
packages/features/layout/src/components/MobileHeader/MobileHeader.tsx
packages/features/layout/src/components/NestedMenu/NestedMenu.tsx
packages/features/layout/src/components/Sidebar/Sidebar.tsx
packages/features/layout/src/components/UserInfo/UserInfo.tsx
```

### 3.7 Legal (1 file)
```
packages/features/legal/src/LegalDocumentCard/LegalDocumentCard.tsx
```

### 3.8 Payments (1 file)
```
packages/features/payments/src/utils/payment.tsx
```

### 3.9 Properties (1 file)
```
packages/features/properties/components/BuildingForm/BuildingForm.tsx
```

### 3.10 Settings (25 files)
```
packages/features/settings/src/components/AccountBilling/AccountBilling.tsx
packages/features/settings/src/components/AccountBilling/BillingHistory.tsx
packages/features/settings/src/components/AccountBilling/PaymentMethods.tsx
packages/features/settings/src/components/AddressForm/AddressForm.tsx
packages/features/settings/src/components/AvatarUpload.tsx
packages/features/settings/src/components/BillingSection/BillingSection.tsx
packages/features/settings/src/components/EmergencyContactForm/EmergencyContactForm.tsx
packages/features/settings/src/components/ExportData.tsx
packages/features/settings/src/components/OrganizationSelector.tsx
packages/features/settings/src/components/PersonalInfoSection/PersonalInfoSection.tsx
packages/features/settings/src/components/PreferencesSection/PreferencesSection.tsx
packages/features/settings/src/components/ProfileAddress/ProfileAddress.tsx
packages/features/settings/src/components/ProfileForm.tsx
packages/features/settings/src/components/ProfilePersonal/ProfilePersonal.tsx
packages/features/settings/src/components/ProfileProfessional/ProfileProfessional.tsx
packages/features/settings/src/components/SecuritySection/SecuritySection.tsx
packages/features/settings/src/components/SettingsPreferences/SettingsPreferences.tsx
packages/features/settings/src/components/SettingsPrivacy/SettingsPrivacy.tsx
packages/features/settings/src/components/SettingsSecurity/SettingsSecurity.tsx
packages/features/settings/src/wrappers/PaymentSection.tsx
packages/features/settings/src/wrappers/PreferencesSection.tsx
packages/features/settings/src/wrappers/ProfileSection.tsx
packages/features/settings/src/wrappers/SecuritySection.tsx
packages/features/settings/src/wrappers/SettingsPage.tsx
packages/features/settings/src/wrappers/SettingsShell.tsx
```

### 3.11 Shared (9 files)
```
packages/features/shared/components/AddressAutocomplete/AddressAutocomplete.tsx
packages/features/shared/components/CountriesSelect/CountriesSelect.tsx
packages/features/shared/components/LocaleSelect/LocaleSelect.tsx
packages/features/shared/components/PhoneInputGroup/PhoneInputGroup.tsx
packages/features/shared/components/PhoneSelect/PhoneSelect.tsx
packages/features/shared/components/RegionsSelect/RegionsSelect.tsx
packages/features/shared/components/TimezoneSelect/TimezoneSelect.tsx
packages/features/shared/QueryClientProvider.tsx
packages/features/shared/ThemeContext.tsx
```

### 3.12 Social (1 file)
```
packages/features/social/src/SocialLinksCard/SocialLinksCard.tsx
```

### 3.13 Subscriptions (5 files)
```
packages/features/subscriptions/src/components/SubscriptionPlans.tsx
packages/features/subscriptions/src/wrappers/BillingPage.tsx
packages/features/subscriptions/src/wrappers/CheckoutPage.tsx
packages/features/subscriptions/src/wrappers/PricingPage.tsx
packages/features/subscriptions/src/wrappers/SubscriptionShell.tsx
```

### 3.14 Style Guide (445 files)

#### 3.14.1 Core Components (27 files)
```
packages/features/style-guide/src/components/AccessibilityStatusBadges/AccessibilityStatusBadges.tsx
packages/features/style-guide/src/components/AnatomyDiagram/AnatomyDiagram.tsx
packages/features/style-guide/src/components/ChartLibraryDemo/ChartLibraryDemo.tsx
packages/features/style-guide/src/components/CodeBlock/CodeBlock.tsx
packages/features/style-guide/src/components/ComponentDocPage/ComponentDocPage.tsx
packages/features/style-guide/src/components/ComponentDocPage/sections/AccessibilityTabContent.tsx
packages/features/style-guide/src/components/ComponentDocPage/sections/BehaviorsSection.tsx
packages/features/style-guide/src/components/ComponentDocPage/sections/CodeTabContent.tsx
packages/features/style-guide/src/components/ComponentDocPage/sections/ContentGuidelinesSection.tsx
packages/features/style-guide/src/components/ComponentDocPage/sections/FormattingSection.tsx
packages/features/style-guide/src/components/ComponentDocPage/sections/ModifiersSection.tsx
packages/features/style-guide/src/components/ComponentDocPage/sections/ResponsiveSection.tsx
packages/features/style-guide/src/components/ComponentDocPage/sections/VariantDocsSection.tsx
packages/features/style-guide/src/components/DemoCard/DemoCard.tsx
packages/features/style-guide/src/components/DemoGrid/DemoGrid.tsx
packages/features/style-guide/src/components/FoundationDocPage/FoundationDocPage.tsx
packages/features/style-guide/src/components/Guidance/Guidance.tsx
packages/features/style-guide/src/components/IconLibrary/IconLibrary.tsx
packages/features/style-guide/src/components/KeyboardShortcutTable/KeyboardShortcutTable.tsx
packages/features/style-guide/src/components/LibraryToggle/LibraryToggle.tsx
packages/features/style-guide/src/components/LivePlayground/LivePlayground.tsx
packages/features/style-guide/src/components/PropTable/PropTable.tsx
packages/features/style-guide/src/components/RelatedComponentCards/RelatedComponentCards.tsx
packages/features/style-guide/src/components/StickyLibraryToggle/StickyLibraryToggle.tsx
packages/features/style-guide/src/components/StructureSpec/StructureSpec.tsx
packages/features/style-guide/src/components/StyleGuideLink/StyleGuideLink.tsx
packages/features/style-guide/src/components/TokenTable/TokenTable.tsx
```

#### 3.14.2 Content - Components - Actions (15 files)
```
packages/features/style-guide/src/content/components/actions/Button/demos/ButtonDotDemo.tsx
packages/features/style-guide/src/content/components/actions/Button/demos/ButtonGroupDemo.tsx
packages/features/style-guide/src/content/components/actions/Button/demos/ButtonMatrixDemo.tsx
packages/features/style-guide/src/content/components/actions/Button/demos/ButtonShapesDemo.tsx
packages/features/style-guide/src/content/components/actions/Button/demos/ButtonSizesDemo.tsx
packages/features/style-guide/src/content/components/actions/Button/demos/ButtonStatesDemo.tsx
packages/features/style-guide/src/content/components/actions/Button/demos/ButtonWithIconsDemo.tsx
packages/features/style-guide/src/content/components/actions/Button/demos/FullWidthButtonsDemo.tsx
packages/features/style-guide/src/content/components/actions/Button/demos/IconOnlyButtonsDemo.tsx
packages/features/style-guide/src/content/components/actions/Button/demos/index.tsx
packages/features/style-guide/src/content/components/actions/Button/demos/SplitButtonDemo.tsx
packages/features/style-guide/src/content/components/actions/FloatingActionButton/demos/FloatingActionButtonBasicDemo.tsx
packages/features/style-guide/src/content/components/actions/Link/demos/LinkDemo.tsx
packages/features/style-guide/src/content/components/actions/SegmentedControl/demos/SegmentedControlBasicDemo.tsx
packages/features/style-guide/src/content/components/actions/SplitButton/demos/SplitButtonBasicDemo.tsx
```

#### 3.14.3 Content - Components - Data Display (57 files)
```
packages/features/style-guide/src/content/components/data-display/Accordion/demos/AccordionBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/Avatar/demos/AvatarFallbackDemo.tsx
packages/features/style-guide/src/content/components/data-display/Avatar/demos/AvatarSizesDemo.tsx
packages/features/style-guide/src/content/components/data-display/AvatarGroup/demos/AvatarGroupBasic.demo.tsx
packages/features/style-guide/src/content/components/data-display/Badge/demos/BadgeCountDemo.tsx
packages/features/style-guide/src/content/components/data-display/Badge/demos/BadgeDotDemo.tsx
packages/features/style-guide/src/content/components/data-display/Badge/demos/BadgeIconCircleDemo.tsx
packages/features/style-guide/src/content/components/data-display/Badge/demos/BadgeOutlineDemo.tsx
packages/features/style-guide/src/content/components/data-display/Badge/demos/BadgeSizesDemo.tsx
packages/features/style-guide/src/content/components/data-display/Badge/demos/BadgeStatusDemo.tsx
packages/features/style-guide/src/content/components/data-display/Badge/demos/BadgeVariantsDemo.tsx
packages/features/style-guide/src/content/components/data-display/Badge/demos/BadgeWithIconsDemo.tsx
packages/features/style-guide/src/content/components/data-display/Card/demos/CardBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/Card/demos/CardStructureDemo.tsx
packages/features/style-guide/src/content/components/data-display/Card/demos/CardVariantsDemo.tsx
packages/features/style-guide/src/content/components/data-display/CardGrid/demos/CardFlexGridDemo.tsx
packages/features/style-guide/src/content/components/data-display/CardGrid/demos/CardGridBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/CardGrid/demos/CardGridContentDemo.tsx
packages/features/style-guide/src/content/components/data-display/Chip/demos/BasicUsageDemo.tsx
packages/features/style-guide/src/content/components/data-display/Chip/demos/ChipBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/Chip/demos/ChipSelectableDemo.tsx
packages/features/style-guide/src/content/components/data-display/CircleFlag/demos/CircleFlagBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/ColumnChips/demos/ColumnChipsBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/DataList/demos/DataListDraggable.tsx
packages/features/style-guide/src/content/components/data-display/DataList/demos/DataListRichDemo.tsx
packages/features/style-guide/src/content/components/data-display/DataList/demos/DataListSelection.tsx
packages/features/style-guide/src/content/components/data-display/DataTable/demos/DataTableBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/GroupRow/demos/GroupRowBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/GroupRow/docs/GroupRowDoc.tsx
packages/features/style-guide/src/content/components/data-display/Icon/demos/IconBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/InfiniteScroll/demos/InfiniteScrollBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/KpiCard/demos/KpiCardBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/LocaleSelector/demos/LocaleSelectorBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/Logo/demos/LogoBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/Logo/docs/LogoDoc.tsx
packages/features/style-guide/src/content/components/data-display/NumberedList/demos/NumberedListBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/NumberedList/docs/NumberedListDoc.tsx
packages/features/style-guide/src/content/components/data-display/Progress/demos/ProgressBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/Progress/demos/ProgressCircularDemo.tsx
packages/features/style-guide/src/content/components/data-display/Progress/demos/ProgressColorDemo.tsx
packages/features/style-guide/src/content/components/data-display/Progress/demos/ProgressIndeterminateDemo.tsx
packages/features/style-guide/src/content/components/data-display/Progress/demos/ProgressSizeDemo.tsx
packages/features/style-guide/src/content/components/data-display/Progress/demos/ProgressStepsDemo.tsx
packages/features/style-guide/src/content/components/data-display/Progress/demos/ProgressValuesDemo.tsx
packages/features/style-guide/src/content/components/data-display/RatingStars/demos/RatingStarsBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/StatCard/demos/StatCardBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/StatusIndicator/demos/StatusIndicatorBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/StatusIndicator/demos/StatusIndicatorPulseDemo.tsx
packages/features/style-guide/src/content/components/data-display/Tag/demos/BasicUsageDemo.tsx
packages/features/style-guide/src/content/components/data-display/Tag/demos/TagBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/Tag/demos/TagRemovableDemo.tsx
packages/features/style-guide/src/content/components/data-display/Timeline/demos/TimelineDemo.tsx
packages/features/style-guide/src/content/components/data-display/TreeView/demos/TreeViewBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/VerificationBadge/demos/VerificationBadgeBasicDemo.tsx
packages/features/style-guide/src/content/components/data-display/VisualEffect/demos/VisualEffectBasicDemo.tsx
```

#### 3.14.4 Content - Components - Feedback (15 files)
```
packages/features/style-guide/src/content/components/feedback/Alert/demos/AlertBasicDemo.tsx
packages/features/style-guide/src/content/components/feedback/Alert/demos/AlertDismissibleDemo.tsx
packages/features/style-guide/src/content/components/feedback/Alert/demos/AlertTypesDemo.tsx
packages/features/style-guide/src/content/components/feedback/Alert/demos/AlertVariantsDemo.tsx
packages/features/style-guide/src/content/components/feedback/ConfirmationModal/demos/ConfirmationModalBasicDemo.tsx
packages/features/style-guide/src/content/components/feedback/EmptyState/demos/EmptyStateBasicDemo.tsx
packages/features/style-guide/src/content/components/feedback/Modal/demos/ModalBasicDemo.tsx
packages/features/style-guide/src/content/components/feedback/Modal/demos/ModalSizesDemo.tsx
packages/features/style-guide/src/content/components/feedback/PageLoader/demos/index.tsx
packages/features/style-guide/src/content/components/feedback/Skeleton/demos/SkeletonEnhancementDemo.tsx
packages/features/style-guide/src/content/components/feedback/Skeleton/demos/SkeletonVariantsDemo.tsx
packages/features/style-guide/src/content/components/feedback/Spinner/demos/SpinnerSizesDemo.tsx
packages/features/style-guide/src/content/components/feedback/Toast/demos/ToastTypesDemo.tsx
packages/features/style-guide/src/content/components/feedback/Tooltip/demos/TooltipPlacementDemo.tsx
```

#### 3.14.5 Content - Components - Inputs (51 files)
```
packages/features/style-guide/src/content/components/inputs/Checkbox/demos/CheckboxStatesDemo.tsx
packages/features/style-guide/src/content/components/inputs/CheckboxGroup/demos/CheckboxGroupBasicDemo.tsx
packages/features/style-guide/src/content/components/inputs/CheckboxGroup/demos/CheckboxGroupHorizontalDemo.tsx
packages/features/style-guide/src/content/components/inputs/ColorPicker/demos/ColorPickerDemo.tsx
packages/features/style-guide/src/content/components/inputs/Combobox/demos/ComboboxCreatableDemo.tsx
packages/features/style-guide/src/content/components/inputs/Combobox/demos/ComboboxDemo.tsx
packages/features/style-guide/src/content/components/inputs/Combobox/demos/ComboboxMultiDemo.tsx
packages/features/style-guide/src/content/components/inputs/Combobox/demos/ComboboxSizesDemo.tsx
packages/features/style-guide/src/content/components/inputs/Combobox/demos/ComboboxVirtualDemo.tsx
packages/features/style-guide/src/content/components/inputs/DatePicker/demos/DatePickerDemo.tsx
packages/features/style-guide/src/content/components/inputs/DatePicker/demos/DatePickerSizesDemo.tsx
packages/features/style-guide/src/content/components/inputs/FileUpload/demos/FileUploadDemo.tsx
packages/features/style-guide/src/content/components/inputs/InlineEdit/demos/InlineEditBasicDemo.tsx
packages/features/style-guide/src/content/components/inputs/Input/demos/InputFullWidthDemo.tsx
packages/features/style-guide/src/content/components/inputs/Input/demos/InputHelperTextDemo.tsx
packages/features/style-guide/src/content/components/inputs/Input/demos/InputRequiredDemo.tsx
packages/features/style-guide/src/content/components/inputs/Input/demos/InputSizesDemo.tsx
packages/features/style-guide/src/content/components/inputs/Input/demos/InputStatesDemo.tsx
packages/features/style-guide/src/content/components/inputs/Input/demos/InputTypesDemo.tsx
packages/features/style-guide/src/content/components/inputs/Input/demos/InputWithIconsDemo.tsx
packages/features/style-guide/src/content/components/inputs/Label/demos/LabelDemo.tsx
packages/features/style-guide/src/content/components/inputs/Radio/demos/RadioDemo.tsx
packages/features/style-guide/src/content/components/inputs/RichTextEditor/demos/RichTextEditorBasic.demo.tsx
packages/features/style-guide/src/content/components/inputs/RichTextEditor/demos/RichTextEditorBasicDemo.tsx
packages/features/style-guide/src/content/components/inputs/RichTextEditor/docs/RichTextEditorDoc.tsx
packages/features/style-guide/src/content/components/inputs/SearchFilter/demos/BasicUsageDemo.tsx
packages/features/style-guide/src/content/components/inputs/SearchInput/demos/SearchInputBasicDemo.tsx
packages/features/style-guide/src/content/components/inputs/SearchInput/demos/SearchInputSizesDemo.tsx
packages/features/style-guide/src/content/components/inputs/Select/demos/DatabaseSelectsDemo.tsx
packages/features/style-guide/src/content/components/inputs/Select/demos/GeographySelectsDemo.tsx
packages/features/style-guide/src/content/components/inputs/Select/demos/GroupedSelectDemo.tsx
packages/features/style-guide/src/content/components/inputs/Select/demos/IconSelectDemo.tsx
packages/features/style-guide/src/content/components/inputs/Select/demos/SelectBasicDemo.tsx
packages/features/style-guide/src/content/components/inputs/Select/demos/SelectCustomOptionDemo.tsx
packages/features/style-guide/src/content/components/inputs/Select/demos/SelectMultiDemo.tsx
packages/features/style-guide/src/content/components/inputs/Select/demos/SelectSearchableDemo.tsx
packages/features/style-guide/src/content/components/inputs/Select/demos/SelectSizesDemo.tsx
packages/features/style-guide/src/content/components/inputs/Select/demos/SelectStatesDemo.tsx
packages/features/style-guide/src/content/components/inputs/Select/demos/TreeSelectDemo.tsx
packages/features/style-guide/src/content/components/inputs/SidebarToggle/demos/SidebarToggleBasicDemo.tsx
packages/features/style-guide/src/content/components/inputs/Slider/demos/SliderBasicDemo.tsx
packages/features/style-guide/src/content/components/inputs/Switch/demos/SwitchStatesDemo.tsx
packages/features/style-guide/src/content/components/inputs/TextArea/demos/TextAreaBasicDemo.tsx
packages/features/style-guide/src/content/components/inputs/TextArea/demos/TextAreaStatesDemo.tsx
packages/features/style-guide/src/content/components/inputs/ThemeToggle/demos/ThemeToggleBasicDemo.tsx
packages/features/style-guide/src/content/components/inputs/TimePicker/demos/TimePickerDemo.tsx
packages/features/style-guide/src/content/components/inputs/TimePicker/demos/TimePickerSizesDemo.tsx
packages/features/style-guide/src/content/components/inputs/TransferList/demos/TransferListDemo.tsx
```

#### 3.14.6 Content - Components - Layout (10 files)
```
packages/features/style-guide/src/content/components/layout/Box/demos/BoxBasicDemo.tsx
packages/features/style-guide/src/content/components/layout/Box/demos/BoxVariantsDemo.tsx
packages/features/style-guide/src/content/components/layout/Divider/demos/DividerBasicDemo.tsx
packages/features/style-guide/src/content/components/layout/FormGrid/demos/FormGridBasicDemo.tsx
packages/features/style-guide/src/content/components/layout/Grid/demos/GridBasicDemo.tsx
packages/features/style-guide/src/content/components/layout/Inline/demos/InlineBasicDemo.tsx
packages/features/style-guide/src/content/components/layout/ScrollArea/demos/ScrollAreaBasicDemo.tsx
packages/features/style-guide/src/content/components/layout/SectionHeader/demos/SectionHeaderBasicDemo.tsx
packages/features/style-guide/src/content/components/layout/SplitPane/demos/SplitPaneBasic.demo.tsx
packages/features/style-guide/src/content/components/layout/Stack/demos/StackBasicDemo.tsx
```

#### 3.14.7 Content - Components - Navigation (27 files)
```
packages/features/style-guide/src/content/components/navigation/Breadcrumbs/demos/BreadcrumbsDemo.tsx
packages/features/style-guide/src/content/components/navigation/BurgerMenu/demos/BurgerMenuBasicDemo.tsx
packages/features/style-guide/src/content/components/navigation/BurgerMenu/demos/BurgerMenuStatesDemo.tsx
packages/features/style-guide/src/content/components/navigation/BurgerMenu/demos/index.tsx
packages/features/style-guide/src/content/components/navigation/Menu/demos/MenuBasicDemo.tsx
packages/features/style-guide/src/content/components/navigation/MobileHeader/demos/index.tsx
packages/features/style-guide/src/content/components/navigation/MobileHeader/demos/MobileHeaderBasicDemo.tsx
packages/features/style-guide/src/content/components/navigation/MobileHeader/demos/MobileHeaderMinimalDemo.tsx
packages/features/style-guide/src/content/components/navigation/NestedSidebar/demos/NestedSidebarBasicDemo.tsx
packages/features/style-guide/src/content/components/navigation/Pagination/demos/PaginationBasicDemo.tsx
packages/features/style-guide/src/content/components/navigation/SidebarSection/demos/SidebarSectionBasicDemo.tsx
packages/features/style-guide/src/content/components/navigation/SidebarSection/docs/SidebarSectionDoc.tsx
packages/features/style-guide/src/content/components/navigation/Stepper/demos/StepperDemo.tsx
packages/features/style-guide/src/content/components/navigation/Tabs/demos/TabsBasicLineDemo.tsx
packages/features/style-guide/src/content/components/navigation/Tabs/demos/TabsBasicStackedDemo.tsx
packages/features/style-guide/src/content/components/navigation/Tabs/demos/TabsBorderedDemo.tsx
packages/features/style-guide/src/content/components/navigation/Tabs/demos/TabsFlushDemo.tsx
packages/features/style-guide/src/content/components/navigation/Tabs/demos/TabsFullWidthDemo.tsx
packages/features/style-guide/src/content/components/navigation/Tabs/demos/TabsIconDemo.tsx
packages/features/style-guide/src/content/components/navigation/Tabs/demos/TabsIconsDemo.tsx
packages/features/style-guide/src/content/components/navigation/Tabs/demos/TabsPillsDemo.tsx
packages/features/style-guide/src/content/components/navigation/Tabs/demos/TabsSizeDemo.tsx
packages/features/style-guide/src/content/components/navigation/Tabs/demos/TabsSliderDemo.tsx
packages/features/style-guide/src/content/components/navigation/Tabs/demos/TabsSliderSoftDemo.tsx
packages/features/style-guide/src/content/components/navigation/Tabs/demos/TabsVerticalDemo.tsx
```

#### 3.14.8 Content - Components - Overlays (16 files)
```
packages/features/style-guide/src/content/components/overlays/Command/demos/CommandPrimitiveDemo.tsx
packages/features/style-guide/src/content/components/overlays/Command/docs/CommandDoc.tsx
packages/features/style-guide/src/content/components/overlays/CommandPalette/demos/CommandPaletteDemo.tsx
packages/features/style-guide/src/content/components/overlays/Drawer/demos/DrawerDemo.tsx
packages/features/style-guide/src/content/components/overlays/Drawer/demos/DrawerPositionsDemo.tsx
packages/features/style-guide/src/content/components/overlays/Drawer/demos/DrawerResponsiveDemo.tsx
packages/features/style-guide/src/content/components/overlays/Drawer/demos/DrawerSizesDemo.tsx
packages/features/style-guide/src/content/components/overlays/Dropdown/demos/DropdownAlignmentDemo.tsx
packages/features/style-guide/src/content/components/overlays/Dropdown/demos/DropdownBasicDemo.tsx
packages/features/style-guide/src/content/components/overlays/Dropdown/demos/DropdownGroupedDemo.tsx
packages/features/style-guide/src/content/components/overlays/Dropdown/demos/DropdownWithIconsDemo.tsx
packages/features/style-guide/src/content/components/overlays/Dropdown/demos/index.tsx
packages/features/style-guide/src/content/components/overlays/Popover/demos/PopoverDemo.tsx
packages/features/style-guide/src/content/components/overlays/Popover/demos/PopoverPlacementsDemo.tsx
packages/features/style-guide/src/content/components/overlays/Popover/demos/PopoverTriggersDemo.tsx
```

#### 3.14.9 Content - Components - Typography (5 files)
```
packages/features/style-guide/src/content/components/typography/Text/demos/TextBasicDemo.tsx
packages/features/style-guide/src/content/components/typography/Text/demos/TextCategoriesDemo.tsx
packages/features/style-guide/src/content/components/typography/Text/demos/TextColorsDemo.tsx
packages/features/style-guide/src/content/components/typography/Text/demos/TextFormattingDemo.tsx
packages/features/style-guide/src/content/components/typography/Text/demos/TextSizesDemo.tsx
```

#### 3.14.10 Content - Data Visualization (128 files)
See full list in sections below...

#### 3.14.11 Content - Foundation (32 files)
```
packages/features/style-guide/src/content/foundation/Accessibility/demos/AccessibilityDemo.tsx
packages/features/style-guide/src/content/foundation/Borders/demos/BordersDemo.tsx
packages/features/style-guide/src/content/foundation/Breakpoints/demos/BreakpointsDemo.tsx
packages/features/style-guide/src/content/foundation/Color/demos/ColorScaleDemo.tsx
packages/features/style-guide/src/content/foundation/Color/demos/ColorTokenSection.tsx
packages/features/style-guide/src/content/foundation/Color/demos/index.tsx
packages/features/style-guide/src/content/foundation/Color/demos/SemanticColorsDemo.tsx
packages/features/style-guide/src/content/foundation/concepts/Accessibility/demos/AnnounceDemo.tsx
packages/features/style-guide/src/content/foundation/concepts/Density/demos/DensityDemo.tsx
packages/features/style-guide/src/content/foundation/concepts/RTL/demos/RTLDemo.tsx
packages/features/style-guide/src/content/foundation/concepts/Setup/demos/PulwaveProviderBasicDemo.tsx
packages/features/style-guide/src/content/foundation/concepts/Setup/docs/PulwaveProviderDoc.tsx
packages/features/style-guide/src/content/foundation/Elevation/demos/ElevationScaleDemo.tsx
packages/features/style-guide/src/content/foundation/Elevation/demos/ZIndexScaleDemo.tsx
packages/features/style-guide/src/content/foundation/Grid/demos/ElevationScaleDemo.tsx
packages/features/style-guide/src/content/foundation/Grid/demos/index.tsx
packages/features/style-guide/src/content/foundation/Iconography/demos/IconSizeScaleDemo/IconSizeScaleDemo.tsx
packages/features/style-guide/src/content/foundation/Iconography/demos/IconStrokeWidthDemo/IconStrokeWidthDemo.tsx
packages/features/style-guide/src/content/foundation/Iconography/docs/IconGuidelinesPage/IconGuidelinesPage.tsx
packages/features/style-guide/src/content/foundation/Iconography/docs/IconLibraryPage/IconLibraryPage.tsx
packages/features/style-guide/src/content/foundation/Iconography/docs/IconLibraryShell/IconLibraryShell.tsx
packages/features/style-guide/src/content/foundation/Motion/demos/MotionBasicDemo.tsx
packages/features/style-guide/src/content/foundation/Spacing/demos/index.tsx
packages/features/style-guide/src/content/foundation/Spacing/demos/SpacingScaleDemo.tsx
packages/features/style-guide/src/content/foundation/Spacing/demos/SpacingTokenSection.tsx
packages/features/style-guide/src/content/foundation/Typography/demos/FontWeightsDemo.tsx
packages/features/style-guide/src/content/foundation/Typography/demos/index.tsx
packages/features/style-guide/src/content/foundation/Typography/demos/TypeScaleDemo.tsx
packages/features/style-guide/src/content/foundation/Typography/demos/TypographyTokenSection.tsx
packages/features/style-guide/src/content/foundation/ZIndex/demos/ZIndexDemo.tsx
```

#### 3.14.12 Content - Patterns (29 files)
```
packages/features/style-guide/src/content/patterns/data/BulkActionBar/demos/BasicUsageDemo.tsx
packages/features/style-guide/src/content/patterns/data/DataTransferButton/demos/DataTransferBasicDemo.tsx
packages/features/style-guide/src/content/patterns/data/ExportData/demos/ExportDataBasicDemo.tsx
packages/features/style-guide/src/content/patterns/data/FilterableDataTable/demos/BasicUsageDemo.tsx
packages/features/style-guide/src/content/patterns/data/ImportModal/demos/ImportModalBasicDemo.tsx
packages/features/style-guide/src/content/patterns/data/ImportModal/docs/ImportModalDoc.tsx
packages/features/style-guide/src/content/patterns/display/Cards/demos/CardsBasicDemo.tsx
packages/features/style-guide/src/content/patterns/display/Cards/docs/CardsDoc.tsx
packages/features/style-guide/src/content/patterns/display/Carousel/demos/CarouselAutoPlayDemo.tsx
packages/features/style-guide/src/content/patterns/display/Carousel/demos/CarouselBasicDemo.tsx
packages/features/style-guide/src/content/patterns/display/Carousel/demos/CarouselMultipleDemo.tsx
packages/features/style-guide/src/content/patterns/display/Carousel/demos/CarouselNavigationDemo.tsx
packages/features/style-guide/src/content/patterns/form/demos/ContactFormDefaultBgDemo.tsx
packages/features/style-guide/src/content/patterns/form/demos/ContactFormDemo.tsx
packages/features/style-guide/src/content/patterns/form/demos/LoginFormDemo.tsx
packages/features/style-guide/src/content/patterns/form/docs/FormsPage.tsx
packages/features/style-guide/src/content/patterns/form/Form/demos/FormActionsDemo.tsx
packages/features/style-guide/src/content/patterns/form/Form/demos/FormBasicDemo.tsx
packages/features/style-guide/src/content/patterns/form/Form/demos/FormHorizontalDemo.tsx
packages/features/style-guide/src/content/patterns/form/Form/demos/FormWithRowsDemo.tsx
packages/features/style-guide/src/content/patterns/layout/ContentLayout/demos/index.tsx
packages/features/style-guide/src/content/patterns/layout/HeaderLayout/demos/index.tsx
packages/features/style-guide/src/content/patterns/layout/PageLayout/demos/index.tsx
packages/features/style-guide/src/content/patterns/layout/SectionLayout/demos/SectionLayoutBasicDemo.tsx
packages/features/style-guide/src/content/patterns/layout/SidebarLayout/demos/index.tsx
packages/features/style-guide/src/content/patterns/process/AvatarUpload/demos/AvatarUploadBasicDemo.tsx
packages/features/style-guide/src/content/patterns/process/Wizard/demos/WizardBasicDemo.tsx
packages/features/style-guide/src/content/patterns/search/SearchFilter/demos/SearchFilterBasicDemo.tsx
```

#### 3.14.13 Content - Utilities (15 files)
```
packages/features/style-guide/src/content/utilities/accessibility/FocusTrap/demos/FocusTrapBasicDemo.tsx
packages/features/style-guide/src/content/utilities/accessibility/FocusTrap/demos/FocusTrapModalDemo.tsx
packages/features/style-guide/src/content/utilities/accessibility/FocusTrap/demos/index.tsx
packages/features/style-guide/src/content/utilities/accessibility/LiveRegion/demos/LiveRegionBasicDemo.tsx
packages/features/style-guide/src/content/utilities/accessibility/LiveRegion/docs/LiveRegionDoc.tsx
packages/features/style-guide/src/content/utilities/accessibility/SkipLink/demos/SkipLinkBasicDemo.tsx
packages/features/style-guide/src/content/utilities/accessibility/SkipLink/docs/SkipLinkDoc.tsx
packages/features/style-guide/src/content/utilities/accessibility/VisuallyHidden/demos/index.tsx
packages/features/style-guide/src/content/utilities/accessibility/VisuallyHidden/demos/VisuallyHiddenContextDemo.tsx
packages/features/style-guide/src/content/utilities/accessibility/VisuallyHidden/demos/VisuallyHiddenIconButtonDemo.tsx
packages/features/style-guide/src/content/utilities/accessibility/VisuallyHidden/demos/VisuallyHiddenSkipLinkDemo.tsx
packages/features/style-guide/src/content/utilities/error-handling/ErrorBoundary/demos/ErrorBoundaryBasicDemo.tsx
packages/features/style-guide/src/content/utilities/error-handling/ErrorBoundary/demos/ErrorBoundaryCustomFallbackDemo.tsx
packages/features/style-guide/src/content/utilities/error-handling/ErrorBoundary/demos/ErrorBoundaryWithCallbackDemo.tsx
```

#### 3.14.14 Contexts & Pages (2 files)
```
packages/features/style-guide/src/contexts/ChartLibraryContext.tsx
packages/features/style-guide/src/pages/StyleGuideShell.tsx
```

---

## 4. Packages/Pages (23 files)

### 4.1 Admin Pages (9 files)
```
packages/pages/admin/src/pages/AdminPage.tsx
packages/pages/admin/src/pages/AdminShell.tsx
packages/pages/admin/src/pages/AuditLogsPage.tsx
packages/pages/admin/src/pages/ConfigurationPage.tsx
packages/pages/admin/src/pages/DashboardPage.tsx
packages/pages/admin/src/pages/FeatureFlagsPage.tsx
packages/pages/admin/src/pages/MasterDataPage.tsx
packages/pages/admin/src/pages/PermissionsPage.tsx
packages/pages/admin/src/pages/RetentionPage.tsx
```

### 4.2 Auth Pages (2 files)
```
packages/pages/auth/src/pages/AuthCallbackPage/AuthCallbackPage.tsx
packages/pages/auth/src/pages/AuthPage/AuthPage.tsx
```

### 4.3 Onboarding (1 file)
```
packages/pages/onboarding/wrappers/OnboardingPage.tsx
```

### 4.4 Shell Layouts (8 files)
```
packages/pages/shell/src/layouts/AppShell/AppShell.tsx
packages/pages/shell/src/layouts/BaseBlankLayout/BaseBlankLayout.tsx
packages/pages/shell/src/layouts/BaseSidebarLayout/BaseSidebarLayout.tsx
packages/pages/shell/src/layouts/HeaderShell/HeaderShell.tsx
packages/pages/shell/src/layouts/MobileShell/MobileShell.tsx
packages/pages/shell/src/layouts/NestedSidebarShell/DraggableMenu.tsx
packages/pages/shell/src/layouts/NestedSidebarShell/NestedSidebarShell.tsx
packages/pages/shell/src/layouts/SidebarShell/SidebarShell.tsx
```

### 4.5 Style Guide Pages (2 files)
```
packages/pages/style-guide/src/pages/IconLibraryPage.tsx
packages/pages/style-guide/src/pages/StyleGuidePage.tsx
```

---

## 5. Packages/Shared/UI (178 files)

### 5.1 UI Components (96 files)
```
packages/shared/ui/components/Accordion/Accordion.tsx
packages/shared/ui/components/Alert/Alert.tsx
packages/shared/ui/components/Avatar/Avatar.tsx
packages/shared/ui/components/AvatarGroup/AvatarGroup.tsx
packages/shared/ui/components/Badge/Badge.tsx
packages/shared/ui/components/Box/Box.tsx
packages/shared/ui/components/Breadcrumbs/Breadcrumbs.tsx
packages/shared/ui/components/BurgerMenu/BurgerMenu.tsx
packages/shared/ui/components/Button/Button.tsx
packages/shared/ui/components/Card/Card.tsx
packages/shared/ui/components/CardGrid/CardFlexGrid.tsx
packages/shared/ui/components/CardGrid/CardGrid.tsx
packages/shared/ui/components/Checkbox/Checkbox.tsx
packages/shared/ui/components/CheckboxGroup/CheckboxGroup.tsx
packages/shared/ui/components/Chip/Chip.tsx
packages/shared/ui/components/CircleFlag/CircleFlag.tsx
packages/shared/ui/components/ColorPicker/ColorPicker.tsx
packages/shared/ui/components/ColumnChips/ColumnChips.tsx
packages/shared/ui/components/Combobox/Combobox.tsx
packages/shared/ui/components/Command/Command.tsx
packages/shared/ui/components/ConfirmationModal/ConfirmationModal.tsx
packages/shared/ui/components/DataList/DataList.tsx
packages/shared/ui/components/DataTable/DataTable.tsx
packages/shared/ui/components/DatePicker/DatePicker.tsx
packages/shared/ui/components/Divider/Divider.tsx
packages/shared/ui/components/Drawer/Drawer.tsx
packages/shared/ui/components/Dropdown/Dropdown.tsx
packages/shared/ui/components/EmptyState/EmptyState.tsx
packages/shared/ui/components/ErrorBoundary/ErrorBoundary.tsx
packages/shared/ui/components/FileUpload/FileUpload.tsx
packages/shared/ui/components/FloatingActionButton/FloatingActionButton.tsx
packages/shared/ui/components/FocusTrap/FocusTrap.tsx
packages/shared/ui/components/Form/Form.tsx
packages/shared/ui/components/Form/FormField.tsx
packages/shared/ui/components/FormGrid/FormGrid.tsx
packages/shared/ui/components/Grid/Grid.tsx
packages/shared/ui/components/GroupRow/GroupRow.tsx
packages/shared/ui/components/Icon/Icon.tsx
packages/shared/ui/components/InfiniteScroll/InfiniteScroll.tsx
packages/shared/ui/components/Inline/Inline.tsx
packages/shared/ui/components/InlineEdit/InlineEdit.tsx
packages/shared/ui/components/Input/Input.tsx
packages/shared/ui/components/KpiCard/KpiCard.tsx
packages/shared/ui/components/Label/Label.tsx
packages/shared/ui/components/Link/Link.tsx
packages/shared/ui/components/LiveRegion/LiveRegion.tsx
packages/shared/ui/components/LocaleSelector/LocaleSelector.tsx
packages/shared/ui/components/Logo/Logo.tsx
packages/shared/ui/components/Menu/Menu.tsx
packages/shared/ui/components/MobileHeader/MobileHeader.tsx
packages/shared/ui/components/Modal/Modal.tsx
packages/shared/ui/components/NumberedList/NumberedList.tsx
packages/shared/ui/components/PageLoader/PageLoader.tsx
packages/shared/ui/components/Pagination/Pagination.tsx
packages/shared/ui/components/Popover/Popover.tsx
packages/shared/ui/components/Progress/Progress.tsx
packages/shared/ui/components/PulwaveProvider/PulwaveProvider.tsx
packages/shared/ui/components/Radio/Radio.tsx
packages/shared/ui/components/Radio/RadioGroup.tsx
packages/shared/ui/components/RatingStars/RatingStars.tsx
packages/shared/ui/components/RichTextEditor/RichTextEditor.tsx
packages/shared/ui/components/ScrollArea/ScrollArea.tsx
packages/shared/ui/components/SearchInput/SearchInput.tsx
packages/shared/ui/components/SectionHeader/SectionHeader.tsx
packages/shared/ui/components/SegmentedControl/SegmentedControl.tsx
packages/shared/ui/components/Select/Select.tsx
packages/shared/ui/components/SidebarBase/SidebarBase.tsx
packages/shared/ui/components/SidebarSection/SidebarSection.tsx
packages/shared/ui/components/SidebarToggle/SidebarToggle.tsx
packages/shared/ui/components/Skeleton/Skeleton.tsx
packages/shared/ui/components/SkipLink/SkipLink.tsx
packages/shared/ui/components/Slider/Slider.tsx
packages/shared/ui/components/Spinner/Spinner.tsx
packages/shared/ui/components/SplitButton/SplitButton.tsx
packages/shared/ui/components/SplitPane/SplitPane.tsx
packages/shared/ui/components/Stack/Stack.tsx
packages/shared/ui/components/StatCard/StatCard.tsx
packages/shared/ui/components/StatusIndicator/StatusIndicator.tsx
packages/shared/ui/components/Stepper/Stepper.tsx
packages/shared/ui/components/Switch/Switch.tsx
packages/shared/ui/components/Tabs/Tabs.tsx
packages/shared/ui/components/Tag/Tag.tsx
packages/shared/ui/components/Text/Text.tsx
packages/shared/ui/components/TextArea/TextArea.tsx
packages/shared/ui/components/ThemeToggle/ThemeToggle.tsx
packages/shared/ui/components/Timeline/Timeline.tsx
packages/shared/ui/components/TimePicker/TimePicker.tsx
packages/shared/ui/components/Toast/Toast.tsx
packages/shared/ui/components/Toast/ToastProvider.tsx
packages/shared/ui/components/Tooltip/Tooltip.tsx
packages/shared/ui/components/TransferList/TransferList.tsx
packages/shared/ui/components/TreeView/TreeView.tsx
packages/shared/ui/components/VerificationBadge/VerificationBadge.tsx
packages/shared/ui/components/VisualEffect/VisualEffect.tsx
packages/shared/ui/components/VisuallyHidden/VisuallyHidden.tsx
```

### 5.2 Data Visualization - Charts (60 files)

#### Cartesian Charts (18 files)
```
packages/shared/ui/data-visualization/charts/cartesian/AccumulatedLineChart/AccumulatedLineChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/AreaChart/AreaChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/BarChart/BarChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/CandlestickChart/CandlestickChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/DivergingBarChart/DivergingBarChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/DotPlotChart/DotPlotChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/DualAxisChart/DualAxisChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/LineChart/LineChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/LollipopChart/LollipopChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/ScatterChart/ScatterChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/SplineLineChart/SplineLineChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/StackedBarChart/StackedBarChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/StepAreaChart/StepAreaChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/StepLineChart/StepLineChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/StreamGraph/StreamGraph.tsx
packages/shared/ui/data-visualization/charts/cartesian/ThresholdAreaChart/ThresholdAreaChart.tsx
packages/shared/ui/data-visualization/charts/cartesian/WaterfallChart/WaterfallChart.tsx
```

#### Compact Charts (6 files)
```
packages/shared/ui/data-visualization/charts/compact/BulletChart/BulletChart.tsx
packages/shared/ui/data-visualization/charts/compact/ParliamentChart/ParliamentChart.tsx
packages/shared/ui/data-visualization/charts/compact/PerformanceGauge/PerformanceGauge.tsx
packages/shared/ui/data-visualization/charts/compact/PictogramChart/PictogramChart.tsx
packages/shared/ui/data-visualization/charts/compact/SparklineChart/SparklineChart.tsx
packages/shared/ui/data-visualization/charts/compact/WaffleChart/WaffleChart.tsx
```

#### Geography Charts (4 files)
```
packages/shared/ui/data-visualization/charts/geography/BubbleMapChart/BubbleMapChart.tsx
packages/shared/ui/data-visualization/charts/geography/CountryMapChart/CountryMapChart.tsx
packages/shared/ui/data-visualization/charts/geography/GeoChart/GeoChart.tsx
packages/shared/ui/data-visualization/charts/geography/WorldMapChart/WorldMapChart.tsx
```

#### Hierarchical Charts (12 files)
```
packages/shared/ui/data-visualization/charts/hierarchical/BubblePackChart/BubblePackChart.tsx
packages/shared/ui/data-visualization/charts/hierarchical/ChordDiagram/ChordDiagram.tsx
packages/shared/ui/data-visualization/charts/hierarchical/FlowChart/FlowChart.tsx
packages/shared/ui/data-visualization/charts/hierarchical/FunnelChart/FunnelChart.tsx
packages/shared/ui/data-visualization/charts/hierarchical/MekkoChart/MekkoChart.tsx
packages/shared/ui/data-visualization/charts/hierarchical/NetworkDiagram/NetworkDiagram.tsx
packages/shared/ui/data-visualization/charts/hierarchical/OrgChart/OrgChart.tsx
packages/shared/ui/data-visualization/charts/hierarchical/PyramidChart/PyramidChart.tsx
packages/shared/ui/data-visualization/charts/hierarchical/SankeyDiagram/SankeyDiagram.tsx
packages/shared/ui/data-visualization/charts/hierarchical/SunburstChart/SunburstChart.tsx
packages/shared/ui/data-visualization/charts/hierarchical/TreemapChart/TreemapChart.tsx
packages/shared/ui/data-visualization/charts/hierarchical/VennDiagram/VennDiagram.tsx
```

#### Radial Charts (11 files)
```
packages/shared/ui/data-visualization/charts/radial/CircularLineChart/CircularLineChart.tsx
packages/shared/ui/data-visualization/charts/radial/DonutChart/DonutChart.tsx
packages/shared/ui/data-visualization/charts/radial/GaugeChart/GaugeChart.tsx
packages/shared/ui/data-visualization/charts/radial/NestedPieChart/NestedPieChart.tsx
packages/shared/ui/data-visualization/charts/radial/PieChart/PieChart.tsx
packages/shared/ui/data-visualization/charts/radial/PolarAreaChart/PolarAreaChart.tsx
packages/shared/ui/data-visualization/charts/radial/ProgressRingsChart/ProgressRingsChart.tsx
packages/shared/ui/data-visualization/charts/radial/RadarChart/RadarChart.tsx
packages/shared/ui/data-visualization/charts/radial/RadialBarChart/RadialBarChart.tsx
packages/shared/ui/data-visualization/charts/radial/RoseChart/RoseChart.tsx
packages/shared/ui/data-visualization/charts/radial/SpiralPlot/SpiralPlot.tsx
```

#### Statistical Charts (7 files)
```
packages/shared/ui/data-visualization/charts/statistical/BoxPlotChart/BoxPlotChart.tsx
packages/shared/ui/data-visualization/charts/statistical/HeatmapChart/HeatmapChart.tsx
packages/shared/ui/data-visualization/charts/statistical/HistogramChart/HistogramChart.tsx
packages/shared/ui/data-visualization/charts/statistical/ParallelCoordinatesPlot/ParallelCoordinatesPlot.tsx
packages/shared/ui/data-visualization/charts/statistical/PopulationPyramidChart/PopulationPyramidChart.tsx
packages/shared/ui/data-visualization/charts/statistical/ViolinPlot/ViolinPlot.tsx
packages/shared/ui/data-visualization/charts/statistical/WordCloudChart/WordCloudChart.tsx
```

#### Timeline Charts (2 files)
```
packages/shared/ui/data-visualization/charts/timeline/GanttChart/GanttChart.tsx
packages/shared/ui/data-visualization/charts/timeline/TimelineChart/TimelineChart.tsx
```

### 5.3 Data Visualization - Primitives & Components (22 files)
```
packages/shared/ui/data-visualization/components/SVGTooltip/SVGTooltip.tsx
packages/shared/ui/data-visualization/primitives/ArcRenderer/ArcRenderer.tsx
packages/shared/ui/data-visualization/primitives/AreaSeries/AreaSeries.tsx
packages/shared/ui/data-visualization/primitives/BarSeries/BarSeries.tsx
packages/shared/ui/data-visualization/primitives/ChartAnnotation/ChartAnnotation.tsx
packages/shared/ui/data-visualization/primitives/ChartAxes/ChartAxes.tsx
packages/shared/ui/data-visualization/primitives/ChartAxisTick/ChartAxisTick.tsx
packages/shared/ui/data-visualization/primitives/ChartBrush/ChartBrush.tsx
packages/shared/ui/data-visualization/primitives/ChartContainer/ChartContainer.tsx
packages/shared/ui/data-visualization/primitives/ChartDefs/ChartDefs.tsx
packages/shared/ui/data-visualization/primitives/ChartGrid/ChartGrid.tsx
packages/shared/ui/data-visualization/primitives/ChartLegend/ChartLegend.tsx
packages/shared/ui/data-visualization/primitives/ChartLegend/ChartLegendLayer.tsx
packages/shared/ui/data-visualization/primitives/ChartShell/ChartShell.tsx
packages/shared/ui/data-visualization/primitives/ChartTooltip/ChartTooltip.tsx
packages/shared/ui/data-visualization/primitives/ChartTooltip/ChartTooltipLayer.tsx
packages/shared/ui/data-visualization/primitives/ChartZoom/ChartZoom.tsx
packages/shared/ui/data-visualization/primitives/LineSeries/LineSeries.tsx
packages/shared/ui/data-visualization/primitives/PieSeries/PieSeries.tsx
packages/shared/ui/data-visualization/primitives/ScatterSeries/ScatterSeries.tsx
```

### 5.4 Data Visualization - Providers (5 files)
```
packages/shared/ui/data-visualization/providers/adapters/visx/components/index.tsx
packages/shared/ui/data-visualization/providers/adapters/visx/components/LineChart.tsx
packages/shared/ui/data-visualization/providers/adapters/visx/components/ResponsiveContainer.tsx
packages/shared/ui/data-visualization/providers/adapters/visx/examples/VISXLineChartExample.tsx
packages/shared/ui/data-visualization/providers/ChartProvider.tsx
```

### 5.5 Icon Library (3 files)
```
packages/shared/ui/icon-library/custom/BoxSelect.tsx
packages/shared/ui/icon-library/custom/FunctionSquare.tsx
packages/shared/ui/icon-library/custom/RulerIcon.tsx
```

---

## 6. Packages/Widgets (16 files)

### 6.1 Data Display (6 files)
```
packages/widgets/data-display/AvatarUpload/AvatarUpload.tsx
packages/widgets/data-display/BulkActionBar/BulkActionBar.tsx
packages/widgets/data-display/Carousel/Carousel.tsx
packages/widgets/data-display/ErrorState/index.tsx
packages/widgets/data-display/FilterableDataTable/FilterableDataTable.tsx
packages/widgets/data-display/SearchFilter/SearchFilter.tsx
```

### 6.2 Data Transfer (3 files)
```
packages/widgets/data-transfer/DataTransferButton/DataTransferButton.tsx
packages/widgets/data-transfer/ExportData/ExportData.tsx
packages/widgets/data-transfer/ImportModal/ImportModal.tsx
```

### 6.3 Feedback (1 file)
```
packages/widgets/feedback/LoadingState.tsx
```

### 6.4 Forms (1 file)
```
packages/widgets/forms/Wizard/Wizard.tsx
```

### 6.5 Layout (5 files)
```
packages/widgets/layout/ContentLayout/ContentLayout.tsx
packages/widgets/layout/HeaderLayout/HeaderLayout.tsx
packages/widgets/layout/PageLayout/PageLayout.tsx
packages/widgets/layout/SectionLayout/SectionLayout.tsx
packages/widgets/layout/SidebarLayout/SidebarLayout.tsx
```

---

## Quick Reference by Package

| Package | Files | Category |
|---------|-------|----------|
| apps/web/src | 5 | App Shell |
| apps/web/real-estate | 20 | App Pages |
| apps/web/restaurant | 14 | App Pages |
| packages/entities | 31 | Tests |
| packages/features/admin | 27 | Feature |
| packages/features/auth | 8 | Feature |
| packages/features/dashboard | 1 | Feature |
| packages/features/feedback | 1 | Feature |
| packages/features/i18n | 1 | Feature |
| packages/features/layout | 8 | Feature |
| packages/features/legal | 1 | Feature |
| packages/features/payments | 1 | Feature |
| packages/features/properties | 1 | Feature |
| packages/features/settings | 25 | Feature |
| packages/features/shared | 9 | Feature |
| packages/features/social | 1 | Feature |
| packages/features/subscriptions | 5 | Feature |
| packages/features/style-guide | 445 | Style Guide |
| packages/pages/admin | 9 | Page |
| packages/pages/auth | 2 | Page |
| packages/pages/onboarding | 1 | Page |
| packages/pages/shell | 8 | Layout |
| packages/pages/style-guide | 2 | Page |
| packages/shared/ui/components | 96 | UI Component |
| packages/shared/ui/data-visualization | 82 | Chart |
| packages/widgets | 16 | Widget |

---

*Generated: 2026-01-18*
*Total TSX Files: 794*
