import { IsString, IsEmail, IsArray, IsOptional, IsNotEmpty, IsIn } from 'class-validator';

export class CreateOutsourcingRequestDto {
  @IsNotEmpty()
  @IsString()
  organizationName!: string;

  @IsOptional()
  @IsString()
  companySize?: string;

  @IsNotEmpty()
  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsArray()
  services!: string[];

  @IsOptional()
  @IsString()
  natureOfOutsourcing!: string;

  @IsOptional()
  @IsString()
  budgetRange!: string;
}

export class UpdateOutsourcingRequestDto {
  @IsOptional()
  @IsString()
  organizationName?: string;

  @IsOptional()
  @IsString()
  coreFunctions?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  services?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['full', 'partial', 'on-demand'])
  natureOfOutsourcing?: string;

  @IsOptional()
  @IsString()
  budgetRange?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'in_progress', 'completed', 'cancelled'])
  status?: string;
}
