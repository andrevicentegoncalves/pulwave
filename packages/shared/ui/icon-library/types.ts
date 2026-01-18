import type React from 'react';

export interface BaseIconProps extends React.SVGAttributes<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
}

export type IconComponent = React.ComponentType<BaseIconProps>;
