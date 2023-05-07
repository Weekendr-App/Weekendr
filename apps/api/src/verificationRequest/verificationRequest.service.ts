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

  async ensureVerificationRequest(firebaseUserId: string, id: string) {
    return this.prisma.verificationRequest.upsert({
      create: {
        id,
        firebaseUserId,
        expiresAt: addHours(new Date(), 1),
      },
      update: {
        id,
        expiresAt: addHours(new Date(), 1),
      },
      where: {
        firebaseUserId,
      },
    });
  }

  async getByUserId(userId: string) {
    return this.prisma.verificationRequest.findFirst({
      where: { firebaseUserId: userId },
    });
  }

  async verifyUser(id: string, firebaseUserId: string) {
    const request = await this.prisma.verificationRequest.findFirst({
      where: { id, firebaseUserId },
    });

    if (!request) {
      throw new NotFoundException('Verification request not found');
    }

    if (isAfter(new Date(), request.expiresAt)) {
      throw new BadRequestException('Verification request has expired');
    }

    await this.firebaseService.getAuth().updateUser(firebaseUserId, {
      emailVerified: true,
    });

    await this.prisma.verificationRequest.delete({
      where: { firebaseUserId },
    });
  }
}
