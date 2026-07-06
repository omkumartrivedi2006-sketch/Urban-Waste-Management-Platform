import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'Urban Waste Management Platform API',
    uptime: process.uptime(),
    database: req.app.get('dbStatus') || 'DISCONNECTED',
    message: 'UWMP service healthcheck completed successfully.'
  });
});

export default router;
