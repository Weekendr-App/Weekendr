import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Venue } from 'src/venues/models/venue.model';
import { VenuesService } from 'src/venues/venues.service';
import { EventsService } from './events.service';
import { Event } from './models/event.model';

@Resolver(() => Event)
export class EventsResolver {
  constructor(
    private readonly eventsService: EventsService,
    private readonly venuesService: VenuesService,
  ) {}

  @ResolveField(() => Venue)
  async venue(@Parent() event: Event): Promise<Venue> {
    return this.venuesService.findById(event.venueId);
  }
}
