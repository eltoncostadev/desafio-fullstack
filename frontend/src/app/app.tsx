import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import styles from './app.module.css';
import { ClientsPage } from '../features/clients/pages/ClientsPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { LoginPage } from '../features/login/pages/LoginPage';
import { PrivateRoute } from '../shared/auth/PrivateRoute';

export function App() {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';
  const mainClassName = isLoginRoute
    ? `${styles.main} ${styles.mainLogin}`
    : styles.main;
  const shellClassName = isLoginRoute
    ? `${styles.appShell} ${styles.appShellLogin}`
    : styles.appShell;
  return (
    <div className={shellClassName}>
      {!isLoginRoute && (
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Client Management MVP</p>
            <h1>Console Administrativo</h1>
          </div>
          <nav className={styles.navLinks}>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/clients">Clientes</Link>
          </nav>
        </header>
      )}

      <main className={mainClassName}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <PrivateRoute>
                <ClientsPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
