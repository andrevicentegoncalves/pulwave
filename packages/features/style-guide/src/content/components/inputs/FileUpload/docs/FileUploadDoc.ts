import { ComponentDoc } from '@pulwave/features-style-guide';
import { FileUploadDemo } from '../demos';

export const FileUploadDoc: ComponentDoc = {
    name: 'FileUpload',
    subtitle: 'Drag-and-drop file upload with progress.',
    description: 'File input with drag-and-drop support, file previews, and upload progress tracking.',
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
        'For file uploads with drag-and-drop',
        'When showing file previews is important',
        'For multiple file uploads with progress tracking',
        'Document upload in forms',
        'Media file uploads',
    ],

    whenNotToUse: [
        { text: 'For simple single file select', alternative: 'Native file input' },
        { text: 'For image-only uploads with cropping', alternative: 'AvatarUpload component' },
        { text: 'For inline attachment buttons', alternative: 'Button with file input' },
    ],

    overview: {
        description: 'File upload area with drag and drop support, previews, and progress tracking.',
        variants: ['dropzone', 'button'],
        demos: [
            {
                name: 'Basic Usage',
                description: 'Draggable file upload area.',
                component: FileUploadDemo,
            }
        ]
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Drop Zone', description: 'Drag-and-drop target area' },
                { name: '2. Upload Icon', description: 'Visual indicator for upload action' },
                { name: '3. Instructions', description: 'Text guidance for users' },
                { name: '4. Browse Button', description: 'Alternative to drag-and-drop' },
                { name: '5. File List', description: 'Uploaded files with previews' },
                { name: '6. Progress Bar', description: 'Upload progress indicator' },
            ]
        },
        emphasis: 'Drop zone should clearly indicate drag-over state.',
        alignment: 'Files list below or beside the drop zone.',
    },

    content: {
        mainElements: 'Clear instructions and file type/size restrictions.',
        overflowContent: 'File list scrolls when many files uploaded.',
        internationalization: 'Instructions and error messages should be translatable.',
    },

    designRecommendations: [
        'Show clear drop zone boundaries.',
        'Provide visual feedback on drag-over.',
        'Display accepted file types and size limits.',
        'Show upload progress for each file.',
        'Allow removing uploaded files.',
    ],

    developmentConsiderations: [
        'Validate file types and sizes client-side.',
        'Handle upload errors gracefully.',
        'Support canceling in-progress uploads.',
        'Consider chunked uploads for large files.',
        'Provide progress callbacks for UI updates.',
    ],

    props: [
        { name: 'onFilesChange', type: '(files: UploadedFile[]) => void', required: true, description: 'Callback when files change' },
        { name: 'files', type: 'UploadedFile[]', description: 'Currently uploaded files' },
        { name: 'accept', type: 'string | string[]', description: 'Accepted file types' },
        { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Allow multiple files' },
        { name: 'maxSize', type: 'number', description: 'Maximum file size in bytes' },
        { name: 'maxFiles', type: 'number', description: 'Maximum number of files' },
        { name: 'showPreview', type: 'boolean', defaultValue: 'true', description: 'Show file previews' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disabled state' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus the upload area' },
            { key: 'Enter/Space', action: 'Opens file dialog when focused' },
        ],
        aria: [
            { attribute: 'role="button"', usage: 'Drop zone acts as a button' },
            { attribute: 'aria-label', usage: 'Describes the upload action' },
            { attribute: 'aria-describedby', usage: 'References file restrictions' },
        ],
        screenReader: 'Dropzone announces instructions and file list updates.',
        focusIndicator: 'Focus ring on the drop zone area.',
    },

    relatedComponents: [
        { name: 'AvatarUpload', description: 'Image upload with cropping', path: 'components/inputs/avatar-upload' },
        { name: 'Progress', description: 'Progress indicator', path: 'components/feedback/progress' },
        { name: 'Button', description: 'Alternative upload trigger', path: 'components/actions/button' },
    ],
};

export default FileUploadDoc;

