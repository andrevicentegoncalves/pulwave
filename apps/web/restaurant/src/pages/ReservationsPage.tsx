/**
 * ReservationsPage - Restaurant App
 * @package @pulwave/apps/restaurant
 */
import { useState } from 'react';

interface Reservation {
    id: string;
    name: string;
    date: string;
    time: string;
    guests: number;
    table: string;
}

export const ReservationsPage = () => {
    const [reservations] = useState<Reservation[]>([]);

    return (
        <div className="reservations-page">
            <header className="reservations-page__header">
                <h1>Reservations</h1>
                <button className="btn btn--primary">New Reservation</button>
            </header>
            <main className="reservations-page__content">
                <div className="date-navigator">
                    <button className="btn btn--icon" aria-label="Previous day">&lt;</button>
                    <span className="current-date">Today</span>
                    <button className="btn btn--icon" aria-label="Next day">&gt;</button>
                </div>
                {reservations.length === 0 ? (
                    <div className="empty-state">
                        <p>No reservations for today.</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Time</th>
                                <th>Guests</th>
                                <th>Table</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map(r => (
                                <tr key={r.id}>
                                    <td>{r.name}</td>
                                    <td>{r.time}</td>
                                    <td>{r.guests}</td>
                                    <td>{r.table}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default ReservationsPage;
