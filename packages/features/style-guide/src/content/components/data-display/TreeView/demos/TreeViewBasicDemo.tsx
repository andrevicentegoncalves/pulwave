/**
 * TreeView Basic Demo
 */
import { TreeView } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<TreeView data={[
    {
        id: '1',
        label: 'Documents',
        children: [
            { id: '1-1', label: 'Work' },
            { id: '1-2', label: 'Personal' },
        ]
    },
    {
        id: '2',
        label: 'Images',
        children: [
            { id: '2-1', label: 'Vacation' },
            { id: '2-2', label: 'Events' },
        ]
    },
]} />`;

const treeData = [
    {
        id: '1',
        label: 'Documents',
        children: [
            { id: '1-1', label: 'Work' },
            { id: '1-2', label: 'Personal' },
        ]
    },
    {
        id: '2',
        label: 'Images',
        children: [
            { id: '2-1', label: 'Vacation' },
            { id: '2-2', label: 'Events' },
        ]
    },
];

const TreeViewBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic TreeView" description="Hierarchical tree structure">
        <TreeView data={treeData} />
    </DemoCard>
);

export default TreeViewBasicDemo;
