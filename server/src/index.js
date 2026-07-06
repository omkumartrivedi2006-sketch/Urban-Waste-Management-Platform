import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import aiRouter from './routes/ai.js';
import complaintsRouter from './routes/complaints.js';
import notificationsRouter from './routes/notifications.js';
import vehiclesRouter from './routes/vehicles.js';
import routesRouter from './routes/routes.js';
import analyticsRouter from './routes/analytics.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // For development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Set database status helper
app.use((req, res, next) => {
  const stateMap = {
    0: 'DISCONNECTED',
    1: 'CONNECTED',
    2: 'CONNECTING',
    3: 'DISCONNECTING'
  };
  req.app.set('dbStatus', stateMap[mongoose.connection.readyState] || 'UNKNOWN');
  next();
});

// Bind API Routes
app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/routes', routesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/admin', adminRouter);

// Root route placeholder
app.get('/', (req, res) => {
  res.send('UWMP API Server is active. Access health info at /api/health');
});

// Connect Database and Start Server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`[Server] Express active on http://localhost:${PORT}`);
    console.log(`[Server] Health check endpoint: http://localhost:${PORT}/api/health`);
  });
};

startServer();
