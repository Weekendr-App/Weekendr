import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { FirebaseService } from 'src/common/firebase/firebase.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { VerificationRequestService } from 'src/verificationRequest/verificationRequest.service';
import { v4 } from 'uuid';
import { RegisterUserInput } from './dto/register-user.input';
import { RegisterUserResponse } from './models/registration.model';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  private auth: Auth;

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
    private readonly verificationRequestService: VerificationRequestService,
  ) {
    this.auth = this.firebaseService.getAuth();
  }

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
    const { email, password } = values;

    try {
      const user = await this.auth.getUserByEmail(email);

      if (!user.emailVerified) {
        await this.sendVerificationEmail(user.uid, values);

        return {
          message: 'User already exists. Verification email sent.',
          success: false,
        };
      }

      return {
        message: 'User already exists',
        success: false,
      };
    } catch {
      const user = await this.auth.createUser({ email, password });

      await this.sendVerificationEmail(user.uid, values);

      return {
        message: 'User created',
        success: true,
      };
    }
  }

  private async sendVerificationEmail(uid: string, values: RegisterUserInput) {
    const verificationId = v4();

    await this.verificationRequestService.ensureVerificationRequest(
      uid,
      verificationId,
    );

    // TODO: Fetch URL dynamically
    await this.mailService.sendNewUserEmail(
      values,
      `http://localhost:4000/verify-user?id=${verificationId}&userId=${uid}`,
    );
  }
}
