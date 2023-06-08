import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingListEntity } from './shopping-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingListEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class ShoppingListModule {}
