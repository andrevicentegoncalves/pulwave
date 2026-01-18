# Round 25: Remaining Phases Plan

**Status**: 📋 PLANNING (Agents working on Phase 3)

---

## Phase 4: Features - Other Packages

**Estimated**: ~74 files
**Approach**: 3-4 parallel agents by feature category

### Admin Features (~26 files)
**Package**: `packages/features/admin/src/`

**Categories**:
- **Audit Logs** (1 file): RecentActivityTable.tsx
- **Core** (2 files): AdminContext.tsx, AdminLoadingState.tsx
- **Shell** (1 file): AdminShell.tsx
- **Master Data** (11 files):
  - ColumnTreeSelect, EnumMultiSelect, FullColumnMultiSelect, FullTableMultiSelect
  - MasterDataTypeSelect (2 files), MasterDataValueSelect (2 files)
- **Permissions** (2 files): PermissionsMultiSelect, UserPermissionsModal
- **Translations** (12 files):
  - AllTranslationsList, GroupedTranslationList, TranslationFormModal
  - Forms: UITranslationForm, ContentTranslationForm, EnumTranslationForm, MasterDataTranslationForm, SchemaTranslationForm, TranslationsList
  - Components: CircleFlag, GroupRow
  - index.tsx

**Agent Task**: Migrate all admin React.FC to function declarations

---

### Auth Features (~7 files)
**Package**: `packages/features/auth/src/`

**Files**:
- components/AuthSentView.tsx
- components/EmailOtpForm.tsx
- components/MergeAccountModal.tsx
- components/OtpVerifyForm.tsx
- components/WalletConnect.tsx
- wrappers/AuthShell/index.tsx
- wrappers/AuthWrapper/AuthWrapper.tsx

**Agent Task**: Migrate all auth React.FC to function declarations

---

### Settings Features (~12 files)
**Package**: `packages/features/settings/src/`

**Files**:
- components/AccountBilling/AccountBilling.tsx
- components/AccountBilling/BillingHistory.tsx
- components/AccountBilling/PaymentMethods.tsx
- components/AddressForm/AddressForm.tsx
- components/AvatarUpload.tsx
- components/BillingSection/BillingSection.tsx
- components/EmergencyContactForm/EmergencyContactForm.tsx
- components/ExportData.tsx
- components/OrganizationSelector.tsx
- components/PersonalInfoSection/PersonalInfoSection.tsx
- components/PreferencesSection/PreferencesSection.tsx
- components/ProfileAddress/ProfileAddress.tsx
- components/ProfilePersonal/ProfilePersonal.tsx
- components/ProfileProfessional/ProfileProfessional.tsx
- components/SecuritySection/SecuritySection.tsx
- components/SettingsPreferences/SettingsPreferences.tsx
- components/SettingsPrivacy/SettingsPrivacy.tsx
- components/SettingsSecurity/SettingsSecurity.tsx
- wrappers/SettingsPage.tsx
- wrappers/SettingsShell.tsx

**Agent Task**: Migrate all settings React.FC to function declarations

---

### Shared Features (~22 files)
**Package**: `packages/features/shared/`

**Files**:
- components/AddressAutocomplete/AddressAutocomplete.tsx
- components/CountriesSelect/CountriesSelect.tsx
- components/LocaleSelect/LocaleSelect.tsx
- components/PhoneInputGroup/PhoneInputGroup.tsx
- components/PhoneSelect/PhoneSelect.tsx
- components/RegionsSelect/RegionsSelect.tsx
- components/TimezoneSelect/TimezoneSelect.tsx
- QueryClientProvider.tsx
- ThemeContext.tsx

**Agent Task**: Migrate all shared React.FC to function declarations

---

### Layout Features (~6 files)
**Package**: `packages/features/layout/src/`

**Files**:
- components/Menu/Menu.tsx
- components/MobileBottomNav/MobileBottomNav.tsx
- components/MobileDrawer/MobileDrawer.tsx
- components/MobileHeader/MobileHeader.tsx
- components/NestedMenu/NestedMenu.tsx
- components/UserInfo/UserInfo.tsx

**Agent Task**: Migrate all layout React.FC to function declarations

---

### Other Features (6 files - 1 each)
- **Dashboard**: features/dashboard/src/real-estate/RealEstateDashboard.tsx
- **Feedback**: features/feedback/src/ToastProvider.tsx
- **Legal**: features/legal/src/LegalDocumentCard/LegalDocumentCard.tsx
- **Properties**: features/properties/components/BuildingForm/BuildingForm.tsx
- **Social**: features/social/src/SocialLinksCard/SocialLinksCard.tsx
- **Subscriptions**: features/subscriptions/src/components/SubscriptionPlans.tsx

**Approach**: Manual migration (small set)

---

## Phase 5: Shared UI Core Components

**Estimated**: ~20 files
**Approach**: Manual migration (critical components)

### Files to Migrate
**Package**: `packages/shared/ui/components/`

From earlier grep, found React.FC in:
- BurgerMenu/BurgerMenu.tsx
- Chip/Chip.tsx
- DatePicker/DatePicker.tsx
- FileUpload/FileUpload.tsx
- FocusTrap/FocusTrap.tsx
- Form/Form.tsx
- Form/FormField.tsx
- FormGrid/FormGrid.tsx
- KpiCard/KpiCard.tsx
- Label/Label.tsx
- Link/Link.tsx
- LocaleSelector/LocaleSelector.tsx
- MobileHeader/MobileHeader.tsx
- PageLoader/PageLoader.tsx
- Pagination/Pagination.tsx
- PulwaveProvider/PulwaveProvider.tsx
- Radio/RadioGroup.tsx
- SegmentedControl/SegmentedControl.tsx
- SkipLink/SkipLink.tsx
- StatusIndicator/StatusIndicator.tsx
- Tag/Tag.tsx
- ThemeToggle/ThemeToggle.tsx
- Toast/ToastProvider.tsx
- VisualEffect/VisualEffect.tsx

Plus:
- ColumnChips/ColumnChips.tsx
- DataTable/DataTable.tsx
- InfiniteScroll/InfiniteScroll.tsx
- TimePicker/TimePicker.tsx
- Menu/Menu.tsx
- GroupRow/GroupRow.tsx
- NumberedList/NumberedList.tsx

**Total**: ~30 files (revised estimate)

**Approach**: Single agent or manual, these are critical shared components

---

## Phase 6: Data Visualization

**Estimated**: 238 files
**Approach**: 4-5 parallel agents by category

### Breakdown

**Charts** (~160 files):
- Cartesian (40 files): LineChart, BarChart, AreaChart, ScatterChart, etc.
- Radial (20 files): PieChart, DonutChart, RadarChart, etc.
- Statistical (15 files): Histogram, BoxPlot, Heatmap, etc.
- Hierarchical (20 files): TreeMap, Sunburst, Network, etc.
- Specialized (20 files): Sankey, Waterfall, Funnel, etc.
- Geography (10 files): GeoChart, CountryMap, BubbleMap, etc.
- Timeline (10 files): Timeline, Gantt, etc.
- Compact (10 files): Sparkline, BulletChart, etc.

**Primitives** (~30 files):
- ChartShell, ChartContainer, ChartAxes, ChartGrid
- ChartTooltip, ChartLegend, ChartDefs
- Series primitives: LineSeries, BarSeries, AreaSeries, ScatterSeries, PieSeries
- Renderers: ArcRenderer
- Supporting: ChartAxisTick, ChartAnnotation, ChartBrush, ChartZoom

**Adapters** (~48 files):
- Recharts adapter (~24 files): primitives/, components/
- VISX adapter (~24 files): primitives/, components/

**Agent Distribution**:
1. **Agent 1**: Cartesian + Radial charts
2. **Agent 2**: Statistical + Hierarchical charts
3. **Agent 3**: Specialized + Geography + Timeline + Compact
4. **Agent 4**: All primitives
5. **Agent 5**: Both adapters (Recharts + VISX)

---

## Execution Strategy

### Phase 4: Features - Other
**Time**: 3-4 hours
**Agents**: 4-5 parallel
1. Admin features (26 files)
2. Auth + Layout features (13 files)
3. Settings features (20 files)
4. Shared features (22 files)
5. Other features (6 files) - manual

### Phase 5: Shared UI Core
**Time**: 2-3 hours
**Approach**: Single agent or manual
- Critical components, needs careful review
- ~30 files total

### Phase 6: Data Visualization
**Time**: 8-12 hours
**Agents**: 5 parallel
- 238 files divided by category
- Charts, primitives, adapters

---

## Verification Strategy

After each phase:
```bash
# Check remaining React.FC count
find packages/features -name "*.tsx" -exec grep -l "React\.FC" {} \; 2>/dev/null | grep -v "style-guide" | wc -l

# Phase 5
find packages/shared/ui/components -name "*.tsx" -exec grep -l "React\.FC" {} \; | wc -l

# Phase 6
find packages/shared/ui/data-visualization -name "*.tsx" -exec grep -l "React\.FC" {} \; | wc -l

# Final check
find packages apps -name "*.tsx" -exec grep -l "React\.FC" {} \; | wc -l
# Should be 0
```

---

## Risk Mitigation

### High-Risk Components
These need extra attention:
- **DataTable**: Complex component with many props
- **Form/FormField**: Critical for all forms
- **PulwaveProvider**: Root provider
- **Toast/ToastProvider**: Context provider
- **Charts**: Extensive props, many variants

### Testing Priority
After migration:
1. Run dev server for real-estate app
2. Test style guide (all components visible)
3. Test admin panel (uses many features)
4. Visual regression on key pages

---

*Planning document - to be executed after Phase 3 completes*
