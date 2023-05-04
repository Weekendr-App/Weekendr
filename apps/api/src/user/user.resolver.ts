import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FirebaseGuard } from 'src/common/firebase/firebase.guard';
import { FirebaseService } from 'src/common/firebase/firebase.service';
import { FirebaseUser } from 'src/common/firebase/firebase.user.decorator';
import { Venue } from 'src/venues/models/venue.model';
import { VenuesService } from 'src/venues/venues.service';
import { RegisterUserInput } from './dto/register-user.input';
import { RegisterUserResponse } from './models/registration.model';
import { User } from './models/user.model';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly venuesService: VenuesService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Query(() => User)
  @UseGuards(FirebaseGuard)
  async me(@FirebaseUser() user: User) {
    return user;
  }

  @ResolveField(() => [Venue])
  @UseGuards(FirebaseGuard)
  async venues(@FirebaseUser() user: User) {
    return this.venuesService.findByOwnerId(user.id);
  }

  @Mutation(() => RegisterUserResponse)
  async registerUser(@Args('user') data: RegisterUserInput) {
    return this.firebaseService.registerUser(data);
  }
}
