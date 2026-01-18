/**
 * SearchInput Basic Demo
 */
import { SearchInput } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<SearchInput placeholder="Search items…" />
<SearchInput
    placeholder="Search with callback…"
    onChange={(e) => console.log(e.target.value)}
/>`;

const SearchInputBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Search Input" description="Input optimized for search">
        <div className="demo-stack">
            <SearchInput placeholder="Search items…" />
            <SearchInput placeholder="Search with callback…" onChange={(e) => console.log(e.target.value)} />
        </div>
    </DemoCard>
);

export default SearchInputBasicDemo;
