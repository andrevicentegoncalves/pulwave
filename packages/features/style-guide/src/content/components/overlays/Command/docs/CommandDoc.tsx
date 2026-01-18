import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const CommandDoc: ComponentDoc = {
    name: 'Command Primitive',
    description: 'Fast, composable, unstyled command menu primitives for building custom command palettes.',
    usage: `
\`\`\`tsx
import { Command, CommandInput, CommandList, CommandItem } from '@pulwave/ui';

<Command>
  <CommandInput placeholder="Search…" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Task</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
\`\`\`
`,
    props: [
        { name: 'Command', type: "Component", description: 'Root container.' },
        { name: 'CommandInput', type: "Component", description: 'Search input.' },
        { name: 'CommandList', type: "Component", description: 'Scrollable list container.' },
        { name: 'CommandItem', type: "Component", description: 'Selectable item.' },
    ]
};

export default CommandDoc;
