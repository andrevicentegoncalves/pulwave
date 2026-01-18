/**
 * Tooltip Placement Demo
 */
import { Tooltip, Button } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Tooltip content="Top tooltip" direction="top">
    <Button variant="outlined">Top</Button>
</Tooltip>
<Tooltip content="Right tooltip" direction="right">
    <Button variant="outlined">Right</Button>
</Tooltip>
<Tooltip content="Bottom tooltip" direction="bottom">
    <Button variant="outlined">Bottom</Button>
</Tooltip>
<Tooltip content="Left tooltip" direction="left">
    <Button variant="outlined">Left</Button>
</Tooltip>`;

const TooltipPlacementDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Tooltip Placement" description="Different tooltip positions">
        <div className="demo-row">
            <Tooltip content="Top tooltip" direction="top">
                <Button variant="outlined">Top</Button>
            </Tooltip>
            <Tooltip content="Right tooltip" direction="right">
                <Button variant="outlined">Right</Button>
            </Tooltip>
            <Tooltip content="Bottom tooltip" direction="bottom">
                <Button variant="outlined">Bottom</Button>
            </Tooltip>
            <Tooltip content="Left tooltip" direction="left">
                <Button variant="outlined">Left</Button>
            </Tooltip>
        </div>
    </DemoCard>
);

export default TooltipPlacementDemo;
