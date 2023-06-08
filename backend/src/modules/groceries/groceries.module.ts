import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../accounts/account.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { CategoryEntity } from '../categories/category.entity';
import { LocationEntity } from '../locations/location.entity';
import { GroceriesController } from './groceries.controller';
import { GroceriesService } from './groceries.service';
import { GroceryEntity } from './grocery.entity';
import { GroceryItemsModule } from '../grocery-items/grocery-items.module';
import { ReceiptModule } from '../receipt/receipt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroceryEntity,
      CategoryEntity,
      LocationEntity,
      AccountEntity,
    ]),
    AccountsModule,
    GroceryItemsModule,
    ReceiptModule,
  ],
  controllers: [GroceriesController],
  providers: [GroceriesService],
  exports: [GroceriesService],
})
export class GroceriesModule {}
