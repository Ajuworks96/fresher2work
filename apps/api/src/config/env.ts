import dotenv from 'dotenv';
import path from 'path';

// Load from apps/api/.env as primary, with fallback to root or process.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'fresher2work-super-secret-jwt-key-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_FresherToWorkDemo',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_FresherToWork2026',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'whsec_fresher2work_secret',
  ACTIVATION_AMOUNT_PAISE: 9900, // ₹99.00 INR
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  STORAGE_BUCKET: process.env.STORAGE_BUCKET || 'fresher2work-files',
  STORAGE_PUBLIC_URL: process.env.STORAGE_PUBLIC_URL || 'https://assets.fresher2work.com',
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://sxsiarjhqgvzsqmwscap.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || process.env.STORAGE_BUCKET || 'fresher2work-files',
};
