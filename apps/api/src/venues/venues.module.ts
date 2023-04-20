import { Module } from '@nestjs/common';
import { BoundsScalar } from 'src/common/scalars/bounds.scalar';
import { PrismaService } from 'src/common/services/prisma.service';
import { EventsService } from 'src/events/events.service';
import { MailModule } from 'src/mail/mail.module';
import { UserService } from 'src/user/user.service';
import { VenuesResolver } from './venues.resolver';
import { VenuesService } from './venues.service';

@Module({
  imports: [MailModule],
  providers: [
    PrismaService,
    VenuesResolver,
    VenuesService,
    EventsService,
    BoundsScalar,
    UserService,
  ],
})
export class VenuesModule {}
