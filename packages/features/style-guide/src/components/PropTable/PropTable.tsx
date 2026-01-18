/**
 * PropTable Component
 * 
 * Displays component prop documentation in a table format.
 */
import React from 'react';
import { Text } from "@pulwave/ui";

export interface PropDefinition {
    name: string;
    type: string;
    default?: string;
    required?: boolean;
    description: string;
}

export interface PropTableProps {
    props: PropDefinition[];
}

export const PropTable = ({ props }: PropTableProps) => {
    return (
        <table className="prop-table">
            <thead>
                <tr>
                    <th><Text variant="label">Prop</Text></th>
                    <th><Text variant="label">Type</Text></th>
                    <th><Text variant="label">Default</Text></th>
                    <th><Text variant="label">Description</Text></th>
                </tr>
            </thead>
            <tbody>
                {props.map((prop) => (
                    <tr key={prop.name}>
                        <td>
                            <Text as="code" variant="body-s">{prop.name}</Text>
                            {prop.required && <Text as="span" variant="label" className="prop-table__required" color="error">*</Text>}
                        </td>
                        <td><Text as="code" variant="body-s" color="primary">{prop.type}</Text></td>
                        <td>{prop.default ? <Text as="code" variant="body-s">{prop.default}</Text> : <Text variant="body-s" color="muted">-</Text>}</td>
                        <td><Text variant="body-m">{prop.description}</Text></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

PropTable.displayName = 'PropTable';
