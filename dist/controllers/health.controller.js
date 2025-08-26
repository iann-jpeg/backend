"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const public_decorator_1 = require("../middleware/public.decorator");
const dashboard_service_1 = require("../services/dashboard.service");
let HealthController = class HealthController {
    constructor(prisma, dashboardService) {
        this.prisma = prisma;
        this.dashboardService = dashboardService;
    }
    async getHealth() {
        const startTime = Date.now();
        try {
            let dbHealthy = false;
            let queryTest = false;
            try {
                dbHealthy = await this.prisma.healthCheck();
            }
            catch (error) {
                console.warn('Database health check failed, trying basic query...');
                try {
                    await this.prisma.$queryRaw `SELECT 1`;
                    dbHealthy = true;
                }
                catch (basicError) {
                    console.error('Basic database query failed:', basicError);
                }
            }
            if (dbHealthy) {
                try {
                    await this.prisma.user.count();
                    queryTest = true;
                }
                catch (error) {
                    console.warn('User count query failed, trying alternative...');
                    try {
                        await this.prisma.$queryRaw `SELECT COUNT(*) FROM "User"`;
                        queryTest = true;
                    }
                    catch (altError) {
                        console.warn('Alternative query failed:', altError);
                    }
                }
            }
            const responseTime = Date.now() - startTime;
            const isHealthy = dbHealthy && queryTest;
            return {
                status: isHealthy ? 'healthy' : 'degraded',
                timestamp: new Date().toISOString(),
                responseTime: `${responseTime}ms`,
                services: {
                    database: {
                        status: dbHealthy ? 'up' : 'down',
                        connection: dbHealthy,
                        queries: queryTest,
                        url_configured: !!process.env.DATABASE_URL
                    },
                    application: {
                        status: 'up',
                        memory_usage: process.memoryUsage(),
                        uptime: process.uptime()
                    }
                },
                environment: process.env.NODE_ENV || 'development',
                version: '1.0.0',
                deployment: {
                    platform: 'railway',
                    tables_expected: ['User', 'Claim', 'Quote', 'Consultation', 'Payment', 'Document', 'Admin']
                }
            };
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                responseTime: `${responseTime}ms`,
                error: error instanceof Error ? error.message : 'Unknown error',
                services: {
                    database: { status: 'unknown' },
                    application: { status: 'partial' }
                }
            };
        }
    }
    async getDeepHealth() {
        const startTime = Date.now();
        try {
            const [userCount, claimCount, quotesCount, consultationCount, paymentCount] = await Promise.all([
                this.prisma.user.count().catch(() => 0),
                this.prisma.claim.count().catch(() => 0),
                this.prisma.quote.count().catch(() => 0),
                this.prisma.consultation.count().catch(() => 0),
                this.prisma.payment.count().catch(() => 0)
            ]);
            const responseTime = Date.now() - startTime;
            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                responseTime: `${responseTime}ms`,
                database: {
                    status: 'up',
                    tables: {
                        users: userCount,
                        claims: claimCount,
                        quotes: quotesCount,
                        consultations: consultationCount,
                        payments: paymentCount
                    }
                },
                performance: {
                    fast: responseTime < 100,
                    acceptable: responseTime < 500,
                    slow: responseTime >= 500
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            };
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('deep'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getDeepHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        dashboard_service_1.DashboardService])
], HealthController);
//# sourceMappingURL=health.controller.js.map