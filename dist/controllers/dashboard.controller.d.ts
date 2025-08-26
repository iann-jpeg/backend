import { DashboardService } from '../services/dashboard.service';
import { PdfService } from '../services/pdf.service';
import { AdminStatsQueryDto } from '../config/dashboard.dto';
import { BaseController } from './base.controller';
import { Response } from 'express';
export declare class DashboardController extends BaseController {
    private readonly dashboardService;
    private readonly pdfService;
    getAdminMetrics(query: AdminStatsQueryDto): Promise<{
        success: boolean;
        message: string | undefined;
        data: any;
        timestamp: string;
    } | {
        success: boolean;
        message: string;
        data: null;
    }>;
    constructor(dashboardService: DashboardService, pdfService: PdfService);
    getDashboardStats(query: AdminStatsQueryDto): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
        isRealTime: boolean;
    } | {
        success: boolean;
        message: string;
        data: null;
        isRealTime: boolean;
    }>;
    getRecentActivities(query: any): Promise<{
        success: boolean;
        data: any[];
        message: string;
        isRealTime: boolean;
    }>;
    exportDashboardPDF(res: Response): Promise<void>;
    getTopStats(): Promise<{
        success: boolean;
        message: string | undefined;
        data: any;
        timestamp: string;
    } | {
        success: boolean;
        message: string;
        data: null;
    }>;
}
