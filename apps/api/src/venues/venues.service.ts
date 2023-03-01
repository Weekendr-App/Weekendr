import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { GetVenuesInRangeInput } from './dto/get-venues-in-range.input';
import { Venue } from './models/venue.model';

@Injectable()
export class VenuesService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Venue> {
    const venue = await this.prisma.venue.findUnique({ where: { id } });
    if (venue.deletedAt) {
      return null;
    }

    return venue;
  }

  async findAll(): Promise<Venue[]> {
    return this.prisma.venue.findMany({
      where: { deletedAt: null },
    });
  }

  async create(data: Prisma.VenueCreateInput): Promise<Venue> {
    return this.prisma.venue.create({
      data,
    });
  }

  async update(id: number, data: Prisma.VenueUpdateInput): Promise<Venue> {
    return this.prisma.venue.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Venue> {
    return this.prisma.venue.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findAllInRange(data: GetVenuesInRangeInput): Promise<Venue[]> {
    const { bounds } = data;
    const { _sw, _ne } = bounds;

    const xmin = _sw.lng;
    const ymin = _sw.lat;
    const xmax = _ne.lng;
    const ymax = _ne.lat;

    return this.prisma.$queryRaw<Venue[]>`
      SELECT * FROM "Venue" WHERE "deletedAt" IS NULL AND ST_Within(ST_MakePoint(longitude, latitude), ST_MakeEnvelope(${xmin}, ${ymin}, ${xmax}, ${ymax}))`;
  }
}
