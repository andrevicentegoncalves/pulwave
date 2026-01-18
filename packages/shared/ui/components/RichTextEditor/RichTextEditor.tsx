import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@pulwave/utils';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    LinkIcon,
    Undo,
    Redo,
    Quote
} from '../../icon-library';
import { richTextEditorVariants, type RichTextEditorProps } from './types';
import './styles/_index.scss';



/**
 * Toolbar Button
 */
const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    children,
    title
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={title}
        aria-pressed={isActive}
        className={cn(
            'rich-text-editor__toolbar-btn',
            isActive && 'rich-text-editor__toolbar-btn--state-active'
        )}
    >
        {children}
    </button>
);

/**
 * RichTextEditor Component
 * 
 * A WYSIWYG editor built on TipTap with system styling.
 */
export const RichTextEditor = ({
    content = '',
    onChange,
    placeholder = 'Start typing…',
    editable = true,
    minHeight = '150px',
    className,
    style,
    toolbarActions,
    showToolbar = true,
}: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'rich-text-editor__link',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const handleLinkAdd = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div
            className={cn(richTextEditorVariants({ editable }), className)}
            style={style}
        >
            {showToolbar && editable && (
                <div className="rich-text-editor__toolbar">
                    <div className="rich-text-editor__toolbar-group">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            title="Bold"
                        >
                            <Bold size={16} aria-hidden="true" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            title="Italic"
                        >
                            <Italic size={16} aria-hidden="true" />
                        </ToolbarButton>
                    </div>

                    <div className="rich-text-editor__toolbar-divider" />

                    <div className="rich-text-editor__toolbar-group">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive('bulletList')}
                            title="Bullet List"
                        >
                            <List size={16} aria-hidden="true" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor.isActive('orderedList')}
                            title="Ordered List"
                        >
                            <ListOrdered size={16} aria-hidden="true" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            isActive={editor.isActive('blockquote')}
                            title="Quote"
                        >
                            <Quote size={16} aria-hidden="true" />
                        </ToolbarButton>
                    </div>

                    <div className="rich-text-editor__toolbar-divider" />

                    <div className="rich-text-editor__toolbar-group">
                        <ToolbarButton
                            onClick={handleLinkAdd}
                            isActive={editor.isActive('link')}
                            title="Add Link"
                        >
                            <LinkIcon size={16} aria-hidden="true" />
                        </ToolbarButton>
                    </div>

                    <div className="rich-text-editor__toolbar-spacer" />

                    <div className="rich-text-editor__toolbar-group">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            title="Undo"
                        >
                            <Undo size={16} aria-hidden="true" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            title="Redo"
                        >
                            <Redo size={16} aria-hidden="true" />
                        </ToolbarButton>
                    </div>

                    {toolbarActions && (
                        <>
                            <div className="rich-text-editor__toolbar-divider" />
                            {toolbarActions}
                        </>
                    )}
                </div>
            )}

            <EditorContent
                editor={editor}
                className="rich-text-editor__content"
                style={{ minHeight }}
            />
        </div>
    );
};
RichTextEditor.displayName = 'RichTextEditor';
