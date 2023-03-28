import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { User } from 'src/user/models/user.model';
import { GetVenuesInRangeInput } from './dto/get-venues-in-range.input';
import { Venue } from './models/venue.model';

@Injectable()
export class VenuesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.VenueCreateInput): Promise<Omit<Venue, 'events'>> {
    return this.prisma.venue.create({
      data,
    });
  }

  async findById(id: number, user?: User): Promise<Omit<Venue, 'events'>> {
    const venue = await this.prisma.venue.findUnique({ where: { id } });
    if (venue.deletedAt) {
      return null;
    }

    return {
      ...venue,
      isOwnedByMe: user?.id === venue.firebaseUserId,
    };
  }

  async findByOwnerId(
    firebaseUserId: string,
  ): Promise<Omit<Venue, 'events'>[]> {
    return this.prisma.venue.findMany({
      where: { firebaseUserId, deletedAt: null },
    });
  }

  async update(
    id: number,
    data: Prisma.VenueUpdateInput,
  ): Promise<Omit<Venue, 'events'>> {
    return this.prisma.venue.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Omit<Venue, 'events'>> {
    return this.prisma.venue.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findAllInRange(
    data: GetVenuesInRangeInput,
    user?: User,
  ): Promise<Omit<Venue, 'events'>[]> {
    const { bounds } = data;
    const { _sw, _ne } = bounds;

    const xmin = _sw.lng;
    const ymin = _sw.lat;
    const xmax = _ne.lng;
    const ymax = _ne.lat;

    return (
      await this.prisma.$queryRaw<Venue[]>`
      SELECT * FROM "Venue" WHERE "deletedAt" IS NULL AND ST_Within(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326), ST_MakeEnvelope(${xmin}, ${ymin}, ${xmax}, ${ymax}, 4326))`
    ).map((venue) => ({
      ...venue,
      isOwnedByMe: user?.id === venue.firebaseUserId,
    }));
  }
}
