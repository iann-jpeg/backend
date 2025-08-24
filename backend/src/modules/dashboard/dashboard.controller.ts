import { Controller, Get, Query, Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Response } from 'express';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Query('realtime') realtime?: string) {
    // Always fetch fresh stats for real-time dashboard
    return this.dashboardService.getStats();
  }

  @Get('activities')
  async getActivities() {
    return this.dashboardService.getActivities();
  }

  @Get('export-pdf')
  async exportPDF(@Res() res: Response) {
    // TODO: Generate PDF and stream to response
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from('%PDF-1.4\n%...mock pdf...'));
  }
}
