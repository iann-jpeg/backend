import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsArray()
  features!: string[];

  @IsString()
  category!: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  features?: string[];

  @IsOptional()
  @IsString()
  category?: string;
}
