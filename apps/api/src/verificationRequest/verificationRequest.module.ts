import { Module } from '@nestjs/common';
import { FirebaseService } from 'src/common/firebase/firebase.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { VerificationRequestService } from './verificationRequest.service';

@Module({
  providers: [
    VerificationRequestService,
    PrismaService,
    FirebaseService,
    MailService,
  ],
  exports: [VerificationRequestService],
})
export class VerificationRequestModule {}
