import { Navigate, Route, Routes } from 'react-router-dom';
import styles from './app.module.css';
import { ClientsPage } from '../features/clients/pages/ClientsPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { LoginPage } from '../features/login/pages/LoginPage';

export function App() {
  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Client Management MVP</p>
          <h1>Console Administrativo</h1>
        </div>
        <nav className={styles.navLinks}>
          <a href="/login">Login</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/clients">Clientes</a>
        </nav>
      </header>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
