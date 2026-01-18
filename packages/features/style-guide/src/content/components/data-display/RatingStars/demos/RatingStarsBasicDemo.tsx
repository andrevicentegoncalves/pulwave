import { RatingStars, Stack, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<RatingStars value={4} size="m" />
<RatingStars value={5} color="warning" />
<RatingStars value={3.7} showNumeric />`;

const RatingStarsBasicDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Rating Stars" description="Star rating component">
            <Stack spacing="8">
                <Stack spacing="2">
                    <Text weight="bold">Sizes</Text>
                    <div className="flex items-center gap-4">
                        <RatingStars value={4} size="s" />
                        <RatingStars value={4} size="m" />
                        <RatingStars value={4} size="l" />
                    </div>
                </Stack>

                <Stack spacing="2">
                    <Text weight="bold">Colors</Text>
                    <div className="flex items-center gap-4">
                        <RatingStars value={5} color="warning" />
                        <RatingStars value={5} color="primary" />
                        <RatingStars value={5} color="success" />
                        <RatingStars value={5} color="error" />
                    </div>
                </Stack>

                <Stack spacing="2">
                    <Text weight="bold">Precision & Numeric</Text>
                    <div className="flex flex-col gap-2">
                        <RatingStars value={3.2} showNumeric />
                        <RatingStars value={3.7} showNumeric />
                        <RatingStars value={4.9} showNumeric />
                    </div>
                </Stack>
            </Stack>
        </DemoCard>
    );
};

export default RatingStarsBasicDemo;
