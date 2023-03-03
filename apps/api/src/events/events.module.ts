import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { VenuesService } from 'src/venues/venues.service';
import { EventsResolver } from './events.resolver';
import { EventsService } from './events.service';

@Module({
  providers: [PrismaService, EventsService, VenuesService, EventsResolver],
})
export class EventsModule {}
