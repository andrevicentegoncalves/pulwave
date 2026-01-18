import { useState } from 'react';
import { InfiniteScroll, Card, Text, Stack } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const InfiniteScrollBasicDemo = () => {
    const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => i + 1));
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const loadMore = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            if (items.length >= 30) {
                setHasMore(false);
                setLoading(false);
                return;
            }

            const nextItems = Array.from({ length: 5 }, (_, i) => items.length + i + 1);
            setItems((prev) => [...prev, ...nextItems]);
            setLoading(false);
        }, 1500);
    };

    return (
        <DemoCard
            title="Infinite Scroll"
            description="Scroll the container to load more items."
            sourceCode={`// Usage
<InfiniteScroll
    onLoadMore={loadMore}
    hasMore={hasMore}
    loading={loading}
    endMessage="No more items!"
>
    {items.map(item => <Item key={item} />)}
</InfiniteScroll>`}
        >
            <div style={{ height: 300, overflow: 'auto', border: '1px solid var(--color-border-default)', padding: 10 }}>
                <InfiniteScroll
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    loading={loading}
                    endMessage="No more items to load."
                // Ensure the root is the scroll container if specific container needed, 
                // generally works within its parent.
                >
                    <Stack gap={2}>
                        {items.map((item) => (
                            <Card key={item}>
                                <Text>Item #{item}</Text>
                            </Card>
                        ))}
                    </Stack>
                </InfiniteScroll>
            </div>
        </DemoCard>
    );
};

export default InfiniteScrollBasicDemo;
