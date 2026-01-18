import { Carousel } from '@pulwave/widgets';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Carousel style={{ height: '300px' }}>
    <div style={{ background: '#ffcccc' }}>Slide 1</div>
    <div style={{ background: '#ccffcc' }}>Slide 2</div>
    <div style={{ background: '#ccccff' }}>Slide 3</div>
</Carousel>`;

const CarouselBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Carousel" description="Slideshow component">
        <div style={{ height: '300px', background: '#f5f5f5' }}>
            <Carousel>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#ffcccc' }}>Slide 1</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#ccffcc' }}>Slide 2</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#ccccff' }}>Slide 3</div>
            </Carousel>
        </div>
    </DemoCard>
);

export default CarouselBasicDemo;
