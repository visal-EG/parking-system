import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Occupancy() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/api/parking/occupancy');
      setRows(data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to load');
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 10_000);
    return () => clearInterval(t);
  }, []);

  // Group rows by floor
  const floors = {};
  rows.forEach(r => {
    if (!floors[r.floorCode]) floors[r.floorCode] = [];
    floors[r.floorCode].push(r);
  });

  // Totals
  const totalCap = rows.reduce((s, r) => s + r.capacity, 0);
  const totalOcc = rows.reduce((s, r) => s + r.occupied, 0);

  return (
    <>
      <h1>Live Occupancy</h1>

      {totalCap > 0 && (
        <div className="kpi" style={{ marginBottom: '1.5rem' }}>
          <div className="kpi-card">
            <div className="kpi-icon green">🟢</div>
            <div className="kpi-info">
              <h3>Available</h3>
              <div className="value">{totalCap - totalOcc}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon red">🔴</div>
            <div className="kpi-info">
              <h3>Occupied</h3>
              <div className="value">{totalOcc}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon blue">🏢</div>
            <div className="kpi-info">
              <h3>Total Capacity</h3>
              <div className="value">{totalCap}</div>
            </div>
          </div>
        </div>
      )}

      {err && <div className="error">{err}</div>}
      {rows.length === 0 && !err && <div className="spinner" />}

      <div className="floor-grid">
        {Object.entries(floors).map(([floorCode, types]) => {
          const floorCap = types.reduce((s, t) => s + t.capacity, 0);
          const floorOcc = types.reduce((s, t) => s + t.occupied, 0);
          const pct = floorCap > 0 ? (floorOcc / floorCap) * 100 : 0;
          const fillClass = pct >= 90 ? 'high' : pct >= 60 ? 'medium' : 'low';

          return (
            <div className="floor-card" key={floorCode}>
              <div className="floor-header">
                <h3>🏢 Floor {floorCode}</h3>
                <span className="floor-stats">
                  {floorCap - floorOcc} / {floorCap} available
                </span>
              </div>

              <div className="progress-bar">
                <div className={`fill ${fillClass}`} style={{ width: `${pct}%` }} />
              </div>

              {types.map(t => {
                const free = t.capacity - t.occupied;
                return (
                  <div key={t.type} style={{ marginBottom: '.75rem' }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: '.85rem', marginBottom: '.35rem'
                    }}>
                      <span>{t.type === 'CAR' ? '🚗' : '🏍'} {t.type}</span>
                      <span className={`badge ${free === 0 ? 'full' : 'ok'}`}>
                        {free === 0 ? 'FULL' : `${free} free`}
                      </span>
                    </div>
                    <div className="spot-grid">
                      {Array.from({ length: t.capacity }, (_, i) => (
                        <div
                          key={i}
                          className={`spot-cell ${i < t.occupied ? 'occupied' : 'available'}`}
                          title={i < t.occupied ? 'Occupied' : 'Available'}
                        />
                      ))}
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
