import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, Max, MaxLength, Min } from 'class-validator';

@InputType()
export class CreateVenueInput {
  @Field()
  @MaxLength(30)
  name: string;

  @Field()
  @Min(-90)
  @Max(90)
  @IsNumber()
  latitude: number;

  @Field()
  @Min(-180)
  @Max(180)
  @IsNumber()
  longitude: number;

  @Field()
  @MaxLength(255)
  address: string;

  @Field({ nullable: true })
  picture?: string;
}
