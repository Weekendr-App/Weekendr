import { Field, InputType } from '@nestjs/graphql';
import { CreateVenueInput } from './create-venue.input';

@InputType()
export class UpdateVenueInput extends CreateVenueInput {
  @Field()
  id: number;
}
