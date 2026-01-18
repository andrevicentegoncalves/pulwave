/**
 * KeyboardShortcutTable Component
 * 
 * Displays keyboard navigation shortcuts in a styled table.
 * Used in Accessibility tab for documenting keyboard interactions.
 */
import React from 'react';
import { Keyboard } from '@pulwave/ui';
import { DataTable, Text } from "@pulwave/ui";
import './styles/_index.scss';

export interface KeyboardShortcut {
    key: string;
    action: string;
    [key: string]: unknown;
}

export interface KeyboardShortcutTableProps {
    shortcuts: KeyboardShortcut[];
    className?: string;
}

export const KeyboardShortcutTable = ({ shortcuts, className = '' }: KeyboardShortcutTableProps) => {
    if (!shortcuts?.length) return null;

    return (
        <div className={`keyboard-shortcuts ${className}`}>
            {/* Header is handled by parent usually, but if we want it self-contained: */}
            {/* Actually ComponentDocPage renders header outside. I'll remove header or keep it? */}
            {/* Existing usage in ComponentDocPage has header outside. */}
            {/* But this component HAS a header inside line 25. */}
            {/* If I use this component, I should probably remove the header from ComponentDocPage */}
            {/* OR I make this component just the table. */}
            {/* I'll make it just the table to be flexible, or keep header? */}
            {/* The existing component has a header. I'll stick to making it useful. */}

            <DataTable
                columns={[
                    {
                        key: 'key',
                        header: 'Key',
                        width: '30%',
                        render: (value: unknown) => <Text as="kbd" className="keyboard-shortcuts__key">{String(value)}</Text>
                    },
                    {
                        key: 'action',
                        header: 'Action',
                        width: '70%',
                        render: (value: unknown) => <Text as="span" className="keyboard-shortcuts__action">{String(value)}</Text>
                    }
                ]}
                data={shortcuts}
                density="compact"
            />
        </div>
    );
};

KeyboardShortcutTable.displayName = 'KeyboardShortcutTable';

export default KeyboardShortcutTable;
