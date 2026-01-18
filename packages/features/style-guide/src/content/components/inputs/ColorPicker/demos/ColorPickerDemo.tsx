import React, { useState } from 'react';
import { ColorPicker, Stack, Text, Card } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<ColorPicker
    label="Brand Color"
    value={color}
    onChange={setColor}
    placeholder="#000000"
/>

<ColorPicker
    label="Background Color"
    value={rgbColor}
    onChange={setRgbColor}
    format="rgb"
    placeholder="rgb(0, 0, 0)"
/>`;

const ColorPickerDemo = () => {
    const [color, setColor] = useState('#3b82f6');
    const [rgbColor, setRgbColor] = useState('rgb(59, 130, 246)');

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="ColorPicker" description="Pick colors in Hex or RGB">
            <Stack spacing="8">
                <Stack spacing="4">
                    <Text category="title" size="m">ColorPicker Basic</Text>
                    <Text>
                        A simple color picker with hex input and popover swatches.
                    </Text>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-4 space-y-4">
                            <Text weight="bold">Hex Format (Default)</Text>
                            <ColorPicker
                                label="Brand Color"
                                value={color}
                                onChange={setColor}
                                placeholder="#000000"
                            />
                            <div className="flex items-center gap-2 mt-4 text-sm text-neutral-500">
                                <Text size="s" color="muted">Result:</Text>
                                <div
                                    className="w-4 h-4 rounded border border-neutral-200"
                                    style={{ backgroundColor: color }}
                                />
                                <Text as="code" size="s">{color}</Text>
                            </div>
                        </Card>

                        <Card className="p-4 space-y-4">
                            <Text weight="bold">RGB Format</Text>
                            <ColorPicker
                                label="Background Color"
                                value={rgbColor}
                                onChange={setRgbColor}
                                format="rgb"
                                placeholder="rgb(0, 0, 0)"
                            />
                            <div className="flex items-center gap-2 mt-4 text-sm text-neutral-500">
                                <Text size="s" color="muted">Result:</Text>
                                <div
                                    className="w-4 h-4 rounded border border-neutral-200"
                                    style={{ backgroundColor: rgbColor }}
                                />
                                <Text as="code" size="s">{rgbColor}</Text>
                            </div>
                        </Card>
                    </div>
                </Stack>
            </Stack>
        </DemoCard>
    );
};

export default ColorPickerDemo;
