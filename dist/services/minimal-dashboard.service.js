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
exports.MinimalDashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MinimalDashboardService = class MinimalDashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMinimalStats() {
        try {
            const [totalUsers, totalClaims, totalQuotes, totalConsultations, totalDiaspora, totalDocuments, totalProducts] = await Promise.all([
                this.prisma.user.count(),
                this.prisma.claim.count(),
                this.prisma.quote.count(),
                this.prisma.consultation.count(),
                this.prisma.diasporaRequest.count(),
                this.prisma.document.count(),
                this.prisma.product.count()
            ]);
            return {
                status: 'operational',
                totalUsers,
                totalClaims,
                totalQuotes,
                totalConsultations,
                totalDiaspora,
                totalDocuments,
                totalProducts,
                message: 'Dashboard operational with existing database tables',
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('Dashboard service error:', error);
            return {
                status: 'degraded',
                message: 'Dashboard service experiencing issues',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            };
        }
    }
};
exports.MinimalDashboardService = MinimalDashboardService;
exports.MinimalDashboardService = MinimalDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MinimalDashboardService);
//# sourceMappingURL=minimal-dashboard.service.js.map