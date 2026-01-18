import { SplitButton, Stack } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import { Save, Trash, Printer } from '@ui';

const codeUsage = `<SplitButton
    kind="primary"
    onClick={handleMain}
    options={[
        { label: 'Save Draft', onClick: handleDraft, icon: <Save /> },
        { label: 'Print', onClick: handlePrint, icon: <Printer /> }
    ]}
>
    Save Changes
</SplitButton>`;

const SplitButtonBasicDemo = () => {
    const handleMain = () => alert('Main Action Clicked');
    const handleOption = (action: string) => alert(`Option ${action} Clicked`);

    const options = [
        { label: 'Save as Draft', onClick: () => handleOption('Save Draft'), icon: <Save size={14} /> },
        { label: 'Print', onClick: () => handleOption('Print'), icon: <Printer size={14} /> },
        { label: 'Delete', onClick: () => handleOption('Delete'), icon: <Trash size={14} /> },
    ];

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Split Button Variants"
            description="SplitButton supports all standard button variants."
        >
            <Stack spacing="4" align="center">
                <SplitButton
                    kind="primary"
                    onClick={handleMain}
                    options={options}
                >
                    Save Changes
                </SplitButton>

                <SplitButton
                    kind="secondary"
                    onClick={handleMain}
                    options={options}
                >
                    Secondary
                </SplitButton>

                <SplitButton
                    kind="error"
                    onClick={() => alert('Destroy!')}
                    options={options}
                >
                    Delete Item
                </SplitButton>

                <SplitButton
                    kind="primary"
                    size="s"
                    onClick={handleMain}
                    options={options}
                >
                    Small
                </SplitButton>
            </Stack>
        </DemoCard>
    );
};

export default SplitButtonBasicDemo;
