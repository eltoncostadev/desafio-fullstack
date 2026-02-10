import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import App from './app';

vi.mock('../shared/auth/PrivateRoute', () => ({
  PrivateRoute: ({ children }: { children: JSX.Element }) => children,
}));

vi.mock('../shared/auth/auth-context', () => ({
  useAuth: () => ({
    token: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

const renderApp = (initialPath = '/dashboard') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );

describe('App', () => {
  it('renders the dashboard shell', () => {
    renderApp();

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
  });

  it('renders the login page when navigating to /login', () => {
    renderApp('/login');

    expect(screen.getByText('Olá, seja bem-vindo!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });
});
