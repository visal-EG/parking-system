import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/api/reports/dashboard')
      .then(r => setData(r.data))
      .catch(e => setErr(e.response?.data?.message || 'Failed to load'));

    // Load 7-day revenue for chart
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    const from = weekAgo.toISOString().slice(0, 10);
    const to = today.toISOString().slice(0, 10);

    api.get('/api/reports/revenue', { params: { from, to } })
      .then(r => setRevenue(r.data))
      .catch(() => {}); // non-critical
  }, []);

  if (err) return <div className="error">{err}</div>;
  if (!data) return <div className="spinner" />;

  const maxRevenue = revenue?.daily?.length
    ? Math.max(...revenue.daily.map(d => Number(d.amount)), 1)
    : 1;

  return (
    <>
      <h1>Dashboard</h1>

      <div className="kpi">
        <div className="kpi-card">
          <div className="kpi-icon blue">🎫</div>
          <div className="kpi-info">
            <h3>Active Tickets</h3>
            <div className="value">{data.activeTickets}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon green">✅</div>
          <div className="kpi-info">
            <h3>Paid Tickets</h3>
            <div className="value">{data.paidTickets}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon orange">💰</div>
          <div className="kpi-info">
            <h3>Today's Revenue</h3>
            <div className="value">₹{Number(data.todayRevenue).toFixed(0)}</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon red">📅</div>
          <div className="kpi-info">
            <h3>This Month</h3>
            <div className="value">₹{Number(data.monthRevenue).toFixed(0)}</div>
          </div>
        </div>
      </div>

      {revenue?.daily?.length > 0 && (
        <div className="card">
          <h2>7-Day Revenue</h2>
          <div className="bar-chart">
            {revenue.daily.map(d => {
              const amt = Number(d.amount);
              const pct = (amt / maxRevenue) * 100;
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
    </>
  );
}
