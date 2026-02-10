import { useMemo } from 'react';
import { httpClient } from '../api/http-client';

export type ApiHook = {
  get: <T>(path: string, init?: RequestInit) => Promise<T>;
  post: <T>(path: string, body?: unknown, init?: RequestInit) => Promise<T>;
};

export function useApi(): ApiHook {
  return useMemo(
    () => ({
      get: (path, init) => httpClient(path, { ...init, method: 'GET' }),
      post: (path, body, init) =>
        httpClient(path, {
          ...init,
          method: 'POST',
          body: body ? JSON.stringify(body) : undefined,
        }),
    }),
    [],
  );
}
