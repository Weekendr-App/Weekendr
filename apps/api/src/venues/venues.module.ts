import { Module } from '@nestjs/common';
import { DateScalar } from 'src/common/scalars/date.scalar';
import { VenuesResolver } from './venues.resolver';
import { VenuesService } from './venues.service';

@Module({
  providers: [VenuesResolver, VenuesService, DateScalar],
})
export class VenuesModule {}
