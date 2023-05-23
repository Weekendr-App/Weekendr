import { Injectable } from '@nestjs/common';
import { EventStatus, Prisma, Role, VenueStatus } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { User } from 'src/user/models/user.model';
import { GetVenuesInRangeInput } from './dto/get-venues-in-range.input';
import { Venue, VenueInRange } from './models/venue.model';

@Injectable()
export class VenuesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.VenueCreateInput): Promise<Venue> {
    return this.prisma.venue.create({
      data,
      include: {
        owner: true,
      },
    });
  }

  async findById(id: number, user?: User): Promise<Venue> {
    const venue = await this.prisma.venue.findFirst({
      where: { id, deletedAt: null },
      include: { owner: true },
    });

    if (!venue) {
      return null;
    }

    const isOwnedByMe = user?.id === venue.owner.id;
    const canView =
      isOwnedByMe ||
      venue.status === VenueStatus.ACTIVE ||
      user?.role === Role.MODERATOR;

    if (!canView) {
      return null;
    }

    return {
      ...venue,
      isOwnedByMe,
    };
  }

  async findByOwnerId(id: string): Promise<Venue[]> {
    return this.prisma.venue.findMany({
      where: { deletedAt: null, owner: { id } },
      include: {
        owner: true,
      },
    });
  }

  async update(
    id: number,
    data: Prisma.VenueUpdateInput,
  ): Promise<Omit<Venue, 'events'>> {
    return this.prisma.venue.update({
      where: { id },
      data,
      include: {
        owner: true,
      },
    });
  }

  async delete(id: number): Promise<Omit<Venue, 'events' | 'owner'>> {
    return this.prisma.venue.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findAllInRange(
    data: GetVenuesInRangeInput,
    user?: User,
    categoryId?: number,
  ): Promise<VenueInRange[]> {
    const { bounds } = data;
    const { _sw, _ne } = bounds;

    const xmin = _sw.lng;
    const ymin = _sw.lat;
    const xmax = _ne.lng;
    const ymax = _ne.lat;

    const id = await this.prisma.$queryRaw<{ id: Venue['id'] }[]>`
      SELECT id FROM "Venue" WHERE "deletedAt" IS NULL AND ST_Within(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326), ST_MakeEnvelope(${xmin}, ${ymin}, ${xmax}, ${ymax}, 4326))`;

    const query = {
      where: {
        id: { in: id.map((v) => v.id) },
        status: VenueStatus.ACTIVE,
      },
      include: {
        events: {
          include: {
            category: true,
          },
          orderBy: {
            startDate: Prisma.SortOrder.asc,
          },
          where: {
            endDate: { gte: new Date() },
            status: EventStatus.PUBLISHED,
          },
          take: 1,
        },
        owner: true,
      },
    };

    if (categoryId) {
      query.where['events'] = {
        some: {
          AND: [
            {
              category: { id: categoryId },
            },
            {
              endDate: { gte: new Date() },
            },
          ],
        },
      };
    }

    const venues = await this.prisma.venue.findMany(query);
    return venues.map((venue) => ({
      ...venue,
      isOwnedByMe: user?.id === venue.owner.id,
    }));
  }

  async getDraftVenues(): Promise<Venue[]> {
    return this.prisma.venue.findMany({
      include: { owner: true },
      where: { status: VenueStatus.DRAFT },
    });
  }
}
