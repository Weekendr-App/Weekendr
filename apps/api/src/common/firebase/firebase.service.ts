import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fb from 'firebase-admin';
import { RegisterUserInput } from 'src/user/dto/register-user.input';
import { RegisterUserResponse } from 'src/user/models/registration.model';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class FirebaseService {
  private app: fb.app.App;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
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
}
