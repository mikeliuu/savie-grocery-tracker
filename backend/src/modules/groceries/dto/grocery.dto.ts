import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from 'src/modules/accounts/account.entity';
import { CategoryEntity } from 'src/modules/categories/category.entity';
import { GroceryEntity } from '../grocery.entity';
import { BaseGroceryDTO } from './base-grocery.dto';

export class GroceryDTO extends BaseGroceryDTO {
  @ApiProperty({ nullable: true })
  id: number;

  @ApiProperty()
  category: CategoryEntity;

  @ApiProperty()
  account: AccountEntity;

  static toEntity(dto: GroceryDTO): GroceryEntity {
    const entity = new GroceryEntity();

    if (dto?.id) {
      entity.id = dto.id;
    }

    entity.name = dto.name;
    entity.account = dto.account;
    entity.category = dto.category || null;

    return entity;
  }

  static toDTO(entity: GroceryEntity): GroceryDTO {
    const dto = new GroceryDTO();

    if (entity?.id) {
      dto.id = entity.id;
    }

    dto.name = entity.name;
    dto.account = entity.account;
    dto.category = entity.category;

    return dto;
  }
}
