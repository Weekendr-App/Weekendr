import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseMiddleware implements NestMiddleware {
  constructor(private readonly firebaseService: FirebaseService) {}

  async use(request: Request, _response: Response, next: () => void) {
    const { authorization } = request.headers;

    request['user'] = null;

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.replace('Bearer ', '');

      try {
        const decodedToken = await this.firebaseService
          .getAuth()
          .verifyIdToken(token);

        request['user'] = {
          id: decodedToken.uid,
          email: decodedToken.email,
        };
      } catch (error) {
        console.log('Error while verifying Firebase ID token:', error);
      }
    } else {
      console.log(
        'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      );
    }

    next();
  }
}
