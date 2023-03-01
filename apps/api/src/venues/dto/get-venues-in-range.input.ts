import { Field, InputType } from '@nestjs/graphql';
import { Bounds } from 'src/common/scalars/bounds.scalar';

@InputType()
export class GetVenuesInRangeInput {
  @Field(() => Bounds)
  bounds: Bounds;
}
