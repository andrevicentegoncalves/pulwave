import { cva, type VariantProps } from 'class-variance-authority';

export const vennDiagramVariants = cva('chart chart--venn', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface VennDiagramSet {
    id: string;
    label?: string;
    value: number;
    color?: string;
}

export interface VennDiagramIntersection {
    sets: string[];
    value: number;
}

export interface VennDiagramProps extends VariantProps<typeof vennDiagramVariants> {
    sets: VennDiagramSet[];
    intersections?: VennDiagramIntersection[];
    size?: number;
    showLabels?: boolean;
    showValues?: boolean;
    className?: string;
}
