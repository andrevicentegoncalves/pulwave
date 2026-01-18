/**
 * MenuPage - Restaurant App
 * @package @pulwave/apps/restaurant
 */
import { useState } from 'react';

interface MenuItem {
    id: string;
    name: string;
    category: string;
    price: number;
    available: boolean;
}

export const MenuPage = () => {
    const [items] = useState<MenuItem[]>([]);

    return (
        <div className="menu-page">
            <header className="menu-page__header">
                <h1>Menu</h1>
                <button className="btn btn--primary">Add Item</button>
            </header>
            <main className="menu-page__content">
                {items.length === 0 ? (
                    <div className="empty-state">
                        <p>No menu items yet.</p>
                    </div>
                ) : (
                    <div className="menu-grid">
                        {items.map(item => (
                            <div key={item.id} className="menu-card">
                                <h3>{item.name}</h3>
                                <span className="category">{item.category}</span>
                                <span className="price">${item.price.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MenuPage;
