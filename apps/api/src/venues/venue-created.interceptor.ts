import { CallHandler, Injectable, NestInterceptor } from '@nestjs/common';
import { GraphQLExecutionContext } from '@nestjs/graphql';
import { Venue } from '@prisma/client';
import { Observable, tap } from 'rxjs';
import { FirebaseService } from 'src/common/firebase/firebase.service';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VenueCreatedInterceptor implements NestInterceptor {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  intercept(
    _context: GraphQLExecutionContext,
    next: CallHandler,
  ): Observable<Venue> {
    return next.handle().pipe(
      tap(async (venue) => {
        const moderators = await this.userService.getAllModerators();
        const firebaseUsers = await Promise.all(
          moderators.map((moderator) =>
            this.firebaseService.getAuth().getUser(moderator.id),
          ),
        );
        const emails = firebaseUsers.map((user) => user.email);

        await this.mailService.sendNewVenueEmail(venue, emails);
      }),
    );
  }
}
