import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Firebase' })
export class Firebase {
  @Field()
  message: string;
}
