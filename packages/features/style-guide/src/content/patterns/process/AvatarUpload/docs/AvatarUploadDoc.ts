import { ComponentDoc } from '@pulwave/features-style-guide';

export const AvatarUploadDoc: ComponentDoc = {
    name: 'AvatarUpload',
    subtitle: 'Interactive avatar image uploader.',
    description: 'AvatarUpload extends the standard Avatar component with interactive features for uploading or changing the user profile image with drag-and-drop and click support.',
    sourcePath: 'packages/ui/components/AvatarUpload/AvatarUpload.tsx',
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
        'User profile settings pages',
        'Account setup wizards',
        'Team member management',
        'Organization branding settings',
        'Any context requiring profile image upload',
    ],

    whenNotToUse: [
        { text: 'Display-only avatars', alternative: 'Avatar component' },
        { text: 'Multiple file uploads', alternative: 'FileUpload component' },
        { text: 'Document uploads', alternative: 'FileUpload with document types' },
        { text: 'Inline image editing', alternative: 'ImageEditor component' },
    ],

    overview: {
        description: 'Interactive avatar with upload capability for profile images.',
        variants: ['default', 'sizes'],
    },

    formatting: {
        anatomy: {
            parts: [
                { name: '1. Avatar Image', description: 'Current or placeholder image' },
                { name: '2. Upload Overlay', description: 'Hover state with camera icon' },
                { name: '3. Loading Indicator', description: 'Spinner during upload' },
                { name: '4. Hidden File Input', description: 'Native file picker trigger' },
            ]
        },
        emphasis: 'Image is primary. Upload action appears on hover.',
        alignment: 'Circular avatar centered. Overlay covers entire area.',
    },

    content: {
        mainElements: 'Circular avatar image with upload overlay on hover.',
        overflowContent: 'Not applicable (fixed size component).',
        internationalization: 'Alt text and hover text should be translatable.',
    },

    designRecommendations: [
        'Use on profile settings pages.',
        'Provide immediate feedback during upload (loading state).',
        'Handle file validation (size, type) in the parent onUpload handler.',
        'Show preview of selected image before uploading.',
    ],

    developmentConsiderations: [
        'Controlled component: src must be managed by parent.',
        'The onUpload callback receives the raw change event from the hidden file input.',
        'Supports keyboard interaction (Enter/Space to trigger upload).',
        'Validate file type and size before upload.',
    ],

    props: [
        { name: 'src', type: 'string', required: false, description: 'URL of the current avatar image.' },
        { name: 'onUpload', type: '(e: ChangeEvent) => void', required: false, description: 'Callback fired when a file is selected.' },
        { name: 'size', type: '"s" | "default" | "m" | "l" | "xl" | "2xl"', required: false, description: 'Size of the avatar.', defaultValue: '"default"' },
        { name: 'loading', type: 'boolean', required: false, description: 'Shows a loading spinner overlay.', defaultValue: 'false' },
        { name: 'alt', type: 'string', required: false, description: 'Alt text for the image.', defaultValue: '"Avatar"' },
        { name: 'accept', type: 'string', required: false, description: 'Accepted file types.', defaultValue: '"image/*"' },
        { name: 'className', type: 'string', required: false, description: 'Additional CSS classes.' },
    ],

    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Focus the upload control' },
            { key: 'Enter/Space', action: 'Open file picker' },
        ],
        aria: [
            { attribute: 'role="button"', usage: 'Interactive element for upload' },
            { attribute: 'aria-label', usage: 'Describes the upload action' },
            { attribute: 'aria-busy', usage: 'Indicates upload in progress' },
        ],
        screenReader: 'Announces: "Upload profile picture" or "Change profile picture [current alt]".',
        focusIndicator: 'Focus ring around avatar when focused.',
    },

    relatedComponents: [
        { name: 'Avatar', description: 'Display-only avatar', path: 'components/data-display/avatar' },
        { name: 'FileUpload', description: 'General file uploads', path: 'components/inputs/file-upload' },
        { name: 'AvatarGroup', description: 'Multiple avatars', path: 'components/data-display/avatar-group' },
    ],
};

export default AvatarUploadDoc;

