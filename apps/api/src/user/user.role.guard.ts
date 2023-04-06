import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { User } from './models/user.model';

export const RoleGuard = (role: Role) => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const ctx = GqlExecutionContext.create(context);
      const user = ctx.getContext().req.user as User;

      return user.role === role;
    }
  }

  return mixin(RoleGuardMixin);
};
