import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';
import { RolesGuard } from '../middleware/roles.guard';
import { Roles } from '../middleware/roles.decorator';
import { DashboardService } from '../services/dashboard.service';
import { PdfService } from '../services/pdf.service';
import { AdminStatsQueryDto } from '../config/dashboard.dto';
import { BaseController } from './base.controller';
import { Response } from 'express';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class DashboardController extends BaseController {
  @Get('/admin/metrics')
  async getAdminMetrics(@Query() query: AdminStatsQueryDto) {
    try {
      const stats = await this.dashboardService.getDashboardStats(query);
      return this.handleSuccess(stats, 'Dashboard statistics retrieved successfully');
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        data: null
      };
    }
  }
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly pdfService: PdfService,
  ) {
    super();
  }

  @Get('stats')
  async getDashboardStats(@Query() query: AdminStatsQueryDto) {
    try {
      const stats = await this.dashboardService.getDashboardStats(query);
      return this.handleSuccess(stats, 'Dashboard statistics retrieved successfully');
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        data: null
      };
    }
  }

  @Get('activities')
  async getRecentActivities(@Query() query: any) {
    try {
      const { limit } = query;
      const activities = await this.dashboardService.getActivities(limit ? parseInt(limit.toString()) : 20);
      
      return {
        success: true,
        data: activities,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to fetch recent activities: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: null,
      };
    }
  }

  @Get('export-pdf')
  async exportDashboardPDF(@Res() res: Response) {
    try {
      const stats = await this.dashboardService.getDashboardStats({});
      await this.pdfService.generateDashboardReport(stats, res);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Failed to generate PDF report: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: null,
      });
    }
  }

  @Get('top-stats')
  async getTopStats() {
    try {
      const topStats = await this.dashboardService.getTopStats();
      return this.handleSuccess(topStats, 'Top statistics retrieved successfully');
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        data: null
      };
    }
  }
}
