import { Carousel } from '@pulwave/widgets';
import { Stack, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Carousel showArrows={false}>
    {/* Slides */}
</Carousel>

<Carousel showDots={false}>
    {/* Slides */}
</Carousel>`;

const CarouselNavigationDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Carousel Navigation" description="Customizing navigation controls (arrows/dots)">
        <Stack spacing={8}>
            <div>
                <Text size="s" className="mb-2">No Arrows</Text>
                <div style={{ height: '200px', background: '#f5f5f5' }}>
                    <Carousel showArrows={false}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#ddd' }}>Slide 1</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#eee' }}>Slide 2</div>
                    </Carousel>
                </div>
            </div>
            <div>
                <Text size="s" className="mb-2">No Dots</Text>
                <div style={{ height: '200px', background: '#f5f5f5' }}>
                    <Carousel showDots={false}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#ddd' }}>Slide 1</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#eee' }}>Slide 2</div>
                    </Carousel>
                </div>
            </div>
        </Stack>
    </DemoCard>
);

export default CarouselNavigationDemo;
