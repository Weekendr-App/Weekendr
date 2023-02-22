import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Venue' })
export class Venue {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
