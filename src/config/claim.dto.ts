import { IsString, IsNumber, IsDateString, IsArray, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateClaimDto {
  @IsString()
  policyNumber!: string;

  @IsString()
  claimType!: string;

  @IsDateString()
  incidentDate!: string;

  @IsNumber()
  estimatedLoss!: number;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  documents?: string[];

  @IsOptional()
  @IsString()
  documentPath?: string;
}

export class UpdateClaimDto {
  @IsOptional()
  @IsString()
  policyNumber?: string;

  @IsOptional()
  @IsString()
  claimType?: string;

  @IsOptional()
  @IsDateString()
  incidentDate?: string;

  @IsOptional()
  @IsNumber()
  estimatedLoss?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  documents?: string[];

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  submitterName?: string;

  @IsOptional()
  @IsEmail()
  submitterEmail?: string;

  @IsOptional()
  @IsString()
  submitterPhone?: string;
}
