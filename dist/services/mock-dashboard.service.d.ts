export declare class MockDashboardService {
    getDashboardStats(filters?: any): Promise<{
        totalUsers: number;
        totalClaims: number;
        totalQuotes: number;
        totalConsultations: number;
        totalPayments: number;
        monthlyRevenue: number;
        recentActivity: never[];
        mockData: boolean;
        warning: string;
    }>;
    getAnalytics(): Promise<{
        userGrowth: never[];
        revenueGrowth: never[];
        claimStats: never[];
        mockData: boolean;
    }>;
    getRecentActivity(): Promise<{
        activities: never[];
        mockData: boolean;
    }>;
}
