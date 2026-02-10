import { getAuthToken } from '../auth/token-store';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const buildUrl = (path: string): string => {
  if (path.startsWith('http')) {
    return path;
  }
  const sanitizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${sanitizedPath}`;
};

export async function httpClient<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  const rawPayload = await response.text();
  if (!rawPayload) {
    return undefined as T;
  }

  try {
    return JSON.parse(rawPayload) as T;
  } catch {
    throw new Error('Failed to parse server response.');
  }
}
