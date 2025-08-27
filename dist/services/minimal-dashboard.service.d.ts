import { PrismaService } from '../prisma/prisma.service';
export declare class MinimalDashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getMinimalStats(): Promise<{
        status: string;
        totalUsers: number;
        totalClaims: number;
        totalQuotes: number;
        totalConsultations: number;
        totalDiaspora: number;
        totalDocuments: number;
        totalProducts: number;
        message: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: string;
        timestamp: string;
        totalUsers?: undefined;
        totalClaims?: undefined;
        totalQuotes?: undefined;
        totalConsultations?: undefined;
        totalDiaspora?: undefined;
        totalDocuments?: undefined;
        totalProducts?: undefined;
    }>;
}
