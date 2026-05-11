import { useState } from 'react';
import { api } from '../api';

export default function Exit() {
  const [ticketNo, setTicketNo] = useState('');
  const [method, setMethod] = useState('CARD');
  const [quote, setQuote] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const step = receipt ? 3 : quote ? 2 : 1;

  async function fetchQuote() {
    if (!ticketNo.trim()) return;
    setErr('');
    setQuote(null);
    setReceipt(null);
    setLoading(true);
    try {
      const { data } = await api.get(`/api/parking/tickets/${ticketNo.trim()}/quote`);
      setQuote(data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  }

  async function pay() {
    setErr('');
    setLoading(true);
    try {
      const { data } = await api.post(`/api/billing/tickets/${ticketNo.trim()}/pay`, { method });
      setReceipt(data);
      setQuote(null);
    } catch (e) {
      setErr(e.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setTicketNo('');
    setQuote(null);
    setReceipt(null);
    setErr('');
  }

  return (
    <>
      <h1>Vehicle Exit &amp; Payment</h1>

      <div className="steps">
        <div className={`step ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>
          <span className="step-num">{step > 1 ? '✓' : '1'}</span> Lookup
        </div>
        <div className="step-line" />
        <div className={`step ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}>
          <span className="step-num">{step > 2 ? '✓' : '2'}</span> Payment
        </div>
        <div className="step-line" />
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-num">3</span> Receipt
        </div>
      </div>

      {err && <div className="error">{err}</div>}

      {/* Step 1: Lookup */}
      {!quote && !receipt && (
        <div className="card">
          <h2>Look Up Ticket</h2>
          <div className="row">
            <div className="form-group">
              <label>Ticket Number</label>
              <input
                value={ticketNo}
                onChange={(e) => setTicketNo(e.target.value)}
                placeholder="e.g. TKT-00001"
              />
            </div>
            <div className="form-group" style={{ flex: '0 0 auto' }}>
              <label>&nbsp;</label>
              <button onClick={fetchQuote} disabled={loading}>
                {loading ? 'Looking up...' : 'Calculate Fee'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Quote + Payment */}
      {quote && !receipt && (
        <div className="card">
          <h2>Payment Details</h2>
          <div className="receipt-card" style={{ border: '2px solid var(--primary-light)', margin: '0 0 1.25rem' }}>
            <div className="detail">
              <span className="label">Ticket</span>
              <span>{quote.ticketNo}</span>
            </div>
            <div className="detail">
              <span className="label">Vehicle</span>
              <span>{quote.licensePlate}</span>
            </div>
            <div className="detail">
              <span className="label">Duration</span>
              <span>{quote.minutesParked} minutes</span>
            </div>
            <hr className="divider" />
            <div className="total">₹{Number(quote.amount).toFixed(2)}</div>
          </div>

          <div className="row">
            <div className="form-group">
              <label>Payment Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="CARD">💳 Card</option>
                <option value="CASH">💵 Cash</option>
                <option value="UPI">📱 UPI</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: '0 0 auto' }}>
              <label>&nbsp;</label>
              <button onClick={pay} disabled={loading}>
                {loading ? 'Processing...' : 'Pay & Exit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Receipt */}
      {receipt && (
        <div>
          <div className="receipt-card">
            <h3>✅ Payment Successful</h3>
            <hr className="divider" />
            <div className="detail">
              <span className="label">Ticket</span>
              <span>{receipt.ticketNo}</span>
            </div>
            <div className="detail">
              <span className="label">Vehicle</span>
              <span>{receipt.licensePlate}</span>
            </div>
            <div className="detail">
              <span className="label">Spot</span>
              <span>{receipt.spotCode}</span>
            </div>
            <div className="detail">
              <span className="label">Entry</span>
              <span>{new Date(receipt.entryTime).toLocaleString()}</span>
            </div>
            <div className="detail">
              <span className="label">Exit</span>
              <span>{new Date(receipt.exitTime).toLocaleString()}</span>
            </div>
            <div className="detail">
              <span className="label">Method</span>
              <span>{receipt.method}</span>
            </div>
            <hr className="divider" />
            <div className="total">₹{Number(receipt.amount).toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button onClick={reset}>Process Another Vehicle</button>
          </div>
        </div>
      )}
    </>
  );
}
