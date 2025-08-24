import { AdminService } from '../services/admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        success: boolean;
        data: {
            stats: {
                totalUsers: any;
                totalClaims: any;
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
    getDashboardStats(): Promise<{
        success: boolean;
        data: {
            stats: {
                totalUsers: any;
                totalClaims: any;
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
    getUsers(query: any): Promise<{
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
            users: {
                id: number;
                name: string;
                email: string;
                role: string;
                createdAt: string;
                updatedAt: string;
                _count: {
                    payments: number;
                    claims: number;
                };
            }[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
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
    updateUser(id: string, data: any): Promise<{
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
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
}
