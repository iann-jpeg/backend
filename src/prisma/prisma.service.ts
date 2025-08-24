import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['error', 'warn'],
      errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Database connected successfully');
    } catch (error: any) {
      console.error('❌ Database connection failed:', error.message || 'Unknown error');
      // Allow server to start even if DB connection fails initially
      console.log('⚠️  Server will continue without database connection');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: any) {
    // This method is kept for compatibility but the actual cleanup
    // is handled by onModuleDestroy
  }
}
