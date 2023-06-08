import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../accounts/account.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { CategoryEntity } from '../categories/category.entity';
import { LocationEntity } from '../locations/location.entity';
import { MailModule } from '../mail/mail.module';
import { GroceryItemsService } from './grocery-items.service';
import { GroceryItemEntity } from './grocery-item.entity';
import { GroceryEntity } from '../groceries/grocery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroceryEntity,
      GroceryItemEntity,
      CategoryEntity,
      LocationEntity,
      AccountEntity,
    ]),
    MailModule,
    AccountsModule,
  ],
  controllers: [],
  providers: [GroceryItemsService],
  exports: [GroceryItemsService],
})
export class GroceryItemsModule {}
