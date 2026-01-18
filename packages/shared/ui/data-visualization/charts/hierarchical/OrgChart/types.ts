import { cva, type VariantProps } from 'class-variance-authority';

export const orgChartVariants = cva('chart chart--org', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface OrgNode {
    name: string;
    title?: string;
    image?: string;
    children?: OrgNode[];
    color?: string;
}

export interface OrgChartProps extends VariantProps<typeof orgChartVariants> {
    data: OrgNode;
    nodeWidth?: number;
    nodeHeight?: number;
    horizontalSpacing?: number;
    verticalSpacing?: number;
    nodeColors?: Record<string, string>;
    showImages?: boolean;
    expandAll?: boolean;
    className?: string;
}
