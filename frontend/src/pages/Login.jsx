import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../auth';

export default function Login() {
  const [u, setU] = useState('admin');
  const [p, setP] = useState('admin123');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(u, p);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <span className="icon">🅿</span>
          <h2>City Mall Parking</h2>
          <p>Sign in to your account</p>
        </div>

        {err && <div className="error">{err}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input
              value={u}
              onChange={(e) => setU(e.target.value)}
              placeholder="Enter username"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>

        <div className="demo">
          Demo accounts: admin/admin123 &middot; operator/op123 &middot; user/user123
        </div>
      </div>
    </div>
  );
}
