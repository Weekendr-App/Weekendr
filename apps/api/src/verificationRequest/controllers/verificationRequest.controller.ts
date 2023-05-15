import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { VerificationRequestService } from '../verificationRequest.service';

@Controller('verify-user')
export class VerificationRequestController {
  constructor(
    private readonly verificationRequestService: VerificationRequestService,
  ) {}

  @Get()
  async verifyUser(@Query('id') id: string, @Query('userId') userId: string) {
    if (!id || !userId) {
      throw new BadRequestException('Missing UUID or userId');
    }

    await this.verificationRequestService.verifyUser(id, userId);

    return { message: 'User verified' };
  }
}
