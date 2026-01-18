import { Carousel } from '@pulwave/widgets';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<div style={{ height: '300px' }}>
    <Carousel autoPlay interval={3000}>
        <div style={{ background: '#ffe4e1' }}>Slide 1</div>
        <div style={{ background: '#e0ffff' }}>Slide 2</div>
        <div style={{ background: '#f0e68c' }}>Slide 3</div>
    </Carousel>
</div>`;

const CarouselAutoPlayDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="AutoPlay Carousel" description="Automatically transitions slides every 3 seconds">
        <div style={{ height: '300px', background: '#f5f5f5' }}>
            <Carousel autoPlay interval={3000}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#ffe4e1' }}>Slide 1</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#e0ffff' }}>Slide 2</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f0e68c' }}>Slide 3</div>
            </Carousel>
        </div>
    </DemoCard>
);

export default CarouselAutoPlayDemo;
