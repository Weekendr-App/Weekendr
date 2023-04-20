import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureUser(id: User['id'], email: User['email']) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      return user;
    }

    return await this.prisma.user.create({ data: { id, email } });
  }

  async getAllModerators() {
    return await this.prisma.user.findMany({
      where: { role: Role.MODERATOR },
    });
  }
}
