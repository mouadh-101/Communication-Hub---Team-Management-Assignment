import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME || 'team_communication',
  process.env.DATABASE_USER || 'postgres',
  process.env.DATABASE_PASSWORD || 'postgres',
  {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    dialect: 'postgres',
  }
);

export default sequelize;