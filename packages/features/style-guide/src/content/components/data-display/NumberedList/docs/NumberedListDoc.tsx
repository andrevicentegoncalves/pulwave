import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const NumberedListDoc: ComponentDoc = {
  name: 'NumberedList',
  description: 'A styled ordered list component, useful for displaying steps, instructions, or rankings.',
  status: 'stable',
  overview: {
    description: 'Styled ordered list for steps and rankings.',
  },
  props: [
    { name: 'items', type: "Array<{ name: string, description?: string }>", description: 'Data array for simple rendering.' },
    { name: 'children', type: "ReactNode", description: 'For composed usage.' },
  ]
};

export default NumberedListDoc;
