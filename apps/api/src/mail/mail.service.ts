import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Venue } from '@prisma/client';
import { RegisterUserInput } from 'src/user/dto/register-user.input';

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

  async sendNewUserEmail(values: RegisterUserInput, link: string) {
    await this.mailerService.sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `${values.email} wants to sign up`,
      template: 'sign-up',
      context: {
        values,
        link,
      },
    });
  }
}
