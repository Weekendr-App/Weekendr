import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { PrismaService } from 'src/common/services/prisma.service';
import { VenuesService } from 'src/venues/venues.service';
import { EventsResolver } from './events.resolver';
import { EventsService } from './events.service';

@Module({
  imports: [CategoriesModule],
  providers: [PrismaService, EventsService, VenuesService, EventsResolver],
})
export class EventsModule {}
