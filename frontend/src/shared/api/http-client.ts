const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const buildUrl = (path: string): string => {
  if (path.startsWith('http')) {
    return path;
  }
  const sanitizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${sanitizedPath}`;
};

export async function httpClient<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
