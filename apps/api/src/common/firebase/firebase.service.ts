import { Injectable } from '@nestjs/common';
import * as fb from 'firebase-admin';
import firebaseConfig from './config';

@Injectable()
export class FirebaseService {
  private app: fb.app.App;

  constructor() {
    this.app = fb.initializeApp({
      credential: fb.credential.cert(firebaseConfig),
    });
  }

  getAuth() {
    return this.app.auth();
  }
}
