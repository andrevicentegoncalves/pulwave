/**
 * TablesPage - Restaurant App
 * @package @pulwave/apps/restaurant
 */
import { useState } from 'react';

interface Table {
    id: string;
    number: string;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved';
}

export const TablesPage = () => {
    const [tables] = useState<Table[]>([]);

    return (
        <div className="tables-page">
            <header className="tables-page__header">
                <h1>Tables</h1>
                <button className="btn btn--primary">Add Table</button>
            </header>
            <main className="tables-page__content">
                {tables.length === 0 ? (
                    <div className="empty-state">
                        <p>No tables configured.</p>
                    </div>
                ) : (
                    <div className="tables-grid">
                        {tables.map(t => (
                            <div key={t.id} className={`table-card table-card--${t.status}`}>
                                <h3>Table {t.number}</h3>
                                <span>{t.capacity} seats</span>
                                <span className={`status status--${t.status}`}>{t.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TablesPage;
