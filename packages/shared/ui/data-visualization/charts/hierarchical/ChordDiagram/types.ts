import { cva, type VariantProps } from 'class-variance-authority';

export const chordDiagramVariants = cva('chart chart--chord', {
    variants: {
        // Add variants here if needed
    },
    defaultVariants: {
    },
});

export interface ChordData {
    from: string;
    to: string;
    value: number;
}

export interface ChordDiagramProps extends VariantProps<typeof chordDiagramVariants> {
    data: ChordData[];
    size?: number;
    innerRadius?: number;
    padAngle?: number;
    arcWidth?: number;
    showLabels?: boolean;
    className?: string;
}
