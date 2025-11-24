import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import Card from './Card';
import Input from './Input';
import Badge from './Badge';
import Button from './Button';

const SearchFilter = ({
    placeholder = 'Search...',
    onSearch,
    onReset,
    isExpanded: controlledIsExpanded,
    activeFilters = [],
    children,
    className = '',
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isExpandedInternal, setIsExpandedInternal] = useState(false);

    const isControlled = controlledIsExpanded !== undefined;
    const isExpanded = isControlled ? controlledIsExpanded : isExpandedInternal;

    const toggleExpand = () => {
        if (!isControlled) {
            setIsExpandedInternal(!isExpanded);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) onSearch(value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        if (onSearch) onSearch('');
    };

    const handleReset = () => {
        handleClearSearch();
        if (onReset) onReset();
    };

    return (
        <Card noPadding className={`search-and-filter ${className}`}>
            <div className="search-and-filter__wrapper">
                <div
                    className="search-and-filter__icon"
                    onClick={toggleExpand}
                    role="button"
                    tabIndex={0}
                    aria-label="Toggle filters"
                >
                    <Filter size={18} />
                </div>

                <div className="search-and-filter__input-wrapper">
                    <Input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder={placeholder}
                        size="sm"
                        rightIcon={searchTerm && (
                            <button
                                className="sf-clear-btn"
                                onClick={handleClearSearch}
                                aria-label="Clear search"
                                type="button"
                            >
                                <X size={14} />
                            </button>
                        )}
                    />
                </div>
            </div>

            <div className={`search-and-filter__placeholder-wrapper ${isExpanded ? 'search-and-filter__placeholder-wrapper--is-expanded' : ''}`}>
                <div className="search-and-filter__placeholder">
                    {children}
                </div>

                {/* Buttons AFTER filters when expanded */}
                {isExpanded && (
                    <div className="search-and-filter__button-group">
                        <Button variant="outline" size="sm" onClick={handleReset}>
                            Reset
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => onSearch && onSearch(searchTerm)}>
                            Search
                        </Button>
                    </div>
                )}
            </div>

            {!isExpanded && activeFilters.length > 0 && (
                <div className="search-and-filter__active-filters">
                    {activeFilters.map((filter, index) => (
                        <Badge
                            key={index}
                            variant="light"
                            type="neutral"
                            size="s"
                            removable={!!filter.onRemove}
                            onRemove={filter.onRemove}
                        >
                            {filter.label || filter}
                        </Badge>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default SearchFilter;
