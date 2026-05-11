import { useEffect, useState } from 'react';
import { api } from '../api';

export default function CustomerSlots() {
  const [floors, setFloors] = useState([]);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [reserving, setReserving] = useState(false);

  async function load() {
    try {
      const { data } = await api.get('/api/reservations/floor-spots');
      setFloors(data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to load');
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 10_000);
    return () => clearInterval(t);
  }, []);

  async function handleReserve(spotId) {
    if (reserving) return;
    setReserving(true);
    setErr('');
    setMsg('');
    try {
      const { data } = await api.post('/api/reservations', { spotId });
      setMsg(`Spot ${data.spotCode} reserved! Expires at ${new Date(data.expiresAt).toLocaleTimeString()}`);
      load();
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to reserve');
    } finally {
      setReserving(false);
    }
  }

  return (
    <>
      <h1>Available Parking Slots</h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: '.5rem', marginTop: '-0.75rem' }}>
        Click a green spot to reserve it for 10 minutes
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', fontSize: '.82rem' }}>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#bbf7d0', border: '1px solid #86efac', borderRadius: 3, verticalAlign: 'middle', marginRight: 4 }} /> Available</span>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#fecaca', border: '1px solid #fca5a5', borderRadius: 3, verticalAlign: 'middle', marginRight: 4 }} /> Occupied</span>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 3, verticalAlign: 'middle', marginRight: 4 }} /> Reserved</span>
      </div>

      {msg && <div className="success">{msg}</div>}
      {err && <div className="error">{err}</div>}

      {floors.length === 0 && !err && <div className="spinner" />}

      <div className="floor-grid">
        {floors.map(floor => {
          const totalCap = floor.spots.length;
          const totalOcc = floor.spots.filter(s => s.occupied || s.reserved).length;
          const totalFree = totalCap - totalOcc;
          const pct = totalCap > 0 ? (totalOcc / totalCap) * 100 : 0;
          const fillClass = pct >= 90 ? 'high' : pct >= 60 ? 'medium' : 'low';

          // Group spots by type
          const byType = {};
          floor.spots.forEach(s => {
            if (!byType[s.type]) byType[s.type] = [];
            byType[s.type].push(s);
          });

          return (
            <div className="floor-card" key={floor.floorCode}>
              <div className="floor-header">
                <h3>Floor {floor.floorCode}</h3>
                <span className="floor-stats">
                  {totalFree} / {totalCap} available
                </span>
              </div>

              <div className="progress-bar">
                <div className={`fill ${fillClass}`} style={{ width: `${pct}%` }} />
              </div>

              {Object.entries(byType).map(([type, spots]) => {
                const free = spots.filter(s => !s.occupied && !s.reserved).length;
                return (
                  <div key={type} style={{ marginBottom: '.75rem' }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: '.85rem', marginBottom: '.35rem'
                    }}>
                      <span>{type === 'CAR' ? '🚗' : '🏍'} {type}</span>
                      <span style={{ color: free === 0 ? 'var(--danger)' : 'var(--success)' }}>
                        {free === 0 ? 'FULL' : `${free} free`}
                      </span>
                    </div>
                    <div className="spot-grid">
                      {spots.map(s => {
                        const cls = s.occupied ? 'occupied' : s.reserved ? 'reserved' : 'available';
                        return (
                          <div
                            key={s.id}
                            className={`spot-cell ${cls}`}
                            title={s.occupied ? `${s.code} - Occupied` : s.reserved ? `${s.code} - Reserved` : `${s.code} - Click to reserve`}
                            onClick={() => {
                              if (!s.occupied && !s.reserved) handleReserve(s.id);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
