import { IsOptional, IsString, IsDateString } from 'class-validator';

export interface DashboardStatsDto {
  totalClaims: number;
  totalQuotes: number;
  totalConsultations: number;
  totalDiaspora: number;
  totalUsers: number;
  pendingClaims: number;
  pendingQuotes: number;
  monthlyRevenue?: number;
  conversionRate?: number;
  approvedClaims?: number;
  rejectedClaims?: number;
  approvedQuotes?: number;
  thisMonthClaims?: number;
  thisMonthQuotes?: number;
}

export class AdminStatsQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  period?: string; // daily, weekly, monthly, yearly
}
