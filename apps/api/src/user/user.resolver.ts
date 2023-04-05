import { UseGuards } from '@nestjs/common';
import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FirebaseGuard } from 'src/common/firebase/firebase.guard';
import { FirebaseUser } from 'src/common/firebase/firebase.user.decorator';
import { Venue } from 'src/venues/models/venue.model';
import { VenuesService } from 'src/venues/venues.service';
import { User } from './models/user.model';
import { RoleGuard } from './user.role.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly venuesService: VenuesService) {}

  @Query(() => User)
  @UseGuards(FirebaseGuard, RoleGuard('OWNER'))
  async me(@FirebaseUser() user: User) {
    return user;
  }

  @ResolveField(() => [Venue])
  @UseGuards(FirebaseGuard, RoleGuard('OWNER'))
  async venues(@FirebaseUser() user: User) {
    return this.venuesService.findByOwnerId(user.id);
  }
}
