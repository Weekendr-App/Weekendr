import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { VenueStatus } from '@prisma/client';
import { Event } from 'src/events/models/event.model';
import { User } from 'src/user/models/user.model';

registerEnumType(VenueStatus, {
  name: 'VenueStatus',
});

@ObjectType({ description: 'Venue' })
export class Venue {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  owner: Omit<User, 'email' | 'venues'>;

  @Field()
  address: string;

  @Field()
  latitude: number;

  @Field({ nullable: true })
  isOwnedByMe?: boolean;

  @Field()
  longitude: number;

  @Field()
  picture: string;

  @Field(() => [Event], { nullable: true, defaultValue: [] })
  events?: Event[] = [];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field()
  phone: string;

  @Field(() => VenueStatus)
  status: VenueStatus;
}
