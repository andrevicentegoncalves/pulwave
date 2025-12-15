import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ChevronRight, ChevronDown, Check, Search } from 'lucide-react';
import Input from './Input';
import Icon from './Icon';

/**
 * TreeSelect Component
 * A tree view with multi-select checkboxes and collapsible nodes
 * Perfect for table→column hierarchy selection
 */
const TreeSelect = ({
    data = [],
    selectedItems = [],
    onChange,
    searchable = true,
    searchPlaceholder = 'Search...',
    expandAll = false,
    showCounts = true,
    readOnly = false,
    className,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedNodes, setExpandedNodes] = useState(
        expandAll ? data.map(d => d.id) : []
    );

    // Filter data based on search
    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return data;
        const query = searchQuery.toLowerCase();
        return data.map(parent => {
            const matchingChildren = parent.children?.filter(child =>
                child.label.toLowerCase().includes(query) ||
                child.id.toLowerCase().includes(query)
            ) || [];
            const parentMatches = parent.label.toLowerCase().includes(query);
            if (parentMatches || matchingChildren.length > 0) {
                return { ...parent, children: parentMatches ? parent.children : matchingChildren };
            }
            return null;
        }).filter(Boolean);
    }, [data, searchQuery]);

    // Toggle node expansion
    const toggleExpand = (nodeId) => {
        setExpandedNodes(prev =>
            prev.includes(nodeId)
                ? prev.filter(id => id !== nodeId)
                : [...prev, nodeId]
        );
    };

    // Check if a parent is selected (all children selected)
    const isParentSelected = (parent) => {
        if (!parent.children?.length) return selectedItems.includes(parent.id);
        return parent.children.every(child => selectedItems.includes(child.id));
    };

    // Check if a parent is partially selected
    const isParentPartial = (parent) => {
        if (!parent.children?.length) return false;
        const selectedCount = parent.children.filter(c => selectedItems.includes(c.id)).length;
        return selectedCount > 0 && selectedCount < parent.children.length;
    };

    // Toggle parent selection (selects/deselects all children)
    const toggleParent = (parent) => {
        if (!parent.children?.length) {
            // Leaf node
            const isSelected = selectedItems.includes(parent.id);
            onChange(isSelected
                ? selectedItems.filter(id => id !== parent.id)
                : [...selectedItems, parent.id]
            );
            return;
        }

        const allChildIds = parent.children.map(c => c.id);
        const allSelected = isParentSelected(parent);

        if (allSelected) {
            // Deselect all children
            onChange(selectedItems.filter(id => !allChildIds.includes(id)));
        } else {
            // Select all children
            const newSelection = [...new Set([...selectedItems, ...allChildIds])];
            onChange(newSelection);
        }
    };

    // Toggle single child
    const toggleChild = (childId) => {
        const isSelected = selectedItems.includes(childId);
        onChange(isSelected
            ? selectedItems.filter(id => id !== childId)
            : [...selectedItems, childId]
        );
    };

    // Count selected in parent
    const getSelectedCount = (parent) => {
        if (!parent.children?.length) return 0;
        return parent.children.filter(c => selectedItems.includes(c.id)).length;
    };

    return (
        <div className={clsx('tree-select', className)}>
            {searchable && (
                <div className="tree-select__search">
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        leftIcon={<Icon size="s"><Search /></Icon>}
                        fullWidth
                    />
                </div>
            )}

            <div className="tree-select__list">
                {filteredData.length === 0 ? (
                    <div className="tree-select__empty">No items found</div>
                ) : (
                    filteredData.map(parent => (
                        <div key={parent.id} className="tree-select__node">
                            {/* Parent row */}
                            <div className="tree-select__parent">
                                {parent.children?.length > 0 && (
                                    <button
                                        type="button"
                                        className="tree-select__expand"
                                        onClick={() => toggleExpand(parent.id)}
                                    >
                                        {expandedNodes.includes(parent.id)
                                            ? <ChevronDown size={16} />
                                            : <ChevronRight size={16} />
                                        }
                                    </button>
                                )}
                                {!readOnly && (
                                    <button
                                        type="button"
                                        className={clsx(
                                            'tree-select__checkbox',
                                            isParentSelected(parent) && 'tree-select__checkbox--checked',
                                            isParentPartial(parent) && 'tree-select__checkbox--partial'
                                        )}
                                        onClick={() => toggleParent(parent)}
                                    >
                                        {isParentSelected(parent) && <Check size={12} />}
                                        {isParentPartial(parent) && <span className="tree-select__partial-indicator" />}
                                    </button>
                                )}
                                <span
                                    className="tree-select__label"
                                    onClick={() => parent.children?.length && toggleExpand(parent.id)}
                                >
                                    {parent.icon && <span className="tree-select__icon">{parent.icon}</span>}
                                    {parent.label}
                                    {showCounts && parent.children?.length > 0 && (
                                        <span className="tree-select__count">
                                            ({getSelectedCount(parent)}/{parent.children.length})
                                        </span>
                                    )}
                                </span>
                            </div>

                            {/* Children */}
                            {parent.children?.length > 0 && expandedNodes.includes(parent.id) && (
                                <div className="tree-select__children">
                                    {parent.children.map(child => (
                                        <div key={child.id} className="tree-select__child">
                                            {!readOnly && (
                                                <button
                                                    type="button"
                                                    className={clsx(
                                                        'tree-select__checkbox',
                                                        selectedItems.includes(child.id) && 'tree-select__checkbox--checked'
                                                    )}
                                                    onClick={() => toggleChild(child.id)}
                                                >
                                                    {selectedItems.includes(child.id) && <Check size={12} />}
                                                </button>
                                            )}
                                            <span className="tree-select__label">{child.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

TreeSelect.propTypes = {
    /** Tree data: [{ id, label, icon?, children: [{ id, label }] }] */
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.node,
        children: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })),
    })),
    /** Array of selected item IDs (children only) */
    selectedItems: PropTypes.arrayOf(PropTypes.string),
    /** Callback when selection changes */
    onChange: PropTypes.func.isRequired,
    /** Show search input */
    searchable: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    /** Expand all nodes by default */
    expandAll: PropTypes.bool,
    /** Show selection counts */
    showCounts: PropTypes.bool,
    /** Read-only mode (no checkboxes, just view) */
    readOnly: PropTypes.bool,
    className: PropTypes.string,
};

export default TreeSelect;
