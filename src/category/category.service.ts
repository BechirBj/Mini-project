import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        parentCategoryId: dto.parentCategoryId,
        image: dto.image,
        CategoryContent: {
          create: dto.contents.map((content) => ({
            ...content,
          })),
        },
      },
      include: {
        CategoryContent: true,
      },
    });
  }
  async findAll() {
    return this.prisma.category.findMany({
      include:{
                CategoryContent:true,
        subcategories:true,
        parentCategory:true

      }
    });
  }

  async findOne(id: string) {
    return await this.prisma.category.findUnique({
      where: {id:id},
      include:{
        CategoryContent:true,
        subcategories:true,
        parentCategory:true
      }
    })
   
  }
   async update(id: string, data: UpdateCategoryDto) {
    const { contents, ...categoryData } = data;
    return this.prisma.category.update({
      where: { id },
      data: {
        ...categoryData,
        CategoryContent: {
          deleteMany: {},
          create: contents,
        },
      },
      include: { CategoryContent: true },
    });
  }
  async remove(id: string) {
    await this.prisma.category.delete({ where: { id } }); 
    return true;
  }
}
