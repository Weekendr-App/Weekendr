import { Module } from '@nestjs/common';
import { BoundsScalar } from 'src/common/scalars/bounds.scalar';
import { DateScalar } from 'src/common/scalars/date.scalar';
import { PrismaService } from 'src/common/services/prisma.service';
import { VenuesResolver } from './venues.resolver';
import { VenuesService } from './venues.service';

@Module({
  providers: [
    PrismaService,
    VenuesResolver,
    VenuesService,
    DateScalar,
    BoundsScalar,
  ],
})
export class VenuesModule {}
