// UI Components - Main entry point
// Categories for documentation: Primitives, Feedback, Display, Navigation, Decorative

// Primitives - Atomic form elements
export { default as Button } from './Button.jsx';
export { default as Input } from './Input.jsx';
export { default as SearchInput } from './SearchInput.jsx';
export { default as Checkbox } from './Checkbox.jsx';
export { default as Select } from './Select.jsx';
export { default as TextArea } from './TextArea.jsx';
export { default as MultiSelectDropdown } from './MultiSelectDropdown.jsx';
export { default as TreeSelect } from './TreeSelect.jsx';
export { default as AccordionSelect } from './AccordionSelect.jsx';
export { default as TreeDropdown } from './TreeDropdown.jsx';
export { default as ColumnChips } from './ColumnChips.jsx';

// Feedback - User feedback components
export { default as Alert } from './Alert.jsx';
export { default as Modal } from './Modal.jsx';
export { default as Toast } from './Toast.jsx';
export { default as Tooltip } from './Tooltip.jsx';
export { default as Skeleton } from './Skeleton.jsx';
export { default as Spinner } from './Spinner.jsx';
export { default as ConfirmationModal } from './ConfirmationModal.jsx';

// Display - Data display components
export { default as Avatar } from './Avatar.jsx';
export { default as Badge } from './Badge.jsx';
export { default as VerificationBadge } from './VerificationBadge.jsx';
export { default as Card } from './Card.jsx';
export { default as CardGrid } from './CardGrid.jsx';
export { default as DataTable } from './DataTable.jsx';
export { default as DataList } from './DataList.jsx';
export { default as KpiCard } from './KpiCard.jsx';
export { default as StatCard } from './StatCard.jsx';
export { default as EmptyState } from './EmptyState.jsx';
export { default as SectionHeader } from './SectionHeader.jsx';
export { default as ScrollArea } from './ScrollArea.jsx';
export { default as GroupRow } from './GroupRow.jsx';

// Navigation - Navigation UI components
export { default as Tabs, TabPanel } from './Tabs.jsx';
export { default as Pagination } from './Pagination.jsx';
export { Dropdown, DropdownItem, DropdownDivider, DropdownLabel, useDropdown } from './Dropdown.jsx';
export { default as SidebarSection } from './SidebarSection.jsx';

export { default as Wizard } from './Wizard.jsx';

// Decorative - Visual/icon components
export { default as Icon } from './Icon.jsx';
export { default as Divider } from './Divider.jsx';
export { default as Vector } from './Vector.jsx';
export { default as VisualEffect } from './VisualEffect.jsx';
export { default as CircleFlag } from './CircleFlag.jsx';
export { default as LocaleSelector, CompactLocaleSelector } from './LocaleSelector.jsx';
export * from './iconLibrary.jsx';

// Re-export Floating Action Button from navigation
export { FloatingActionButton } from '../navigation';
