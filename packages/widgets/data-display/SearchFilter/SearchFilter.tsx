/**
 * SearchFilter
 *
 * Search input with expandable filter panel.
 *
 * @package @ui
 */
import { useState, type ChangeEvent } from 'react';
import { Filter, X, Card, Input, Badge, Button } from '@pulwave/ui';
import { classNames } from '@pulwave/utils';
import {
    searchFilterVariants,
    searchFilterPlaceholderWrapperVariants,
    type SearchFilterProps
} from './types';
import './styles/_index.scss';

export * from './types';

/**
 * SearchFilter - Search with filters
 */
export const SearchFilter = ({
    placeholder = 'Search…',
    onSearch,
    onReset,
    isExpanded: controlledIsExpanded,
    activeFilters = [],
    children,
    className = '',
}: SearchFilterProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isExpandedInternal, setIsExpandedInternal] = useState(false);

    const isControlled = controlledIsExpanded !== undefined;
    const isExpanded = isControlled ? controlledIsExpanded : isExpandedInternal;

    const toggleExpand = () => {
        if (!isControlled) {
            setIsExpandedInternal(!isExpanded);
        }
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch?.(value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        onSearch?.('');
    };

    const handleReset = () => {
        handleClearSearch();
        onReset?.();
    };

    return (
        <Card padding="none" className={classNames(searchFilterVariants(), className)}>
            <div className="search-and-filter__wrapper">
                <div
                    className="search-and-filter__icon"
                    onClick={toggleExpand}
                    role="button"
                    tabIndex={0}
                    aria-label="Toggle filters"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleExpand();
                        }
                    }}
                >
                    <Filter size={18} aria-hidden="true" />
                </div>

                <div className="search-and-filter__input-wrapper">
                    <Input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder={placeholder}
                        size="s"
                        rightIcon={searchTerm ? (
                            <button
                                className="sf-clear-btn"
                                onClick={handleClearSearch}
                                aria-label="Clear search"
                                type="button"
                            >
                                <X size={14} aria-hidden="true" />
                            </button>
                        ) : undefined}
                    />
                </div>
            </div>

            <div className={classNames(searchFilterPlaceholderWrapperVariants({ isExpanded }))}>
                <div className="search-and-filter__placeholder">
                    {children}
                </div>

                {isExpanded && (
                    <div className="search-and-filter__button-group">
                        <Button variant="outlined" size="s" onClick={handleReset}>
                            Reset
                        </Button>
                        <Button kind="primary" size="s" onClick={() => onSearch?.(searchTerm)}>
                            Search
                        </Button>
                    </div>
                )}
            </div>

            {!isExpanded && activeFilters.length > 0 && (
                <div className="search-and-filter__active-filters">
                    {activeFilters.map((filter, index) => {
                        const filterObj = typeof filter === 'string' ? { label: filter } : filter;
                        return (
                            <Badge
                                key={filterObj.label || `filter-${index}`}
                                status="neutral"
                                size="s"
                                removable={!!filterObj.onRemove}
                                onRemove={filterObj.onRemove}
                            >
                                {filterObj.label}
                            </Badge>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

SearchFilter.displayName = 'SearchFilter';

export default SearchFilter;
