import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../admin/admin.guard';
import { AdminService } from '../services/admin.service';
import { BaseController } from './base.controller';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController extends BaseController {
  constructor(private readonly adminService: AdminService) {
    super();
  }

  // ============= QUOTES MANAGEMENT =============
  @Get('quotes')
  async getAllQuotes(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    try {
      const result = await this.adminService.getAllQuotes(+page, +limit, status, search);
      return this.handleSuccess(result.data, result.success ? 'Quotes retrieved successfully' : result.message);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('quotes/:id')
  async getQuoteById(@Param('id') id: string) {
    try {
      const result = await this.adminService.getQuoteById(+id);
      if (!result.success) {
        return this.handleError(new Error(result.error));
      }
      return this.handleSuccess(result.data, 'Quote retrieved successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Put('quotes/:id/status')
  async updateQuoteStatus(@Param('id') id: string, @Body('status') status: string) {
    try {
      const result = await this.adminService.updateQuoteStatus(+id, status);
      if (!result.success) {
        return this.handleError(new Error(result.error));
      }
      return this.handleSuccess(result.data, result.message);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete('quotes/:id')
  async deleteQuote(@Param('id') id: string) {
    try {
      const result = await this.adminService.deleteQuote(+id);
      if (!result.success) {
        return this.handleError(new Error(result.error));
      }
      return this.handleSuccess(null, result.message);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('quotes/export/:format')
  async exportQuotes(@Param('format') format: string) {
    try {
      const result = await this.adminService.exportQuotesData(format as 'csv' | 'json');
      if (!result.success) {
        return this.handleError(new Error(result.error || 'Export failed'));
      }
      return this.handleSuccess(result.data, result.message);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ============= DASHBOARD STATS =============
  @Get('dashboard/comprehensive')
  async getComprehensiveStats() {
    try {
      const result = await this.adminService.getDashboardData();
      return this.handleSuccess(result.data, 'Dashboard stats retrieved successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ============= SYSTEM HEALTH =============
  @Get('health')
  async getSystemHealth() {
    try {
      const result = await this.adminService.getSystemHealth();
      return this.handleSuccess(result, 'System health retrieved successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }
}