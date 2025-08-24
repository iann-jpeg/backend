import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    private metricsCache;
    private metricsCacheExpiry;
    constructor(prisma: PrismaService);
    getDashboardData(): Promise<{
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
                id: string;
                type: string;
                action: string;
                description: string;
                user: {
                    name: string;
                    email: string;
                } | null;
                timestamp: Date;
            }[];
        };
    }>;
    getComprehensiveDashboardStats(): Promise<{
        success: boolean;
        data: {
            totalUsers: number;
            totalClaims: number;
            totalQuotes: number;
            totalConsultations: number;
            totalOutsourcingRequests: number;
            totalPayments: number;
            totalDiasporaRequests: number;
            pendingClaims: number;
            pendingConsultations: number;
            activePolicies: number;
            monthlyRevenue: number;
            totalRevenue: number;
            avgPaymentAmount: number;
            conversionRate: number;
            userGrowthRate: number;
            claimGrowthRate: number;
            quoteGrowthRate: number;
            consultationGrowthRate: number;
            revenueGrowthRate: number;
            totalSubmissions: number;
            allSubmissions: {
                claims: {
                    id: number;
                    policyNumber: string;
                    clientEmail: string;
                    incidentType: string;
                    claimAmount: number;
                    status: string;
                    createdAt: Date;
                }[];
                consultations: {
                    id: number;
                    fullName: string;
                    email: string;
                    serviceType: string;
                    preferredDate: Date | null;
                    status: string;
                    createdAt: Date;
                }[];
                outsourcing: {
                    id: number;
                    companyName: string;
                    contactEmail: string;
                    serviceType: string;
                    budgetRange: string;
                    status: string;
                    createdAt: Date;
                }[];
                payments: {
                    id: number;
                    policyNumber: string;
                    clientEmail: string;
                    amount: number;
                    paymentMethod: string;
                    status: string;
                    createdAt: Date;
                }[];
                diaspora: {
                    id: number;
                    fullName: string;
                    email: string;
                    currentCountry: string;
                    serviceType: string;
                    status: string;
                    createdAt: Date;
                }[];
            };
            generatedAt: string;
            isRealTime: boolean;
            isMockData?: undefined;
        };
        message?: undefined;
    } | {
        success: boolean;
        data: {
            totalUsers: number;
            totalClaims: number;
            totalQuotes: number;
            totalConsultations: number;
            totalOutsourcingRequests: number;
            totalPayments: number;
            totalDiasporaRequests: number;
            pendingClaims: number;
            pendingConsultations: number;
            activePolicies: number;
            monthlyRevenue: number;
            totalRevenue: number;
            avgPaymentAmount: number;
            conversionRate: number;
            userGrowthRate: number;
            claimGrowthRate: number;
            quoteGrowthRate: number;
            consultationGrowthRate: number;
            revenueGrowthRate: number;
            totalSubmissions: number;
            allSubmissions: {
                claims: never[];
                consultations: never[];
                outsourcing: never[];
                payments: never[];
                diaspora: never[];
            };
            generatedAt: string;
            isRealTime: boolean;
            isMockData: boolean;
        };
        message: string;
    }>;
    getSystemHealth(): Promise<{
        success: boolean;
        data: {
            status: string;
            database: string;
            timestamp: string;
            uptime: number;
            error?: undefined;
        };
    } | {
        success: boolean;
        data: {
            status: string;
            database: string;
            timestamp: string;
            error: any;
            uptime?: undefined;
        };
    }>;
    getSystemMetrics(): Promise<any>;
    getRecentActivities(limit?: number): Promise<{
        success: boolean;
        data: {
            id: string;
            type: string;
            action: string;
            description: string;
            user: {
                name: string;
                email: string;
            } | null;
            timestamp: Date;
        }[];
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getAllUsers(page?: number, limit?: number): Promise<{
        success: boolean;
        data: {
            users: {
                role: import(".prisma/client").$Enums.Role;
                _count: {
                    claims: number;
                    quotes: number;
                };
                id: number;
                name: string;
                email: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
            };
        };
        message?: undefined;
    } | {
        success: boolean;
        data: {
            users: never[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
            };
        };
        message: string;
    }>;
    getUserStats(): Promise<{
        success: boolean;
        data: {
            total: number;
            admins: number;
            regular: number;
            recentSignups: number;
            byRole: {
                role: import(".prisma/client").$Enums.Role;
                count: number;
            }[];
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    updateUserStatus(userId: number, status: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            role: import(".prisma/client").$Enums.Role;
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    deleteUser(userId: number): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
    getAllClaims(page?: number, limit?: number, status?: string, search?: string): Promise<{
        success: boolean;
        data: {
            claims: ({
                user: {
                    id: number;
                    name: string;
                    email: string;
                } | null;
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: string;
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
                pages: number;
                totalPages: number;
            };
        };
        message?: undefined;
    } | {
        success: boolean;
        data: {
            claims: never[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
                totalPages: number;
            };
        };
        message: string;
    }>;
    getClaimsStats(): Promise<{
        success: boolean;
        data: {
            total: number;
            pending: number;
            approved: number;
            rejected: number;
            thisMonth: number;
            approvalRate: number;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    updateClaimStatus(claimId: number, status: string, adminId?: number): Promise<{
        success: boolean;
        data: {
            user: {
                id: number;
                name: string;
                email: string;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: string;
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
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getClaimById(claimId: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: string;
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
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    downloadDocumentById(documentId: number, res: any): Promise<void>;
    private getMockDocumentById;
    getAllConsultations(page?: number, limit?: number, status?: string, search?: string): Promise<{
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
                id: number;
                name: string;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                message: string;
                status: string;
                userId: number | null;
                phone: string;
                country: string | null;
                timezone: string | null;
                scheduledAt: Date | null;
                company: string | null;
                consultationDate: string;
                consultationTime: string;
                serviceType: string;
                duration: number | null;
                meetingLink: string | null;
                meetingType: string | null;
                notes: string | null;
            })[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
        message?: undefined;
    } | {
        success: boolean;
        data: {
            consultations: never[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
        message: string;
    }>;
    getConsultationById(consultationId: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            user: {
                id: number;
                name: string;
                email: string;
                profile: {
                    phone: string | null;
                } | null;
            } | null;
        } & {
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            message: string;
            status: string;
            userId: number | null;
            phone: string;
            country: string | null;
            timezone: string | null;
            scheduledAt: Date | null;
            company: string | null;
            consultationDate: string;
            consultationTime: string;
            serviceType: string;
            duration: number | null;
            meetingLink: string | null;
            meetingType: string | null;
            notes: string | null;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    updateConsultationStatus(consultationId: number, status: string, adminId?: number): Promise<{
        success: boolean;
        data: {
            user: {
                id: number;
                name: string;
                email: string;
            } | null;
        } & {
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            message: string;
            status: string;
            userId: number | null;
            phone: string;
            country: string | null;
            timezone: string | null;
            scheduledAt: Date | null;
            company: string | null;
            consultationDate: string;
            consultationTime: string;
            serviceType: string;
            duration: number | null;
            meetingLink: string | null;
            meetingType: string | null;
            notes: string | null;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    scheduleMeeting(consultationId: number, meetingData: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            consultation: {
                user: {
                    id: number;
                    name: string;
                    email: string;
                    profile: {
                        phone: string | null;
                    } | null;
                } | null;
            } & {
                id: number;
                name: string;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                message: string;
                status: string;
                userId: number | null;
                phone: string;
                country: string | null;
                timezone: string | null;
                scheduledAt: Date | null;
                company: string | null;
                consultationDate: string;
                consultationTime: string;
                serviceType: string;
                duration: number | null;
                meetingLink: string | null;
                meetingType: string | null;
                notes: string | null;
            };
            meetingDetails: {
                date: any;
                time: any;
                type: any;
                link: any;
                duration: any;
                notes: any;
            };
            client: {
                id: number;
                name: string;
                email: string;
                profile: {
                    phone: string | null;
                } | null;
            } | null;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    sendWhatsAppMeetingDetails(consultationId: number, data: {
        message?: string;
        includeLink?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            recipient: string;
            phone: string;
            message: string;
            sentAt: string;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getAllQuotes(page?: number, limit?: number, status?: string, search?: string): Promise<{
        success: boolean;
        data: {
            quotes: ({
                user: {
                    id: number;
                    name: string;
                    email: string;
                } | null;
            } & {
                id: number;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                userId: number | null;
                firstName: string;
                lastName: string;
                phone: string;
                location: string | null;
                product: string;
                budget: string | null;
                coverage: string | null;
                details: string | null;
                contactMethod: string;
                bestTime: string | null;
            })[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
                totalPages: number;
            };
        };
        message?: undefined;
    } | {
        success: boolean;
        data: {
            quotes: never[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
                totalPages: number;
            };
        };
        message: string;
    }>;
    getQuoteById(id: number): Promise<{
        success: boolean;
        data: {
            user: {
                id: number;
                name: string;
                email: string;
            } | null;
            documents: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                filename: string;
                originalName: string;
                mimeType: string;
                size: number;
                path: string;
                claimId: number | null;
                quoteId: number | null;
                content: Uint8Array | null;
                outsourcingId: number | null;
            }[];
        } & {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: number | null;
            firstName: string;
            lastName: string;
            phone: string;
            location: string | null;
            product: string;
            budget: string | null;
            coverage: string | null;
            details: string | null;
            contactMethod: string;
            bestTime: string | null;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    updateQuoteStatus(id: number, status: string): Promise<{
        success: boolean;
        data: {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: number | null;
            firstName: string;
            lastName: string;
            phone: string;
            location: string | null;
            product: string;
            budget: string | null;
            coverage: string | null;
            details: string | null;
            contactMethod: string;
            bestTime: string | null;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        message?: undefined;
    }>;
    getAllDiasporaRequests(page?: number, limit?: number, status?: string, search?: string): Promise<{
        success: boolean;
        data: {
            diasporaRequests: ({
                user: {
                    id: number;
                    name: string;
                    email: string;
                } | null;
            } & {
                id: number;
                name: string;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                userId: number | null;
                phone: string;
                country: string;
                timezone: string;
                scheduledAt: Date | null;
                serviceInterest: string;
            })[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
                totalPages: number;
            };
        };
        message?: undefined;
    } | {
        success: boolean;
        data: {
            diasporaRequests: never[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
                totalPages: number;
            };
        };
        message: string;
    }>;
    getDiasporaRequestById(id: number): Promise<{
        success: boolean;
        data: {
            user: {
                id: number;
                name: string;
                email: string;
            } | null;
        } & {
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: number | null;
            phone: string;
            country: string;
            timezone: string;
            scheduledAt: Date | null;
            serviceInterest: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    updateDiasporaRequestStatus(id: number, status: string): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: number | null;
            phone: string;
            country: string;
            timezone: string;
            scheduledAt: Date | null;
            serviceInterest: string;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        message?: undefined;
    }>;
    getContentStats(): Promise<{
        success: boolean;
        data: {
            users: number;
            claims: number;
            quotes: number;
            consultations: number;
            outsourcing: number;
            resources: number;
            payments: number;
            total: number;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    generateReport(type: string, dateRange?: {
        from?: string;
        to?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            type: "claims" | "quotes" | "users";
            dateRange: {
                from: Date;
                to: Date;
            };
            count: any;
            records: any;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getNotifications(): Promise<{
        success: boolean;
        data: {
            notifications: never[];
            totalCount: number;
            unreadCount: number;
        };
        message?: undefined;
    } | {
        success: boolean;
        data: {
            notifications: never[];
            totalCount: number;
            unreadCount: number;
        };
        message: string;
    }>;
    getAnalytics(period?: string): Promise<{
        success: boolean;
        data: {
            period: string;
            userGrowth: {
                date: any;
                users: number;
            }[];
            paymentTrends: {
                date: any;
                amount: number;
                count: number;
            }[];
            topProducts: {
                name: any;
                category: string;
                sales: number;
            }[];
            conversionData: {
                rate: number;
                change: number;
            };
            generatedAt: string;
            isRealTime: boolean;
        };
        isMockData?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: {
            period: string;
            userGrowth: {
                date: string;
                users: number;
            }[];
            paymentTrends: {
                date: string;
                amount: number;
            }[];
            topProducts: {
                name: string;
                category: string;
                sales: number;
            }[];
            conversionData: {
                rate: number;
                change: number;
            };
            generatedAt: string;
            isRealTime: boolean;
        };
        isMockData: boolean;
        message: string;
    }>;
    private getPeriodDays;
    private getUserGrowthData;
    private getPaymentTrendsData;
    private getTopProductsData;
    private getConversionData;
    getAllPayments(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        data: {
            payments: ({
                user: {
                    id: number;
                    name: string;
                    email: string;
                } | null;
            } & {
                id: number;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                amount: number;
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
                currentPage: number;
                totalPages: number;
                totalItems: number;
                itemsPerPage: number;
            };
        };
        message?: undefined;
    } | {
        success: boolean;
        data: {
            payments: never[];
            pagination: {
                currentPage: number;
                totalPages: number;
                totalItems: number;
                itemsPerPage: number;
            };
        };
        message: string;
    }>;
    getPaymentStats(): Promise<{
        success: boolean;
        data: {
            totalRevenue: number;
            monthlyRevenue: number;
            totalPayments: number;
            monthlyPayments: number;
            avgPaymentAmount: number;
            generatedAt: string;
        };
        isMockData?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: {
            totalRevenue: number;
            monthlyRevenue: number;
            totalPayments: number;
            monthlyPayments: number;
            avgPaymentAmount: number;
            generatedAt: string;
        };
        isMockData: boolean;
        message: string;
    }>;
    exportData(dataType: string, format?: string, limit?: number, skip?: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            format: string;
            records: any;
            count: any;
            note: string;
            exportedAt?: undefined;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            format: string;
            records: any;
            count: any;
            exportedAt: string;
            note?: undefined;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getAllOutsourcingRequests(page?: number, limit?: number, status?: string, search?: string): Promise<{
        success: boolean;
        data: {
            outsourcingRequests: ({
                user: {
                    id: number;
                    name: string;
                    email: string;
                } | null;
            } & {
                id: number;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                userId: number | null;
                location: string;
                organizationName: string;
                coreFunctions: string | null;
                address: string | null;
                services: string[];
                natureOfOutsourcing: string;
                budgetRange: string;
            })[];
            totalCount: number;
            totalPages: number;
            currentPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getOutsourcingRequestById(id: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        data: {
            user: {
                id: number;
                name: string;
                email: string;
            } | null;
        } & {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: number | null;
            location: string;
            organizationName: string;
            coreFunctions: string | null;
            address: string | null;
            services: string[];
            natureOfOutsourcing: string;
            budgetRange: string;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    updateOutsourcingRequestStatus(id: number, status: string, notes?: string): Promise<{
        success: boolean;
        data: {
            user: {
                id: number;
                name: string;
                email: string;
            } | null;
        } & {
            id: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: number | null;
            location: string;
            organizationName: string;
            coreFunctions: string | null;
            address: string | null;
            services: string[];
            natureOfOutsourcing: string;
            budgetRange: string;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getOutsourcingStats(): Promise<{
        success: boolean;
        data: {
            totalCount: number;
            monthlyCount: number;
            statusStats: Record<string, number>;
            generatedAt: string;
        };
        message?: undefined;
    } | {
        success: boolean;
        data: {
            totalCount: number;
            monthlyCount: number;
            statusStats: {};
            generatedAt: string;
        };
        message: string;
    }>;
    getSystemSettings(): Promise<{
        success: boolean;
        data: {
            siteName: string;
            supportEmail: string;
            maintenanceMode: boolean;
            allowRegistration: boolean;
            emailNotifications: boolean;
            maxFileSize: number;
            allowedFileTypes: string[];
            backupEnabled: boolean;
            autoBackupInterval: string;
            sessionTimeout: number;
            twoFactorRequired: boolean;
            passwordMinLength: number;
            systemHealth: {
                database: string;
                email: string;
                storage: string;
                api: string;
                realtime: string;
            };
            lastUpdated: string;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    updateSystemSettings(settings: any): Promise<{
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    testEmailSettings(testEmail?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            recipient: string;
            sentAt: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    testNotifications(): Promise<{
        success: boolean;
        message: string;
        data: {
            testedAt: string;
            notifications: {
                type: string;
                message: string;
            }[];
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    createSystemBackup(): Promise<{
        success: boolean;
        data: {
            backupId: string;
            createdAt: string;
            size: string;
            type: string;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    restoreSystemBackup(backupId: string): Promise<{
        success: boolean;
        data: {
            backupId: string;
            restoredAt: string;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    listBackups(): Promise<{
        success: boolean;
        data: {
            backups: {
                id: string;
                name: string;
                createdAt: string;
                size: string;
                type: string;
            }[];
            totalCount: number;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    clearSystemCache(): Promise<{
        success: boolean;
        data: {
            clearedAt: string;
            cacheSize: string;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    restartServices(): Promise<{
        success: boolean;
        data: {
            restartedAt: string;
            services: string[];
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getSystemStatus(): Promise<{
        success: boolean;
        data: {
            uptime: string;
            lastRestart: string;
            systemLoad: string;
            memoryUsage: string;
            diskUsage: string;
            activeConnections: number;
            health: {
                database: string;
                email: string;
                storage: string;
                api: string;
                realtime: string;
            };
            timestamp: string;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    setMaintenanceMode(enabled: boolean): Promise<{
        success: boolean;
        data: {
            maintenanceMode: boolean;
            updatedAt: string;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    private getSystemHealthStatus;
}
