import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CategoriesResolver } from './categories.resolver';
import { CategoriesService } from './categories.service';

@Module({
  providers: [PrismaService, CategoriesService, CategoriesResolver],
  exports: [CategoriesService],
})
export class CategoriesModule {}
