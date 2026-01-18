/**
 * Guidance Component
 * 
 * Visual comparison component for "Do / Don't" or "When to use / When not to use".
 * Displays two columns side-by-side with success/error visuals.
 */
import React from 'react';
import { Check, X } from '@pulwave/ui';
import { Text } from "@pulwave/ui";
import './styles/_index.scss';

export interface GuidanceItem {
    text?: string;
    image?: string;
    caption?: string;
    alternative?: React.ReactNode; // For "When not to use" alternatives
    link?: string;
}

export interface GuidanceProps {
    positive?: {
        title?: string;
        items: (string | GuidanceItem)[];
    };
    negative?: {
        title?: string;
        items: (string | GuidanceItem)[];
    };
    className?: string;
}

export const Guidance = ({ positive, negative, className = '' }: GuidanceProps) => {
    if (!positive && !negative) return null;

    const normalizeItem = (item: string | GuidanceItem): GuidanceItem => {
        return typeof item === 'string' ? { text: item } : item;
    };

    return (
        <div className={`component-doc__when-to-use-wrapper ${className}`}>
            {/* Positive Column (Do / When to use) */}
            {positive && positive.items.length > 0 && (
                <div className="component-doc__when-to-use">
                    <div className="component-doc__when-header">
                        <Check size={24} aria-hidden="true" />
                        <Text as="h4" category="title" size="s" weight="bold">{positive.title || 'Do'}</Text>
                    </div>
                    <ul className="component-doc__when-list">
                        {positive.items.map((rawItem, index) => {
                            const item = normalizeItem(rawItem);
                            return (
                                <li key={index} className="component-doc__when-item">
                                    {item.image && (
                                        <div className="relative mb-2 rounded border border-neutral-200 overflow-hidden">
                                            <img src={item.image} alt={item.caption || ''} className="w-full h-auto block" width={400} height={300} />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        {item.text && <Text as="span" category="body" size="s">{item.text}</Text>}
                                        {item.caption && <Text as="span" category="body" size="xs" color="muted" className="component-doc__when-caption">{item.caption}</Text>}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Negative Column (Don't / When not to use) */}
            {negative && negative.items.length > 0 && (
                <div className="component-doc__when-not-to-use">
                    <div className="component-doc__when-header">
                        <X size={24} aria-hidden="true" />
                        <Text as="h4" category="title" size="s" weight="bold">{negative.title || "Don't"}</Text>
                    </div>
                    <ul className="component-doc__when-list">
                        {negative.items.map((rawItem, index) => {
                            const item = normalizeItem(rawItem);
                            return (
                                <li key={index} className="component-doc__when-item component-doc__when-item--alternative">
                                    {item.image && (
                                        <div className="relative mb-2 rounded border border-neutral-200 overflow-hidden">
                                            <img src={item.image} alt={item.caption || ''} className="w-full h-auto block" width={400} height={300} />
                                        </div>
                                    )}
                                    <div className="flex flex-col w-full">
                                        {item.text && <Text as="span" category="body" size="s">{item.text}</Text>}
                                        {item.caption && <Text as="span" category="body" size="xs" color="muted" className="component-doc__when-caption">{item.caption}</Text>}
                                        {item.alternative && (
                                            <div className="component-doc__alternative">
                                                <Text as="strong" weight="bold">Alternative:</Text>{' '}
                                                {item.link ? (
                                                    <a href={item.link} className="component-doc__alternative-link">
                                                        {item.alternative}
                                                    </a>
                                                ) : (
                                                    item.alternative
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Guidance;
