import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { getUser } from '../auth';

export default function CustomerHome() {
  const user = getUser();
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/api/parking/occupancy')
      .then(r => {
        const rows = r.data;
        const totalCapacity = rows.reduce((s, r) => s + r.capacity, 0);
        const totalOccupied = rows.reduce((s, r) => s + r.occupied, 0);
        setStats({ total: totalCapacity, occupied: totalOccupied, available: totalCapacity - totalOccupied });
      })
      .catch(e => setErr(e.response?.data?.message || 'Failed to load availability'));
  }, []);

  return (
    <>
      <h1>Welcome, {user?.username}!</h1>
      {err && <div className="error">{err}</div>}

      {stats && (
        <div className="kpi">
          <div className="kpi-card">
            <div className="kpi-icon green">🟢</div>
            <div className="kpi-info">
              <h3>Available Spots</h3>
              <div className="value">{stats.available}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon red">🔴</div>
            <div className="kpi-info">
              <h3>Occupied</h3>
              <div className="value">{stats.occupied}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon blue">🏢</div>
            <div className="kpi-info">
              <h3>Total Capacity</h3>
              <div className="value">{stats.total}</div>
            </div>
          </div>
        </div>
      )}

      {!stats && !err && <div className="spinner" />}

      <h2>Quick Actions</h2>
      <div className="quick-actions">
        <Link to="/customer/slots" className="action-card">
          <div className="action-icon">🅿</div>
          <h3>View Available Slots</h3>
          <p>See floor-by-floor availability with visual spot map</p>
        </Link>
        <Link to="/customer/my-reservations" className="action-card">
          <div className="action-icon">📋</div>
          <h3>My Reservations</h3>
          <p>View your active reservation and countdown timer</p>
        </Link>
        <Link to="/customer/check-ticket" className="action-card">
          <div className="action-icon">🎫</div>
          <h3>Check My Ticket</h3>
          <p>Look up your parking duration and estimated fee</p>
        </Link>
        <Link to="/customer/profile" className="action-card">
          <div className="action-icon">👤</div>
          <h3>My Profile</h3>
          <p>View your account information</p>
        </Link>
      </div>
    </>
  );
}
