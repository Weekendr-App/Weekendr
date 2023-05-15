import { Module } from '@nestjs/common';
import { FirebaseService } from 'src/common/firebase/firebase.service';
import { BoundsScalar } from 'src/common/scalars/bounds.scalar';
import { PrismaService } from 'src/common/services/prisma.service';
import { EventsService } from 'src/events/events.service';
import { MailModule } from 'src/mail/mail.module';
import { UserService } from 'src/user/user.service';
import { VerificationRequestModule } from 'src/verificationRequest/verificationRequest.module';
import { VenuesResolver } from './venues.resolver';
import { VenuesService } from './venues.service';

@Module({
  imports: [MailModule, VerificationRequestModule],
  providers: [
    PrismaService,
    VenuesResolver,
    FirebaseService,
    VenuesService,
    EventsService,
    BoundsScalar,
    UserService,
  ],
})
export class VenuesModule {}
