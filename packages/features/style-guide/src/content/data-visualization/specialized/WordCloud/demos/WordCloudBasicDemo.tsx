/**
 * WordCloud Basic Demo
 */
import React from 'react';
import { WordCloudChart as WordCloud } from '@ui/data-visualization';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { WordCloud, ChartProvider } from '@pulwave/ui/data-visualization';

const data = [
    { text: 'React', value: 100 },
    { text: 'TypeScript', value: 95 },
    { text: 'JavaScript', value: 90 },
    { text: 'NextJS', value: 75 },
    { text: 'Node', value: 70 },
    // ... more words
];

<ChartProvider>
  <WordCloud
    data={data}
    height={350}
  />
</ChartProvider>`;

const data = [
    { text: 'React', value: 100 },
    { text: 'TypeScript', value: 95 },
    { text: 'JavaScript', value: 90 },
    { text: 'NextJS', value: 75 },
    { text: 'Node', value: 70 },
    { text: 'Vue', value: 65 },
    { text: 'Angular', value: 55 },
    { text: 'Svelte', value: 50 },
    { text: 'GraphQL', value: 45 },
    { text: 'REST', value: 42 },
    { text: 'Docker', value: 40 },
    { text: 'AWS', value: 38 },
    { text: 'CSS', value: 35 },
    { text: 'HTML', value: 30 },
    { text: 'Git', value: 28 },
    { text: 'Kubernetes', value: 26 },
    { text: 'Python', value: 55 },
    { text: 'Redux', value: 45 },
    { text: 'SCSS', value: 42 },
    { text: 'Webpack', value: 32 },
    { text: 'Vite', value: 48 },
    { text: 'MongoDB', value: 35 },
    { text: 'PostgreSQL', value: 40 },
    { text: 'Redis', value: 28 },
    { text: 'Prisma', value: 38 },
    { text: 'SASS', value: 25 },
    { text: 'Testing', value: 42 },
    { text: 'CI/CD', value: 35 },
    { text: 'API', value: 50 },
    { text: 'WebSockets', value: 30 },
];

const WordCloudBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Word Cloud" description="Keyword frequency visualization">
        <WordCloud
            data={data}
            height={350}
        />
    </DemoCard>
);

export default WordCloudBasicDemo;
