/**
 * Accordion Basic Demo
 */
import { Accordion, AccordionItem, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Accordion>
    <AccordionItem id="1" title="Section 1">
        <Text>Content for section 1</Text>
    </AccordionItem>
    <AccordionItem id="2" title="Section 2">
        <Text>Content for section 2</Text>
    </AccordionItem>
    <AccordionItem id="3" title="Section 3">
        <Text>Content for section 3</Text>
    </AccordionItem>
</Accordion>`;

const AccordionBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Accordion" description="Expandable content sections">
        <Accordion>
            <AccordionItem id="1" title="Section 1">
                <Text>Content for section 1</Text>
            </AccordionItem>
            <AccordionItem id="2" title="Section 2">
                <Text>Content for section 2</Text>
            </AccordionItem>
            <AccordionItem id="3" title="Section 3">
                <Text>Content for section 3</Text>
            </AccordionItem>
        </Accordion>
    </DemoCard>
);

export default AccordionBasicDemo;
