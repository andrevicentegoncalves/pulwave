import { Carousel } from '@pulwave/widgets';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<div style={{ height: '300px' }}>
    <Carousel slidesToShow={2}>
        <div style={{ background: '#ffcccc' }}>Slide 1</div>
        <div style={{ background: '#ccffcc' }}>Slide 2</div>
        <div style={{ background: '#ccccff' }}>Slide 3</div>
        <div style={{ background: '#ffffcc' }}>Slide 4</div>
    </Carousel>
</div>`;

const CarouselMultipleDemo = () => (
    <DemoCard sourceCode={demoCode} showSourceToggle={true} title="Multiple Slides" description="Show multiple slides at once (slidesToShow=2)">
        <div style={{ height: '300px', background: '#f5f5f5' }}>
            <Carousel slidesToShow={2}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#ffcccc', borderRight: '1px solid white' }}>Slide 1</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#ccffcc', borderRight: '1px solid white' }}>Slide 2</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#ccccff', borderRight: '1px solid white' }}>Slide 3</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#ffffcc', borderRight: '1px solid white' }}>Slide 4</div>
            </Carousel>
        </div>
    </DemoCard>
);

const demoCode = `<div style={{ height: '300px' }}>
    <Carousel slidesToShow={2}>
        <div style={{ background: '#ffcccc' }}>Slide 1</div>
        <div style={{ background: '#ccffcc' }}>Slide 2</div>
        <div style={{ background: '#ccccff' }}>Slide 3</div>
        <div style={{ background: '#ffffcc' }}>Slide 4</div>
    </Carousel>
</div>`;

export default CarouselMultipleDemo;
