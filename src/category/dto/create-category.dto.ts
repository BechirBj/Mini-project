import { IsOptional, IsString, IsUUID, IsEnum, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

enum Language {
  AR = 'Arabic',
  EN = 'English',
  FR = 'French',
}

class CategoryContentDto {
  @IsEnum(Language)
  language: Language;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateCategoryDto {
  @IsOptional()
  @IsUUID()
  parentCategoryId?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryContentDto)
  contents: CategoryContentDto[];
}
