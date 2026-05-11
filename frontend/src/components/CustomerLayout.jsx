import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../auth';

export default function CustomerLayout() {
  const user = getUser();
  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav('/login');
  }

  return (
    <div className="customer-layout">
      <header className="customer-topnav">
        <div className="brand">{'\u{1F17F}'} Vikesh's Parking System</div>
        <div className="nav-links">
          <NavLink to="/customer" end>Home</NavLink>
          <NavLink to="/customer/my-reservations">My Reservations</NavLink>
          <NavLink to="/customer/track-ticket">Track My Ticket</NavLink>
          <NavLink to="/customer/nearby-parking">Nearby Parking</NavLink>
          <NavLink to="/customer/profile">Profile</NavLink>
        </div>
        <div className="nav-right">
          <span>{user?.username}</span>
          <button className="secondary" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="customer-main">
        <Outlet />
      </main>
    </div>
  );
}
