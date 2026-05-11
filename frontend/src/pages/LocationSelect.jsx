import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { getUser } from '../auth';

const cityIcons = {
  Bangalore: '\u{1F3D9}',
  Mumbai: '\u{1F309}',
  Delhi: '\u{1F3DB}',
};

export default function LocationSelect() {
  const user = getUser();
  const nav = useNavigate();
  const [cities, setCities] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/api/parking/cities')
      .then(r => setCities(r.data))
      .catch(e => setErr(e.response?.data?.message || 'Failed to load cities'));
  }, []);

  return (
    <>
      <h1>Welcome, {user?.username}!</h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', marginTop: '-0.75rem' }}>
        Select a city to find parking
      </p>

      {err && <div className="error">{err}</div>}
      {cities.length === 0 && !err && <div className="spinner" />}

      <div className="city-grid">
        {cities.map(city => (
          <div
            key={city}
            className="city-card"
            onClick={() => nav(`/customer/malls/${city}`)}
          >
            <div className="city-icon">{cityIcons[city] || '\u{1F3D7}'}</div>
            <h3>{city}</h3>
            <p>Browse malls &rarr;</p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '2rem' }}>Quick Actions</h2>
      <div className="quick-actions">
        <div className="action-card" onClick={() => nav('/customer/my-reservations')}>
          <div className="action-icon">{'\u{1F4CB}'}</div>
          <h3>My Reservations</h3>
          <p>View your active reservation and countdown timer</p>
        </div>
        <div className="action-card" onClick={() => nav('/customer/track-ticket')}>
          <div className="action-icon">{'\u{1F3AB}'}</div>
          <h3>Track My Ticket</h3>
          <p>Look up your booking by ticket number</p>
        </div>
        <div className="action-card" onClick={() => nav('/customer/nearby-parking')}>
          <div className="action-icon">{'\u{1F4CD}'}</div>
          <h3>Find Nearby Parking</h3>
          <p>Discover parking lots near your location</p>
        </div>
        <div className="action-card" onClick={() => nav('/customer/profile')}>
          <div className="action-icon">{'\u{1F464}'}</div>
          <h3>My Profile</h3>
          <p>View your account information</p>
        </div>
      </div>
    </>
  );
}
