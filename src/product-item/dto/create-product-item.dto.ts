import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Currency, Language } from '@prisma/client';

class PriceDto {
  @IsEnum(Currency)
  currency: Currency;

  @IsNumber()
  price: number;
}

class VariationContentDto {
  @IsEnum(Language)
  language: Language;

  @IsString()
  name: string;

  @IsString()
  value: string;
}

class VariationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationContentDto)
  contents: VariationContentDto[];
}

export class CreateProductItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  barcode: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  online?: boolean = true;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceDto)
  prices: PriceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationDto)
  variations: VariationDto[];
}
