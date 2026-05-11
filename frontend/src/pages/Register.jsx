import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../auth';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await register(form.username, form.password, form.email);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <span className="icon">🅿</span>
          <h2>City Mall Parking</h2>
          <p>Create your account</p>
        </div>

        {err && <div className="error">{err}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input
              value={form.username}
              onChange={upd('username')}
              placeholder="Choose a username"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={upd('email')}
              placeholder="your@email.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={upd('password')}
              placeholder="Create a password"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
