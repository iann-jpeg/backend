// Centralized config loader
import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'production',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],
  elasticEmailApiKey: process.env.ELASTIC_EMAIL_API_KEY,
  elasticEmailFrom: process.env.ELASTIC_EMAIL_FROM,
};
