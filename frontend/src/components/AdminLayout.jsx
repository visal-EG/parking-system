import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getUser, logout, hasRole } from '../auth';

export default function AdminLayout() {
  const user = getUser();
  const nav = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    nav('/login');
  }

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay open" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <h2>🅿 Vikesh's Parking</h2>
          <small>Parking System</small>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin-panel" end onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">📊</span> Dashboard
          </NavLink>
          <NavLink to="/admin-panel/entry" onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">🚗</span> Vehicle Entry
          </NavLink>
          <NavLink to="/admin-panel/exit" onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">💳</span> Exit &amp; Pay
          </NavLink>
          <NavLink to="/admin-panel/occupancy" onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">🏢</span> Occupancy
          </NavLink>
          <NavLink to="/admin-panel/reports" onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">📈</span> Reports
          </NavLink>
          {hasRole('ADMIN') && (
            <NavLink to="/admin-panel/rates" onClick={() => setSidebarOpen(false)}>
              <span className="nav-icon">⚙</span> Rate Management
            </NavLink>
          )}
          <NavLink to="/admin-panel/profile" onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">👤</span> Profile
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <span>{user?.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="admin-topbar-right">
            <span style={{ fontSize: '.85rem', color: 'var(--gray-500)' }}>
              {user?.role === 'ADMIN' ? 'Administrator' : 'Operator'}
            </span>
            <img src="/Vikesh_Pic.jpg" alt="Admin" className="admin-avatar" />
          </div>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
