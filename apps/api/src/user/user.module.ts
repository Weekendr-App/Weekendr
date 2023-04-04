import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { VenuesService } from 'src/venues/venues.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [PrismaService, VenuesService, UserResolver, UserService],
})
export class UserModule {}
