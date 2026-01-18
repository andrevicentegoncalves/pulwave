import React from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@pulwave/ui';
import { User, Settings, CreditCard } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const CommandPrimitiveDemo = () => {
    return (
        <DemoCard title="Command Primitive" description="Low-level composable command palette components.">
            <div style={{ border: '1px solid var(--color-border-default)', borderRadius: '8px', maxWidth: '400px' }}>
                <Command>
                    <CommandInput placeholder="Type a command or search…" />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            <CommandItem>
                                <User size={14} style={{ marginRight: '8px' }} />
                                <span>Profile</span>
                            </CommandItem>
                            <CommandItem>
                                <CreditCard size={14} style={{ marginRight: '8px' }} />
                                <span>Billing</span>
                            </CommandItem>
                            <CommandItem>
                                <Settings size={14} style={{ marginRight: '8px' }} />
                                <span>Settings</span>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </div>
        </DemoCard>
    );
};

