import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { EventStatus } from '@prisma/client';
import { Venue } from 'src/venues/models/venue.model';

registerEnumType(EventStatus, {
  name: 'EventStatus',
});

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

  @Field(() => EventStatus)
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
