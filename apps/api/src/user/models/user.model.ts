import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { Venue } from 'src/venues/models/venue.model';

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType({ description: 'User' })
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => Role)
  role: Role;

  @Field(() => [Venue])
  venues: Venue[];
}
