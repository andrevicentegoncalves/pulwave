import React from 'react';
import { cn } from '@pulwave/utils';
import { timelineVariants, type TimelineProps } from './types';
import './styles/_index.scss';


export const TimelineRoot = ({
    items,
    orientation = 'vertical',
    align = 'left',
    showConnector = true,
    className,
    children
}: TimelineProps) => {

    const renderItems = () => {
        if (!items) return null;
        return items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
                <TimelineItem key={item.id} variant={item.variant}>
                    <TimelineMarker>
                        <TimelineDot icon={item.icon} />
                        {showConnector && !isLast && <TimelineConnector />}
                    </TimelineMarker>
                    <TimelineContent>
                        {item.timestamp && <span className="timeline__timestamp">{item.timestamp}</span>}
                        <h4 className="timeline__title">{item.title}</h4>
                        {item.content && <div className="timeline__description">{item.content}</div>}
                    </TimelineContent>
                </TimelineItem>
            );
        });
    };

    return (
        <div className={cn(timelineVariants({ orientation, align }), className)} role="list">
            {children ?? renderItems()}
        </div>
    );
};
TimelineRoot.displayName = 'Timeline';

export const TimelineItem = ({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) => (
    <div className={cn('timeline__item', variant && `timeline__item--variant-${variant}`, className)} role="listitem">
        {children}
    </div>
);
TimelineItem.displayName = 'Timeline.Item';

export const TimelineMarker = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn('timeline__marker', className)}>{children}</div>
);
TimelineMarker.displayName = 'Timeline.Marker';

export const TimelineDot = ({ icon, className }: { icon?: React.ReactNode, className?: string }) => (
    <span className={cn('timeline__dot', className)}>
        {icon || <div className="timeline__default-dot" />}
    </span>
);
TimelineDot.displayName = 'Timeline.Dot';

export const TimelineConnector = ({ className }: { className?: string }) => (
    <span className={cn('timeline__connector', className)} />
);
TimelineConnector.displayName = 'Timeline.Connector';

export const TimelineContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn('timeline__content', className)}>{children}</div>
);
TimelineContent.displayName = 'Timeline.Content';


export const Timeline = Object.assign(TimelineRoot, {
    Item: TimelineItem,
    Marker: TimelineMarker,
    Dot: TimelineDot,
    Connector: TimelineConnector,
    Content: TimelineContent
});

