import { ComponentDoc } from '@pulwave/features-style-guide';
import { RichTextEditorBasicDemo as RichTextEditorBasic } from '../demos';

const RichTextEditorDoc: ComponentDoc = {
    name: 'RichTextEditor',
    subtitle: 'WYSIWYG text editor with formatting tools.',
    description: 'RichTextEditor is a feature-rich WYSIWYG text editor built on TipTap, providing formatting tools for bold, italic, lists, links, and more with full accessibility support.',
    status: 'stable',
    version: '1.0.0',
    lastUpdated: '2026-01-17',

    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    whenToUse: [
        'CMS content editing interfaces',
        'Blog post or article composition',
        'Email template builders',
        'Comment systems requiring formatting',
        'Documentation editors',
    ],

    whenNotToUse: [
        { text: 'Simple single-line text input', alternative: 'Input component' },
        { text: 'Plain multi-line text without formatting', alternative: 'TextArea component' },
        { text: 'Code editing with syntax highlighting', alternative: 'Code editor component' },
        { text: 'Markdown-only content', alternative: 'Markdown editor' },
    ],

    overview: {
        description: 'A full-featured rich text editor with customizable toolbar and TipTap-powered editing.',
        variants: ['default', 'minimal', 'full'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'A simple rich text editor with toolbar.',
                component: RichTextEditorBasic,
            },
        ],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Toolbar', description: 'Formatting buttons (bold, italic, lists, etc.)' },
                { name: '2. Editor Area', description: 'Content editing region' },
                { name: '3. Placeholder', description: 'Hint text when empty' },
                { name: '4. Focus Ring', description: 'Visual focus indicator' },
            ]
        },
        emphasis: 'Toolbar provides visual formatting controls while content area handles text.',
        alignment: 'Toolbar above editor, full-width layout.',
    },

    content: {
        mainElements: 'Editable content area with toolbar for formatting operations.',
        overflowContent: 'Content scrolls vertically within the editor bounds.',
        internationalization: 'Supports RTL text and locale-specific formatting.',
    },

    designRecommendations: [
        'Provide clear visual feedback for active formatting states.',
        'Keep toolbar compact with most-used actions visible.',
        'Consider hiding advanced features behind "More" menu.',
        'Maintain consistent height for predictable layouts.',
    ],

    developmentConsiderations: [
        'Content can be controlled via HTML string or TipTap JSON.',
        'onChange callback provides updated HTML content.',
        'Use editable=false for read-only display mode.',
        'Consider debouncing onChange for performance.',
    ],

    props: [
        { name: 'content', type: 'string | object', required: false, description: 'Initial content (HTML or TipTap JSON).' },
        { name: 'onChange', type: '(html: string) => void', required: false, description: 'Callback when content changes (receives HTML string).' },
        { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text.', defaultValue: '"Start typing..."' },
        { name: 'editable', type: 'boolean', required: false, description: 'Whether the editor is editable.', defaultValue: 'true' },
        { name: 'minHeight', type: 'string', required: false, description: 'Minimum height of the editor.', defaultValue: '"150px"' },
        { name: 'showToolbar', type: 'boolean', required: false, description: 'Whether to show the toolbar.', defaultValue: 'true' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate between toolbar and editor' },
            { key: 'Ctrl/Cmd + B', action: 'Toggle bold' },
            { key: 'Ctrl/Cmd + I', action: 'Toggle italic' },
            { key: 'Ctrl/Cmd + U', action: 'Toggle underline' },
            { key: 'Ctrl/Cmd + Z', action: 'Undo' },
            { key: 'Ctrl/Cmd + Shift + Z', action: 'Redo' },
        ],
        aria: [
            { attribute: 'role="textbox"', usage: 'Editor area is a textbox' },
            { attribute: 'aria-multiline="true"', usage: 'Indicates multi-line input' },
            { attribute: 'aria-label', usage: 'Toolbar buttons have descriptive labels' },
        ],
        screenReader: 'Announces formatting changes and toolbar button states.',
        focusIndicator: 'Visible focus ring on editor and toolbar buttons.',
    },

    relatedComponents: [
        { name: 'TextArea', description: 'Plain multi-line text input', path: 'components/inputs/text-area' },
        { name: 'Input', description: 'Single-line text input', path: 'components/inputs/input' },
        { name: 'Form', description: 'Form wrapper component', path: 'patterns/form/form' },
    ],
};

export default RichTextEditorDoc;
