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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mock_data_service_1 = require("../services/mock-data.service");
let AdminService = class AdminService {
    constructor(prisma, mockDataService) {
        this.prisma = prisma;
        this.mockDataService = mockDataService;
    }
    async getDashboardData() {
        try {
            const [userCount, paymentCount, totalRevenue, recentActivity] = await Promise.all([
                this.prisma.user.count(),
                this.prisma.payment.count({ where: { status: 'COMPLETED' } }),
                this.prisma.payment.aggregate({
                    _sum: { amount: true },
                    where: { status: 'COMPLETED' }
                }),
                this.prisma.user.findMany({
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                        role: true
                    }
                })
            ]);
            return {
                success: true,
                data: {
                    stats: {
                        totalUsers: userCount,
                        totalPayments: paymentCount,
                        totalRevenue: totalRevenue._sum.amount || 0,
                        growthRate: 12.5
                    },
                    recentActivity,
                    chartData: await this.getChartData({})
                }
            };
        }
        catch (error) {
            console.error('Database error in getDashboardData, using mock data:', error);
            return {
                success: true,
                data: this.mockDataService.getMockDashboardData(),
                isMockData: true
            };
        }
    }
    async getUsers(query) {
        const { search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { [sortBy]: sortOrder },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            payments: true,
                            claims: true
                        }
                    }
                }
            }),
            this.prisma.user.count({ where })
        ]);
        return {
            success: true,
            data: {
                users,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            }
        };
    }
    async updateUser(id, data) {
        const user = await this.prisma.user.update({
            where: { id: Number(id) },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return { success: true, data: user };
    }
    async deleteUser(id) {
        await this.prisma.user.delete({
            where: { id: Number(id) }
        });
        return { success: true, message: 'User deleted successfully' };
    }
    async getClaims(query) {
        try {
            const { search, status, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
            const skip = (page - 1) * limit;
            const where = {};
            if (search) {
                where.OR = [
                    { policyNumber: { contains: search, mode: 'insensitive' } },
                    { claimNumber: { contains: search, mode: 'insensitive' } },
                    { user: {
                            OR: [
                                { name: { contains: search, mode: 'insensitive' } },
                                { email: { contains: search, mode: 'insensitive' } }
                            ]
                        } }
                ];
            }
            if (status) {
                where.status = status;
            }
            const [claims, total] = await Promise.all([
                this.prisma.claim.findMany({
                    where,
                    skip,
                    take: Number(limit),
                    orderBy: { [sortBy]: sortOrder },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profile: {
                                    select: {
                                        phone: true
                                    }
                                }
                            }
                        },
                        documents: {
                            select: {
                                id: true,
                                filename: true,
                                originalName: true,
                                mimeType: true,
                                size: true,
                                createdAt: true
                            }
                        }
                    }
                }),
                this.prisma.claim.count({ where })
            ]);
            return {
                success: true,
                data: {
                    claims,
                    pagination: {
                        total,
                        page: Number(page),
                        limit: Number(limit),
                        totalPages: Math.ceil(total / limit)
                    }
                }
            };
        }
        catch (error) {
            console.error('Database error in getClaims, using mock data:', error);
            return {
                success: true,
                data: this.mockDataService.getMockClaimsData(),
                isMockData: true
            };
        }
    }
    async getClaimById(id) {
        const claim = await this.prisma.claim.findUnique({
            where: { id: Number(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                phone: true
                            }
                        }
                    }
                },
                documents: {
                    select: {
                        id: true,
                        filename: true,
                        originalName: true,
                        mimeType: true,
                        size: true,
                        createdAt: true,
                        path: true
                    }
                }
            }
        });
        return { success: true, data: claim };
    }
    async updateClaimStatus(id, status) {
        const claim = await this.prisma.claim.update({
            where: { id: Number(id) },
            data: { status }
        });
        return { success: true, data: claim };
    }
    async getConsultations(query) {
        const { search, status, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { consultationType: { contains: search, mode: 'insensitive' } },
                { user: {
                        OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    } }
            ];
        }
        if (status) {
            where.status = status;
        }
        const [consultations, total] = await Promise.all([
            this.prisma.consultation.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profile: {
                                select: {
                                    phone: true
                                }
                            }
                        }
                    }
                }
            }),
            this.prisma.consultation.count({ where })
        ]);
        return {
            success: true,
            data: {
                consultations,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            }
        };
    }
    async getConsultationById(id) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: Number(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                phone: true
                            }
                        }
                    }
                }
            }
        });
        return { success: true, data: consultation };
    }
    async updateConsultationStatus(id, status) {
        const consultation = await this.prisma.consultation.update({
            where: { id: Number(id) },
            data: { status }
        });
        return { success: true, data: consultation };
    }
    async downloadDocument(id) {
        const document = await this.prisma.document.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                filename: true,
                originalName: true,
                mimeType: true,
                path: true,
                size: true
            }
        });
        return { success: true, data: document };
    }
    async getPayments(query) {
        const { search, status, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { transactionId: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (status) {
            where.status = status;
        }
        const [payments, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            this.prisma.payment.count({ where })
        ]);
        return {
            success: true,
            data: {
                payments,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            }
        };
    }
    async getPaymentStats() {
        const [totalRevenue, monthlyRevenue, paymentsByStatus] = await Promise.all([
            this.prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'COMPLETED' }
            }),
            this.prisma.payment.groupBy({
                by: ['createdAt'],
                _sum: { amount: true },
                where: {
                    status: 'COMPLETED',
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            }),
            this.prisma.payment.groupBy({
                by: ['status'],
                _count: true
            })
        ]);
        return {
            success: true,
            data: {
                totalRevenue: totalRevenue._sum.amount || 0,
                monthlyRevenue: monthlyRevenue.reduce((sum, item) => sum + (item._sum.amount || 0), 0),
                statusBreakdown: paymentsByStatus
            }
        };
    }
    async updatePaymentStatus(id, status) {
        const payment = await this.prisma.payment.update({
            where: { id: Number(id) },
            data: { status }
        });
        return { success: true, data: payment };
    }
    async getNotifications(query) {
        const { page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            this.prisma.adminNote.findMany({
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.adminNote.count()
        ]);
        return {
            success: true,
            data: {
                notifications,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            }
        };
    }
    async createNotification(data) {
        const notification = await this.prisma.adminNote.create({
            data
        });
        return { success: true, data: notification };
    }
    async markNotificationRead(id) {
        const notification = await this.prisma.adminNote.update({
            where: { id: Number(id) },
            data: { note: 'read' }
        });
        return { success: true, data: notification };
    }
    async getAnalytics(query) {
        const { period = '30d' } = query;
        const now = new Date();
        const startDate = new Date();
        switch (period) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(now.getDate() - 90);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }
        const [userGrowth, paymentTrends, topProducts] = await Promise.all([
            this.prisma.user.groupBy({
                by: ['createdAt'],
                _count: true,
                where: {
                    createdAt: { gte: startDate }
                }
            }),
            this.prisma.payment.groupBy({
                by: ['createdAt', 'status'],
                _count: true,
                _sum: { amount: true },
                where: {
                    createdAt: { gte: startDate }
                }
            }),
            this.prisma.product.findMany({
                take: 10,
                select: {
                    name: true,
                    category: true
                }
            })
        ]);
        return {
            success: true,
            data: {
                period,
                userGrowth,
                paymentTrends,
                topProducts
            }
        };
    }
    async getChartData(query) {
        const { type = 'revenue', period = '30d' } = query;
        const now = new Date();
        const startDate = new Date();
        startDate.setDate(now.getDate() - 30);
        switch (type) {
            case 'revenue':
                const revenueData = await this.prisma.payment.groupBy({
                    by: ['createdAt'],
                    _sum: { amount: true },
                    where: {
                        status: 'COMPLETED',
                        createdAt: { gte: startDate }
                    }
                });
                return { type: 'revenue', data: revenueData };
            case 'users':
                const userData = await this.prisma.user.groupBy({
                    by: ['createdAt'],
                    _count: true,
                    where: {
                        createdAt: { gte: startDate }
                    }
                });
                return { type: 'users', data: userData };
            default:
                return { type, data: [] };
        }
    }
    async getSettings() {
        return {
            success: true,
            data: {
                siteName: 'Galloways Admin',
                maintenanceMode: false,
                allowRegistration: true,
                emailNotifications: true,
                backupEnabled: true,
                maxFileSize: 10,
                allowedFileTypes: ['pdf', 'jpg', 'png', 'docx'],
                supportEmail: 'support@galloways.co.ke',
                systemHealth: {
                    database: 'healthy',
                    email: 'healthy',
                    storage: 'healthy'
                }
            }
        };
    }
    async updateSettings(data) {
        return {
            success: true,
            data,
            message: 'Settings updated successfully'
        };
    }
    async exportUsers(query) {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
        return {
            success: true,
            data: users,
            filename: `users_export_${new Date().toISOString().split('T')[0]}.csv`
        };
    }
    async exportPayments(query) {
        const payments = await this.prisma.payment.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        return {
            success: true,
            data: payments,
            filename: `payments_export_${new Date().toISOString().split('T')[0]}.csv`
        };
    }
    async getSystemHealth() {
        try {
            await this.prisma.user.count();
            return {
                success: true,
                data: {
                    database: 'healthy',
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    timestamp: new Date()
                }
            };
        }
        catch (error) {
            return {
                success: false,
                data: {
                    database: 'unhealthy',
                    error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error',
                    timestamp: new Date()
                }
            };
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mock_data_service_1.MockDataService])
], AdminService);
//# sourceMappingURL=admin.service.backup.js.map