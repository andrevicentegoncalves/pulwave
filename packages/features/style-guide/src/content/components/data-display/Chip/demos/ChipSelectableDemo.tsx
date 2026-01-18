/**
 * Chip Selectable Demo
 * Shows selectable chips
 */
import { useState } from 'react';
import { Chip, Avatar } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';
import { Star, Heart, Bookmark } from '@ui';

const codeUsage = `<Chip selected={isSelected} onSelect={toggle}>
    Selectable Chip
</Chip>`;

const ChipSelectableDemo = () => {
    const [selected, setSelected] = useState<string[]>(['React']);

    const options = ['React', 'Vue', 'Angular', 'Svelte'];

    const toggleOption = (option: string) => {
        setSelected(prev =>
            prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option]
        );
    };

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Selectable Chips"
            description="Chips that can be selected/deselected"
        >
            <>
                {options.map(option => (
                    <Chip
                        key={option}
                        selected={selected.includes(option)}
                        onSelect={() => toggleOption(option)}
                    >
                        {option}
                    </Chip>
                ))}
            </>
        </DemoCard>
    );
};

export default ChipSelectableDemo;
