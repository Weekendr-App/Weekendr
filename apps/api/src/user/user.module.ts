import { Module } from '@nestjs/common';
import { FirebaseService } from 'src/common/firebase/firebase.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { VenuesService } from 'src/venues/venues.service';
import { VerificationRequestModule } from 'src/verificationRequest/verificationRequest.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [VerificationRequestModule],
  providers: [
    PrismaService,
    VenuesService,
    UserResolver,
    UserService,
    FirebaseService,
    MailService,
  ],
})
export class UserModule {}
