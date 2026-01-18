/**
 * InventoryPage - Restaurant App
 * @package @pulwave/apps/restaurant
 */

export const InventoryPage = () => {
    return (
        <div className="inventory-page">
            <header className="inventory-page__header">
                <h1>Inventory</h1>
                <button className="btn btn--primary">Add Item</button>
            </header>
            <main className="inventory-page__content">
                <div className="inventory-filters">
                    <label htmlFor="category-filter" className="sr-only">Filter by category</label>
                    <select
                        id="category-filter"
                        name="category"
                        className="select"
                        aria-label="Filter by category"
                    >
                        <option value="">All Categories</option>
                        <option value="produce">Produce</option>
                        <option value="meat">Meat</option>
                        <option value="dairy">Dairy</option>
                        <option value="beverages">Beverages</option>
                    </select>
                </div>
                <div className="empty-state">
                    <p>No inventory items.</p>
                </div>
            </main>
        </div>
    );
};

export default InventoryPage;
