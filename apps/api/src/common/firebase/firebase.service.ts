import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fb from 'firebase-admin';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterUserInput } from 'src/user/dto/register-user.input';
import { RegisterUserResponse } from 'src/user/models/registration.model';

@Injectable()
export class FirebaseService {
  private app: fb.app.App;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    const firebaseConfig = {
      clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      privateKey: this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        .replace(/\\n/g, ''),
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
    };

    this.app =
      fb.apps.length < 1
        ? fb.initializeApp(
            {
              credential: fb.credential.cert(firebaseConfig),
            },
            'firebase-service',
          )
        : fb.app('firebase-service');
  }

  getAuth() {
    return this.app.auth();
  }

  async registerUser({
    email,
    password,
    taxReturnsPicture,
  }: RegisterUserInput): Promise<RegisterUserResponse> {
    try {
      await this.app.auth().getUserByEmail(email);

      return {
        message: 'User already exists',
        success: false,
      };
    } catch {
      await this.app.auth().createUser({ email, password });

      const link = await this.app.auth().generateEmailVerificationLink(email);

      await this.mailerService.sendMail({
        to: process.env.ADMIN_EMAIL,
        subject: `${email} wants to sign up`,
        template: 'sign-up',
        context: {
          values: {
            email,
            password,
            taxReturnsPicture,
          },
          link,
        },
      });

      return {
        message: 'User created',
        success: true,
      };
    }
  }
}
