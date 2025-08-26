import { PrismaService } from '../prisma/prisma.service';
import { DashboardService } from '../services/dashboard.service';
export declare class HealthController {
    private readonly prisma;
    private readonly dashboardService;
    constructor(prisma: PrismaService, dashboardService: DashboardService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        responseTime: string;
        services: {
            database: {
                status: string;
                connection: boolean;
                queries: boolean;
                url_configured: boolean;
            };
            application: {
                status: string;
                memory_usage: NodeJS.MemoryUsage;
                uptime: number;
            };
        };
        environment: string;
        version: string;
        deployment: {
            platform: string;
            tables_expected: string[];
        };
        error?: undefined;
    } | {
        status: string;
        timestamp: string;
        responseTime: string;
        error: string;
        services: {
            database: {
                status: string;
                connection?: undefined;
                queries?: undefined;
                url_configured?: undefined;
            };
            application: {
                status: string;
                memory_usage?: undefined;
                uptime?: undefined;
            };
        };
        environment?: undefined;
        version?: undefined;
        deployment?: undefined;
    }>;
    getDeepHealth(): Promise<{
        status: string;
        timestamp: string;
        responseTime: string;
        database: {
            status: string;
            tables: {
                users: any;
                claims: any;
                quotes: any;
                consultations: any;
                payments: any;
            };
        };
        performance: {
            fast: boolean;
            acceptable: boolean;
            slow: boolean;
        };
        error?: undefined;
    } | {
        status: string;
        error: string;
        timestamp: string;
        responseTime?: undefined;
        database?: undefined;
        performance?: undefined;
    }>;
}
