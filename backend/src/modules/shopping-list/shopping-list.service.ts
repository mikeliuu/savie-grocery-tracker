import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../accounts/account.entity';
import { CreateShoppingListDTO } from './dto/create-shopping-list.dto';
import { ShoppingListEntity } from './shopping-list.entity';
import { ShoppingListVO } from './vo/shopping-list.vo';

@Injectable()
export class ShoppinglistService {
  constructor(
    @InjectRepository(ShoppingListEntity)
    private shoppingListRepository: Repository<ShoppingListEntity>,
  ) {}

  mapToVo(list: ShoppingListEntity[]) {
    return list.map((list) => ShoppingListVO.toVO(list));
  }

  async getAll(accountId: number): Promise<ShoppingListVO[]> {
    const results = await this.shoppingListRepository.find({
      where: {
        account: {
          id: accountId,
        },
      },
    });

    return this.mapToVo(results);
  }

  async create(
    payload: CreateShoppingListDTO,
    accountId: number,
  ): Promise<ShoppingListVO> {
    const entity = new ShoppingListEntity();

    const account = new AccountEntity();
    account.id = accountId;

    entity.name = payload?.name;
    entity.description = payload?.description;
    entity.account = account;

    const newShoppingList = await this.shoppingListRepository.save(entity);

    return ShoppingListVO.toVO(newShoppingList);
  }
}
