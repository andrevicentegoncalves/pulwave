import React, { useState, useMemo, useId } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ChevronDown, ChevronRight, Search, X, Check } from 'lucide-react';
import { Dropdown } from './Dropdown';
import Input from './Input';
import Icon from './Icon';

/**
 * TreeDropdown Component
 * A dropdown that displays a tree structure for multi-select
 * Combines the trigger UX of MultiSelectDropdown with tree hierarchy
 */
const TreeDropdown = ({
    label,
    data = [],
    selectedItems = [],
    onChange,
    placeholder = 'Select items...',
    searchPlaceholder = 'Search...',
    maxHeight = 320,
    disabled = false,
    fullWidth = false,
    className,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedNodes, setExpandedNodes] = useState([]);
    const generatedId = useId();

    // Filter data based on search
    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return data;
        const query = searchQuery.toLowerCase();
        return data.map(parent => {
            const matchingChildren = parent.children?.filter(child =>
                child.label.toLowerCase().includes(query)
            ) || [];
            const parentMatches = parent.label.toLowerCase().includes(query);
            if (parentMatches || matchingChildren.length > 0) {
                return { ...parent, children: parentMatches ? parent.children : matchingChildren };
            }
            return null;
        }).filter(Boolean);
    }, [data, searchQuery]);

    // Auto-expand parents with matching children when searching
    React.useEffect(() => {
        if (searchQuery.trim()) {
            const matchingParents = filteredData.map(p => p.id);
            setExpandedNodes(matchingParents);
        }
    }, [searchQuery, filteredData]);

    const toggleExpand = (nodeId, e) => {
        e.stopPropagation();
        setExpandedNodes(prev =>
            prev.includes(nodeId)
                ? prev.filter(id => id !== nodeId)
                : [...prev, nodeId]
        );
    };

    const isParentSelected = (parent) => {
        if (!parent.children?.length) return selectedItems.includes(parent.id);
        return parent.children.every(c => selectedItems.includes(c.id));
    };

    const isParentPartial = (parent) => {
        if (!parent.children?.length) return false;
        const count = parent.children.filter(c => selectedItems.includes(c.id)).length;
        return count > 0 && count < parent.children.length;
    };

    const toggleParent = (parent, e) => {
        e.stopPropagation();
        if (!parent.children?.length) {
            const isSelected = selectedItems.includes(parent.id);
            onChange(isSelected ? selectedItems.filter(id => id !== parent.id) : [...selectedItems, parent.id]);
            return;
        }
        const allChildIds = parent.children.map(c => c.id);
        const allSelected = isParentSelected(parent);
        if (allSelected) {
            onChange(selectedItems.filter(id => !allChildIds.includes(id)));
        } else {
            onChange([...new Set([...selectedItems, ...allChildIds])]);
        }
    };

    const toggleChild = (childId, e) => {
        e.stopPropagation();
        const isSelected = selectedItems.includes(childId);
        onChange(isSelected ? selectedItems.filter(id => id !== childId) : [...selectedItems, childId]);
    };

    // Display text
    const displayValue = selectedItems.length > 0
        ? `${selectedItems.length} selected`
        : placeholder;

    return (
        <div className={clsx('form-item', fullWidth && 'form-item--full-width', className)}>
            {label && <label htmlFor={generatedId} className="form-label">{label}</label>}
            <Dropdown
                trigger={
                    <Input
                        id={generatedId}
                        value={displayValue}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly
                        rightIcon={<Icon size="s"><ChevronDown /></Icon>}
                        className={clsx('cursor-pointer', disabled && 'cursor-not-allowed')}
                        fullWidth
                    />
                }
                align="left"
                closeOnItemClick={false}
            >
                <div className="tree-dropdown">
                    {/* Search */}
                    <div className="tree-dropdown__search">
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            leftIcon={<Icon size="s"><Search /></Icon>}
                            rightIcon={searchQuery ? (
                                <button type="button" className="tree-dropdown__clear" onClick={(e) => { e.stopPropagation(); setSearchQuery(''); }}>
                                    <X size={14} />
                                </button>
                            ) : null}
                            fullWidth
                            autoFocus
                        />
                    </div>

                    {/* Tree list */}
                    <div className="tree-dropdown__list" style={{ maxHeight }}>
                        {filteredData.length === 0 ? (
                            <div className="tree-dropdown__empty">No items found</div>
                        ) : (
                            filteredData.map(parent => (
                                <div key={parent.id} className="tree-dropdown__node">
                                    <div className="tree-dropdown__parent">
                                        {parent.children?.length > 0 && (
                                            <button type="button" className="tree-dropdown__expand" onClick={(e) => toggleExpand(parent.id, e)}>
                                                {expandedNodes.includes(parent.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className={clsx(
                                                'tree-dropdown__checkbox',
                                                isParentSelected(parent) && 'tree-dropdown__checkbox--checked',
                                                isParentPartial(parent) && 'tree-dropdown__checkbox--partial'
                                            )}
                                            onClick={(e) => toggleParent(parent, e)}
                                        >
                                            {isParentSelected(parent) && <Check size={10} />}
                                            {isParentPartial(parent) && <span className="tree-dropdown__partial" />}
                                        </button>
                                        <span className="tree-dropdown__label" onClick={(e) => parent.children?.length && toggleExpand(parent.id, e)}>
                                            {parent.label}
                                        </span>
                                    </div>
                                    {parent.children?.length > 0 && expandedNodes.includes(parent.id) && (
                                        <div className="tree-dropdown__children">
                                            {parent.children.map(child => (
                                                <div key={child.id} className="tree-dropdown__child">
                                                    <button
                                                        type="button"
                                                        className={clsx('tree-dropdown__checkbox', selectedItems.includes(child.id) && 'tree-dropdown__checkbox--checked')}
                                                        onClick={(e) => toggleChild(child.id, e)}
                                                    >
                                                        {selectedItems.includes(child.id) && <Check size={10} />}
                                                    </button>
                                                    <span className="tree-dropdown__label">{child.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="tree-dropdown__footer">
                        <span>{selectedItems.length} selected</span>
                        {selectedItems.length > 0 && (
                            <button type="button" className="tree-dropdown__clear-all" onClick={(e) => { e.stopPropagation(); onChange([]); }}>
                                Clear all
                            </button>
                        )}
                    </div>
                </div>
            </Dropdown>
        </div>
    );
};

TreeDropdown.propTypes = {
    label: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        children: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })),
    })),
    selectedItems: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    maxHeight: PropTypes.number,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};

export default TreeDropdown;
