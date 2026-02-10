import { Link, Navigate, Route, Routes } from 'react-router-dom';
import styles from './app.module.css';
import { ClientsPage } from '../features/clients/pages/ClientsPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { LoginPage } from '../features/login/pages/LoginPage';
import { PrivateRoute } from '../shared/auth/PrivateRoute';

export function App() {
  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Client Management MVP</p>
          <h1>Console Administrativo</h1>
        </div>
        <nav className={styles.navLinks}>
          <Link to="/login">Login</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/clients">Clientes</Link>
        </nav>
      </header>

      <main className={styles.main}>
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
