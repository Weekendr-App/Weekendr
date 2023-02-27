import {
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { omit } from 'ramda';
import { FirebaseGuard } from 'src/common/firebase/firebase.guard';
import { FirebaseUser } from 'src/common/firebase/firebase.user.decorator';
import { User } from 'src/user/models/user.model';
import { CreateVenueInput } from './dto/create-venue.input';
import { GetVenuesInRangeInput } from './dto/get-venues-in-range.input';
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

  @Query(() => [Venue])
  async venuesInRange(
    @Args('fields') data: GetVenuesInRangeInput,
  ): Promise<Venue[]> {
    return this.venuesService.findAllInRange(data);
  }

  @Mutation(() => Venue)
  @UseGuards(FirebaseGuard)
  async createVenue(
    @Args('fields') data: CreateVenueInput,
    @FirebaseUser() user: User,
  ): Promise<Venue> {
    return this.venuesService.create({ ...data, firebaseUserId: user.id });
  }

  @Mutation(() => Venue)
  @UseGuards(FirebaseGuard)
  async updateVenue(
    @Args('fields') data: UpdateVenueInput,
    @FirebaseUser() user: User,
  ): Promise<Venue> {
    const venue = await this.venuesService.findById(data.id);
    if (venue?.firebaseUserId !== user.id) {
      throw new ForbiddenException(data.id);
    }

    return this.venuesService.update(data.id, omit(['id'], data));
  }

  @Mutation(() => Venue)
  @UseGuards(FirebaseGuard)
  async deleteVenue(@Args('id') id: number, @FirebaseUser() user: User) {
    const venue = await this.venuesService.findById(id);
    if (venue?.firebaseUserId !== user.id) {
      throw new ForbiddenException(id);
    }

    return this.venuesService.delete(id);
  }
}
