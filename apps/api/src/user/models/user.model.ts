import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { Venue } from 'src/venues/models/venue.model';

@ObjectType({ description: 'User' })
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  role: Role;

  @Field(() => [Venue])
  venues: Venue[];
}
