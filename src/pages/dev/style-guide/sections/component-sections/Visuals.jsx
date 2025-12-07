import React from 'react';
import { VisualEffect, Vector, Card } from '../../../../../components/ui';

export default function Visuals() {
    return (
        <div className="space-y-12">
            {/* Visual Effects */}
            <div>
                <h3 className="text-lg font-medium mb-4">Visual Effects</h3>
                <p className="text-muted-foreground mb-6">
                    Decorative animations and background effects.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="p-6 h-64 overflow-hidden relative flex flex-col items-center justify-center">
                        <span className="z-10 font-medium bg-background/80 px-3 py-1 rounded backdrop-blur-sm">Sidebar Wave</span>
                        <div className="absolute inset-0 opacity-50">
                            <VisualEffect variant="sidebar-wave" />
                        </div>
                    </Card>

                    <Card className="p-6 h-64 overflow-hidden relative flex flex-col items-center justify-center">
                        <span className="z-10 font-medium bg-background/80 px-3 py-1 rounded backdrop-blur-sm">Pulse Wave</span>
                        <div className="flex items-center justify-center h-full w-full">
                            <VisualEffect variant="pulse-wave" />
                        </div>
                    </Card>

                    <Card className="p-6 h-64 overflow-hidden relative flex flex-col items-center justify-center">
                        <span className="z-10 font-medium bg-background/80 px-3 py-1 rounded backdrop-blur-sm">Ring Wave</span>
                        <div className="flex items-center justify-center h-full w-full">
                            <VisualEffect variant="ring-wave" size="l" />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Vectors */}
            <div>
                <h3 className="text-lg font-medium mb-4">Vectors</h3>
                <p className="text-muted-foreground mb-6">
                    Base SVG wrapper for custom vector graphics.
                </p>

                <Card className="p-8">
                    <div className="flex gap-8 items-center justify-center">
                        <Vector className="text-primary w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                        </Vector>

                        <Vector className="text-secondary w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </Vector>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Examples of custom SVG paths wrapped in Vector component
                    </p>
                </Card>
            </div>
        </div>
    );
}
