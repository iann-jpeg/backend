import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateConsultationDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsString()
  serviceType!: string;

  @IsString()
  consultationDate!: string;

  @IsString()
  consultationTime!: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}

export class UpdateConsultationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsString()
  consultationDate?: string;

  @IsOptional()
  @IsString()
  consultationTime?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
