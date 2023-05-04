import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fb from 'firebase-admin';
import { Field, InputType } from '@nestjs/graphql';
import { MailerService } from '@nestjs-modules/mailer';

@InputType()
class FirebaseUser {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  taxReturnsPicture: string;
}

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

  async registerUser(values: FirebaseUser): Promise<{ message: string }> {
    try {
      await this.app.auth().getUserByEmail(values.email);
    } catch (e) {
      await this.app
        .auth()
        .createUser({ password: values.password, email: values.email });

      this.app
        .auth()
        .generateEmailVerificationLink(values.email)
        .then(async (link) => {
          await this.mailerService.sendMail({
            to: 'urosjeknic@gmail.com',
            subject: `${values.email} wants to sign up`,
            template: 'sign-up',
            context: {
              values,
              link,
            },
          });
        });
    }

    return new Promise((resolve) => resolve({ message: 'kurcina' }));
  }
}
