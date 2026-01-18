
import React, { useState } from 'react';
import { Card, Text, Stack } from "@pulwave/ui";
import { DemoCard } from '@pulwave/features-style-guide';
import './MotionBasicDemo.scss';

const codeUsage = `.element {
    animation: var(--animation-fade-in) var(--duration-normal) var(--easing-standard);
}

// Common animations:
// --animation-fade-in
// --animation-slide-up
// --animation-scale-in
// --animation-pulse`;

const MotionBox = ({ animation, label, description }: { animation: string, label: string, description: string }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const triggerAnimation = () => {
        setIsAnimating(false);
        // Force re-render to restart animation
        setTimeout(() => setIsAnimating(true), 10);
    };

    return (
        <Card
            className="motion-demo-card"
            onClick={triggerAnimation}
        >
            <div className={`motion-demo-box ${isAnimating ? animation : ''}`} />
            <Text as="div" variant="heading-s" className="motion-demo-label">{label}</Text>
            <Text as="div" variant="body-s" className="motion-demo-helper">
                {description}
            </Text>
        </Card>
    );
};

const MotionBasicDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Motion Primitives" description="Click cards to replay animations.">
            <Stack spacing="8">
                <div>
                    <Text as="h3" variant="heading-m" className="motion-demo-title">
                        Entrance Animations
                    </Text>
                    <Text variant="body-s" className="motion-demo-description">
                        Click each card to trigger the animation
                    </Text>
                    <div className="motion-demo-grid">
                        <MotionBox animation="motion-demo-fade-in" label="Fade In" description="--duration-normal" />
                        <MotionBox animation="motion-demo-slide-up" label="Slide Up" description="--easing-decelerate" />
                        <MotionBox animation="motion-demo-scale-in" label="Scale In" description="--duration-fast" />
                    </div>
                </div>

                <div>
                    <Text as="h3" variant="heading-m" className="motion-demo-title">
                        Micro-Interactions
                    </Text>
                    <div className="motion-demo-grid">
                        <MotionBox animation="motion-demo-pulse" label="Pulse" description="Attention" />
                        <MotionBox animation="motion-demo-bounce" label="Bounce" description="Confirmation" />
                        <MotionBox animation="motion-demo-shake" label="Shake" description="Error" />
                    </div>
                </div>

                <div>
                    <Text as="h3" variant="heading-m" className="motion-demo-title">
                        Duration & Easing
                    </Text>
                    <div className="motion-demo-grid">
                        <MotionBox animation="motion-demo-slow" label="Slow" description="--duration-slow (400ms)" />
                        <MotionBox animation="motion-demo-normal" label="Normal" description="--duration-normal (200ms)" />
                        <MotionBox animation="motion-demo-fast" label="Fast" description="--duration-fast (100ms)" />
                    </div>
                </div>
            </Stack>
        </DemoCard>
    );
};

export default MotionBasicDemo;
