import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductItemDto } from './dto/create-product-item.dto';

@Injectable()
export class ProductItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductItemDto) {
    return this.prisma.productItem.create({
      data: {
        barcode: dto.barcode,
        reference: dto.reference,
        image: dto.image,
        online: dto.online,
        product: {
          connect: { id: dto.productId },
        },
        productItemPrices: {
          create: dto.prices.map((p) => ({
            currency: p.currency,
            price: p.price,
          })),
        },
        ProductItemVariations: {
          create: dto.variations.map((variation) => ({
            ProductItemVariationContents: {
              create: variation.contents.map((content) => ({
                name: content.name,
                value: content.value,
                language: content.language,
              })),
            },
          })),
        },
      },
      include: {
        productItemPrices: true,
        ProductItemVariations: {
          include: {
            ProductItemVariationContents: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.productItem.findMany({
      include: {
        productItemPrices: true,
        ProductItemVariations: {
          include: {
            ProductItemVariationContents: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.productItem.findUnique({
      where: { id },
      include: {
        productItemPrices: true,
        ProductItemVariations: {
          include: {
            ProductItemVariationContents: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.productItem.delete({
      where: { id },
    });
  }
}
