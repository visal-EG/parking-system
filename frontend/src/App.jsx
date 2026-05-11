import { Routes, Route, Navigate } from 'react-router-dom';
import { getUser, hasRole } from './auth';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Entry from './pages/Entry.jsx';
import Exit from './pages/Exit.jsx';
import Occupancy from './pages/Occupancy.jsx';
import Reports from './pages/Reports.jsx';
import Admin from './pages/Admin.jsx';
import Profile from './pages/Profile.jsx';
import LocationSelect from './pages/LocationSelect.jsx';
import MallList from './pages/MallList.jsx';
import CustomerSlots from './pages/CustomerSlots.jsx';
import MyReservations from './pages/MyReservations.jsx';
import CheckTicket from './pages/CheckTicket.jsx';
import NearbyParking from './pages/NearbyParking.jsx';

import AdminLayout from './components/AdminLayout.jsx';
import CustomerLayout from './components/CustomerLayout.jsx';

function RequireAuth({ children, roles }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function RootRedirect() {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  // Admin and Operator go to admin layout dashboard
  if (user.role === 'ADMIN' || user.role === 'OPERATOR') {
    return <Navigate to="/admin-panel" replace />;
  }
  // Customer goes to city selection
  return <Navigate to="/customer" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes - no layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Root redirect based on role */}
      <Route path="/" element={<RootRedirect />} />

      {/* Admin / Operator routes with sidebar layout */}
      <Route
        path="/admin-panel"
        element={
          <RequireAuth roles={['ADMIN', 'OPERATOR']}>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="entry" element={<Entry />} />
        <Route path="exit" element={<Exit />} />
        <Route path="occupancy" element={<Occupancy />} />
        <Route path="reports" element={<Reports />} />
        <Route path="rates" element={<RequireAuth roles={['ADMIN']}><Admin /></RequireAuth>} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Customer routes with top-nav layout */}
      <Route
        path="/customer"
        element={
          <RequireAuth roles={['CUSTOMER']}>
            <CustomerLayout />
          </RequireAuth>
        }
      >
        <Route index element={<LocationSelect />} />
        <Route path="malls/:city" element={<MallList />} />
        <Route path="mall/:mallId/slots" element={<CustomerSlots />} />
        <Route path="my-reservations" element={<MyReservations />} />
        <Route path="track-ticket" element={<CheckTicket />} />
        <Route path="nearby-parking" element={<NearbyParking />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
