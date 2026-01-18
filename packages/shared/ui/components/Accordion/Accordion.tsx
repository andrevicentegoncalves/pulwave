import React, { useState, createContext, useContext } from 'react';
import { ChevronDown } from '../../icon-library';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@pulwave/utils';
import {
    accordionVariants,
    accordionItemVariants,
    accordionHeaderVariants,
    accordionPanelVariants,
    accordionIconVariants,
    accordionChevronVariants,
    type AccordionProps,
    type AccordionItemProps
} from './types';
import { Text } from '../Text';
import './styles/_index.scss';

interface AccordionContextType {
    expandedIds: string[];
    toggle: (id: string) => void;
    variant: VariantProps<typeof accordionVariants>['variant'];
}

const AccordionContext = createContext<AccordionContextType>({
    expandedIds: [],
    toggle: () => { },
    variant: 'primary'
});

const AccordionRoot = ({
    items,
    children,
    allowMultiple = false,
    defaultExpanded = [],
    variant = 'primary',
    className,
    ...props
}: AccordionProps) => {
    const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpanded);

    const toggle = (id: string) => {
        setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : allowMultiple ? [...prev, id] : [id]);
    };

    return (
        <AccordionContext.Provider value={{ expandedIds, toggle, variant }}>
            <div className={cn(accordionVariants({ variant }), className)} {...props}>
                {items ? items.map(item => (
                    <AccordionItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        icon={item.icon}
                        badge={item.badge}
                        disabled={item.disabled}
                    >
                        {item.content}
                    </AccordionItem>
                )) : children}
            </div>
        </AccordionContext.Provider>
    );
};
AccordionRoot.displayName = 'Accordion';

export const AccordionItem = ({
    id,
    title,
    children,
    icon,
    badge,
    disabled = false,
    isExpanded: isExpandedProp,
    onToggle
}: AccordionItemProps) => {
    const ctx = useContext(AccordionContext);
    const isExpanded = isExpandedProp !== undefined ? isExpandedProp : ctx.expandedIds.includes(id);

    // Safety for onToggle manual override
    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            onToggle ? onToggle() : ctx.toggle(id);
        }
    };

    return (
        <div className={cn(accordionItemVariants({ expanded: isExpanded, disabled }))}>
            <button
                type="button"
                className={cn(accordionHeaderVariants())}
                onClick={handleToggle}
                disabled={disabled}
                aria-expanded={isExpanded}
            >
                {icon && <span className={cn(accordionIconVariants())} aria-hidden="true">{icon}</span>}
                <div className="accordion__title-group">
                    <Text className="accordion__title" size="m" weight="medium">{title}</Text>
                </div>
                {badge && <span className="accordion__badge">{badge}</span>}
                <span className={cn(accordionChevronVariants({ expanded: isExpanded }))} aria-hidden="true">
                    <ChevronDown size={16} />
                </span>
            </button>
            {isExpanded && (
                <div className={cn(accordionPanelVariants())}>
                    <div className="accordion__content">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};
AccordionItem.displayName = 'Accordion.Item';

export const Accordion = Object.assign(AccordionRoot, {
    Item: AccordionItem,
});

