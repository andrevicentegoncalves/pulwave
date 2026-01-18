import React, { useState, MouseEvent, KeyboardEvent } from 'react';
import { cn } from '@pulwave/utils';
import { ChevronDown, ChevronRight, Folder, FolderOpen, File } from '../../icon-library';
import { treeViewVariants, type TreeViewProps, type TreeNode } from './types';
import './styles/_index.scss';


// Root
const TreeViewNode = ({
    node,
    depth = 0,
    onSelect,
    selectedId,
    expandedNodes,
    toggleExpand,
    showIcons = true
}: {
    node: TreeNode;
    depth?: number;
    onSelect?: (node: TreeNode) => void;
    selectedId?: string;
    expandedNodes: string[];
    toggleExpand: (nodeId: string, e: MouseEvent | KeyboardEvent) => void;
    showIcons?: boolean;
}) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.includes(node.id);
    const isSelected = selectedId === node.id;

    return (
        <div className="tree-view__node">
            <div
                className={cn(
                    'tree-view__row',
                    isSelected && 'tree-view__row--state-selected',
                    onSelect && 'tree-view__row--state-clickable'
                )}
                style={{ paddingLeft: `calc(${depth} * var(--scale-5) + var(--scale-2))` }}
            >
                {hasChildren ? (
                    <button
                        type="button"
                        className="tree-view__expand"
                        onClick={(e) => toggleExpand(node.id, e)}
                        aria-label={isExpanded ? `Collapse ${node.label}` : `Expand ${node.label}`}
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
                    </button>
                ) : <span className="tree-view__expand-placeholder" />}

                <button
                    type="button"
                    className="tree-view__content"
                    onClick={() => onSelect?.(node)}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
                            toggleExpand(node.id, e);
                        } else if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
                            toggleExpand(node.id, e);
                        }
                    }}
                    aria-current={isSelected ? 'true' : undefined}
                >
                    {showIcons && (
                        <span className="tree-view__icon" aria-hidden="true">
                            {node.icon || (hasChildren ? (isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />) : <File size={16} />)}
                        </span>
                    )}

                    <span className="tree-view__label">{node.label}</span>
                    {node.badge && <span className="tree-view__badge">{node.badge}</span>}
                </button>
            </div>
            {hasChildren && isExpanded && (
                <div className="tree-view__children">
                    {node.children!.map(child => (
                        <TreeViewNode
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            onSelect={onSelect}
                            selectedId={selectedId}
                            expandedNodes={expandedNodes}
                            toggleExpand={toggleExpand}
                            showIcons={showIcons}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
TreeViewNode.displayName = 'TreeView.Node';

// Root
export const TreeViewRoot = ({
    data = [],
    onSelect,
    selectedId,
    expandAll = false,
    showIcons = true,
    className
}: TreeViewProps) => {
    const getAllNodeIds = (nodes: TreeNode[], ids: string[] = []): string[] => {
        nodes.forEach(n => { ids.push(n.id); if (n.children) getAllNodeIds(n.children, ids); });
        return ids;
    };

    const [expandedNodes, setExpandedNodes] = useState<string[]>(expandAll ? getAllNodeIds(data) : []);

    const toggleExpand = (nodeId: string, e: MouseEvent | KeyboardEvent) => {
        e.stopPropagation();
        setExpandedNodes(prev => prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]);
    };

    return (
        <div className={cn(treeViewVariants(), className)}>
            {data.length === 0 ? (
                <div className="tree-view__empty">No items</div>
            ) : (
                data.map(node => (
                    <TreeViewNode
                        key={node.id}
                        node={node}
                        onSelect={onSelect}
                        selectedId={selectedId}
                        expandedNodes={expandedNodes}
                        toggleExpand={toggleExpand}
                        showIcons={showIcons}
                    />
                ))
            )}
        </div>
    );
};
TreeViewRoot.displayName = 'TreeView';

export const TreeView = Object.assign(TreeViewRoot, {
    Node: TreeViewNode,
});

