import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';
import Card from './Card';
import ScrollArea from './ScrollArea';
import SidebarToggle from '../navigation/SidebarToggle';

const SidebarSection = ({ title, items, activeKey, onSelect, isExpanded = true, toggleSidebar }) => {
    return (
        <Card variant="elevated" noPadding className={`sidebar-section-card ${!isExpanded ? 'collapsed' : ''}`}>
            <div className="card__body">
                <div className="sidebar-section__header flex items-center justify-between">
                    {isExpanded && <h3>{title}</h3>}
                    {toggleSidebar && (
                        <div className="sidebar-section__toggle transform scale-75 origin-right">
                            <SidebarToggle isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
                        </div>
                    )}
                </div>
                <ScrollArea className="sidebar-section__scroll-area" orientation="both" style={{ flex: 1 }}>
                    <div className="sidebar-section__nav">
                        {items.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeKey === item.key;
                            return (
                                <button
                                    key={item.key}
                                    className={`sidebar-section__item ${isActive ? 'sidebar-section__item--active' : ''} ${!isExpanded ? 'justify-center p-2' : ''}`}
                                    onClick={() => onSelect(item)}
                                    title={!isExpanded ? item.label : ''}
                                >
                                    {Icon && <Icon size={20} />}
                                    {isExpanded && (
                                        <>
                                            <span className="sidebar-section__label">
                                                {item.label}
                                            </span>
                                            <ChevronRight size={14} />
                                        </>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>
        </Card>
    );
};

SidebarSection.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.elementType,
        })
    ).isRequired,
    activeKey: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool,
    toggleSidebar: PropTypes.func,
};

export default SidebarSection;
