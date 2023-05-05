import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { FirebaseService } from 'src/common/firebase/firebase.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { VerificationRequestService } from 'src/verificationRequest/verificationRequest.service';
import { RegisterUserInput } from './dto/register-user.input';
import { RegisterUserResponse } from './models/registration.model';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
    private readonly verificationRequestService: VerificationRequestService,
  ) {}

  async ensureUser(id: User['id'], email: User['email']) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      return user;
    }

    return await this.prisma.user.create({ data: { id, email } });
  }

  async getAllModerators() {
    return await this.prisma.user.findMany({
      where: { role: Role.MODERATOR },
    });
  }

  async registerUser(values: RegisterUserInput): Promise<RegisterUserResponse> {
    const auth = this.firebaseService.getAuth();
    const { email, password } = values;

    try {
      await auth.getUserByEmail(email);

      return {
        message: 'User already exists',
        success: false,
      };
    } catch {
      const user = await auth.createUser({ email, password });
      const link = await auth.generateEmailVerificationLink(email);

      await this.verificationRequestService.createVerificationRequest(
        user.uid,
        link,
      );

      // TODO: Construct a proper URL
      await this.mailService.sendNewUserEmail(values, link);

      return {
        message: 'User created',
        success: true,
      };
    }
  }
}
