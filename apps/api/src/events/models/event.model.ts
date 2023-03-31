import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EventStatus } from '@prisma/client';
import { Venue } from 'src/venues/models/venue.model';

@ObjectType({ description: 'Event' })
export class Event {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  picture?: string;

  venueId: number;

  @Field(() => Venue)
  venue: Venue;

  @Field()
  status: EventStatus;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field()
  price: number;
}
