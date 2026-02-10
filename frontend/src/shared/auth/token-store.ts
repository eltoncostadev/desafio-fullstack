let authToken: string | null = null;

export const getAuthToken = (): string | null => authToken;

export const setAuthToken = (token: string | null): void => {
  authToken = token;
};
