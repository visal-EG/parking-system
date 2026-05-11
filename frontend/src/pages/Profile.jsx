import { useEffect, useState } from 'react';
import { api } from '../api';
import { getUser } from '../auth';

export default function Profile() {
  const localUser = getUser();
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/api/auth/me')
      .then(r => setProfile(r.data))
      .catch(e => setErr(e.response?.data?.message || 'Failed to load profile'));
  }, []);

  if (err) {
    return (
      <>
        <h1>My Profile</h1>
        <div className="error">{err}</div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <h1>My Profile</h1>
        <div className="spinner" />
      </>
    );
  }

  const roleLabel = {
    ADMIN: 'Administrator',
    OPERATOR: 'Operator',
    CUSTOMER: 'Customer',
  };

  return (
    <>
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-avatar">👤</div>
        <div className="profile-field">
          <span className="field-label">Username</span>
          <span className="field-value">{profile.username}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Email</span>
          <span className="field-value">{profile.email || '—'}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Role</span>
          <span className="field-value">{roleLabel[profile.role] || profile.role}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">User ID</span>
          <span className="field-value">#{profile.id || localUser?.userId}</span>
        </div>
      </div>
    </>
  );
}
