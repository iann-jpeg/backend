import { PrismaService } from '../prisma/prisma.service';
import { MockDataService } from '../services/mock-data.service';
export declare class AdminService {
    private prisma;
    private mockDataService;
    constructor(prisma: PrismaService, mockDataService: MockDataService);
    getDashboardData(): Promise<{
        success: boolean;
        data: {
            stats: {
                totalUsers: number;
                totalPayments: number;
                totalRevenue: number;
                growthRate: number;
            };
            recentActivity: {
                id: number;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
            }[];
            chartData: {
                type: string;
                data: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PaymentGroupByOutputType, "createdAt"[]> & {
                    _sum: {
                        amount: number | null;
                    };
                })[];
            } | {
                type: string;
                data: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.UserGroupByOutputType, "createdAt"[]> & {
                    _count: number;
                })[];
            } | {
                type: any;
                data: never[];
            };
        };
        isMockData?: undefined;
    } | {
        success: boolean;
        data: {
            stats: {
                totalUsers: number;
                totalClaims: number;
                totalPayments: number;
                totalRevenue: number;
                growthRate: number;
            };
            recentActivity: {
                id: number;
                name: string;
                email: string;
                createdAt: string;
                role: string;
            }[];
        };
        isMockData: boolean;
    }>;
    getUsers(query: any): Promise<{
        success: boolean;
        data: {
            users: {
                _count: {
                    claims: number;
                    payments: number;
                };
                id: number;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                createdAt: Date;
                updatedAt: Date;
            }[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
    }>;
    updateUser(id: string, data: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getClaims(query: any): Promise<{
        success: boolean;
        data: {
            claims: ({
                user: {
                    id: number;
                    name: string;
                    email: string;
                    profile: {
                        phone: string | null;
                    } | null;
                } | null;
                documents: {
                    id: number;
                    createdAt: Date;
                    filename: string;
                    originalName: string;
                    mimeType: string;
                    size: number;
                }[];
            } & {
                status: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                userId: number | null;
                policyNumber: string;
                claimType: string;
                incidentDate: Date;
                estimatedLoss: number;
                submitterEmail: string | null;
                submitterName: string | null;
                submitterPhone: string | null;
            })[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
        isMockData?: undefined;
    } | {
        success: boolean;
        data: {
            claims: {
                id: number;
                policyNumber: string;
                claimType: string;
                incidentDate: string;
                estimatedLoss: number;
                description: string;
                status: string;
                createdAt: string;
                user: {
                    id: number;
                    name: string;
                    email: string;
                    profile: {
                        phone: string;
                    };
                };
                documents: {
                    id: number;
                    filename: string;
                    originalName: string;
                    mimeType: string;
                    size: number;
                    createdAt: string;
                }[];
            }[];
        };
        isMockData: boolean;
    }>;
    getClaimById(id: string): Promise<{
        success: boolean;
        data: ({
            user: {
                id: number;
                name: string;
                email: string;
                profile: {
                    phone: string | null;
                } | null;
            } | null;
            documents: {
                id: number;
                createdAt: Date;
                filename: string;
                originalName: string;
                mimeType: string;
                size: number;
                path: string;
            }[];
        } & {
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            userId: number | null;
            policyNumber: string;
            claimType: string;
            incidentDate: Date;
            estimatedLoss: number;
            submitterEmail: string | null;
            submitterName: string | null;
            submitterPhone: string | null;
        }) | null;
    }>;
    updateClaimStatus(id: string, status: string): Promise<{
        success: boolean;
        data: {
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            userId: number | null;
            policyNumber: string;
            claimType: string;
            incidentDate: Date;
            estimatedLoss: number;
            submitterEmail: string | null;
            submitterName: string | null;
            submitterPhone: string | null;
        };
    }>;
    getConsultations(query: any): Promise<{
        success: boolean;
        data: {
            consultations: ({
                user: {
                    id: number;
                    name: string;
                    email: string;
                    profile: {
                        phone: string | null;
                    } | null;
                } | null;
            } & {
                status: string;
                id: number;
                name: string;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                userId: number | null;
                phone: string;
                country: string | null;
                timezone: string | null;
                scheduledAt: Date | null;
                company: string | null;
                consultationDate: string;
                consultationTime: string;
                message: string;
                serviceType: string;
            })[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
    }>;
    getConsultationById(id: string): Promise<{
        success: boolean;
        data: ({
            user: {
                id: number;
                name: string;
                email: string;
                profile: {
                    phone: string | null;
                } | null;
            } | null;
        } & {
            status: string;
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            phone: string;
            country: string | null;
            timezone: string | null;
            scheduledAt: Date | null;
            company: string | null;
            consultationDate: string;
            consultationTime: string;
            message: string;
            serviceType: string;
        }) | null;
    }>;
    updateConsultationStatus(id: string, status: string): Promise<{
        success: boolean;
        data: {
            status: string;
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            phone: string;
            country: string | null;
            timezone: string | null;
            scheduledAt: Date | null;
            company: string | null;
            consultationDate: string;
            consultationTime: string;
            message: string;
            serviceType: string;
        };
    }>;
    downloadDocument(id: string): Promise<{
        success: boolean;
        data: {
            id: number;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            path: string;
        } | null;
    }>;
    getPayments(query: any): Promise<{
        success: boolean;
        data: {
            payments: ({
                user: {
                    name: string;
                    email: string;
                } | null;
            } & {
                status: string;
                amount: number;
                id: number;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                userId: number | null;
                policyNumber: string | null;
                clientName: string;
                paymentMethod: string;
                phoneNumber: string | null;
                cardNumber: string | null;
                expiryDate: string | null;
                cvv: string | null;
                billingPhone: string | null;
                transactionId: string | null;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
            })[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
    }>;
    getPaymentStats(): Promise<{
        success: boolean;
        data: {
            totalRevenue: number;
            monthlyRevenue: number;
            statusBreakdown: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PaymentGroupByOutputType, "status"[]> & {
                _count: number;
            })[];
        };
    }>;
    updatePaymentStatus(id: string, status: string): Promise<{
        success: boolean;
        data: {
            status: string;
            amount: number;
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            policyNumber: string | null;
            clientName: string;
            paymentMethod: string;
            phoneNumber: string | null;
            cardNumber: string | null;
            expiryDate: string | null;
            cvv: string | null;
            billingPhone: string | null;
            transactionId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    getNotifications(query: any): Promise<{
        success: boolean;
        data: {
            notifications: {
                id: number;
                createdAt: Date;
                adminId: number | null;
                entityId: string;
                entityType: string;
                note: string;
                isPrivate: boolean;
            }[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
    }>;
    createNotification(data: any): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            adminId: number | null;
            entityId: string;
            entityType: string;
            note: string;
            isPrivate: boolean;
        };
    }>;
    markNotificationRead(id: string): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            adminId: number | null;
            entityId: string;
            entityType: string;
            note: string;
            isPrivate: boolean;
        };
    }>;
    getAnalytics(query: any): Promise<{
        success: boolean;
        data: {
            period: any;
            userGrowth: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.UserGroupByOutputType, "createdAt"[]> & {
                _count: number;
            })[];
            paymentTrends: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PaymentGroupByOutputType, ("status" | "createdAt")[]> & {
                _count: number;
                _sum: {
                    amount: number | null;
                };
            })[];
            topProducts: {
                name: string;
                category: string;
            }[];
        };
    }>;
    getChartData(query: any): Promise<{
        type: string;
        data: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PaymentGroupByOutputType, "createdAt"[]> & {
            _sum: {
                amount: number | null;
            };
        })[];
    } | {
        type: string;
        data: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.UserGroupByOutputType, "createdAt"[]> & {
            _count: number;
        })[];
    } | {
        type: any;
        data: never[];
    }>;
    getSettings(): Promise<{
        success: boolean;
        data: {
            siteName: string;
            maintenanceMode: boolean;
            allowRegistration: boolean;
            emailNotifications: boolean;
            backupEnabled: boolean;
            maxFileSize: number;
            allowedFileTypes: string[];
            supportEmail: string;
            systemHealth: {
                database: string;
                email: string;
                storage: string;
            };
        };
    }>;
    updateSettings(data: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    exportUsers(query: any): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        }[];
        filename: string;
    }>;
    exportPayments(query: any): Promise<{
        success: boolean;
        data: ({
            user: {
                name: string;
                email: string;
            } | null;
        } & {
            status: string;
            amount: number;
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            policyNumber: string | null;
            clientName: string;
            paymentMethod: string;
            phoneNumber: string | null;
            cardNumber: string | null;
            expiryDate: string | null;
            cvv: string | null;
            billingPhone: string | null;
            transactionId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        filename: string;
    }>;
    getSystemHealth(): Promise<{
        success: boolean;
        data: {
            database: string;
            uptime: number;
            memory: NodeJS.MemoryUsage;
            timestamp: Date;
            error?: undefined;
        };
    } | {
        success: boolean;
        data: {
            database: string;
            error: any;
            timestamp: Date;
            uptime?: undefined;
            memory?: undefined;
        };
    }>;
}
