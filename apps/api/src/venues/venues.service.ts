import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { Venue } from './models/venue.model';

@Injectable()
export class VenuesService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Venue> {
    return this.prisma.venue.findUnique({ where: { id } });
  }

  async findAll(): Promise<Venue[]> {
    return this.prisma.venue.findMany();
  }

  async create(data: Prisma.VenueCreateInput): Promise<Venue> {
    return this.prisma.venue.create({ data });
  }

  async update(id: number, data: Prisma.VenueUpdateInput): Promise<Venue> {
    return this.prisma.venue.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Venue> {
    return this.prisma.venue.delete({ where: { id } });
  }
}
