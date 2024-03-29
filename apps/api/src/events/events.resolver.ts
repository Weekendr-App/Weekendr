import {
  ForbiddenException,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  Query,
} from '@nestjs/graphql';
import { VenueStatus } from '@prisma/client';
import { CategoriesService } from 'src/categories/categories.service';
import { FirebaseGuard } from 'src/common/firebase/firebase.guard';
import { FirebaseUser } from 'src/common/firebase/firebase.user.decorator';
import { User } from 'src/user/models/user.model';
import { RoleGuard } from 'src/user/user.role.guard';
import { Venue } from 'src/venues/models/venue.model';
import { VenuesService } from 'src/venues/venues.service';
import { CreateEventInput } from './dto/create-event.input';
import { EventsService } from './events.service';
import { Event } from './models/event.model';

@Resolver(() => Event)
export class EventsResolver {
  constructor(
    private readonly eventsService: EventsService,
    private readonly venuesService: VenuesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @ResolveField(() => Venue)
  async venue(@Parent() event: Event): Promise<Venue> {
    return this.venuesService.findById(event.venueId);
  }

  @Query(() => Event)
  async event(@Args('eventId', ParseIntPipe) eventId: number): Promise<Event> {
    return this.eventsService.findById(eventId);
  }

  @Query(() => [Event])
  async venueEvents(
    @Args('venueId', ParseIntPipe) venueId: number,
  ): Promise<Event[]> {
    return this.eventsService.findAllByVenueId(venueId);
  }

  @Mutation(() => Event)
  @UseGuards(FirebaseGuard, RoleGuard('OWNER'))
  async createEvent(
    @Args('fields') data: CreateEventInput,
    @FirebaseUser() user: User,
  ): Promise<Event> {
    const category = await this.categoriesService.findCategoryById(
      data.categoryId,
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const venue = await this.venuesService.findById(data.venueId, user);

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    if (venue.status !== VenueStatus.ACTIVE) {
      throw new ForbiddenException('This venue is not active');
    }

    if (!venue.isOwnedByMe) {
      throw new ForbiddenException('You are not the owner of this venue');
    }

    const existingEvents = await this.eventsService.findInRange(
      data.startDate,
      data.endDate,
      data.venueId,
    );

    if (existingEvents.length > 0) {
      throw new ForbiddenException(
        'Unfortunately, there is already an event taking place within this date range.',
      );
    }

    return this.eventsService.create(data);
  }

  @Mutation(() => Event)
  @UseGuards(FirebaseGuard, RoleGuard('OWNER'))
  async cancelEvent(
    @Args('eventId', ParseIntPipe) eventId: number,
    @FirebaseUser() user: User,
  ): Promise<Event> {
    const event = await this.eventsService.findById(eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.venue.status !== VenueStatus.ACTIVE) {
      throw new ForbiddenException('This venue is not active');
    }

    if (event.venue.owner.id !== user.id) {
      throw new ForbiddenException('You are not the owner of this event');
    }

    return this.eventsService.cancelEvent(eventId);
  }
}
