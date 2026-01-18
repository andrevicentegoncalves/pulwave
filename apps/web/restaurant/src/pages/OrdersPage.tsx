/**
 * OrdersPage - Restaurant App
 * @package @pulwave/apps/restaurant
 */
import { useState } from 'react';

interface Order {
    id: string;
    table: string;
    items: number;
    total: number;
    status: 'pending' | 'preparing' | 'ready' | 'delivered';
}

export const OrdersPage = () => {
    const [orders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');

    return (
        <div className="orders-page">
            <header className="orders-page__header">
                <h1>Orders</h1>
                <button className="btn btn--primary">New Order</button>
            </header>
            <main className="orders-page__content">
                <div className="orders-tabs" role="tablist" aria-label="Order filters">
                    <button
                        role="tab"
                        aria-selected={activeTab === 'active'}
                        aria-controls="orders-panel"
                        className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Active
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === 'completed'}
                        aria-controls="orders-panel"
                        className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === 'all'}
                        aria-controls="orders-panel"
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                </div>
                <div role="tabpanel" id="orders-panel" aria-label={`${activeTab} orders`}>
                    {orders.length === 0 ? (
                        <div className="empty-state">
                            <p>No {activeTab === 'all' ? '' : activeTab + ' '}orders.</p>
                        </div>
                    ) : (
                        <div className="orders-grid">
                            {orders.map(o => (
                                <div key={o.id} className="order-card">
                                    <h3>Table {o.table}</h3>
                                    <span>{o.items} items</span>
                                    <span className="total">${o.total.toFixed(2)}</span>
                                    <span className={`status status--${o.status}`}>{o.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OrdersPage;
