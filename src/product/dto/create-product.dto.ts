import { IsArray, IsOptional, IsString, IsUUID, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Language } from '@prisma/client';

class ProductContentDto {
  @IsEnum(Language)
  language: Language;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  details?: string;
}

export class CreateProductDto {
  @IsArray()
  categoryIds: string[]; 

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductContentDto)
  contents: ProductContentDto[];
}
