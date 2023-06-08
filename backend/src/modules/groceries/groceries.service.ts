import {
  BadGatewayException,
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as FormData from 'form-data';

import { Repository } from 'typeorm';
import { GroceryDTO } from './dto/grocery.dto';
import { GroceryVO } from './vo/grocery.vo';
import { AccountEntity } from '../accounts/account.entity';
import { CreateGroceryDTO } from './dto/create-grocery.dto';
import { LocationEntity } from '../locations/location.entity';
import { GroceryEntity } from './grocery.entity';
import { CategoryEntity } from '../categories/category.entity';
import { SinceParam, SortParam, TotalWasteCost } from './grocery.interface';
import { SINCE_DAY } from 'src/core/constants/global';
import { GroceryFilterOptionDTO } from './dto/grocery-filter-option.dto';
import { UpdateGroceryDTO } from './dto/update-grocery.dto';
import { GroceryFilterOptionVO } from './vo/grocery-filter-option.vo';
import { GroceryItemsService } from '../grocery-items/grocery-items.service';
import { CreateGroceryItemDTO } from '../grocery-items/dto/create-grocery-item.dto';
import { getSinceDay } from 'src/utils/date';
import { GroceryWasteCostVO } from './vo/grocery-waste-cost.vo';
import { calculateWasteCost } from './grocery.business-logic';
import { BulkCreateGroceryDTO } from './dto/bulk-create-grocery.dto';

@Injectable()
export class GroceriesService {
  constructor(
    @InjectRepository(GroceryEntity)
    private groceryRepository: Repository<GroceryEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>,

    private groceryItemsService: GroceryItemsService,
  ) {}

  mapToVo(groceries: GroceryEntity[]) {
    return groceries.map((groceries) => GroceryVO.toVO(groceries));
  }

  async findAll(
    accountId: number,
    payload?: GroceryFilterOptionDTO,
  ): Promise<GroceryVO[]> {
    const query = await this.groceryRepository
      .createQueryBuilder('grocery')
      .leftJoin('grocery.account', 'account')
      .leftJoinAndSelect('grocery.category', 'category')
      .leftJoinAndSelect('grocery.items', 'items')
      .leftJoinAndSelect('items.location', 'location')
      .andWhere('account.id = :accountId', { accountId });

    if (payload?.search) {
      const { search } = payload;

      await query.andWhere('LOWER(grocery.name) ILIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    if (payload?.filters?.categories?.length > 0) {
      await query.andWhere('category.id IN (:...filter)', {
        filter: payload?.filters?.categories,
      });
    }

    if (payload?.filters?.isExpired) {
      await query
        .andWhere('items.expiryDate IS NOT NULL')
        .andWhere('items.expiryDate < :now', {
          now: new Date(),
        });
    }

    if (payload?.filters?.locations?.length > 0) {
      await query.andWhere('items.location.id IN (:...filter)', {
        filter: payload?.filters?.locations,
      });
    }

    if (payload?.sort) {
      const { sort } = payload;

      if (sort === SortParam.Name) {
        await query.orderBy('grocery.name', 'ASC');
      } else if (sort === SortParam.WhatIsNew) {
        await query.orderBy('items.createdAt', 'ASC');
      } else if (sort === SortParam.Expiry) {
        await query.orderBy('items.expiryDate', 'ASC');
      }
    }

    const results = await query.getMany();

    return this.mapToVo(results);
  }

  async findFilterOptions(accountId: number): Promise<GroceryFilterOptionVO[]> {
    const categoryResults = await this.categoryRepository
      .createQueryBuilder('categories')
      .leftJoin('categories.account', 'account')
      .select(['categories.id', 'categories.name'])
      .andWhere('account.id = :accountId', { accountId })
      .getMany();

    const locationResults = await this.locationRepository
      .createQueryBuilder('locations')
      .leftJoin('locations.account', 'account')
      .select(['locations.id', 'locations.name'])
      .andWhere('account.id = :accountId', { accountId })
      .getMany();

    const results: GroceryFilterOptionVO[] = [
      {
        filter: 'category',
        value: categoryResults,
      },
      {
        filter: 'location',
        value: locationResults,
      },
    ];

    return results;
  }

  async findAllNames(accountId: number): Promise<string[]> {
    const results = await this.groceryRepository
      .createQueryBuilder('grocery')
      .leftJoin('grocery.account', 'account')
      .where('account.id = :accountId', { accountId })
      .select('DISTINCT grocery.name', 'name')
      .getRawMany();

    return this.mapToVo(results)?.map((item) => item?.name);
  }

  async findAllExpiries(accountId: number): Promise<GroceryVO[]> {
    const results = await this.groceryRepository
      .createQueryBuilder('grocery')
      .leftJoin('grocery.account', 'account')
      .leftJoinAndSelect('grocery.category', 'category')
      .leftJoinAndSelect('grocery.items', 'items')
      .leftJoinAndSelect('items.location', 'location')
      .where('account.id = :id', { id: accountId })
      .andWhere('items.expiryDate IS NOT NULL')
      .andWhere('items.expiryDate < :now', {
        now: new Date(),
      })
      .getMany();

    return this.mapToVo(results) || [];
  }

  async findAllExpiring(
    accountId: number,
    since: SinceParam,
  ): Promise<GroceryVO[]> {
    const date = new Date();
    const expiringDateString = date.setDate(
      date.getDate() + getSinceDay(since),
    );
    const dueDate = new Date(expiringDateString).toISOString();

    const results = await this.groceryRepository
      .createQueryBuilder('grocery')
      .leftJoin('grocery.account', 'account')
      .leftJoinAndSelect('grocery.category', 'category')
      .leftJoinAndSelect('grocery.items', 'items')
      .leftJoinAndSelect('items.location', 'location')
      .where('account.id = :id', { id: accountId })
      .andWhere('items.expiryDate IS NOT NULL')
      .andWhere('items.expiryDate >= :now AND items.expiryDate <= :dueDate', {
        now: new Date(),
        dueDate: dueDate,
      })
      .getMany();

    return this.mapToVo(results) || [];
  }

  async findAllRecent(
    accountId: number,
    since: SinceParam,
  ): Promise<GroceryVO[]> {
    const date = new Date();
    const createdDateString = date.setDate(date.getDate() - getSinceDay(since));
    const createdDate = new Date(createdDateString).toISOString();

    const results = await this.groceryRepository
      .createQueryBuilder('grocery')
      .leftJoin('grocery.account', 'account')
      .leftJoinAndSelect('grocery.category', 'category')
      .leftJoinAndSelect('grocery.items', 'items')
      .leftJoinAndSelect('items.location', 'location')
      .where('account.id = :accountId', { accountId })
      .andWhere('items.createdAt <= :now AND items.createdAt >= :createdDate', {
        now: new Date(),
        createdDate,
      })
      .orderBy('grocery.createdAt', 'DESC')
      .getMany();

    return this.mapToVo(results) || [];
  }

  async getAverageAccountWasteCost(since: SinceParam): Promise<TotalWasteCost> {
    const date = new Date();
    const dateString = date.setDate(date.getDate() - getSinceDay(since));
    const deletedDate = new Date(dateString).toISOString();

    const deletedGroceries = await this.groceryRepository
      .createQueryBuilder('grocery')
      .withDeleted()
      .leftJoin('grocery.account', 'account')
      .leftJoinAndSelect('grocery.items', 'items')
      .andWhere('grocery.deletedAt IS NOT NULL')
      .andWhere(
        'grocery.deletedAt <= :now AND grocery.deletedAt >= :deletedDate',
        {
          now: new Date(),
          deletedDate,
        },
      )
      .getMany();

    const averageData = calculateWasteCost(deletedGroceries);

    return averageData;
  }

  async getLastWasteCost(
    since: SinceParam,
    accountId?: number,
  ): Promise<TotalWasteCost> {
    const date = new Date();
    const dateString = date.setDate(date.getDate() - getSinceDay(since));
    const currentDate = new Date(dateString).toISOString();

    const lastDateString = date.setDate(
      new Date(dateString).getDate() - getSinceDay(since),
    );
    const lastDate = new Date(lastDateString).toISOString();

    const query = await this.groceryRepository
      .createQueryBuilder('grocery')
      .withDeleted()
      .leftJoin('grocery.account', 'account')
      .leftJoinAndSelect('grocery.items', 'items');

    if (accountId && typeof accountId === 'number') {
      await query.andWhere('account.id = :accountId', { accountId });
    }

    const deletedGroceries = await query
      .andWhere('grocery.deletedAt IS NOT NULL')
      .andWhere(
        'grocery.deletedAt <= :current AND grocery.deletedAt >= :lastDate',
        {
          current: currentDate,
          lastDate,
        },
      )
      .getMany();

    return calculateWasteCost(deletedGroceries);
  }

  async getWasteCost(
    since: SinceParam,
    accountId?: number,
  ): Promise<TotalWasteCost> {
    const date = new Date();
    const dateString = date.setDate(date.getDate() - getSinceDay(since));
    const deletedDate = new Date(dateString).toISOString();

    const query = await this.groceryRepository
      .createQueryBuilder('grocery')
      .withDeleted()
      .leftJoin('grocery.account', 'account')
      .leftJoinAndSelect('grocery.items', 'items');

    if (accountId && typeof accountId === 'number') {
      await query.andWhere('account.id = :accountId', { accountId });
    }

    const deletedGroceries = await query
      .andWhere('grocery.deletedAt IS NOT NULL')
      .andWhere(
        'grocery.deletedAt <= :now AND grocery.deletedAt >= :deletedDate',
        {
          now: new Date(),
          deletedDate,
        },
      )
      .getMany();

    return calculateWasteCost(deletedGroceries);
  }

  async getWasteCostSummary(
    accountId: number,
    since: SinceParam,
  ): Promise<GroceryWasteCostVO> {
    const thisWeekData = await this.getWasteCost(since, accountId);
    const lastWeekData = await this.getLastWasteCost(since, accountId);

    const thisWeekAverageAccountData = await this.getWasteCost(since);
    const lastWeekAverageAccountData = await this.getLastWasteCost(since);

    return GroceryWasteCostVO.toVO(
      thisWeekData,
      lastWeekData,
      thisWeekAverageAccountData,
      lastWeekAverageAccountData,
    );
  }

  async getPriceHistory(accountId: number, groceryId: number): Promise<any> {
    const current = await this.groceryRepository.findOne({
      where: {
        id: groceryId,
        account: {
          id: accountId,
        },
      },
    });

    const relatedResultsByName = await this.groceryRepository
      .createQueryBuilder('grocery')
      .leftJoin('grocery.account', 'account')
      .where('account.id = :accountId', { accountId })
      .andWhere('grocery.name = :groceryName', { groceryName: current?.name })
      .orderBy('grocery.createdAt', 'ASC')
      .getMany();

    const caculatedResults = relatedResultsByName?.map((item) => {
      return {
        //! wip
        // averageUnitPrice: item?.price / item?.quantity,
        data: item,
      };
    });

    return caculatedResults;
  }

  async findOneById(
    accountId: number,
    groceryId: number,
  ): Promise<GroceryVO | {}> {
    const entity = await this.groceryRepository
      .createQueryBuilder('grocery')
      .withDeleted()
      .leftJoin('grocery.account', 'account')
      .leftJoinAndSelect('grocery.category', 'category')
      .leftJoinAndSelect('grocery.items', 'items')
      .leftJoinAndSelect('items.location', 'location')
      .andWhere('account.id = :accountId', { accountId })
      .andWhere('grocery.id = :groceryId', { groceryId })
      .andWhere('items.deletedAt IS NULL')
      .getOne();

    return entity?.hasId ? GroceryVO.toVO(entity) : {};
  }

  // create grocery with grocery item(s) by quantity
  async create(
    accountId: number,
    payload: CreateGroceryDTO,
  ): Promise<GroceryVO> {
    if (!payload.name) {
      throw new BadRequestException('Grocery name is missing');
    }

    const dto = new GroceryDTO();

    const accountEntity = new AccountEntity();
    accountEntity.id = accountId;

    if (payload?.categoryId) {
      const categoryEntity = new CategoryEntity();

      categoryEntity.id = payload?.categoryId;

      dto.category = categoryEntity;
    }

    dto.account = accountEntity;
    dto.name = payload?.name;

    let grocery;

    try {
      const existingGrocery = await this.groceryRepository
        .createQueryBuilder('grocery')
        .leftJoin('grocery.account', 'account')
        .leftJoinAndSelect('grocery.category', 'category')
        .leftJoinAndSelect('grocery.items', 'items')
        .andWhere('account.id = :accountId', { accountId })
        .andWhere('grocery.name = :name', { name: payload.name })
        .getOne();

      if (existingGrocery?.hasId) {
        existingGrocery.category = dto?.category;

        grocery = existingGrocery;
      } else {
        const newEntity = GroceryDTO.toEntity(dto);

        // create grocery
        const newGrocery = await this.groceryRepository.save(newEntity);

        if (!newGrocery?.hasId) {
          throw new BadGatewayException(
            'Cannot create grocery',
            'new grocery id not found',
          );
        }

        grocery = newGrocery;
      }
    } catch (err) {
      throw new BadGatewayException('Cannot create grocery group', err);
    }

    // create grocery items
    const createGroceryDto = new CreateGroceryItemDTO();

    const quantity = payload?.quantity || 1;

    createGroceryDto.locationId = payload?.locationId || null;
    createGroceryDto.expiryDate = payload?.expiryDate || null;
    createGroceryDto.quantity = quantity;
    createGroceryDto.price = payload?.price / quantity;
    createGroceryDto.barcode = payload?.barcode;
    createGroceryDto.vendor = payload?.vendor;
    // createGroceryDto.remark = payload.remark;

    try {
      await this.groceryItemsService.create(
        accountId,
        grocery?.id,
        createGroceryDto,
      );
    } catch (err) {
      throw new BadGatewayException('Cannot create grocery item(s)', err);
    }

    console.log({ grocery });

    const result = await this.groceryRepository.findOne({
      where: {
        id: grocery?.id,
      },
      relations: ['category', 'items'],
    });

    return GroceryVO.toVO(result);
  }

  async bulkCreate(
    accountId: number,
    payload: BulkCreateGroceryDTO,
  ): Promise<GroceryVO[]> {
    if (!payload?.items?.length) {
      throw new BadRequestException('No items found');
    }

    const newGroceryIds = [];

    for (let index = 0; index < payload?.items.length; index++) {
      const item = payload?.items[index];

      const newGrocery = await this.create(accountId, item);

      if (!newGrocery?.id) {
        throw new BadGatewayException('Cannot create grocery');
      }
    }

    const results = await this.groceryRepository
      .createQueryBuilder('grocery')
      .leftJoinAndSelect('grocery.category', 'category')
      .leftJoinAndSelect('grocery.items', 'items')
      .where('grocery.id IN (:...newGroceryIds)', {
        newGroceryIds,
      })
      .getMany();

    return results?.map((item) => GroceryVO.toVO(item));
  }

  // update grocery info only
  async update(
    accountId: number,
    groceryId: number,
    payload: Partial<UpdateGroceryDTO>,
  ): Promise<GroceryVO> {
    const groupEntity = await this.groceryRepository.findOne({
      where: {
        id: groceryId,
        account: {
          id: accountId,
        },
      },
      relations: ['category', 'account', 'items'],
    });

    if (!groupEntity?.hasId) {
      throw new NotFoundException('Grocery not found');
    }

    // update a grocery item
    const categoryEntity = new CategoryEntity();
    categoryEntity.id = payload?.categoryId;

    const dto = new GroceryDTO();

    dto.id = groceryId;
    dto.account = groupEntity?.account;
    dto.category = categoryEntity;
    dto.name = payload?.name;

    const updateEntity = GroceryDTO.toEntity(dto);

    try {
      const updatedGroceryGroup = await this.groceryRepository.save(
        updateEntity,
      );

      const newItemCount = payload?.quantity - groupEntity?.items?.length;

      if (newItemCount > 0) {
        const itemdDto = new CreateGroceryItemDTO();

        itemdDto.quantity = newItemCount;

        await this.groceryItemsService.create(
          accountId,
          updatedGroceryGroup?.id,
          itemdDto,
        );
      }

      return GroceryVO.toVO(updatedGroceryGroup);
    } catch (err) {
      throw new BadGatewayException('Cannot update grocery');
    }
  }

  async restore(accountId: number, groceryId: number): Promise<void> {
    const existingGrocery = await this.groceryRepository.findOne({
      where: {
        id: groceryId,
        account: {
          id: accountId,
        },
      },
      relations: ['items'],
      withDeleted: true,
    });

    if (!existingGrocery?.id) {
      throw new BadRequestException('Grocery not found');
    }

    try {
      await this.groceryRepository
        .createQueryBuilder('grocery')
        .restore()
        .where('id = :groceryId', { groceryId })
        .execute();
    } catch (err) {
      throw new BadGatewayException('Cannot restore grocery');
    }
  }

  async delete(accountId: number, groceryId: number): Promise<void> {
    const existingGrocery = await this.groceryRepository.findOne({
      where: {
        id: groceryId,
        account: {
          id: accountId,
        },
      },
      relations: ['items'],
    });

    if (!existingGrocery?.id) {
      throw new BadRequestException('Grocery item not found');
    }

    try {
      await this.groceryRepository
        .createQueryBuilder('grocery')
        .softDelete()
        .where('id = :groceryId', { groceryId })
        .execute();
    } catch (err) {
      throw new BadGatewayException('Cannot delete grocery');
    }
  }
}
