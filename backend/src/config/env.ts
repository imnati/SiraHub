import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  NODE_ENV: optionalEnv('NODE_ENV', 'development') as
    | 'development'
    | 'production'
    | 'test',
  PORT: parseInt(optionalEnv('PORT', '5000'), 10),

  MONGODB_URI: requireEnv('MONGODB_URI'),

  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: optionalEnv('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),

  CLOUDINARY_CLOUD_NAME: optionalEnv('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: optionalEnv('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: optionalEnv('CLOUDINARY_API_SECRET', ''),

  SMTP_HOST: optionalEnv('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: parseInt(optionalEnv('SMTP_PORT', '587'), 10),
  SMTP_SECURE: optionalEnv('SMTP_SECURE', 'false') === 'true',
  SMTP_USER: optionalEnv('SMTP_USER', ''),
  SMTP_PASS: optionalEnv('SMTP_PASS', ''),
  EMAIL_FROM: optionalEnv('EMAIL_FROM', 'SiraHub <no-reply@sirahub.et>'),

  CLIENT_URL: optionalEnv('CLIENT_URL', 'http://localhost:3000'),

  RATE_LIMIT_WINDOW_MS: parseInt(optionalEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  RATE_LIMIT_MAX: parseInt(optionalEnv('RATE_LIMIT_MAX', '100'), 10),
} as const;
