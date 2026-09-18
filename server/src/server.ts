import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'PlanCraft AI API Server',
    description: 'The Xperience - Autonomous Event Operations Platform',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      events: '/api/events',
      chat: '/api/chat',
      risks: '/api/risks/:eventId',
    },
  });
});

// Boot server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✨ PlanCraft AI Server running on port ${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
