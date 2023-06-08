import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountsModule } from '../accounts/accounts.module';
import { GroceriesModule } from '../groceries/groceries.module';
import { MailModule } from '../mail/mail.module';
import { CronjobsService } from './cronjobs.servcie';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MailModule,
    AccountsModule,
    GroceriesModule,
  ],
  providers: [CronjobsService],
  exports: [CronjobsService],
})
export class CronjobsModule {}
