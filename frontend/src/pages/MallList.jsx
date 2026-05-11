import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function MallList() {
  const { city } = useParams();
  const nav = useNavigate();
  const [malls, setMalls] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get(`/api/parking/cities/${encodeURIComponent(city)}/malls`)
      .then(r => setMalls(r.data))
      .catch(e => setErr(e.response?.data?.message || 'Failed to load malls'));
  }, [city]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.25rem' }}>
        <Link to="/customer" style={{ color: 'var(--gray-500)', textDecoration: 'none', fontSize: '.9rem' }}>
          &larr; All Cities
        </Link>
        <h1 style={{ margin: 0 }}>Malls in {city}</h1>
      </div>

      {err && <div className="error">{err}</div>}
      {malls.length === 0 && !err && <div className="spinner" />}

      <div className="mall-grid">
        {malls.map(mall => {
          const pct = mall.totalSpots > 0
            ? Math.round((mall.occupiedSpots / mall.totalSpots) * 100)
            : 0;
          const fillClass = pct >= 90 ? 'high' : pct >= 60 ? 'medium' : 'low';

          return (
            <div
              key={mall.id}
              className="mall-card"
              onClick={() => nav(`/customer/mall/${mall.id}/slots`)}
            >
              <div className="mall-header">
                <h3>{mall.name}</h3>
                <span className={`badge ${mall.availableSpots === 0 ? 'full' : 'ok'}`}>
                  {mall.availableSpots === 0 ? 'FULL' : `${mall.availableSpots} available`}
                </span>
              </div>
              <p className="mall-address">{mall.address}</p>
              <div className="mall-stats">
                <span>{mall.floors} floor{mall.floors !== 1 ? 's' : ''}</span>
                <span>{mall.totalSpots} total spots</span>
              </div>
              <div className="progress-bar" style={{ marginTop: '.75rem' }}>
                <div className={`fill ${fillClass}`} style={{ width: `${pct}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', color: 'var(--gray-500)', marginTop: '.35rem' }}>
                <span>{mall.occupiedSpots} occupied</span>
                <span>{pct}% full</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
