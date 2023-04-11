import { Field, InputType } from '@nestjs/graphql';
import { VenueStatus } from '@prisma/client';
import { CreateVenueInput } from './create-venue.input';

@InputType()
export class UpdateVenueInput extends CreateVenueInput {
  @Field()
  id: number;

  @Field()
  status?: VenueStatus;
}
