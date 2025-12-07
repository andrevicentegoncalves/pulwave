import React from 'react';
import { CircleFlag, Card } from '../../../../../components/ui';

export default function Flags() {
    const commonCountries = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'PT', 'BR', 'JP', 'CN', 'IN'];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium mb-4">Circle Flags</h3>
                <p className="text-muted-foreground mb-6">
                    Country flags with circular masking, provided by <code>country-flag-icons</code>.
                </p>

                <Card className="p-6">
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-4">Sizes</h4>
                            <div className="flex items-end gap-6">
                                <div className="flex flex-col items-center gap-2">
                                    <CircleFlag countryCode="PT" size="s" />
                                    <span className="text-xs text-muted-foreground">Small (s)</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <CircleFlag countryCode="PT" size="m" />
                                    <span className="text-xs text-muted-foreground">Medium (m)</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <CircleFlag countryCode="PT" size="l" />
                                    <span className="text-xs text-muted-foreground">Large (l)</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-4">Examples</h4>
                            <div className="flex flex-wrap gap-4">
                                {commonCountries.map(code => (
                                    <div key={code} className="flex flex-col items-center gap-2 p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-help" title={code}>
                                        <CircleFlag countryCode={code} size="m" />
                                        <span className="text-xs font-mono text-muted-foreground">{code}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-4">Fallback</h4>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center gap-2">
                                    <CircleFlag countryCode="XX" size="m" />
                                    <span className="text-xs text-muted-foreground">Invalid Code</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <CircleFlag countryCode={null} size="m" />
                                    <span className="text-xs text-muted-foreground">No Code</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
