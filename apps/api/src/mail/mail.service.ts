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

  async sendNewUserEmail(values: {
    email: string;
    password: string;
    taxReturnsPicture: string;
  }) {
    await this.mailerService.sendMail({
      to: 'urosjeknic@gmail.com',
      subject: `${values.email} wants to sign up`,
      template: 'sign-up',
      context: {
        values,
      },
    });
  }
}
