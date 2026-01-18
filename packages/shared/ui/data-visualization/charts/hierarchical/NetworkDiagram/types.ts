import { cva, type VariantProps } from 'class-variance-authority';

export const networkDiagramVariants = cva('chart chart--network', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface NetworkNode {
    id: string;
    label?: string;
    group?: string | number;
    color?: string;
}

export interface PositionedNode extends NetworkNode {
    x: number;
    y: number;
}

export interface NetworkLink {
    source: string;
    target: string;
    value?: number;
}

export interface ProcessedLink extends NetworkLink {
    sourceNode: PositionedNode;
    targetNode: PositionedNode;
}

export interface NetworkDiagramProps extends VariantProps<typeof networkDiagramVariants> {
    nodes: NetworkNode[];
    links: NetworkLink[];
    width?: number;
    height?: number;
    nodeRadius?: number;
    linkWidth?: number;
    showLabels?: boolean;
    groupColors?: Record<string | number, string>;
    className?: string;
}
