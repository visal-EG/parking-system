import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Admin() {
  const [rates, setRates] = useState([]);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(null);

  async function load() {
    setErr('');
    try {
      const { data } = await api.get('/api/admin/rates');
      setRates(data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed');
    }
  }

  useEffect(() => { load(); }, []);

  function upd(idx, field, val) {
    const next = [...rates];
    next[idx] = { ...next[idx], [field]: val };
    setRates(next);
  }

  async function save(r) {
    setMsg('');
    setErr('');
    setSaving(r.vehicleType);
    try {
      await api.put(`/api/admin/rates/${r.vehicleType}`, {
        firstHourRate: r.firstHourRate,
        hourlyRate: r.hourlyRate,
        dailyCap: r.dailyCap,
      });
      setMsg(`${r.vehicleType} rates saved successfully.`);
      load();
    } catch (e) {
      setErr(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(null);
    }
  }

  return (
    <>
      <h1>Rate Management</h1>

      {err && <div className="error">{err}</div>}
      {msg && <div className="success">{msg}</div>}

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Vehicle Type</th>
                <th>First Hour (₹)</th>
                <th>Hourly (₹)</th>
                <th>Daily Cap (₹)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r, i) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.vehicleType === 'CAR' ? '🚗' : '🏍'} {r.vehicleType}</strong>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={r.firstHourRate}
                      onChange={e => upd(i, 'firstHourRate', e.target.value)}
                      style={{ width: '100px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={r.hourlyRate}
                      onChange={e => upd(i, 'hourlyRate', e.target.value)}
                      style={{ width: '100px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={r.dailyCap}
                      onChange={e => upd(i, 'dailyCap', e.target.value)}
                      style={{ width: '100px' }}
                    />
                  </td>
                  <td>
                    <button onClick={() => save(r)} disabled={saving === r.vehicleType}>
                      {saving === r.vehicleType ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
