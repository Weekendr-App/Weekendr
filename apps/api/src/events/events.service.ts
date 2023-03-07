import { Injectable } from '@nestjs/common';
import { EventStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateEventInput } from './dto/create-event.input';
import { Event } from './models/event.model';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEventInput): Promise<Event> {
    return this.prisma.event.create({
      include: { venue: true },
      data: {
        ...data,
        status: EventStatus.PUBLISHED,
      },
    });
  }

  async findById(eventId: number): Promise<Event> {
    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: { venue: true },
    });
  }

  async findAllByVenueId(venueId: number): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { venueId },
      include: { venue: true },
    });
  }

  async cancelEvent(eventId: number): Promise<Event> {
    return this.prisma.event.update({
      where: { id: eventId },
      include: { venue: true },
      data: { status: EventStatus.CANCELLED },
    });
  }
}
