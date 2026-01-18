/**
 * StaffPage - Restaurant App
 * @package @pulwave/apps/restaurant
 */
import { useState } from 'react';

interface StaffMember {
    id: string;
    name: string;
    role: string;
    status: 'active' | 'off';
}

export const StaffPage = () => {
    const [staff] = useState<StaffMember[]>([]);

    return (
        <div className="staff-page">
            <header className="staff-page__header">
                <h1>Staff</h1>
                <button className="btn btn--primary">Add Staff</button>
            </header>
            <main className="staff-page__content">
                {staff.length === 0 ? (
                    <div className="empty-state">
                        <p>No staff members added.</p>
                    </div>
                ) : (
                    <div className="staff-grid">
                        {staff.map(s => (
                            <div key={s.id} className="staff-card">
                                <h3>{s.name}</h3>
                                <span className="role">{s.role}</span>
                                <span className={`status status--${s.status}`}>{s.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default StaffPage;
