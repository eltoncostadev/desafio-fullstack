import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { setAuthToken } from './token-store';

type LoginPayload = {
  username: string;
  password: string;
};

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const api = useApi();
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await api.post<{ access_token: string }>('/auth/login', payload);
      setToken(response.access_token);
      setAuthToken(response.access_token);
    },
    [api],
  );

  const logout = useCallback(() => {
    setToken(null);
    setAuthToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [login, logout, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
