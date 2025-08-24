
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Initialize Prisma service for database connection
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  
  // Enable validation pipe for DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  
  // Configure security headers with proper CSP for form submissions
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https:"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "http://localhost:*", "http://127.0.0.1:*"],
          formAction: ["'self'"],
          scriptSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // Configure CORS for frontend
  app.enableCors({
    origin: [
      'https://your-vercel-domain.vercel.app',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  // Set API prefix
  app.setGlobalPrefix('api');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Exact API')
    .setDescription('API documentation for Exact backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  console.log(`🚀 Server starting on port ${port}`);
  
  try {
    const server = await app.listen(port);
    // Setup Socket.io for real-time admin dashboard
    const { setupAdminPanelSocket } = require('./internal-admin-panel.controller');
    setupAdminPanelSocket(server);
    console.log(`✅ Server is running on http://localhost:${port}`);
    console.log(`📚 API Documentation available at http://localhost:${port}/docs`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}
bootstrap();
