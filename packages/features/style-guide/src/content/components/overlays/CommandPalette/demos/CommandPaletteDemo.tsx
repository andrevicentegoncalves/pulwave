import React, { useState, useEffect } from 'react';
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
    CommandShortcut,
    Button,
    Text
} from '@pulwave/ui';
import {
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Mail,
    Rocket
} from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<CommandDialog isOpen={open} onClose={() => setOpen(false)}>
    <CommandInput placeholder="Type a command or search…" />
    <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => console.log('Calendar')}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Calendar</span>
            </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
            <CommandItem onSelect={() => console.log('Profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
        </CommandGroup>
    </CommandList>
</CommandDialog>`;

const CommandPaletteDemo = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <DemoCard
            title="Command Palette"
            description="Global command menu."
            sourceCode={codeUsage}
            showSourceToggle={true}
        >
            <div className="p-8 flex flex-col items-center justify-center space-y-4">
                <div className="text-center space-y-2">
                    <Text size="s" color="muted">
                        Press <Text as="kbd" className="px-2 py-1 bg-neutral-100 rounded border border-neutral-300 text-xs font-mono">Cmd+K</Text> or click the button below.
                    </Text>
                    <Button onClick={() => setOpen(true)} kind="secondary" variant="outlined">
                        Open Command Palette
                    </Button>
                </div>

                <CommandDialog isOpen={open} onClose={() => setOpen(false)}>
                    <CommandInput placeholder="Type a command or search…" />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            <CommandItem onSelect={() => console.log('Calendar')}>
                                <Calendar className="mr-2 h-4 w-4" />
                                <Text>Calendar</Text>
                            </CommandItem>
                            <CommandItem onSelect={() => console.log('Search Emoji')}>
                                <Smile className="mr-2 h-4 w-4" />
                                <Text>Search Emoji</Text>
                            </CommandItem>
                            <CommandItem onSelect={() => console.log('Launch')}>
                                <Rocket className="mr-2 h-4 w-4" />
                                <Text>Launch</Text>
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Settings">
                            <CommandItem onSelect={() => console.log('Profile')}>
                                <User className="mr-2 h-4 w-4" />
                                <Text>Profile</Text>
                                <CommandShortcut>⌘P</CommandShortcut>
                            </CommandItem>
                            <CommandItem onSelect={() => console.log('Billing')}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                <Text>Billing</Text>
                                <CommandShortcut>⌘B</CommandShortcut>
                            </CommandItem>
                            <CommandItem onSelect={() => console.log('Settings')}>
                                <Settings className="mr-2 h-4 w-4" />
                                <Text>Settings</Text>
                                <CommandShortcut>⌘S</CommandShortcut>
                            </CommandItem>
                            <CommandItem onSelect={() => console.log('Mail')}>
                                <Mail className="mr-2 h-4 w-4" />
                                <Text>Mail</Text>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>
        </DemoCard>
    );
};

export default CommandPaletteDemo;
