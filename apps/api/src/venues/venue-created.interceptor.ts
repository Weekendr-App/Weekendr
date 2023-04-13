import { CallHandler, Injectable, NestInterceptor } from '@nestjs/common';
import { GraphQLExecutionContext } from '@nestjs/graphql';
import { Venue } from '@prisma/client';
import { Observable, tap } from 'rxjs';

@Injectable()
export class VenueCreatedInterceptor implements NestInterceptor {
  intercept(
    _context: GraphQLExecutionContext,
    next: CallHandler,
  ): Observable<Venue> {
    return next.handle().pipe(
      tap((venue: Venue) =>
        // TODO: Send email to moderators
        // to notify them of a new venue.
        console.log(`New venue created: ${venue.name}`),
      ),
    );
  }
}
