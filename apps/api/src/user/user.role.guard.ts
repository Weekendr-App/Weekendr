import {
  CanActivate,
  Inject,
  Injectable,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { User } from './models/user.model';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private _reflector: Reflector,
    @Inject('ROLE') private role: Role,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user as User;

    return user.role === this.role;
  }
}
