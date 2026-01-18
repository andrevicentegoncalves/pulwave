import React from 'react';
import { Skeleton, Stack, Text, Card } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Skeleton variant="circular" width={48} height={48} />
<Skeleton variant="rounded" width={80} height={48} />
<Skeleton variant="rectangular" width={80} height={48} />`;

const SkeletonEnhancementDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Skeleton Variants & Composition" description="Advanced usage">
            <Stack spacing="8">
                <Stack spacing="4">
                    <Text size="l" weight="bold">Variants</Text>
                    <div className="flex gap-4 items-center">
                        <Stack spacing="2" className="items-center">
                            <Skeleton variant="circular" width={48} height={48} />
                            <Text size="s">Circular</Text>
                        </Stack>
                        <Stack spacing="2" className="items-center">
                            <Skeleton variant="rounded" width={80} height={48} />
                            <Text size="s">Rounded</Text>
                        </Stack>
                        <Stack spacing="2" className="items-center">
                            <Skeleton variant="rectangular" width={80} height={48} />
                            <Text size="s">Rectangular</Text>
                        </Stack>
                    </div>
                </Stack>

                <Stack spacing="4">
                    <Text size="l" weight="bold">Composite: Card</Text>
                    <Card className="max-w-[300px]">
                        <Stack spacing="4" className="p-4">
                            <div className="flex items-center gap-3">
                                <Skeleton variant="circular" width={40} height={40} />
                                <Stack spacing="2" className="flex-1">
                                    <Skeleton variant="text" width="60%" height={16} />
                                    <Skeleton variant="text" width="40%" height={12} />
                                </Stack>
                            </div>
                            <Skeleton variant="rounded" width="100%" height={120} />
                        </Stack>
                    </Card>
                </Stack>
            </Stack>
        </DemoCard>
    );
};

export default SkeletonEnhancementDemo;
