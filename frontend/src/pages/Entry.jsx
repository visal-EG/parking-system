import { useState } from 'react';
import { api } from '../api';

export default function Entry() {
  const [plate, setPlate] = useState('');
  const [type, setType] = useState('CAR');
  const [ticket, setTicket] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setTicket(null);
    setLoading(true);
    try {
      const { data } = await api.post('/api/parking/entry', {
        licensePlate: plate.trim().toUpperCase(),
        vehicleType: type,
      });
      setTicket(data);
      setPlate('');
    } catch (e) {
      setErr(e.response?.data?.message || 'Entry failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Vehicle Entry</h1>
      <div className="card">
        <form onSubmit={submit}>
          <div className="row">
            <div className="form-group">
              <label>License Plate</label>
              <input
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="e.g. KA-01-AB-1234"
                required
              />
            </div>
            <div className="form-group">
              <label>Vehicle Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="CAR">🚗 Car</option>
                <option value="BIKE">🏍 Bike</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: '0 0 auto' }}>
              <label>&nbsp;</label>
              <button type="submit" disabled={loading}>
                {loading ? 'Issuing...' : 'Issue Ticket'}
              </button>
            </div>
          </div>
        </form>

        {err && <div className="error">{err}</div>}

        {ticket && (
          <div className="ticket-card">
            <h3>🎫 Ticket Issued</h3>
            <div className="ticket-row">
              <span>Ticket No</span>
              <strong>{ticket.ticketNo}</strong>
            </div>
            <div className="ticket-row">
              <span>Spot</span>
              <strong>{ticket.spotCode}</strong>
            </div>
            <div className="ticket-row">
              <span>Floor</span>
              <strong>{ticket.floorCode}</strong>
            </div>
            <div className="ticket-row">
              <span>Entry Time</span>
              <strong>{new Date(ticket.entryTime).toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
