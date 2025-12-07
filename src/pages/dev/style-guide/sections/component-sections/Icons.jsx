import React, { useState } from 'react';
import * as IconLib from '../../../../../components/ui/iconLibrary';
import { Input } from '../../../../../components/ui';

export default function Icons() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter icons based on search term
  // specific exports like 'default' should be ignored
  const allIcons = Object.entries(IconLib)
    .filter(([name]) => name !== 'default')
    .sort(([a], [b]) => a.localeCompare(b));

  const filteredIcons = allIcons.filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (name) => {
    navigator.clipboard.writeText(name);
    // Placeholder for toast notification since react-hot-toast is not installed
    console.log(`Copied ${name} to clipboard`);
    // Ideally we would show a custom internal toast here
    alert(`Copied ${name} to clipboard`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-medium">Icon Library</h3>
          <p className="text-muted-foreground">
            Centralized icon library wrapping Lucide React icons.
            Click on any icon to copy its name.
          </p>
        </div>

        <div className="max-w-md">
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={IconLib.Search}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredIcons.map(([name, IconComponent]) => {
          // Verify it's a valid component
          if (typeof IconComponent !== 'function' && typeof IconComponent !== 'object') return null;

          return (
            <button
              key={name}
              onClick={() => copyToClipboard(name)}
              className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-3 group"
            >
              <IconComponent className="h-8 w-8 text-foreground group-hover:scale-110 transition-transform" />
              <span className="text-xs text-muted-foreground font-mono truncate w-full text-center">
                {name}
              </span>
            </button>
          );
        })}
      </div>

      {filteredIcons.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No icons found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
}
