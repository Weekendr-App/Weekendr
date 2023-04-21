import {
  ForbiddenException,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { VenueStatus } from '@prisma/client';
import { omit } from 'ramda';
import { FirebaseGuard } from 'src/common/firebase/firebase.guard';
import { FirebaseUser } from 'src/common/firebase/firebase.user.decorator';
import { EventsService } from 'src/events/events.service';
import { Event } from 'src/events/models/event.model';
import { User } from 'src/user/models/user.model';
import { RoleGuard } from 'src/user/user.role.guard';
import { CreateVenueInput } from './dto/create-venue.input';
import { GetVenuesInRangeInput } from './dto/get-venues-in-range.input';
import { UpdateVenueInput } from './dto/update-venue.input';
import { Venue, VenueInRange } from './models/venue.model';
import { VenuesService } from './venues.service';
import { VenueCreatedInterceptor } from 'src/venues/venue-created.interceptor';

@Resolver(() => Venue)
export class VenuesResolver {
  constructor(
    private readonly venuesService: VenuesService,
    private readonly eventsService: EventsService,
  ) {}

  @ResolveField(() => [Event])
  async events(@Parent() venue: Venue): Promise<Omit<Event, 'venue'>[]> {
    return this.eventsService.findAllByVenueId(venue.id);
  }

  @Query(() => Venue)
  async venue(
    @Args('id', ParseIntPipe) id: number,
    @FirebaseUser('user') user: User | null,
  ): Promise<Venue> {
    const venue = await this.venuesService.findById(id, user);

    if (!venue) {
      throw new NotFoundException(id);
    }

    return venue;
  }

  @Query(() => [Venue])
  async venuesInRange(
    @Args('fields') data: GetVenuesInRangeInput,
    @FirebaseUser('user') user: User | null,
  ): Promise<VenueInRange[]> {
    return this.venuesService.findAllInRange(data, user);
  }

  @Query(() => [Venue])
  @UseGuards(FirebaseGuard, RoleGuard('MODERATOR'))
  async draftVenues(): Promise<Venue[]> {
    return this.venuesService.getDraftVenues();
  }

  @Mutation(() => Venue)
  @UseGuards(FirebaseGuard, RoleGuard('OWNER'))
  @UseInterceptors(VenueCreatedInterceptor)
  async createVenue(
    @Args('fields') data: CreateVenueInput,
    @FirebaseUser() user: User,
  ): Promise<Venue> {
    return this.venuesService.create({
      ...data,
      owner: { connect: { id: user.id } },
    });
  }

  @Mutation(() => Venue)
  @UseGuards(FirebaseGuard)
  async updateVenue(@Args('fields') data: UpdateVenueInput): Promise<Venue> {
    return this.venuesService.update(data.id, omit(['id'], data));
  }

  @Mutation(() => Venue)
  @UseGuards(FirebaseGuard, RoleGuard('MODERATOR'))
  async publishVenue(@Args('id', ParseIntPipe) id: number): Promise<Venue> {
    return this.venuesService.update(id, { status: VenueStatus.ACTIVE });
  }

  @Mutation(() => Venue)
  @UseGuards(FirebaseGuard, RoleGuard('OWNER'))
  async deleteVenue(
    @Args('id', ParseIntPipe) id: number,
    @FirebaseUser() user: User,
  ) {
    const venue = await this.venuesService.findById(id, user);
    if (!venue?.isOwnedByMe) {
      throw new ForbiddenException(id);
    }

    return this.venuesService.delete(id);
  }
}
