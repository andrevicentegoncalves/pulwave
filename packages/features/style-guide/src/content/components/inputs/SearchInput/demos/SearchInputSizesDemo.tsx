/**
 * SearchInput Sizes Demo
 * Shows all SearchInput size variants
 */
import { SearchInput } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { SearchInput } from '@pulwave/ui';

<SearchInput size="s" placeholder="Small…" />
<SearchInput size="m" placeholder="Medium (default)…" />
<SearchInput size="l" placeholder="Large…" />`;

const SearchInputSizesDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true}
        title="SearchInput Sizes"
        description="Size variants aligned with other form controls (32px, 40px, 48px)"
    >
        <div className="demo-stack" style={{ maxWidth: '400px' }}>
            <SearchInput size="s" placeholder="Small…" />
            <SearchInput size="m" placeholder="Medium (default)…" />
            <SearchInput size="l" placeholder="Large…" />
        </div>
    </DemoCard>
);

export default SearchInputSizesDemo;
