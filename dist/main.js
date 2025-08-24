"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("./prisma/prisma.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const prismaService = app.get(prisma_service_1.PrismaService);
    await prismaService.enableShutdownHooks(app);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.use((0, helmet_1.default)({
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
    }));
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:8080', 'http://127.0.0.1:8081'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 200,
    });
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Exact API')
        .setDescription('API documentation for Exact backend')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT || 3001;
    console.log(`🚀 Server starting on port ${port}`);
    try {
        const server = await app.listen(port);
        const { setupAdminPanelSocket } = require('./internal-admin-panel.controller');
        setupAdminPanelSocket(server);
        console.log(`✅ Server is running on http://localhost:${port}`);
        console.log(`📚 API Documentation available at http://localhost:${port}/docs`);
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map