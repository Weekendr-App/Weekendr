import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateEventInput {
  @Field()
  @MaxLength(30)
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  picture?: string;

  @Field()
  venueId: number;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  price: number;
}
