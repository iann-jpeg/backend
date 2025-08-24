import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ValidationPipe } from '@nestjs/common';
import { globalResponseWrapper } from '../lib/response-wrapper';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

function handleOptions(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization,Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new globalResponseWrapper());
  app.enableCors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });
  app.use(helmet());
  app.use(handleOptions);
  const server = await app.listen(process.env.PORT || 3001);
  
  // Setup Socket.io for real-time admin dashboard
  const { setupAdminPanelSocket } = require('../internal-admin-panel.controller');
  const socketService = setupAdminPanelSocket(server);
  
  console.log('✅ Server is running on http://localhost:3001');
  console.log('📚 API Documentation available at http://localhost:3001/docs');
  console.log('🔌 Socket.io for real-time admin updates is active');
}
bootstrap();
