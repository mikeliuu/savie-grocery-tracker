import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './config/database/ormConfig';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { GroceriesModule } from './modules/groceries/groceries.module';
import { GroceryItemsModule } from './modules/grocery-items/grocery-items.module';
import { LocationsModule } from './modules/locations//locations.module';
import { MailModule } from './modules/mail/mail.module';
import { ShoppingListModule } from './modules/shopping-list/shopping-list.module';
import { UsersModule } from './modules/users/users.module';
import { CronjobsModule } from './modules/cronjobs/cronjobs.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { ReceiptModule } from './modules/receipt/receipt.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormConfig()),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    CronjobsModule,
    MailModule,
    AuthModule,
    UsersModule,
    AccountsModule,
    CategoriesModule,
    LocationsModule,
    GroceriesModule,
    GroceryItemsModule,
    ReceiptModule,
    ShoppingListModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
