import { useEffect, useState, useRef } from 'react';
import { api } from '../api';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [now, setNow] = useState(Date.now());
  const timerRef = useRef(null);

  async function load() {
    try {
      const { data } = await api.get('/api/reservations/my');
      setReservations(data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to load');
    }
  }

  useEffect(() => {
    load();
    timerRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  async function handleCancel(id) {
    setErr('');
    setMsg('');
    try {
      await api.delete(`/api/reservations/${id}`);
      setMsg('Reservation cancelled');
      load();
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to cancel');
    }
  }

  function formatCountdown(expiresAt) {
    const diff = new Date(expiresAt).getTime() - now;
    if (diff <= 0) return 'Expired';
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function isUrgent(expiresAt) {
    const diff = new Date(expiresAt).getTime() - now;
    return diff > 0 && diff < 120000; // < 2 minutes
  }

  return (
    <>
      <h1>My Reservations</h1>
      {msg && <div className="success">{msg}</div>}
      {err && <div className="error">{err}</div>}

      {reservations.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🅿</div>
          <h3 style={{ marginBottom: '.5rem' }}>No Active Reservations</h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '.9rem' }}>
            Go to Available Slots to reserve a parking spot.
          </p>
        </div>
      )}

      {reservations.map(r => {
        const countdown = formatCountdown(r.expiresAt);
        const urgent = isUrgent(r.expiresAt);

        return (
          <div className="card" key={r.id} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ marginBottom: '.5rem' }}>Spot {r.spotCode}</h3>
                <div style={{ fontSize: '.88rem', color: 'var(--gray-500)', display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
                  <span>Floor: <strong style={{ color: 'var(--gray-700)' }}>{r.floorCode}</strong></span>
                  <span>Type: <strong style={{ color: 'var(--gray-700)' }}>{r.spotType}</strong></span>
                  <span>Reserved at: <strong style={{ color: 'var(--gray-700)' }}>{new Date(r.createdAt).toLocaleTimeString()}</strong></span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '.78rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--gray-500)', marginBottom: '.25rem' }}>
                  Time Remaining
                </div>
                <div style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: countdown === 'Expired' ? 'var(--danger)' : urgent ? 'var(--danger)' : 'var(--success)',
                  lineHeight: 1.2
                }}>
                  {countdown}
                </div>
                <button
                  className="danger"
                  style={{ marginTop: '.75rem' }}
                  onClick={() => handleCancel(r.id)}
                >
                  Cancel Reservation
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
