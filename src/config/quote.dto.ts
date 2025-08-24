import { IsString, IsEmail, IsArray, IsOptional } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsString()
  product!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsString()
  coverage?: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsString()
  contactMethod!: string;

  @IsOptional()
  @IsString()
  bestTime?: string;

  @IsOptional()
  @IsString()
  documentPath?: string;
}

export class UpdateQuoteDto {
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
  @IsString()
  product?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsString()
  coverage?: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  contactMethod?: string;

  @IsOptional()
  @IsString()
  bestTime?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
