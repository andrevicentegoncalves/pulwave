import React, { useState } from 'react';
import { TransferList, TransferItem, Stack } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<TransferList
    dataSource={mockData}
    targetKeys={targetKeys}
    onChange={onChange}
    showSearch
    titles={['Available', 'Selected']}
    listHeight={280}
/>`;

const mockData: TransferItem[] = Array.from({ length: 20 }).map((_, i) => ({
    key: i.toString(),
    title: `Option ${i + 1}`,
    description: `Description for option ${i + 1}`,
    disabled: i % 3 === 0 && i !== 0,
}));

const TransferListDemo = () => {
    const [targetKeys, setTargetKeys] = useState<string[]>(['1', '4']);

    const onChange = (nextTargetKeys: string[], direction: 'left' | 'right', moveKeys: string[]) => {
        console.log('direction:', direction);
        console.log('moveKeys:', moveKeys);
        setTargetKeys(nextTargetKeys);
    };

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Transfer List"
            description="Move items between two lists."
        >
            <Stack spacing="8">
                <TransferList
                    dataSource={mockData}
                    targetKeys={targetKeys}
                    onChange={onChange}
                    showSearch
                    titles={['Available', 'Selected']}
                    listHeight={280}
                />
            </Stack>
        </DemoCard>
    );
};

export default TransferListDemo;
