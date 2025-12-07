import React from 'react';
import { Spinner } from '../../../../../components/ui';

export default function Spinners() {
    return (
        <div className="component-category">
            <h3 className="component-category__title">Spinners</h3>
            <p className="component-category__description">
                Indicate loading state with the Spinner component. Available in multiple sizes.
            </p>

            <div className="component-demo">
                <div className="demo-flex-row demo-flex-row--gap-4 demo-flex-row--align-center">
                    <div className="demo-item-col">
                        <Spinner size="s" />
                        <span className="demo-label">Small (16px)</span>
                    </div>
                    <div className="demo-item-col">
                        <Spinner size="m" />
                        <span className="demo-label">Medium (24px)</span>
                    </div>
                    <div className="demo-item-col">
                        <Spinner size="l" />
                        <span className="demo-label">Large (32px)</span>
                    </div>
                    <div className="demo-item-col">
                        <Spinner size="xl" />
                        <span className="demo-label">Extra Large (48px)</span>
                    </div>
                </div>
            </div>

            <h4 className="component-category__subtitle">Colors</h4>
            <p className="component-category__description">
                Spinners inherit the current text color.
            </p>

            <div className="component-demo">
                <div className="demo-flex-row demo-flex-row--gap-4">
                    <div className="text-primary">
                        <Spinner size="m" />
                    </div>
                    <div className="text-success">
                        <Spinner size="m" />
                    </div>
                    <div className="text-warning">
                        <Spinner size="m" />
                    </div>
                    <div className="text-danger">
                        <Spinner size="m" />
                    </div>
                    <div className="text-neutral-500">
                        <Spinner size="m" />
                    </div>
                </div>
            </div>
        </div>
    );
}
