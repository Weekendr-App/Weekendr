import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { Event } from './models/event.model';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByVenueId(venueId: number): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { venueId },
      include: { venue: true },
    });
  }
}
