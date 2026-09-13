import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env';
import { authRouter } from './modules/auth/auth.router';
import { studentsRouter } from './modules/students/students.router';
import { storageRouter } from './modules/storage/storage.router';
import { paymentsRouter } from './modules/payments/payments.router';
import { discoveryRouter } from './modules/discovery/discovery.router';
import { adminRouter } from './modules/admin/admin.router';

const app = express();

// Security and Middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'FresherToWork API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/students', studentsRouter);
app.use('/api/v1/storage', storageRouter);
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/discovery', discoveryRouter);
app.use('/api/v1/admin', adminRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled API Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start Server
if (require.main === module) {
  app.listen(ENV.PORT, () => {
    console.log(`🚀 FresherToWork API Server listening on http://localhost:${ENV.PORT}`);
    console.log(`📡 Health Check: http://localhost:${ENV.PORT}/health`);
  });
}

export default app;
