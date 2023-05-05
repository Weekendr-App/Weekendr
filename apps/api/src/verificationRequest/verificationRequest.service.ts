import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { addHours, isAfter } from 'date-fns';
import { FirebaseService } from 'src/common/firebase/firebase.service';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class VerificationRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async createVerificationRequest(firebaseUserId: string, url: string) {
    return this.prisma.verificationRequest.create({
      data: {
        url,
        firebaseUserId,
        expiresAt: addHours(new Date(), 1),
      },
    });
  }

  async verifyUser(userId: string, url: string) {
    const request = await this.prisma.verificationRequest.findFirst({
      where: { url },
    });

    if (!request) {
      throw new NotFoundException('Verification request not found');
    }

    if (isAfter(request.expiresAt, new Date())) {
      throw new BadRequestException('Verification request has expired');
    }

    await this.firebaseService.getAuth().updateUser(userId, {
      emailVerified: true,
    });
  }
}
