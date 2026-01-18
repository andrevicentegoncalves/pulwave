import { cva, type VariantProps } from 'class-variance-authority';

export const wordCloudChartVariants = cva('chart chart--word-cloud', {
    variants: {
        colorScheme: {
            categorical: 'chart--word-cloud--categorical',
            monochrome: 'chart--word-cloud--monochrome',
            gradient: 'chart--word-cloud--gradient',
        },
    },
    defaultVariants: {
        colorScheme: 'categorical',
    },
});

export interface WordCloudItem {
    text: string;
    value: number;
    [key: string]: any;
}

export interface WordCloudChartProps extends VariantProps<typeof wordCloudChartVariants> {
    data: WordCloudItem[];
    width?: number;
    height?: number;
    minFontSize?: number;
    maxFontSize?: number;
    fontFamily?: string;
    baseColor?: string;
    spiral?: string;
    padding?: number;
    rotations?: number[];
    showCount?: boolean;
    className?: string;
}
