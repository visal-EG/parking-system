import { useState } from 'react';
import { api } from '../api';

export default function CheckTicket() {
  const [ticketNo, setTicketNo] = useState('');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function lookup(e) {
    e.preventDefault();
    if (!ticketNo.trim()) return;
    setErr('');
    setQuote(null);
    setLoading(true);
    try {
      const { data } = await api.get(`/api/parking/tickets/${ticketNo.trim()}/quote`);
      setQuote(data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Ticket not found');
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
      <h1>Check My Ticket</h1>
      <div className="card" style={{ maxWidth: 500 }}>
        <form onSubmit={lookup}>
          <div className="form-group">
            <label>Ticket Number</label>
            <input
              value={ticketNo}
              onChange={e => setTicketNo(e.target.value)}
              placeholder="e.g. TKT-00001"
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" style={{ width: '100%' }}>
            {loading ? 'Looking up...' : 'Look Up Ticket'}
          </button>
        </form>

        {err && <div className="error">{err}</div>}

        {quote && (
          <div className="receipt-card" style={{ marginTop: '1.5rem' }}>
            <h3>🎫 Ticket Details</h3>
            <hr className="divider" />
            <div className="detail">
              <span className="label">Ticket</span>
              <span>{quote.ticketNo}</span>
            </div>
            <div className="detail">
              <span className="label">Vehicle</span>
              <span>{quote.licensePlate}</span>
            </div>
            <div className="detail">
              <span className="label">Spot</span>
              <span>{quote.spotCode}</span>
            </div>
            <div className="detail">
              <span className="label">Duration</span>
              <span>{formatDuration(quote.minutesParked)}</span>
            </div>
            <hr className="divider" />
            <div className="total">₹{Number(quote.amount).toFixed(2)}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--gray-500)', marginTop: '.25rem' }}>
              Estimated fee
            </div>
          </div>
        )}
      </div>
    </>
  );
}
