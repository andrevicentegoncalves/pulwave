import React, { Children, cloneElement, forwardRef, isValidElement } from 'react';
import { cn } from '@pulwave/utils';
import { ChevronRight, MoreHorizontal } from '../../icon-library';
import { breadcrumbsVariants, type BreadcrumbsProps, type BreadcrumbItem as BreadcrumbItemType, type BreadcrumbLinkProps, type BreadcrumbItemProps, type BreadcrumbSeparatorProps, type BreadcrumbEllipsisProps } from './types';
import './styles/_index.scss';

// Subcomponents
const BreadcrumbsItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
    ({ children, className, isCurrent, ...props }, ref) => (
        <li
            ref={ref}
            className={cn('breadcrumbs__item', className)}
            aria-current={isCurrent ? 'page' : undefined}
            {...props}
        >
            {children}
        </li>
    )
);
BreadcrumbsItem.displayName = 'Breadcrumbs.Item';

const BreadcrumbsLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
    ({ as: Component = 'a', className, children, ...props }, ref) => (
        <Component
            ref={ref}
            className={cn('breadcrumbs__link', className)}
            {...props}
        >
            {children}
        </Component>
    )
);
BreadcrumbsLink.displayName = 'Breadcrumbs.Link';

const BreadcrumbsSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => (
    <span className={cn('breadcrumbs__separator', className)} role="presentation" aria-hidden="true" {...props}>
        {children ?? <ChevronRight size={14} />}
    </span>
);
BreadcrumbsSeparator.displayName = 'Breadcrumbs.Separator';

const BreadcrumbsEllipsis = ({ className, ...props }: BreadcrumbEllipsisProps) => (
    <span className={cn('breadcrumbs__collapsed', className)} role="presentation" aria-hidden="true" {...props}>
        <MoreHorizontal size={14} />
        <span className="sr-only">More</span>
    </span>
);
BreadcrumbsEllipsis.displayName = 'Breadcrumbs.Ellipsis';


// Extended item type with tracking fields
interface ExtendedBreadcrumbItem extends BreadcrumbItemType {
    originalIndex?: number;
    isEllipsis?: boolean;
}

// Root Component
export const BreadcrumbsRoot = forwardRef<HTMLElement, BreadcrumbsProps>(
    ({
        items,
        children,
        size,
        separator,
        maxItems,
        itemsBeforeCollapse = 1,
        itemsAfterCollapse = 1,
        className,
        ...props
    }, ref) => {

        // Helper to render legacy items array
        const renderItems = () => {
            if (!items || items.length === 0) return null;

            const totalItems = items.length;
            let displayItems: ExtendedBreadcrumbItem[] = items.map((item, index) => ({ ...item, originalIndex: index }));

            if (maxItems && totalItems > maxItems) {
                const start = displayItems.slice(0, itemsBeforeCollapse);
                const end = displayItems.slice(-itemsAfterCollapse);
                // We insert an ellipsis item
                const ellipsisItem: ExtendedBreadcrumbItem = { label: '…', href: undefined, isEllipsis: true };
                displayItems = [...start, ellipsisItem, ...end];
            }

            return displayItems.map((item, index) => {
                const isLast = index === displayItems.length - 1;
                const isEllipsis = item.isEllipsis;

                // Render Ellipsis
                if (isEllipsis) {
                    return (
                        <BreadcrumbsItem key="ellipsis">
                            <BreadcrumbsEllipsis />
                            <BreadcrumbsSeparator>{separator}</BreadcrumbsSeparator>
                        </BreadcrumbsItem>
                    );
                }

                return (
                    <BreadcrumbsItem key={item.originalIndex}>
                        {item.icon && !isLast && <span className="breadcrumbs__icon" aria-hidden="true">{item.icon}</span>}
                        {isLast || !item.href ? (
                            <span className="breadcrumbs__current" aria-current="page">
                                {item.label}
                            </span>
                        ) : (
                            <BreadcrumbsLink href={item.href} as={item.as}>
                                {item.label}
                            </BreadcrumbsLink>
                        )}
                        {!isLast && <BreadcrumbsSeparator>{separator}</BreadcrumbsSeparator>}
                    </BreadcrumbsItem>
                );
            });
        };

        return (
            <nav
                ref={ref}
                className={cn(breadcrumbsVariants({ size }), className)}
                aria-label="Breadcrumb"
                {...props}
            >
                <ol className="breadcrumbs__list">
                    {children ?? renderItems()}
                </ol>
            </nav>
        );
    }
);
BreadcrumbsRoot.displayName = 'Breadcrumbs';


export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
    Item: BreadcrumbsItem,
    Link: BreadcrumbsLink,
    Separator: BreadcrumbsSeparator,
    Ellipsis: BreadcrumbsEllipsis
});
