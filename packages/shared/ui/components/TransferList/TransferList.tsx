import React, { useState, useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Input } from '../Input';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft, Search } from '../../icon-library';
import { transferListVariants, type TransferListProps, type TransferItem } from './types';
import './styles/_index.scss';



export const TransferList = ({
    dataSource,
    targetKeys = [],
    onChange,
    render,
    titles = ['Source', 'Target'],
    searchPlaceholder = 'Search…',
    showSearch = false,
    className,
    disabled = false,
    listHeight = 300,
}: TransferListProps) => {
    const [sourceSelectedKeys, setSourceSelectedKeys] = useState<string[]>([]);
    const [targetSelectedKeys, setTargetSelectedKeys] = useState<string[]>([]);
    const [sourceSearch, setSourceSearch] = useState('');
    const [targetSearch, setTargetSearch] = useState('');

    // Split data into source and target
    const { sourceList, targetList } = useMemo(() => {
        const source: TransferItem[] = [];
        const target: TransferItem[] = [];

        dataSource.forEach(item => {
            if (targetKeys.includes(item.key)) {
                target.push(item);
            } else {
                source.push(item);
            }
        });

        return { sourceList: source, targetList: target };
    }, [dataSource, targetKeys]);

    // Handle Item Selection
    const handleSelect = (key: string, direction: 'left' | 'right') => {
        const selectedKeys = direction === 'left' ? sourceSelectedKeys : targetSelectedKeys;
        const setKeys = direction === 'left' ? setSourceSelectedKeys : setTargetSelectedKeys;

        if (selectedKeys.includes(key)) {
            setKeys(prev => prev.filter(k => k !== key));
        } else {
            setKeys(prev => [...prev, key]);
        }
    };

    // Handle Movements
    const moveToRight = () => {
        const nextTargetKeys = [...targetKeys, ...sourceSelectedKeys];
        onChange(nextTargetKeys, 'right', sourceSelectedKeys);
        setSourceSelectedKeys([]);
    };

    const moveToLeft = () => {
        const nextTargetKeys = targetKeys.filter(key => !targetSelectedKeys.includes(key));
        onChange(nextTargetKeys, 'left', targetSelectedKeys);
        setTargetSelectedKeys([]);
    };

    const moveAllToRight = () => {
        const allSourceKeys = sourceList.filter(item => !item.disabled).map(item => item.key);
        const nextTargetKeys = [...targetKeys, ...allSourceKeys];
        onChange(nextTargetKeys, 'right', allSourceKeys);
        setSourceSelectedKeys([]);
    };

    const moveAllToLeft = () => {
        const nextTargetKeys: string[] = []; // Empty
        const moveKeys = targetList.map(item => item.key);
        onChange(nextTargetKeys, 'left', moveKeys);
        setTargetSelectedKeys([]);
    };

    // Render Helper
    const renderList = (list: TransferItem[], direction: 'left' | 'right', search: string, onSearch: (v: string) => void, selectedKeys: string[], onSelect: (k: string, d: 'left' | 'right') => void) => {
        const filteredList = list.filter(item => {
            if (!search) return true;
            return (item.title || item.key).toLowerCase().includes(search.toLowerCase());
        });

        const activeCount = filteredList.length;
        const checkedCount = selectedKeys.filter(key => filteredList.find(i => i.key === key)).length;
        const indeterminate = checkedCount > 0 && checkedCount < activeCount;
        const allChecked = activeCount > 0 && checkedCount === activeCount;

        const handleSelectAll = () => {
            if (allChecked) {
                // Deselect only visible (filtered) items
                const visibleKeys = filteredList.map(i => i.key);
                direction === 'left'
                    ? setSourceSelectedKeys(prev => prev.filter(k => !visibleKeys.includes(k)))
                    : setTargetSelectedKeys(prev => prev.filter(k => !visibleKeys.includes(k)));
            } else {
                // Select all visible (filtered) items
                const visibleKeys = filteredList.filter(i => !i.disabled).map(i => i.key);
                const setKeys = direction === 'left' ? setSourceSelectedKeys : setTargetSelectedKeys;
                setKeys(prev => [...Array.from(new Set([...prev, ...visibleKeys]))]);
            }
        };

        return (
            <div className="transfer-list__panel" style={{ height: listHeight }}>
                <div className="transfer-list__header">
                    <Checkbox
                        checked={allChecked}
                        indeterminate={indeterminate}
                        onChange={handleSelectAll}
                        disabled={disabled || activeCount === 0}
                    />
                    <span className="transfer-list__header-title">{direction === 'left' ? titles[0] : titles[1]}</span>
                    <span className="transfer-list__header-count">{checkedCount}/{activeCount} items</span>
                </div>

                {showSearch && (
                    <div className="transfer-list__search">
                        <Input
                            size="s"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => onSearch(e.target.value)}
                            disabled={disabled}
                            leftIcon={<Search size={14} />}
                        />
                    </div>
                )}

                <div className={cn("transfer-list__body", showSearch && "transfer-list__body--with-search")}>
                    {filteredList.map(item => (
                        <div
                            key={item.key}
                            className={cn("transfer-list__item", item.disabled && "transfer-list__item--disabled")}
                            onClick={() => !item.disabled && !disabled && onSelect(item.key, direction)}
                        >
                            <Checkbox
                                checked={selectedKeys.includes(item.key)}
                                disabled={item.disabled || disabled}
                            />
                            <span className="ml-2">
                                {render ? render(item) : (item.title || item.key)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={cn(transferListVariants({ disabled }), className)}>
            {renderList(sourceList, 'left', sourceSearch, setSourceSearch, sourceSelectedKeys, handleSelect)}

            <div className="transfer-list__actions">
                <Button
                    size="s"
                    kind="secondary"
                    variant="outlined"
                    disabled={disabled || targetList.length === 0}
                    onClick={moveAllToLeft}
                    aria-label="Move all items to source"
                >
                    <ChevronsLeft size={16} aria-hidden="true" />
                </Button>
                <Button
                    size="s"
                    kind="secondary"
                    variant="outlined"
                    disabled={disabled || targetSelectedKeys.length === 0}
                    onClick={moveToLeft}
                    aria-label="Move selected items to source"
                >
                    <ChevronLeft size={16} aria-hidden="true" />
                </Button>
                <Button
                    size="s"
                    kind="secondary"
                    variant="outlined"
                    disabled={disabled || sourceSelectedKeys.length === 0}
                    onClick={moveToRight}
                    aria-label="Move selected items to target"
                >
                    <ChevronRight size={16} aria-hidden="true" />
                </Button>
                <Button
                    size="s"
                    kind="secondary"
                    variant="outlined"
                    disabled={disabled || sourceList.length === 0}
                    onClick={moveAllToRight}
                    aria-label="Move all items to target"
                >
                    <ChevronsRight size={16} aria-hidden="true" />
                </Button>
            </div>

            {renderList(targetList, 'right', targetSearch, setTargetSearch, targetSelectedKeys, handleSelect)}
        </div>
    );
};

TransferList.displayName = 'TransferList';
