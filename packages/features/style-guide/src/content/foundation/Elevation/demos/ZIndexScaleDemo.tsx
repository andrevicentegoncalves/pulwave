/**
 * Z-Index Scale Demo
 * Shows stacking order visualization
 */
import { DemoCard } from '@pulwave/features-style-guide';
import demoCode from './ZIndexScaleDemo.tsx?raw';

const ZIndexScaleDemo = () => (
    <DemoCard sourceCode={demoCode} showSourceToggle={false}
        title="Z-Index Scale"
        description="Stacking order for overlapping elements"
    >
        <div className="z-index-demo">
            <div className="z-index-demo__stack">
                {[
                    { name: 'tooltip', value: 600 },
                    { name: 'toast', value: 500 },
                    { name: 'modal', value: 400 },
                    { name: 'overlay', value: 300 },
                    { name: 'sticky', value: 200 },
                    { name: 'dropdown', value: 100 },
                    { name: 'base', value: 0 },
                ].map(({ name, value }, index) => (
                    <div
                        key={name}
                        className="z-index-demo__layer"
                        style={{
                            transform: `translateY(${index * 8}px) translateX(${index * 8}px)`,
                            zIndex: value
                        }}
                    >
                        <span>{name} ({value})</span>
                    </div>
                ))}
            </div>
        </div>
    </DemoCard>
);

export default ZIndexScaleDemo;
