import React from 'react';
import { cn } from '@pulwave/utils';
import {
    numberedListVariants,
    numberedListItemVariants,
    numberedListNumberVariants,
    numberedListContentVariants,
    numberedListLabelVariants,
    numberedListDescriptionVariants,
    type NumberedListProps
} from './types';
import './styles/_index.scss';


export const NumberedListRoot = React.forwardRef<HTMLOListElement, React.OlHTMLAttributes<HTMLOListElement>>(
    ({ className, children, ...props }, ref) => (
        <ol ref={ref} className={cn(numberedListVariants(), className)} {...props}>
            {children}
        </ol>
    )
);
NumberedListRoot.displayName = 'NumberedList.Root';

export const NumberedListItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
    ({ className, children, ...props }, ref) => (
        <li ref={ref} className={cn(numberedListItemVariants(), className)} {...props}>
            {children}
        </li>
    )
);
NumberedListItem.displayName = 'NumberedList.Item';

export const NumberedListNumber = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    ({ className, children, ...props }, ref) => (
        <span ref={ref} className={cn(numberedListNumberVariants(), className)} {...props}>
            {children}
        </span>
    )
);
NumberedListNumber.displayName = 'NumberedList.Number';

export const NumberedListContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn(numberedListContentVariants(), className)} {...props}>
            {children}
        </div>
    )
);
NumberedListContent.displayName = 'NumberedList.Content';

export const NumberedListLabel = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, children, ...props }, ref) => (
        <strong ref={ref} className={cn(numberedListLabelVariants(), className)} {...props}>
            {children}
        </strong>
    )
);
NumberedListLabel.displayName = 'NumberedList.Label';

export const NumberedListDescription = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    ({ className, children, ...props }, ref) => (
        <span ref={ref} className={cn(numberedListDescriptionVariants(), className)} {...props}>
            {children}
        </span>
    )
);
NumberedListDescription.displayName = 'NumberedList.Description';

const NumberedListMain = ({ items, className, children, ...props }: NumberedListProps) => {
    if (children) {
        return <NumberedListRoot className={className} {...props}>{children}</NumberedListRoot>;
    }

    return (
        <NumberedListRoot className={className} {...props}>
            {items?.map((item, index) => (
                <NumberedListItem key={item.name || `item-${index}`}>
                    <NumberedListNumber>{index + 1}</NumberedListNumber>
                    <NumberedListContent>
                        {item.name && <NumberedListLabel>{item.name}</NumberedListLabel>}
                        {item.description && <NumberedListDescription>{item.description}</NumberedListDescription>}
                    </NumberedListContent>
                </NumberedListItem>
            ))}
        </NumberedListRoot>
    );
};

export const NumberedList = Object.assign(NumberedListMain, {
    Root: NumberedListRoot,
    Item: NumberedListItem,
    Number: NumberedListNumber,
    Content: NumberedListContent,
    Label: NumberedListLabel,
    Description: NumberedListDescription,
});
NumberedList.displayName = 'NumberedList';
