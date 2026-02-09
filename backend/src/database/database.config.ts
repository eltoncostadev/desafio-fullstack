import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseNumber(process.env.DB_PORT, 5432),
  username: process.env.DB_USER ?? 'desafio',
  password: process.env.DB_PASSWORD ?? 'desafio',
  database: process.env.DB_NAME ?? 'desafio_fullstack',
  autoLoadEntities: true,
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
});
