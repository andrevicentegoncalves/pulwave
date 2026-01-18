import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const WordCloudDoc: ComponentDoc = {
    name: 'WordCloud',
    status: 'stable',
    version: '1.0.0',
    description: 'Displays words with size proportional to frequency or importance. Creates an engaging, at-a-glance view of key themes in text data. Excellent for survey responses, social media analysis, and content summarization.',

    whenToUse: [
        'Summarizing survey open-ended responses',
        'Social media sentiment and topic analysis',
        'Content and keyword frequency visualization',
        'Engaging infographics about themes/topics',
        'Quick visual summary of text corpus',
    ],

    whenNotToUse: [
        'Precise frequency comparison - word sizes are approximate',
        'Few unique words (<15) - not visually impactful',
        'When word context matters - loses sentence structure',
        'Scientific analysis requiring accuracy',
        'When words have similar frequencies - hard to distinguish',
    ],

    usage: `
\`\`\`tsx
import { WordCloud, ChartProvider } from '@pulwave/ui/data-visualization';

const surveyKeywords = [
    { text: 'Innovation', value: 100 },
    { text: 'Collaboration', value: 85 },
    { text: 'Quality', value: 78 },
    { text: 'Efficiency', value: 72 },
    { text: 'Customer Focus', value: 65 },
    { text: 'Growth', value: 58 },
    { text: 'Sustainability', value: 52 },
    { text: 'Technology', value: 48 },
    { text: 'Teamwork', value: 45 },
    { text: 'Leadership', value: 40 },
];

<ChartProvider>
  <WordCloud
    data={surveyKeywords}
    minFontSize={14}
    maxFontSize={72}
    colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']}
    rotations={[-30, 0, 30]}
  />
</ChartProvider>
\`\`\`
`,

    content: {
        mainElements: 'A word cloud displays words positioned to fill a shape, with font size proportional to frequency/importance. Essential elements include the words and optional color coding.',
        overflowContent: 'Works best with 30-100 words. Too few looks sparse; too many becomes illegible. Filter out common stop words and set a minimum frequency threshold.',
        internationalization: 'Words are in the source language. Font size scaling works across languages. Consider font choice for non-Latin scripts.',
    },

    formatting: {
        emphasis: 'Use varied colors for visual interest or color by category. Avoid too many rotations (0°, ±30° work well). Most important words naturally draw attention.',
        alignment: 'Words fill the available space organically. Shape masks (circle, heart) can add meaning. Ensure adequate contrast.',
    },

    props: [
        { name: 'data', type: "Array<{text, value}>", required: true, description: 'Array of words with their frequency/importance values.' },
        { name: 'minFontSize', type: "number", default: "12", description: 'Minimum font size for low-frequency words.' },
        { name: 'maxFontSize', type: "number", default: "64", description: 'Maximum font size for high-frequency words.' },
        { name: 'colors', type: "string[]", description: 'Color palette for words.' },
        { name: 'rotations', type: "number[]", default: "[0]", description: 'Allowed rotation angles in degrees.' },
        { name: 'onWordClick', type: "(word: {text, value}) => void", description: 'Callback when a word is clicked.' },
    ],

    accessibility: {
        aria: [
            { attribute: 'role="img"', usage: 'Chart container is marked as an image' },
            { attribute: 'aria-label', usage: 'Describes the content (e.g., "Word cloud showing top themes from employee survey")' },
            { attribute: 'aria-describedby', usage: 'Links to word frequency table' },
        ],
        screenReader: 'Screen readers announce words in order of frequency with their values. Provide a ranked list alternative for full accessibility.',
        keyboard: [
            { key: 'Tab', action: 'Navigate between words (in frequency order)' },
            { key: 'Enter', action: 'Select word for filtering/details' },
        ],
    },
};

export default WordCloudDoc;
