import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findCategoryById(categoryId: number): Promise<Category> {
    return this.prisma.category.findUnique({
      where: { id: categoryId },
    });
  }

  async getAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany({ include: { events: true } });
  }
}
