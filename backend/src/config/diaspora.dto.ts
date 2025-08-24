import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateDiasporaDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsString()
  country!: string;

  @IsString()
  timezone!: string;

  @IsString()
  serviceInterest!: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;
}

export class UpdateDiasporaDto {
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
  country?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  serviceInterest?: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
