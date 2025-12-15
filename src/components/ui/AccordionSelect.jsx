import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ChevronDown, Check, Search } from 'lucide-react';
import Input from './Input';
import Icon from './Icon';

/**
 * AccordionSelect Component
 * Accordion-style multi-select with collapsible sections
 * Each section can be expanded to reveal selectable items
 */
const AccordionSelect = ({
    data = [],
    selectedItems = [],
    onChange,
    searchable = true,
    searchPlaceholder = 'Search...',
    allowMultipleOpen = true,
    showCounts = true,
    readOnly = false,
    className,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openSections, setOpenSections] = useState([]);

    // Filter data based on search
    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return data;
        const query = searchQuery.toLowerCase();
        return data.map(section => {
            const matchingItems = section.items?.filter(item =>
                item.label.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query)
            ) || [];
            const sectionMatches = section.label.toLowerCase().includes(query);
            if (sectionMatches || matchingItems.length > 0) {
                return { ...section, items: sectionMatches ? section.items : matchingItems };
            }
            return null;
        }).filter(Boolean);
    }, [data, searchQuery]);

    // Toggle section open/close
    const toggleSection = (sectionId) => {
        if (allowMultipleOpen) {
            setOpenSections(prev =>
                prev.includes(sectionId)
                    ? prev.filter(id => id !== sectionId)
                    : [...prev, sectionId]
            );
        } else {
            setOpenSections(prev =>
                prev.includes(sectionId) ? [] : [sectionId]
            );
        }
    };

    // Check if section is fully selected
    const isSectionSelected = (section) => {
        if (!section.items?.length) return false;
        return section.items.every(item => selectedItems.includes(item.id));
    };

    // Check if section is partially selected
    const isSectionPartial = (section) => {
        if (!section.items?.length) return false;
        const count = section.items.filter(i => selectedItems.includes(i.id)).length;
        return count > 0 && count < section.items.length;
    };

    // Toggle all items in section
    const toggleSection全Select = (section) => {
        if (!section.items?.length) return;
        const allItemIds = section.items.map(i => i.id);
        const allSelected = isSectionSelected(section);

        if (allSelected) {
            onChange(selectedItems.filter(id => !allItemIds.includes(id)));
        } else {
            onChange([...new Set([...selectedItems, ...allItemIds])]);
        }
    };

    // Toggle single item
    const toggleItem = (itemId) => {
        const isSelected = selectedItems.includes(itemId);
        onChange(isSelected
            ? selectedItems.filter(id => id !== itemId)
            : [...selectedItems, itemId]
        );
    };

    // Get selected count for section
    const getSelectedCount = (section) => {
        if (!section.items?.length) return 0;
        return section.items.filter(i => selectedItems.includes(i.id)).length;
    };

    return (
        <div className={clsx('accordion-select', className)}>
            {searchable && (
                <div className="accordion-select__search">
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        leftIcon={<Icon size="s"><Search /></Icon>}
                        fullWidth
                    />
                </div>
            )}

            <div className="accordion-select__sections">
                {filteredData.length === 0 ? (
                    <div className="accordion-select__empty">No items found</div>
                ) : (
                    filteredData.map(section => {
                        const isOpen = openSections.includes(section.id);
                        return (
                            <div key={section.id} className={clsx('accordion-select__section', isOpen && 'accordion-select__section--open')}>
                                {/* Section header */}
                                <div className="accordion-select__header">
                                    {!readOnly && (
                                        <button
                                            type="button"
                                            className={clsx(
                                                'accordion-select__checkbox',
                                                isSectionSelected(section) && 'accordion-select__checkbox--checked',
                                                isSectionPartial(section) && 'accordion-select__checkbox--partial'
                                            )}
                                            onClick={(e) => { e.stopPropagation(); toggleSection全Select(section); }}
                                        >
                                            {isSectionSelected(section) && <Check size={12} />}
                                            {isSectionPartial(section) && <span className="accordion-select__partial" />}
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="accordion-select__trigger"
                                        onClick={() => toggleSection(section.id)}
                                    >
                                        <span className="accordion-select__title">
                                            {section.icon && <span className="accordion-select__icon">{section.icon}</span>}
                                            {section.label}
                                        </span>
                                        {showCounts && section.items?.length > 0 && (
                                            <span className="accordion-select__count">
                                                {getSelectedCount(section)}/{section.items.length}
                                            </span>
                                        )}
                                        <ChevronDown
                                            size={16}
                                            className={clsx('accordion-select__chevron', isOpen && 'accordion-select__chevron--open')}
                                        />
                                    </button>
                                </div>

                                {/* Section content */}
                                {isOpen && section.items?.length > 0 && (
                                    <div className="accordion-select__content">
                                        {section.items.map(item => (
                                            <div key={item.id} className="accordion-select__item">
                                                {!readOnly && (
                                                    <button
                                                        type="button"
                                                        className={clsx(
                                                            'accordion-select__checkbox',
                                                            selectedItems.includes(item.id) && 'accordion-select__checkbox--checked'
                                                        )}
                                                        onClick={() => toggleItem(item.id)}
                                                    >
                                                        {selectedItems.includes(item.id) && <Check size={12} />}
                                                    </button>
                                                )}
                                                <span className="accordion-select__item-label">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

AccordionSelect.propTypes = {
    /** Accordion data: [{ id, label, icon?, items: [{ id, label }] }] */
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.node,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })),
    })),
    /** Array of selected item IDs */
    selectedItems: PropTypes.arrayOf(PropTypes.string),
    /** Callback when selection changes */
    onChange: PropTypes.func.isRequired,
    /** Show search input */
    searchable: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    /** Allow multiple sections open at once */
    allowMultipleOpen: PropTypes.bool,
    /** Show selection counts */
    showCounts: PropTypes.bool,
    /** Read-only mode (no checkboxes, just view) */
    readOnly: PropTypes.bool,
    className: PropTypes.string,
};

export default AccordionSelect;
