import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { GroceryVO } from '../groceries/vo/grocery.vo';

export enum MailTemplate {
  EMAIL_REGISTER_CONFIRMATION = './email-register-confirmation',
  EXPIRY_GROCERY_ALERT = './expiry-grocery-alert',
  EXPIRING_GROCERY_ALERT = './expiring-grocery-alert',
}

export interface SendEmailOptions
  extends Omit<ISendMailOptions, 'from' | 'template'> {
  template: MailTemplate;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(emailOptions: SendEmailOptions): Promise<void> {
    await this.mailerService.sendMail({
      from: process.env.MAIL_FROM,
      ...emailOptions,
    });
  }

  // mail #1
  async sendEmailVerification(email: string, token: string): Promise<void> {
    const confirmUserUrl =
      await `${process.env.WEB_URL}/verify-email?token=${token}`;

    await this.sendEmail({
      subject: 'Confirm your email address on Grocery Tracker App',
      to: email,
      template: MailTemplate.EMAIL_REGISTER_CONFIRMATION,
      context: {
        email,
        url: confirmUserUrl,
      },
    });
  }

  // mail #2
  async sendExpiryGroceryAlertEmail(
    email: string,
    groceryGroups: GroceryVO[],
  ): Promise<void> {
    const hasOnlyItem = groceryGroups.length === 1;

    const groceryText = hasOnlyItem ? 'grocery' : 'groceries';

    const heading = `You have ${groceryGroups.length} ${groceryText} expired`;

    await this.sendEmail({
      subject: `${heading} - Grocery Tracker App`,
      to: email,
      template: MailTemplate.EXPIRY_GROCERY_ALERT,
      context: {
        heading,
        webUrl: process.env.WEB_URL,
        groceryGroups,
      },
    });
  }

  // mail #3
  async sendExpiringGroceryAlertEmail(
    email: string,
    groceryGroups: GroceryVO[],
  ): Promise<void> {
    const hasOnlyItem = groceryGroups.length === 1;

    const groceryText = hasOnlyItem ? 'grocery is' : 'groceries are';

    const heading = `You have ${groceryGroups.length} ${groceryText} expiring soon!`;

    await this.sendEmail({
      subject: `${heading} - Grocery Tracker App`,
      to: email,
      template: MailTemplate.EXPIRING_GROCERY_ALERT,
      context: {
        heading,
        webUrl: process.env.WEB_URL,
        groceryGroups,
      },
    });
  }
}
