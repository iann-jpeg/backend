import { Module } from '@nestjs/common';
import { DashboardController } from '../controllers/dashboard.controller';
import { DashboardService } from '../services/dashboard.service';
import { PdfService } from '../services/pdf.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, PdfService],
  exports: [DashboardService, PdfService],
})
export class DashboardModule {}
