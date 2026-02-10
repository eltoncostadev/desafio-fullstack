import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import styles from './app.module.css';
import { ClientsPage } from '../features/clients/pages/ClientsPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { LoginPage } from '../features/login/pages/LoginPage';
import { PrivateRoute } from '../shared/auth/PrivateRoute';

const iconProps = {
  width: 18,
  height: 18,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" {...iconProps}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9V21h5v-5h3v5h5V9" />
    </svg>
  );
}

function ClientsIcon() {
  return (
    <svg viewBox="0 0 24 24" {...iconProps}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.85" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function App() {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith('/clients')) {
      return 'Clientes';
    }
    if (location.pathname.startsWith('/dashboard')) {
      return 'Dashboard';
    }
    return 'Console Administrativo';
  }, [location.pathname]);
  const mainClassName = isLoginRoute
    ? `${styles.main} ${styles.mainLogin}`
    : styles.main;
  const shellClassName = isLoginRoute
    ? `${styles.appShell} ${styles.appShellLogin}`
    : styles.appShell;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const sidebarClassName = `${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`.trim();
  const sidebarOverlayClassName = `${styles.sidebarOverlay} ${
    isSidebarOpen ? styles.sidebarOverlayVisible : ''
  }`.trim();

  return (
    <div className={shellClassName}>
      {!isLoginRoute && (
        <>
          <aside className={sidebarClassName}>
            <div className={styles.sidebarHeader}>
              <img src="/images/teddy-logo.png" alt="Teddy Open Finance" className={styles.sidebarLogo} />
            </div>
            <nav className={styles.sidebarNav}>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`.trim()
                }
                end
                onClick={closeSidebar}
              >
                <span className={styles.sidebarIcon} aria-hidden="true">
                  <HomeIcon />
                </span>
                Home
              </NavLink>
              <NavLink
                to="/clients"
                className={({ isActive }) =>
                  `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`.trim()
                }
                onClick={closeSidebar}
              >
                <span className={styles.sidebarIcon} aria-hidden="true">
                  <ClientsIcon />
                </span>
                Clientes
              </NavLink>
            </nav>
          </aside>
          <div
            className={sidebarOverlayClassName}
            onClick={closeSidebar}
            role="presentation"
            aria-hidden={!isSidebarOpen}
          />
        </>
      )}

      <div className={styles.mainWrapper}>
        {!isLoginRoute && (
          <header className={styles.header}>
            <div className={styles.leftGroup}>
              <button
                className={styles.menuButton}
                type="button"
                onClick={toggleSidebar}
                aria-label={isSidebarOpen ? 'Fechar menu lateral' : 'Abrir menu lateral'}
                aria-expanded={isSidebarOpen}
              >
                <span />
                <span />
                <span />
              </button>
              <img src="/images/teddy-logo.png" alt="Teddy Open Finance" className={styles.brandLogo} />
            </div>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>
            <span className={styles.userLabel}>
              Olá, <strong>User</strong>
            </span>
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
    </div>
  );
}

export default App;
