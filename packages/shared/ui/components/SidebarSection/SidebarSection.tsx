import React from 'react';
import { ArrowLeft, ArrowRight, ChevronRight } from '../../icon-library';
import { cn } from '@pulwave/utils';
import { Card } from '../Card';
import { ScrollArea } from '../ScrollArea';
import {
    sidebarSectionCardVariants,
    sidebarSectionHeaderVariants,
    sidebarSectionToggleVariants,
    sidebarSectionNavVariants,
    sidebarSectionItemVariants,
    sidebarSectionLabelVariants,
    type SidebarSectionProps
} from './types';
import './styles/_index.scss';

export const SidebarSection = ({ title, items, activeKey, onSelect, isExpanded = true, toggleSidebar }: SidebarSectionProps) => (
    <Card variant="elevated" padding="none" className={cn(sidebarSectionCardVariants({ collapsed: !isExpanded }))}>
        <div className="card__body">
            <div className={cn(sidebarSectionHeaderVariants())}>
                {isExpanded && <h3>{title}</h3>}
                {toggleSidebar && (
                    <div className={cn(sidebarSectionToggleVariants(), "transform scale-75 origin-right")}>
                        <button onClick={toggleSidebar} aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}>
                            {isExpanded ? <ArrowLeft size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
                        </button>
                    </div>
                )}
            </div>
            <ScrollArea className="sidebar-section__scroll-area" orientation="both">
                <div className={cn(sidebarSectionNavVariants())}>
                    {items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.key}
                                className={cn(sidebarSectionItemVariants({
                                    active: activeKey === item.key,
                                    collapsed: !isExpanded
                                }))}
                                onClick={() => onSelect(item)}
                                title={!isExpanded ? item.label : ''}
                            >
                                {Icon && <span aria-hidden="true"><Icon size={20} /></span>}
                                {isExpanded && (
                                    <>
                                        <span className={cn(sidebarSectionLabelVariants())}>{item.label}</span>
                                        <span aria-hidden="true"><ChevronRight size={14} /></span>
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
SidebarSection.displayName = 'SidebarSection';
