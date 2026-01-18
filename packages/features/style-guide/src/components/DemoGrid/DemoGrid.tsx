import React from 'react';
import { Text } from "@pulwave/ui";
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@pulwave/utils';
import './DemoGrid.css';

// DemoGrid Styles
const demoGridVariants = cva(
    'demo-grid',
    {
        variants: {},
        defaultVariants: {},
    }
);

export interface DemoGridProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof demoGridVariants> {
    children: React.ReactNode;
}

export const DemoGrid = ({ children, className, ...props }: DemoGridProps) => (
    <div className={cn(demoGridVariants(), className)} {...props}>
        {children}
    </div>
);

// DemoGridCard Styles
const demoGridCardVariants = cva(
    'demo-grid-card',
    {
        variants: {},
        defaultVariants: {},
    }
);

export interface DemoGridCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof demoGridCardVariants> {
    children: React.ReactNode;
    title?: string;
}

export const DemoGridCard = ({ children, title, className, ...props }: DemoGridCardProps) => (
    <div className={cn(demoGridCardVariants(), className)} {...props}>
        {title && (
            <Text variant="small" className="mb-2 text-neutral-500">
                {title}
            </Text>
        )}
        {children}
    </div>
);
