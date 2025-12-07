import React from 'react';
import { Tooltip, Button, Card } from '../../../../../components/ui';
import { HelpCircle, Info, AlertCircle } from '../../../../../components/ui/iconLibrary';

export default function Tooltips() {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium mb-4">Tooltips</h3>
                <p className="text-muted-foreground mb-6">
                    Informative popups that appear on hover or focus.
                </p>

                <Card className="p-10">
                    <div className="flex flex-wrap gap-8 items-center justify-center">
                        <Tooltip content="This is a simple tooltip">
                            <Button variant="outline">Hover Me</Button>
                        </Tooltip>

                        <Tooltip content="Tooltip with longer text content to demonstrate wrapping behavior">
                            <button className="text-muted-foreground hover:text-foreground transition-colors">
                                <HelpCircle className="h-5 w-5" />
                            </button>
                        </Tooltip>

                        <Tooltip content="Top placement" placement="top">
                            <Button size="sm">Top</Button>
                        </Tooltip>

                        <Tooltip content="Right placement" placement="right">
                            <Button size="sm">Right</Button>
                        </Tooltip>

                        <Tooltip content="Bottom placement" placement="bottom">
                            <Button size="sm">Bottom</Button>
                        </Tooltip>

                        <Tooltip content="Left placement" placement="left">
                            <Button size="sm">Left</Button>
                        </Tooltip>
                    </div>
                </Card>
            </div>
        </div>
    );
}
