import { useState } from 'react';
import { api } from '../api';

export default function CheckTicket() {
  const [ticketNo, setTicketNo] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function lookup(e) {
    e.preventDefault();
    if (!ticketNo.trim()) return;
    setErr('');
    setResult(null);
    setLoading(true);
    try {
      // Try reservation track first (TKT- prefix tickets)
      const { data } = await api.get(`/api/reservations/track/${ticketNo.trim()}`);
      setResult({ type: 'reservation', data });
    } catch {
      // Fallback to staff ticket quote
      try {
        const { data } = await api.get(`/api/parking/tickets/${ticketNo.trim()}/quote`);
        setResult({ type: 'quote', data });
      } catch (e2) {
        setErr(e2.response?.data?.message || 'Ticket not found');
      }
    } finally {
      setLoading(false);
    }
  }

  function formatDuration(mins) {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  return (
    <>
      <h1>Track My Ticket</h1>
      <div className="card" style={{ maxWidth: 500 }}>
        <form onSubmit={lookup}>
          <div className="form-group">
            <label>Ticket Number</label>
            <input
              value={ticketNo}
              onChange={e => setTicketNo(e.target.value)}
              placeholder="e.g. TKT-20260511-123456"
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" style={{ width: '100%' }}>
            {loading ? 'Looking up...' : 'Track Ticket'}
          </button>
        </form>

        {err && <div className="error">{err}</div>}

        {result?.type === 'reservation' && (
          <div className="receipt-card" style={{ marginTop: '1.5rem' }}>
            <h3>Reservation Details</h3>
            <hr className="divider" />
            <div className="detail">
              <span className="label">Ticket</span>
              <span>{result.data.ticketNo}</span>
            </div>
            <div className="detail">
              <span className="label">Spot</span>
              <span>{result.data.spotCode}</span>
            </div>
            <div className="detail">
              <span className="label">Floor</span>
              <span>{result.data.floorCode}</span>
            </div>
            <div className="detail">
              <span className="label">Mall</span>
              <span>{result.data.mallName}</span>
            </div>
            <div className="detail">
              <span className="label">City</span>
              <span>{result.data.city}</span>
            </div>
            <div className="detail">
              <span className="label">Status</span>
              <span className={`badge ${result.data.status === 'ACTIVE' ? 'ok' : 'full'}`}>
                {result.data.status}
              </span>
            </div>
            <hr className="divider" />
            <div className="detail">
              <span className="label">Reserved At</span>
              <span>{new Date(result.data.createdAt).toLocaleString()}</span>
            </div>
            <div className="detail">
              <span className="label">Expires At</span>
              <span>{new Date(result.data.expiresAt).toLocaleString()}</span>
            </div>
          </div>
        )}

        {result?.type === 'quote' && (
          <div className="receipt-card" style={{ marginTop: '1.5rem' }}>
            <h3>Ticket Details</h3>
            <hr className="divider" />
            <div className="detail">
              <span className="label">Ticket</span>
              <span>{result.data.ticketNo}</span>
            </div>
            <div className="detail">
              <span className="label">Duration</span>
              <span>{formatDuration(result.data.minutesParked)}</span>
            </div>
            <hr className="divider" />
            <div className="total">{'\u20B9'}{Number(result.data.amount).toFixed(2)}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--gray-500)', marginTop: '.25rem' }}>
              Estimated fee
            </div>
          </div>
        )}
      </div>
    </>
  );
}
