import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CategoriesService } from './categories.service';

@Module({
  providers: [PrismaService, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
