import type { Editor, Content } from '@tiptap/react';
import type { CSSProperties, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const richTextEditorVariants = cva('rich-text-editor', {
    variants: {
        editable: {
            false: 'rich-text-editor--disabled',
        },
        size: {
            s: 'rich-text-editor--s',
            m: 'rich-text-editor--m',
            l: 'rich-text-editor--l',
        },
    },
    defaultVariants: {
        editable: true,
        size: 'm',
    },
});

export type RichTextEditorVariantProps = VariantProps<typeof richTextEditorVariants>;

export interface RichTextEditorProps extends RichTextEditorVariantProps {
    /**
     * Initial content (HTML string or TipTap JSON)
     */
    content?: Content;

    /**
     * Callback when content changes
     */
    onChange?: (html: string) => void;

    /**
     * Placeholder text
     */
    placeholder?: string;

    /**
     * Whether the editor is editable
     * @default true
     */
    editable?: boolean;

    /**
     * Minimum height of the editor
     * @default '150px'
     */
    minHeight?: string;

    /**
     * Additional className
     */
    className?: string;

    /**
     * Style object
     */
    style?: CSSProperties;

    /**
     * Custom toolbar actions (rendered after default actions)
     */
    toolbarActions?: ReactNode;

    /**
     * Whether to show the toolbar
     * @default true
     */
    showToolbar?: boolean;
}

export type { Editor };
