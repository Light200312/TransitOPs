
import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell.jsx';
import * as api from './api.js';
import { AnalyticsPage } from './pages/AnalyticsPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { DriversPage } from './pages/DriversPage.jsx';
import { ExpensesPage } from './pages/ExpensesPage.jsx';
import { FleetPage } from './pages/FleetPage.jsx';
import { JobsPage } from './pages/JobsPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { ForgetPassword } from './pages/ForgetPassword.jsx';
import { ResetPassword } from './pages/ResetPassword.jsx';
import { MaintenancePage } from './pages/MaintenancePage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { TripsPage } from './pages/TripsPage.jsx';

function ProtectedApp({ role, onLogout, children, allowDriver = false }) {
  const savedName = typeof window !== 'undefined' ? window.localStorage.getItem('transitops-user-name') : '';
  const userName = savedName || (role === 'Driver' ? 'Rakesh Patel' : role === 'Dispatcher' ? 'Aarav Mehta' : role === 'Safety Officer' ? 'Neha Shah' : role === 'Financial Analyst' ? 'Vikram Joshi' : 'Priya Desai');

  if (!role) return <Navigate to="/login" replace />;
  if (role === 'Driver' && !allowDriver) return <Navigate to="/jobs" replace />;

  return <AppShell role={role} name={userName} onLogout={onLogout}>{children}</AppShell>;
}

export function App() {
  const [token, setToken] = useState(() => localStorage.getItem('transitops-token') || null);
  const [role, setRole] = useState(() => localStorage.getItem('transitops-role') || null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [serviceLogs, setServiceLogs] = useState([]);

  /** Fetch all core data from the backend */
  const reload = useCallback(async () => {
    const t = token || localStorage.getItem('transitops-token');
    if (!t) return;
    try {
      const [v, d, tr, sl] = await Promise.all([
        api.fetchVehicles(t),
        api.fetchDrivers(t),
        api.fetchTrips(t),
        api.fetchMaintenance(t),
      ]);
      setVehicles(v);
      setDrivers(d);
      setTrips(tr);
      setServiceLogs(sl);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  }, [token]);

  // Load data on mount if already authenticated
  useEffect(() => {
    if (token) reload();
  }, [token, reload]);

  const handleLogin = (newToken, newRole, newUserName, newCompanyName) => {
    localStorage.setItem('transitops-token', newToken);
    localStorage.setItem('transitops-role', newRole);
    if (newUserName) {
      localStorage.setItem('transitops-user-name', newUserName);
    } else {
      localStorage.removeItem('transitops-user-name');
    }
    if (newCompanyName) {
      localStorage.setItem('transitops-company-name', newCompanyName);
    } else {
      localStorage.removeItem('transitops-company-name');
    }
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem('transitops-token');
    localStorage.removeItem('transitops-role');
    localStorage.removeItem('transitops-user-name');
    localStorage.removeItem('transitops-company-name');
    setToken(null);
    setRole(null);
    setVehicles([]);
    setDrivers([]);
    setTrips([]);
    setServiceLogs([]);
  };

  const appHome = role === 'Driver' ? '/jobs' : '/dashboard';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={role ? <Navigate to={appHome} replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/resetPassword/:resetPasswordToken" element={<ResetPassword />} />
        <Route path="/jobs" element={
          <ProtectedApp role={role} onLogout={logout} allowDriver>
            {role === 'Driver' ?
              <JobsPage trips={trips} vehicles={vehicles} token={token} reload={reload} /> :
              <Navigate to="/dashboard" replace />}
          </ProtectedApp>
        } />
        <Route path="/dashboard" element={<ProtectedApp role={role} onLogout={logout}><DashboardPage vehicles={vehicles} drivers={drivers} trips={trips} /></ProtectedApp>} />
        <Route path="/fleet" element={<ProtectedApp role={role} onLogout={logout}><FleetPage vehicles={vehicles} token={token} reload={reload} role={role} /></ProtectedApp>} />
        <Route path="/drivers" element={<ProtectedApp role={role} onLogout={logout}><DriversPage drivers={drivers} token={token} reload={reload} /></ProtectedApp>} />
        <Route path="/trips" element={<ProtectedApp role={role} onLogout={logout}><TripsPage vehicles={vehicles} drivers={drivers} trips={trips} token={token} reload={reload} /></ProtectedApp>} />
        <Route path="/maintenance" element={<ProtectedApp role={role} onLogout={logout}><MaintenancePage vehicles={vehicles} logs={serviceLogs} token={token} reload={reload} /></ProtectedApp>} />
        <Route path="/expenses" element={<ProtectedApp role={role} onLogout={logout}><ExpensesPage token={token} /></ProtectedApp>} />
        <Route path="/analytics" element={<ProtectedApp role={role} onLogout={logout}><AnalyticsPage token={token} /></ProtectedApp>} />
        <Route path="/settings" element={<ProtectedApp role={role} onLogout={logout}><SettingsPage /></ProtectedApp>} />
        <Route path="*" element={<Navigate to={role ? appHome : '/login'} replace />} />
      </Routes>
    </BrowserRouter>);

}