import { type ReactNode } from 'react';
import { classNames } from '@pulwave/utils';
import './styles/_index.scss';

export type ContentVariant = 'dashboard' | 'wide' | 'xl' | 'ultrawide' | 'fluid';

export interface ContentLayoutProps {
    /** Page content */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Layout width variant */
    variant?: ContentVariant;
}

/**
 * ContentLayout - Content wrapper with max-width variants
 */
export const ContentLayout = ({
    children,
    className = '',
    variant = 'wide'
}: ContentLayoutProps) => {
    return (
        <div className={classNames('content-layout', `content-layout--${variant}`, className)}>
            <div className="content-layout__content">
                {children}
            </div>
        </div>
    );
};

ContentLayout.displayName = 'ContentLayout';
