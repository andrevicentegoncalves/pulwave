/**
 * DemoCard Component
 * 
 * Wrapper for component demos with optional code preview and color scheme toggle.
 */
import React, { useState } from 'react';
import { Card, Button, Tooltip, Text } from "@pulwave/ui";
import { ChartProvider } from "@pulwave/ui";
import { Palette, Code } from '@pulwave/ui';
import './styles/_index.scss';

export interface DemoCardProps {
    title?: string;
    description?: string;
    children: React.ReactNode | ((props: { usePrimaryColors: boolean }) => React.ReactNode);
    showPrimaryToggle?: boolean;
    showSourceToggle?: boolean;
    sourceCode?: string;
    className?: string;
    transparentPreview?: boolean;
    elevated?: boolean;
}

export const DemoCard = ({
    title,
    description,
    children,
    showPrimaryToggle = false,
    showSourceToggle = false,
    sourceCode = '',
    className = '',
    transparentPreview = false,
    elevated = false,
}: DemoCardProps) => {
    const [usePrimaryColors, setUsePrimaryColors] = useState(false);
    const [showSource, setShowSource] = useState(false);

    return (
        <Card padding="s" className={`demo-card ${className}`} variant={elevated ? 'elevated' : 'outlined'}>
            <div className="demo-card__header">
                <div className="demo-card__info">
                    {title && <Text as="h3" category="title" size="m" weight="bold" className="demo-card__title">{title}</Text>}
                    {description && <Text as="p" category="body" size="m" className="demo-card__description">{description}</Text>}
                </div>

                <div className="demo-card__actions">
                    {showPrimaryToggle && (
                        <Tooltip content="Toggle primary color scheme">
                            <Button
                                variant="ghost"
                                shape="circle"
                                size="m"
                                className={`demo-card__action-btn ${usePrimaryColors ? 'btn--active' : ''}`}
                                onClick={() => setUsePrimaryColors(!usePrimaryColors)}
                                aria-label="Toggle primary color scheme"
                            >
                                <Palette size={20} aria-hidden="true" />
                            </Button>
                        </Tooltip>
                    )}
                    {showSourceToggle && sourceCode && (
                        <Tooltip content="View source code">
                            <Button
                                variant="ghost"
                                shape="circle"
                                size="m"
                                className={`demo-card__action-btn ${showSource ? 'btn--active' : ''}`}
                                onClick={() => setShowSource(!showSource)}
                                aria-label="View source code"
                            >
                                <Code size={20} aria-hidden="true" />
                            </Button>
                        </Tooltip>
                    )}
                </div>
            </div>

            <div className="demo-card__content">
                <div
                    className={`demo-card__preview ${usePrimaryColors ? 'demo-card__preview--primary' : ''} ${transparentPreview ? 'demo-card__preview--transparent' : ''}`}
                    data-color-scheme={usePrimaryColors ? 'primary' : 'default'}
                >
                    <ChartProvider>
                        {typeof children === 'function'
                            ? children({ usePrimaryColors })
                            : children}
                    </ChartProvider>
                </div>

                {showSource && sourceCode && (
                    <div className="demo-card__source">
                        <pre className="demo-card__code">
                            <code>{sourceCode}</code>
                        </pre>
                    </div>
                )}
            </div>
        </Card>
    );
};

DemoCard.displayName = 'DemoCard';
