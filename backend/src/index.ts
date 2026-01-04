import { Tenant, User, Team, TeamMember, Message } from './models';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import authRoutes from './routes/authRoutes';
import teamRoutes from './routes/teamRoutes';
import userRoutes from './routes/userRoutes';
import tenantRoutes from './routes/tenantRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'x-user-email'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', teamRoutes);
app.use('/api', userRoutes);
app.use('/api', tenantRoutes);

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();    
    app.listen(PORT, () => {
      // Server started
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();

export default app;
