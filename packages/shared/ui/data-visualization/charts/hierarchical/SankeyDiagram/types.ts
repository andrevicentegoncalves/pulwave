import { cva, type VariantProps } from 'class-variance-authority';

export const sankeyDiagramVariants = cva('chart chart--sankey', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface SankeyNode {
    id: string;
    name: string;
    color?: string;
}

export interface SankeyLink {
    source: string;
    target: string;
    value: number;
}

export interface PositionedNode extends Omit<SankeyNode, 'color'> {
    index: number;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
}

export interface PositionedLink extends SankeyLink {
    path: string;
    color: string;
    sourceNode: PositionedNode;
    targetNode: PositionedNode;
}

export interface SankeyLayout {
    nodes: PositionedNode[];
    links: PositionedLink[];
}

export interface SankeyDiagramProps extends VariantProps<typeof sankeyDiagramVariants> {
    nodes: SankeyNode[];
    links: SankeyLink[];
    width?: number;
    height?: number;
    nodeWidth?: number;
    nodePadding?: number;
    showLabels?: boolean;
    showValues?: boolean;
    valueFormatter?: (v: number) => string;
    onNodeClick?: (node: PositionedNode) => void;
    onLinkClick?: (link: PositionedLink) => void;
    className?: string;
}
