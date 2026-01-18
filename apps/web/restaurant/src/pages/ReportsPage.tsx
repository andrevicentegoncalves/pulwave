/**
 * ReportsPage - Restaurant App
 * @package @pulwave/apps/restaurant
 */

export const ReportsPage = () => {
    return (
        <div className="reports-page">
            <header className="reports-page__header">
                <h1>Reports</h1>
            </header>
            <main className="reports-page__content">
                <div className="reports-grid">
                    <div className="report-card">
                        <h3>Daily Sales</h3>
                        <span className="report-value">$0</span>
                    </div>
                    <div className="report-card">
                        <h3>Weekly Revenue</h3>
                        <span className="report-value">$0</span>
                    </div>
                    <div className="report-card">
                        <h3>Top Items</h3>
                        <span className="report-value">—</span>
                    </div>
                    <div className="report-card">
                        <h3>Staff Performance</h3>
                        <span className="report-value">—</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportsPage;
