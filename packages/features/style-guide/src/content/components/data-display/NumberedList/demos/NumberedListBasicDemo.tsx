import React from 'react';
import { NumberedList } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const NumberedListBasicDemo = () => {
    return (
        <DemoCard title="Numbered List" description="A styled ordered list for steps or instructions.">
            <NumberedList
                items={[
                    { name: 'Create Account', description: 'Sign up for a new account using your email.' },
                    { name: 'Verify Identity', description: 'Upload your ID documents for verification.' },
                    { name: 'Start Investing', description: 'Browse properties and make your first investment.' },
                ]}
            />
            <hr style={{ margin: '2rem 0', opacity: 0.1 }} />
            <NumberedList.Root>
                <NumberedList.Item>
                    <NumberedList.Number>1</NumberedList.Number>
                    <NumberedList.Content>
                        <NumberedList.Label>Manual Item 1</NumberedList.Label>
                        <NumberedList.Description>Custom composed item.</NumberedList.Description>
                    </NumberedList.Content>
                </NumberedList.Item>
                <NumberedList.Item>
                    <NumberedList.Number>2</NumberedList.Number>
                    <NumberedList.Content>
                        <NumberedList.Label>Manual Item 2</NumberedList.Label>
                    </NumberedList.Content>
                </NumberedList.Item>
            </NumberedList.Root>
        </DemoCard>
    );
};

