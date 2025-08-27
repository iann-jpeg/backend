"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockDashboardService = void 0;
const common_1 = require("@nestjs/common");
let MockDashboardService = class MockDashboardService {
    async getDashboardStats(filters = {}) {
        return {
            totalUsers: 0,
            totalClaims: 0,
            totalQuotes: 0,
            totalConsultations: 0,
            totalPayments: 0,
            monthlyRevenue: 0,
            recentActivity: [],
            mockData: true,
            warning: 'Using mock data - Payment table not found'
        };
    }
    async getAnalytics() {
        return {
            userGrowth: [],
            revenueGrowth: [],
            claimStats: [],
            mockData: true
        };
    }
    async getRecentActivity() {
        return {
            activities: [],
            mockData: true
        };
    }
};
exports.MockDashboardService = MockDashboardService;
exports.MockDashboardService = MockDashboardService = __decorate([
    (0, common_1.Injectable)()
], MockDashboardService);
//# sourceMappingURL=mock-dashboard.service.js.map