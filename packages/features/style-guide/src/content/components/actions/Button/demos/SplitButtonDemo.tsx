/**
 * Split Button Demo
 * Shows SplitButton with primary action and dropdown menu
 */
import { SplitButton, Download, Mail, Printer, Share } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import './SplitButtonDemo.scss';

const codeUsage = `import { SplitButton, Download, Mail, Printer, Share } from '@ui';

<SplitButton
    kind="primary"
    leftIcon={<Share size={16} />}
    onClick={() => console.log('Share')}
    options={[
        { label: 'Download', onClick: () => {}, icon: <Download size={16} /> },
        { label: 'Email', onClick: () => {}, icon: <Mail size={16} /> },
        { label: 'Print', onClick: () => {}, icon: <Printer size={16} /> },
    ]}
>
    Share
</SplitButton>`;

const SplitButtonDemo = () => (
    <DemoCard
        sourceCode={codeUsage}
        showSourceToggle={true}
        title="Split Button"
        description="Primary action with dropdown menu for secondary actions"
        className="split-button-demo-card"
    >
        <div className="flex flex-wrap items-center gap-6">
            <SplitButton
                kind="primary"
                leftIcon={<Share size={16} />}
                onClick={() => console.log('Share clicked')}
                options={[
                    { label: 'Download', onClick: () => console.log('Download'), icon: <Download size={16} /> },
                    { label: 'Email', onClick: () => console.log('Email'), icon: <Mail size={16} /> },
                    { label: 'Print', onClick: () => console.log('Print'), icon: <Printer size={16} /> },
                ]}
            >
                Share
            </SplitButton>

            <SplitButton
                kind="secondary"
                onClick={() => console.log('Save clicked')}
                options={[
                    { label: 'Save as Draft', onClick: () => { } },
                    { label: 'Save as Template', onClick: () => { } },
                ]}
            >
                Save
            </SplitButton>

            <SplitButton
                kind="neutral"
                variant="outlined"
                onClick={() => console.log('Export clicked')}
                options={[
                    { label: 'Export as PDF', onClick: () => { } },
                    { label: 'Export as CSV', onClick: () => { } },
                ]}
            >
                Export
            </SplitButton>
        </div>
    </DemoCard>
);

export default SplitButtonDemo;
