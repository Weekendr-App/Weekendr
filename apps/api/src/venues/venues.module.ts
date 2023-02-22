import { Module } from '@nestjs/common';
import { DateScalar } from 'src/common/scalars/date.scalar';
import { PrismaService } from 'src/common/services/prisma.service';
import { VenuesResolver } from './venues.resolver';
import { VenuesService } from './venues.service';

@Module({
  providers: [PrismaService, VenuesResolver, VenuesService, DateScalar],
})
export class VenuesModule {}
