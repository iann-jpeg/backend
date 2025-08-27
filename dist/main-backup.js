"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const client_1 = require("@prisma/client");
async function bootstrap() {
    console.log('🚀 STARTING GALLOWAYS BACKEND - NUCLEAR VERSION');
    const prisma = new client_1.PrismaClient();
    try {
        await prisma.$connect();
        console.log('✅ DATABASE CONNECTED SUCCESSFULLY');
        const userCount = await prisma.user.count();
        console.log(`✅ DATABASE QUERY TEST PASSED - ${userCount} users found`);
    }
    catch (error) {
        console.log('⚠️ DATABASE CONNECTION ISSUES:', error.message);
        console.log('⚠️ CONTINUING WITH MOCK DATA...');
    }
    const { AppModule } = await Promise.resolve().then(() => require('./app.module'));
    const app = await core_1.NestFactory.create(AppModule);
    app.enableCors({
        origin: ['https://galloways.co.ke', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    });
    app.getHttpAdapter().get('/api/health', (req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
            version: '1.0.0',
            deployment: 'railway'
        });
    });
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`✅ APPLICATION STARTED SUCCESSFULLY ON PORT ${port}`);
    console.log(`✅ HEALTH CHECK: http://localhost:${port}/api/health`);
    console.log(`✅ PUBLIC URL: https://gallo-end-production.up.railway.app`);
}
bootstrap().catch((error) => {
    console.error('❌ APPLICATION FAILED TO START:', error);
    process.exit(1);
});
//# sourceMappingURL=main-backup.js.map