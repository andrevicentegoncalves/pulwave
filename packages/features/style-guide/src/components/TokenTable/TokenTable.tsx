/**
 * TokenTable Component
 * 
 * Displays style tokens (colors, spacing) in a formatted table.
 * Used in Code tab for documenting component token usage.
 */
import React from 'react';
import { DataTable, Text } from "@pulwave/ui";
import './styles/_index.scss';

export interface TokenState {
    state: string;
    textToken: string;
    backgroundToken: string;
    [key: string]: unknown;
}

export interface TokenVariant {
    variant: string;
    states: TokenState[];
}

export interface TokenTableProps {
    tokens: TokenVariant[];
    className?: string;
}

export const TokenTable = ({ tokens, className = '' }: TokenTableProps) => {
    if (!tokens?.length) return null;

    return (
        <div className={`token-table ${className}`}>
            {tokens.map((variantGroup, index) => (
                <div key={index} className="token-table__variant">
                    <Text as="h4" variant="heading-s" className="token-table__variant-title">{variantGroup.variant}</Text>
                    <DataTable
                        columns={[
                            {
                                key: 'state',
                                header: 'State',
                                width: '20%',
                                render: (value: unknown) => <Text as="span" className="token-table__state">{String(value)}</Text>
                            },
                            {
                                key: 'textToken',
                                header: 'Text',
                                width: '27%',
                                render: (value: unknown) => <Text as="code" className="token-table__token">{String(value)}</Text>
                            },
                            {
                                key: 'backgroundToken',
                                header: 'Background',
                                width: '27%',
                                render: (value: unknown) => <Text as="code" className="token-table__token">{String(value)}</Text>
                            },
                            {
                                key: 'borderToken',
                                header: 'Border',
                                width: '26%',
                                render: (value: unknown) => value ? <Text as="code" className="token-table__token">{String(value)}</Text> : <Text as="span" className="token-table__none">—</Text>
                            },
                        ]}
                        data={variantGroup.states}
                        density="compact"
                    />
                </div>
            ))}
        </div>
    );
};

TokenTable.displayName = 'TokenTable';

export default TokenTable;
