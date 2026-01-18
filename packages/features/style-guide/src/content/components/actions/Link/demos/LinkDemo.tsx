import { Link } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Link href="#">Default Link</Link>
<Link href="#" variant="neutral">Neutral Link</Link>
<Link href="#" variant="subtle">Subtle Link</Link>
<Link href="https://example.com" external>External Link</Link>
<Link href="#" underline="always">Always Underlined</Link>`;

const LinkDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Link Variants" description="Different link styles">
        <>
            <Link href="#">Default Link</Link>
            <Link href="#" variant="neutral">Neutral Link</Link>
            <Link href="#" variant="subtle">Subtle Link</Link>
            <Link href="https://example.com" external>External Link</Link>
            <Link href="#" underline="always">Always Underlined</Link>
        </>
    </DemoCard>
);

export default LinkDemo;
