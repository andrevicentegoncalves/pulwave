/**
 * CodeBlock Component
 * 
 * Displays syntax-highlighted code examples.
 */
import React from 'react';
import { Text } from "@pulwave/ui";

export interface CodeBlockProps {
    code: string;
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
}

export const CodeBlock = ({
    code,
    language = 'tsx',
    title,
    showLineNumbers = false,
}: CodeBlockProps) => {
    return (
        <div className="code-block">
            {title && <Text className="code-block__title">{title}</Text>}
            <pre className="code-block__pre">
                <code className={`language-${language}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
};

CodeBlock.displayName = 'CodeBlock';
