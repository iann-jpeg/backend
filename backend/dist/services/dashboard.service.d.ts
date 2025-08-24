import { AdminStatsQueryDto } from '../config/dashboard.dto';
export declare class DashboardService {
    getDashboardStats(query?: AdminStatsQueryDto): Promise<{
        totalClaims: number;
        totalQuotes: number;
        totalConsultations: number;
        totalOutsourcingRequests: number;
        totalPayments: number;
        totalDiasporaRequests: number;
        totalUsers: number;
        pendingClaims: number;
        activePolicies: number;
        monthlyRevenue: number;
        conversionRate: number;
        allSubmissions: {
            claims: ({
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
                createdAt: Date;
                updatedAt: Date;
                description: string;
                userId: number | null;
                policyNumber: string;
                claimType: string;
                incidentDate: Date;
                estimatedLoss: number;
                status: string;
                submitterEmail: string | null;
                submitterName: string | null;
                submitterPhone: string | null;
            })[];
            outsourcing: {
                id: number;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                userId: number | null;
                status: string;
                location: string;
                organizationName: string;
                coreFunctions: string | null;
                address: string | null;
                services: string[];
                natureOfOutsourcing: string;
                budgetRange: string;
            }[];
            consultations: {
                name: string;
                id: number;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                userId: number | null;
                status: string;
                phone: string;
                country: string | null;
                timezone: string | null;
                scheduledAt: Date | null;
                company: string | null;
                consultationDate: string;
                consultationTime: string;
                message: string;
                serviceType: string;
                duration: number | null;
                meetingLink: string | null;
                meetingType: string | null;
                notes: string | null;
            }[];
            payments: {
                id: number;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                userId: number | null;
                policyNumber: string | null;
                status: string;
                clientName: string;
                amount: number;
                paymentMethod: string;
                phoneNumber: string | null;
                cardNumber: string | null;
                expiryDate: string | null;
                cvv: string | null;
                billingPhone: string | null;
                transactionId: string | null;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
            }[];
            diaspora: {
                name: string;
                id: number;
                email: string;
                createdAt: Date;
                updatedAt: Date;
                userId: number | null;
                status: string;
                phone: string;
                country: string;
                timezone: string;
                scheduledAt: Date | null;
                serviceInterest: string;
            }[];
        };
        totalSubmissions: number;
        submissionsThisMonth: number;
    }>;
    getActivities(limit?: number): Promise<({
        type: string;
        id: number;
        createdAt: Date;
        policyNumber: string;
        claimType: string;
        estimatedLoss: number;
        status: string;
        submitterEmail: string | null;
        submitterName: string | null;
    } | {
        type: string;
        id: number;
        email: string;
        createdAt: Date;
        status: string;
        organizationName: string;
        services: string[];
        budgetRange: string;
    } | {
        type: string;
        name: string;
        id: number;
        email: string;
        createdAt: Date;
        status: string;
        consultationDate: string;
        serviceType: string;
    } | {
        type: string;
        id: number;
        createdAt: Date;
        status: string;
        clientName: string;
        amount: number;
        paymentMethod: string;
    } | {
        type: string;
        name: string;
        id: number;
        email: string;
        createdAt: Date;
        status: string;
        country: string;
    })[]>;
    getTopStats(): Promise<{
        thisMonthClaims: number;
        thisMonthOutsourcing: number;
        thisMonthConsultations: number;
        thisMonthPayments: number;
        totalRevenue: number;
    }>;
}
