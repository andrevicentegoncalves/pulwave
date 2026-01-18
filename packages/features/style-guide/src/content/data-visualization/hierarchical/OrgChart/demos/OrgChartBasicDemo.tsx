/**
 * OrgChart Basic Demo
 */
import React from 'react';
import { OrgChart } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { OrgChart, ChartProvider } from '@pulwave/ui/data-visualization';

const data = {
    name: 'CEO',
    children: [
        { name: 'Manager A', children: [{ name: 'Employee A1' }, { name: 'Employee A2' }] },
        { name: 'Manager B', children: [{ name: 'Employee B1' }] },
    ]
};

<ChartProvider>
  <OrgChart data={data} />
</ChartProvider>`;

const data = {
    name: 'CEO',
    children: [
        { name: 'Manager A', children: [{ name: 'Employee A1' }, { name: 'Employee A2' }] },
        { name: 'Manager B', children: [{ name: 'Employee B1' }] },
    ]
};

const OrgChartBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Org Chart" description="Organizational structure">
        <OrgChart
            data={data}
        />
    </DemoCard>
);

export default OrgChartBasicDemo;
