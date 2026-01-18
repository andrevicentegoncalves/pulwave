import { useState } from 'react';
import { FileUpload } from '@ui';
import type { UploadedFile } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<FileUpload
    files={files}
    onFilesChange={setFiles}
    multiple
    accept={['image/*', '.pdf', '.doc', '.docx']}
    maxSize={10 * 1024 * 1024}
    placeholder="Drag files here or click to upload (max 10MB)"
/>`;

const FileUploadDemo = () => {
    const [files, setFiles] = useState<UploadedFile[]>([]);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="File Upload" description="Drag-and-drop file uploader">
            <FileUpload
                files={files}
                onFilesChange={setFiles}
                multiple
                accept={['image/*', '.pdf', '.doc', '.docx']}
                maxSize={10 * 1024 * 1024}
                placeholder="Drag files here or click to upload (max 10MB)"
            />
        </DemoCard>
    );
};

export default FileUploadDemo;
