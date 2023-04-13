import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Venue } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendNewVenueEmail(venue: Venue, emails: string[]) {
    for (const to of emails) {
      await this.mailerService.sendMail({
        to,
        subject: `New venue created: ${venue.name}`,
        template: 'new-venue',
        context: {
          venue,
        },
      });
    }
  }
}
