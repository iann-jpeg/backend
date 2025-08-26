import { AdminStatsQueryDto } from '../config/dashboard.dto';
export declare class DashboardService {
    getDashboardStats(query?: AdminStatsQueryDto): Promise<{
        totalClaims: any;
        totalQuotes: any;
        totalConsultations: any;
        totalOutsourcingRequests: any;
        totalPayments: any;
        totalDiasporaRequests: any;
        totalUsers: any;
        pendingClaims: any;
        activePolicies: any;
        monthlyRevenue: number;
        conversionRate: number;
        allSubmissions: {
            claims: any;
            outsourcing: any;
            consultations: any;
            payments: any;
            diaspora: any;
        };
        totalSubmissions: any;
        submissionsThisMonth: any;
    }>;
    getActivities(limit?: number): Promise<any[]>;
    getTopStats(): Promise<{
        thisMonthClaims: any;
        thisMonthOutsourcing: any;
        thisMonthConsultations: any;
        thisMonthPayments: any;
        totalRevenue: any;
    }>;
}
