import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

   async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ProductContents: {
          create: dto.contents,
        },
        categories: {
          create: dto.categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
      },
      include: {
        ProductContents: true,
        categories: {
          include: {
            category: {
              include: {
                CategoryContent: true,
              },
            },
          },
        },
      },
    });
  }
async search({
    name,
    description,
    minPrice,
    maxPrice,
  }: {
    name?: string;
    description?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    return this.prisma.$queryRaw`
      SELECT DISTINCT p.*
      FROM "Product" p
      JOIN "ProductContent" pc ON pc."productId" = p.id
      JOIN "ProductItem" pi ON pi."productId" = p.id
      JOIN "ProductItemPrice" pip ON pip."productItemId" = pi.id
      WHERE 
        (${name} IS NULL OR pc.name ILIKE '%' || ${name} || '%') AND
        (${description} IS NULL OR pc.description ILIKE '%' || ${description} || '%') AND
        (${minPrice} IS NULL OR pip.price >= ${minPrice}) AND
        (${maxPrice} IS NULL OR pip.price <= ${maxPrice});
    `;
  }
  // findAll() {
  //   return `This action returns all product`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} product`;
  // }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
