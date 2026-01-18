/**
 * StructureSpec Component
 * 
 * Displays spacing/structure specifications in a formatted table.
 * Used in Code tab for documenting component spacing tokens.
 */
import React from 'react';
import { DataTable, Text } from "@pulwave/ui";
import './styles/_index.scss';

export interface StructureItem {
    part: string;
    token: string;
    value: string;
    [key: string]: unknown;
}

export interface StructureSpecProps {
    specs: StructureItem[];
    className?: string;
}

export const StructureSpec = ({ specs, className = '' }: StructureSpecProps) => {
    if (!specs?.length) return null;

    return (
        <div className={`structure-spec ${className}`}>
            <DataTable
                columns={[
                    {
                        key: 'part',
                        header: 'Element',
                        width: '35%',
                        render: (value: unknown) => <Text as="span" className="structure-spec__part">{String(value)}</Text>
                    },
                    {
                        key: 'token',
                        header: 'Token',
                        width: '40%',
                        render: (value: unknown) => <Text as="code" className="structure-spec__token">{String(value)}</Text>
                    },
                    {
                        key: 'value',
                        header: 'Value',
                        width: '25%',
                        render: (value: unknown) => <Text as="span" className="structure-spec__value">{String(value)}</Text>
                    },
                ]}
                data={specs}
                density="compact"
            />
        </div>
    );
};

StructureSpec.displayName = 'StructureSpec';

export default StructureSpec;
