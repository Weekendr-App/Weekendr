import { Query, Resolver } from '@nestjs/graphql';
import { Venue } from './models/venue.model';
import { VenuesService } from './venues.service';

@Resolver(() => Venue)
export class VenuesResolver {
  constructor(private readonly venuesService: VenuesService) {}

  @Query(() => [Venue])
  async venues(): Promise<Venue[]> {
    return this.venuesService.findAll();
  }
}
