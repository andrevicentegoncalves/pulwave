/**
 * Pagination Basic Demo
 */
import { useState } from 'react';
import { Pagination } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Pagination
    currentPage={1}
    totalPages={10}
    onPageChange={(page) => console.log('Page:', page)}
/>`;

const PaginationBasicDemo = () => {
    const [page, setPage] = useState(1);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Pagination" description=" ">
            <Pagination
                currentPage={page}
                totalPages={10}
                onPageChange={setPage}
            />
        </DemoCard>
    );
};

export default PaginationBasicDemo;
