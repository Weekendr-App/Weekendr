import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fb from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private app: fb.app.App;

  constructor(private readonly configService: ConfigService) {
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
