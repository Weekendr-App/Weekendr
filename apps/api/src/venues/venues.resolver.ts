import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { omit } from 'ramda';
import { CreateVenueInput } from './dto/create-venue.input';
import { UpdateVenueInput } from './dto/update-venue.input';
import { Venue } from './models/venue.model';
import { VenuesService } from './venues.service';

@Resolver(() => Venue)
export class VenuesResolver {
  constructor(private readonly venuesService: VenuesService) {}

  @Query(() => Venue)
  async venue(@Args('id') id: number): Promise<Venue> {
    const venue = this.venuesService.findById(id);

    if (!venue) {
      throw new NotFoundException(id);
    }

    return venue;
  }

  @Query(() => [Venue])
  async venues(): Promise<Venue[]> {
    return this.venuesService.findAll();
  }

  @Mutation(() => Venue)
  async createVenue(@Args('fields') data: CreateVenueInput): Promise<Venue> {
    return this.venuesService.create(data);
  }

  @Mutation(() => Venue)
  async updateVenue(@Args('fields') data: UpdateVenueInput): Promise<Venue> {
    return this.venuesService.update(data.id, omit(['id'], data));
  }

  @Mutation(() => Venue)
  async deleteVenue(@Args('id') id: number): Promise<Venue> {
    return this.venuesService.delete(id);
  }
}
