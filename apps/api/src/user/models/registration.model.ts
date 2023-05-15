import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Firebase registration response' })
export class RegisterUserResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}
