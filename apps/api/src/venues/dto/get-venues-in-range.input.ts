import { Field, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class GetVenuesInRangeInput {
  @Field()
  @Min(-90)
  @Max(90)
  latitude: number;

  @Field()
  @Min(-180)
  @Max(180)
  longitude: number;

  @Field()
  @Min(0)
  range: number;
}
