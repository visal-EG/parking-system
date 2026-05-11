import { useState } from 'react';
import { api } from '../api';

function isoDate(d) { return d.toISOString().slice(0, 10); }

export default function Reports() {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 6);

  const [from, setFrom] = useState(isoDate(weekAgo));
  const [to, setTo] = useState(isoDate(today));
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function run() {
    setErr('');
    setLoading(true);
    try {
      const { data } = await api.get('/api/reports/revenue', { params: { from, to } });
      setData(data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  const maxAmount = data?.daily?.length
    ? Math.max(...data.daily.map(d => Number(d.amount)), 1)
    : 1;

  return (
    <>
      <h1>Revenue Report</h1>

      <div className="card">
        <div className="row">
          <div className="form-group">
            <label>From</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div className="form-group">
            <label>To</label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: '0 0 auto' }}>
            <label>&nbsp;</label>
            <button onClick={run} disabled={loading}>
              {loading ? 'Loading...' : 'Run Report'}
            </button>
          </div>
        </div>
      </div>

      {err && <div className="error">{err}</div>}

      {data && (
        <>
          <div className="kpi" style={{ marginBottom: '1rem' }}>
            <div className="kpi-card">
              <div className="kpi-icon green">💰</div>
              <div className="kpi-info">
                <h3>Total Revenue</h3>
                <div className="value">₹{Number(data.total).toFixed(0)}</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon blue">📊</div>
              <div className="kpi-info">
                <h3>Days</h3>
                <div className="value">{data.daily.length}</div>
              </div>
            </div>
          </div>

          {data.daily.length > 0 && (
            <div className="card">
              <h2>Daily Revenue</h2>
              <div className="bar-chart">
                {data.daily.map(d => {
                  const amt = Number(d.amount);
                  const pct = (amt / maxAmount) * 100;
                  return (
                    <div className="bar-wrapper" key={d.date}>
                      <span className="bar-value">{amt > 0 ? `₹${amt.toFixed(0)}` : ''}</span>
                      <div className="bar" style={{ height: `${Math.max(pct, 2)}%` }} />
                      <span className="bar-label">{d.date.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card">
            <h2>Details</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Date</th><th>Revenue</th></tr>
                </thead>
                <tbody>
                  {data.daily.map(r => (
                    <tr key={r.date}>
                      <td>{r.date}</td>
                      <td>₹{Number(r.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
