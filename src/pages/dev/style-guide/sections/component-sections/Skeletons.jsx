import React from 'react';
import { Skeleton, Card, CardGrid } from '../../../../../components/ui';

const Skeletons = () => {
    return (
        <section className="component-section">
            <div className="component-section__header">
                <h2 className="component-section__title">Skeleton</h2>
                <p className="component-section__description">
                    Display a placeholder preview of your content before the data gets loaded to reduce load-time frustration.
                </p>
            </div>

            <div className="component-section__content">
                <div className="component-example">
                    <h3 className="component-example__title">Variants</h3>
                    <p className="component-example__description">
                        Skeletons come in different shapes to match the content they are replacing.
                    </p>

                    <div className="component-example__demo">
                        <div className="skeleton-demo__variants-container">
                            <div>
                                <p className="text-sm text-secondary mb-2">Text (Default)</p>
                                <Skeleton variant="text" width="100%" height="20px" />
                                <Skeleton variant="text" width="80%" height="20px" className="skeleton-demo__skeleton-spaced" />
                            </div>

                            <div>
                                <p className="text-sm text-secondary mb-2">Circular</p>
                                <div className="skeleton-demo__flex-row">
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Skeleton variant="circular" width={64} height={64} />
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-secondary mb-2">Rectangular</p>
                                <Skeleton variant="rectangular" width="100%" height={120} />
                            </div>

                            <div>
                                <p className="text-sm text-secondary mb-2">Line</p>
                                <Skeleton variant="line" width="100%" height="24px" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="component-example">
                    <h3 className="component-example__title">Animations</h3>
                    <p className="component-example__description">
                        Choose between pulse (default), wave, or no animation.
                    </p>

                    <div className="component-example__demo">
                        <div className="skeleton-demo__animations-container">
                            <div>
                                <p className="text-sm text-secondary mb-2">Pulse (Default)</p>
                                <Skeleton variant="rectangular" width="100%" height={60} animation="pulse" className="border-radius-m" />
                            </div>

                            <div>
                                <p className="text-sm text-secondary mb-2">Wave</p>
                                <Skeleton variant="rectangular" width="100%" height={60} animation="wave" className="border-radius-m" />
                            </div>

                            <div>
                                <p className="text-sm text-secondary mb-2">None</p>
                                <Skeleton variant="rectangular" width="100%" height={60} animation="none" className="border-radius-m" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="component-example">
                    <h3 className="component-example__title">Example Usage</h3>
                    <p className="component-example__description">
                        Simulating a card loading state.
                    </p>

                    <div className="component-example__demo">
                        <CardGrid columns={2}>
                            <Card>
                                <div className="skeleton-demo__card-header">
                                    <Skeleton variant="circular" width={48} height={48} />
                                    <div className="skeleton-demo__card-content">
                                        <Skeleton variant="text" width="60%" height="20px" className="skeleton-demo__skeleton-mb-sm" />
                                        <Skeleton variant="text" width="40%" height="16px" />
                                    </div>
                                </div>
                                <Skeleton variant="rectangular" width="100%" height={120} className="skeleton-demo__skeleton-mb-md" />
                                <Skeleton variant="text" width="100%" height="16px" className="skeleton-demo__skeleton-mb-sm" />
                                <Skeleton variant="text" width="80%" height="16px" />
                            </Card>
                        </CardGrid>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skeletons;
