import { CallHandler, Injectable, NestInterceptor } from '@nestjs/common';
import { GraphQLExecutionContext } from '@nestjs/graphql';
import { Venue } from '@prisma/client';
import { Observable, tap } from 'rxjs';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VenueCreatedInterceptor implements NestInterceptor {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  intercept(
    _context: GraphQLExecutionContext,
    next: CallHandler,
  ): Observable<Venue> {
    return next.handle().pipe(
      tap(async (venue) => {
        const moderators = await this.userService.getAllModerators();
        const emails = moderators.map((moderator) => moderator.email);

        await this.mailService.sendNewVenueEmail(venue, emails);
      }),
    );
  }
}
