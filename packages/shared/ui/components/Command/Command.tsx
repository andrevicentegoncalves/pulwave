import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from '../../icon-library';
import { cn } from '@pulwave/utils';
import { Modal } from '../Modal';
import { ModalProps } from '../Modal/types';
import {
    commandVariants,
    commandDialogVariants,
    commandInputWrapperVariants,
    commandListVariants,
    commandEmptyVariants,
    commandGroupVariants,
    commandItemVariants,
    commandShortcutVariants,
    commandSeparatorVariants
} from './types';
import './styles/_index.scss';

// ============================================================================
// Command
// ============================================================================

export interface CommandProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
    className?: string;
}

const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, CommandProps>(
    ({ className, ...props }, ref) => (
        <CommandPrimitive
            ref={ref}
            className={cn(commandVariants(), className)}
            {...props}
        />
    )
);
Command.displayName = CommandPrimitive.displayName;

// ============================================================================
// CommandDialog
// ============================================================================

interface CommandDialogProps extends ModalProps {
    children: React.ReactNode;
}

const CommandDialog = ({
    children,
    isOpen,
    onClose,
    className,
    ...props
}: CommandDialogProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="l"
            className={cn(commandDialogVariants(), className)}
            // Command palette usually has no default header/footer
            scrollableBody={false} // CommandList handles scrolling
            // We strip padding in CSS for command-dialog usually
            {...props}
        >
            <Command className="command--dialog">
                {children}
            </Command>
        </Modal>
    );
};
CommandDialog.displayName = 'CommandDialog';

// ============================================================================
// CommandInput
// ============================================================================

const CommandInput = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
    <div className={cn(commandInputWrapperVariants())} cmdk-input-wrapper="">
        <Search size={18} className="mr-2 shrink-0 opacity-50" aria-hidden="true" />
        <CommandPrimitive.Input
            ref={ref}
            className={cn(className)}
            {...props}
        />
    </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

// ============================================================================
// CommandList
// ============================================================================

const CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        className={cn(commandListVariants(), className)}
        {...props}
    />
));
CommandList.displayName = CommandPrimitive.List.displayName;

// ============================================================================
// CommandEmpty
// ============================================================================

const CommandEmpty = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
    <CommandPrimitive.Empty
        ref={ref}
        className={cn(commandEmptyVariants())}
        {...props}
    />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

// ============================================================================
// CommandGroup
// ============================================================================

const CommandGroup = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn(commandGroupVariants(), className)}
        {...props}
    />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

// ============================================================================
// CommandSeparator
// ============================================================================

const CommandSeparator = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
        ref={ref}
        className={cn(commandSeparatorVariants(), className)}
        {...props}
    />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

// ============================================================================
// CommandItem
// ============================================================================

const CommandItem = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        className={cn(commandItemVariants(), className)}
        {...props}
    />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

// ============================================================================
// CommandShortcut
// ============================================================================

const CommandShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(commandShortcutVariants(), className)}
            {...props}
        />
    );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
};
