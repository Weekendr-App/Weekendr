import { Resolver, Query } from '@nestjs/graphql';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from './models/category.model';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }
}
