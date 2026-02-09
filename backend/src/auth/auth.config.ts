export type AuthEnv = {
  credentialEmail: string;
  credentialPassword: string;
  jwtSecret: string;
  jwtExpiresIn: string;
};

export const getAuthEnv = (): AuthEnv => ({
  credentialEmail: process.env.AUTH_EMAIL || 'admin@example.com',
  credentialPassword: process.env.AUTH_PASSWORD || 'admin123',
  jwtSecret: process.env.JWT_SECRET || 'dev-super-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
});
