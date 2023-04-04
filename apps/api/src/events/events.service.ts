import { Injectable } from '@nestjs/common';
import { EventStatus } from '@prisma/client';
import { format } from 'date-fns';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateEventInput } from './dto/create-event.input';
import { Event } from './models/event.model';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEventInput): Promise<Event> {
    return this.prisma.event.create({
      include: { venue: { include: { owner: true } } },
      data: {
        ...data,
        status: EventStatus.PUBLISHED,
      },
    });
  }

  async findById(eventId: number): Promise<Event> {
    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: { venue: { include: { owner: true } } },
    });
  }

  async findAllByVenueId(venueId: number): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { venueId },
      include: { venue: { include: { owner: true } } },
    });
  }

  async findInRange(start: Date, end: Date, venueId: number): Promise<Event[]> {
    const startDate = format(start, 'yyyy-MM-dd HH:mm:ss');
    const endDate = format(end, 'yyyy-MM-dd HH:mm:ss');

    const id = await this.prisma.$queryRaw<{ id: Event['id'] }[]>`
      SELECT id FROM "Event" WHERE
      "venueId" = ${venueId} AND
      "status" = 'PUBLISHED' AND
      tsrange("startDate", "endDate") && tsrange(
        TO_DATE(${startDate}, 'YYYY-MM-DD HH24:MI:SS'),
        TO_DATE(${endDate}, 'YYYY-MM-DD HH24:MI:SS')
      )
    `;

    return this.prisma.event.findMany({
      where: {
        id: {
          in: id.map((i) => i.id),
        },
      },
      include: { venue: { include: { owner: true } } },
    });
  }

  async cancelEvent(eventId: number): Promise<Event> {
    return this.prisma.event.update({
      where: { id: eventId },
      include: { venue: { include: { owner: true } } },
      data: { status: EventStatus.CANCELLED },
    });
  }
}
