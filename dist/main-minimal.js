"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./prisma/prisma.service");
async function bootstrap() {
    try {
        console.log('🚀 Starting minimal nuclear application...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn'],
        });
        const corsOptions = {
            origin: ['https://galloways.co.ke', 'http://localhost:3000'],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            credentials: true,
        };
        app.enableCors(corsOptions);
        app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
        const prismaService = app.get(prisma_service_1.PrismaService);
        await prismaService.$connect();
        console.log('✅ Database connected successfully');
        const port = process.env.PORT || 3000;
        await app.listen(port, '0.0.0.0');
        console.log(`🎯 Minimal nuclear application running on port ${port}`);
        console.log(`🌐 Health endpoint: http://0.0.0.0:${port}/health`);
    }
    catch (error) {
        console.error('💥 Nuclear startup failed:', error);
        process.exit(1);
    }
}
bootstrap().catch((error) => {
    console.error('💥 Bootstrap failed:', error);
    process.exit(1);
});
//# sourceMappingURL=main-minimal.js.map