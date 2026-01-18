import React from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { cn } from '@pulwave/utils';
import { GripVertical } from '../../icon-library';
import {
    splitPaneVariants,
    splitPanePanelVariants,
    splitPaneHandleVariants,
    splitPaneHandleBarVariants,
    splitPaneHandleIconVariants,
    type SplitPaneProps
} from './types';
import './styles/_index.scss';


// Root Component
const SplitPaneRoot = ({
    children,
    direction = 'horizontal',
    className,
    style,
    ...props
}: SplitPaneProps & React.ComponentProps<typeof PanelGroup>) => {
    return (
        <PanelGroup
            direction={direction}
            className={cn(splitPaneVariants({ direction }), className)}
            style={style}
            {...props}
        >
            {children}
        </PanelGroup>
    );
};
SplitPaneRoot.displayName = 'SplitPane';

// Panel
const SplitPanePanel = ({ className, ...props }: React.ComponentProps<typeof Panel>) => (
    <Panel className={cn(splitPanePanelVariants(), className)} {...props} />
);
SplitPanePanel.displayName = 'SplitPane.Panel';

// Handle
const SplitPaneHandle = ({ className, withIcon = true, ...props }: React.ComponentProps<typeof PanelResizeHandle> & { withIcon?: boolean }) => {
    // We need to infer direction from context or just render responsive icon?
    // GripVertical is for horizontal split (vertical bar), GripHorizontal is for vertical split (horizontal bar)
    // But we don't know direction here easily without context.
    // However, CSS handles the rotation/display mostly.
    // Or we provide both and hide one? Or generic Grip.
    // Lucide GripVertical is ... .. ...

    // Simplification: We just render a generic "handle bar". 
    // The CSS logic toggles width/height.
    // The icon: If we want the icon to look right, we might need to know direction.
    // But typically resizing handles use a simple pill or dot indicator.
    // Existing code used GripVertical/Horizontal.

    return (
        <PanelResizeHandle className={cn(splitPaneHandleVariants(), className)} {...props}>
            <div className={cn(splitPaneHandleBarVariants())}>
                {withIcon && (
                    <GripVertical size={16} className={cn(splitPaneHandleIconVariants())} />
                )}
            </div>
        </PanelResizeHandle>
    );
};
SplitPaneHandle.displayName = 'SplitPane.Handle';

export const SplitPane = Object.assign(SplitPaneRoot, {
    Panel: SplitPanePanel,
    Handle: SplitPaneHandle
});

