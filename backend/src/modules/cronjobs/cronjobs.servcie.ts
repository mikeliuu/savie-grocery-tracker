import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AccountsService } from '../accounts/accounts.service';
import { GroceriesService } from '../groceries/groceries.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CronjobsService {
  constructor(
    private accountsService: AccountsService,
    private groceriesService: GroceriesService,
    private mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM, {
    timeZone: 'Europe/London',
  })
  async sendExpiryGroceriesAlert() {
    //* get all default accounts with user info
    const defaultAccounts = await this.accountsService.getAllDefaultAccounts();

    //* loop through all users' exipiry groceries for email alert
    for (const account of defaultAccounts) {
      const groceries = await this.groceriesService.findAllExpiries(
        account?.id,
      );

      if (!groceries?.length) return;

      await this.mailService.sendExpiryGroceryAlertEmail(
        account?.user?.email,
        groceries,
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM, {
    timeZone: 'Europe/London',
  })
  async sendExpiringGroceriesAlert() {
    //* get all default accounts with user info
    const defaultAccounts = await this.accountsService.getAllDefaultAccounts();

    //* loop through all users' exipiry groceries for email alert
    for (const account of defaultAccounts) {
      const groceries = await this.groceriesService.findAllExpiries(
        account?.id,
      );

      if (!groceries?.length) return;

      await this.mailService.sendExpiringGroceryAlertEmail(
        account?.user?.email,
        groceries,
      );
    }
  }
}
