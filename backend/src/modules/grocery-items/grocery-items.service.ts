import {
  BadGatewayException,
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GroceryItemDTO } from './dto/grocery-item.dto';
import { GroceryItemVO } from './vo/grocery-item.vo';
import { AccountEntity } from '../accounts/account.entity';
import { CreateGroceryItemDTO } from './dto/create-grocery-item.dto';
import { LocationEntity } from '../locations/location.entity';
import { GroceryItemEntity } from './grocery-item.entity';
import { UpdateGroceryItemDTO } from './dto/update-grocery-item.dto';
import { GroceryEntity } from '../groceries/grocery.entity';
import { GroceryVO } from '../groceries/vo/grocery.vo';
import { GroceryItemDetailVO } from './vo/grocery-item-detail.vo';

@Injectable()
export class GroceryItemsService {
  constructor(
    @InjectRepository(GroceryEntity)
    private groceryRepository: Repository<GroceryEntity>,
    @InjectRepository(GroceryItemEntity)
    private groceryItemRepository: Repository<GroceryItemEntity>,
  ) {}

  mapToVo(groceries: GroceryItemEntity[]) {
    return groceries.map((groceries) => GroceryItemVO.toVO(groceries));
  }

  async findOneById(
    accountId: number,
    groceryId: number,
    groceryItemId: number,
  ): Promise<GroceryItemDetailVO | {}> {
    const entity = await this.groceryRepository
      .createQueryBuilder('grocery')
      .withDeleted()
      .leftJoin('grocery.account', 'account')
      .leftJoinAndSelect('grocery.category', 'category')
      .leftJoinAndSelect('grocery.items', 'items')
      .leftJoinAndSelect('items.location', 'location')
      .where('account.id = :accountId', {
        accountId,
      })
      .andWhere('grocery.id = :groceryId', {
        groceryId,
      })
      .andWhere('items.id = :groceryItemId', {
        groceryItemId,
      })
      .getOne();

    return entity?.hasId ? GroceryItemDetailVO.toVO(entity) : null;
  }

  async create(
    accountId: number,
    groceryId: number,
    payload: CreateGroceryItemDTO,
  ): Promise<void> {
    // create a grocery item
    const accountEntity = new AccountEntity();
    accountEntity.id = accountId;

    const groceryEntity = new GroceryEntity();
    groceryEntity.id = groceryId;

    const locationEntity = new LocationEntity();
    locationEntity.id = payload?.locationId;

    const dto = new GroceryItemDTO();

    dto.account = accountEntity;
    dto.location = locationEntity;
    dto.grocery = groceryEntity;
    dto.expiryDate = payload?.expiryDate;
    dto.price = payload?.price;
    dto.barcode = payload?.barcode;
    dto.vendor = payload?.vendor;
    // dto.remark = payload?.remark;

    const newEntity = GroceryItemDTO.toEntity(dto);

    try {
      for (let index = 0; index < payload?.quantity; index++) {
        this.groceryItemRepository.save(newEntity);
      }
    } catch (err) {
      throw new BadGatewayException('Cannot create grocery item');
    }
  }

  async update(
    accountId: number,
    groceryId: number,
    groceryItemId: number,
    payload: Partial<UpdateGroceryItemDTO>,
  ): Promise<GroceryItemVO> {
    const entity = await this.groceryItemRepository.findOne({
      where: {
        id: groceryItemId,
        account: {
          id: accountId,
        },
        grocery: {
          id: groceryId,
        },
      },
      relations: ['location', 'account'],
    });

    if (!entity?.hasId) {
      throw new NotFoundException('Grocery item not found');
    }

    // update a grocery item
    const locationEntity = new LocationEntity();
    locationEntity.id = payload?.locationId;

    const accountEntity = new AccountEntity();
    accountEntity.id = accountId;

    const dto = new GroceryItemDTO();

    dto.id = groceryItemId;
    dto.account = entity?.account;
    dto.location = locationEntity;
    dto.expiryDate = payload?.expiryDate;
    dto.price = payload?.price;
    dto.barcode = payload?.barcode;
    dto.vendor = payload?.vendor;
    // dto.remark = payload.remark;

    const updateEntity = GroceryItemDTO.toEntity(dto);

    const updateGrocery = await this.groceryItemRepository.save(updateEntity);

    if (!updateGrocery) throw new BadGatewayException('Cannot update grocery');

    if (payload?.quantity > 1) {
      const dto = new CreateGroceryItemDTO();

      dto.barcode = updateGrocery?.barcode;
      dto.expiryDate = updateGrocery?.expiryDate;
      dto.locationId = updateGrocery?.location?.id;
      dto.price = updateGrocery?.price;
      dto.vendor = updateGrocery?.vendor;
      dto.quantity = payload?.quantity - 1;

      await this.create(accountId, groceryId, dto);
    }

    return GroceryItemVO.toVO(updateGrocery);
  }

  async delete(
    accountId: number,
    groceryId: number,
    groceryItemId: number,
  ): Promise<void> {
    const existingGroceryItem = await this.groceryItemRepository.findOne({
      where: {
        id: groceryItemId,
        account: {
          id: accountId,
        },
        grocery: {
          id: groceryId,
        },
      },
      withDeleted: true,
    });

    if (!existingGroceryItem?.id) {
      throw new BadRequestException('Grocery item not found');
    }
    try {
      await this.groceryItemRepository
        .createQueryBuilder('groceryItem')
        .softDelete()
        .where('id = :groceryItemId', { groceryItemId })
        .execute();
    } catch (err) {
      throw new BadGatewayException('Cannot delete grocery item');
    }
  }

  async deleteAll(accountId: number, groceryId: number): Promise<void> {
    const existingGroceryItems = await this.groceryItemRepository.find({
      where: {
        account: {
          id: accountId,
        },
        grocery: {
          id: groceryId,
        },
      },
      withDeleted: true,
    });

    if (!existingGroceryItems?.length) {
      throw new BadRequestException('Grocery items not found');
    }
    try {
      const groceryItemIds = existingGroceryItems?.map((item) => item?.id);

      await this.groceryItemRepository
        .createQueryBuilder('groceryItem')
        .restore()
        .where('id IN (:...groceryItemIds)', { groceryItemIds })
        .execute();
    } catch (err) {
      throw new BadGatewayException('Cannot delete grocery items');
    }
  }

  async restore(
    accountId: number,
    groceryId: number,
    groceryItemId: number,
  ): Promise<void> {
    const existingGrocery = await this.groceryItemRepository.findOne({
      where: {
        id: groceryItemId,
        account: {
          id: accountId,
        },
        grocery: {
          id: groceryId,
        },
      },
      withDeleted: true,
    });

    if (!existingGrocery?.id) {
      throw new BadRequestException('Grocery item not found');
    }

    try {
      await this.groceryItemRepository
        .createQueryBuilder('groceryItem')
        .restore()
        .where('id = :groceryItemId', { groceryItemId })
        .execute();
    } catch (err) {
      throw new BadGatewayException('Cannot restore grocery item');
    }
  }

  async restoreAll(accountId: number, groceryId: number): Promise<void> {
    const existingGroceryItems = await this.groceryItemRepository.find({
      where: {
        account: {
          id: accountId,
        },
        grocery: {
          id: groceryId,
        },
      },
      withDeleted: true,
    });

    if (!existingGroceryItems?.length) {
      throw new BadRequestException('Grocery items not found');
    }

    try {
      const groceryItemIds = existingGroceryItems?.map((item) => item?.id);

      await this.groceryItemRepository
        .createQueryBuilder('groceryItem')
        .restore()
        .where('id IN (:...groceryItemIds)', { groceryItemIds })
        .execute();
    } catch (err) {
      throw new BadGatewayException('Cannot restore grocery items');
    }
  }
}
