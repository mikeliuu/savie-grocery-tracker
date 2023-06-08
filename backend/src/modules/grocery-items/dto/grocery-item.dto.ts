import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from 'src/modules/accounts/account.entity';
import { GroceryItemEntity } from 'src/modules/grocery-items/grocery-item.entity';
import { GroceryEntity } from 'src/modules/groceries/grocery.entity';
import { LocationEntity } from 'src/modules/locations/location.entity';
import { BaseGroceryItemDTO } from './base-grocery-item.dto';

export class GroceryItemDTO extends BaseGroceryItemDTO {
  @ApiProperty({ nullable: true })
  id: number;

  @ApiProperty({ nullable: true, default: 1 })
  quantity: number;

  @ApiProperty({ nullable: true, default: 'false' })
  done: boolean;

  @ApiProperty()
  location: LocationEntity;

  @ApiProperty()
  account: AccountEntity;

  @ApiProperty()
  grocery: GroceryEntity;

  static toEntity(dto: GroceryItemDTO): GroceryItemEntity {
    const entity = new GroceryItemEntity();

    if (dto?.id) {
      entity.id = dto.id;
    }

    entity.account = dto.account;
    entity.location = dto.location;
    entity.grocery = dto.grocery;
    entity.expiryDate = dto.expiryDate;
    entity.price = dto.price;
    entity.barcode = dto.barcode;
    entity.vendor = dto.vendor;
    entity.done = dto.done;
    // entity.remark = dto.remark;

    return entity;
  }

  static toDTO(entity: GroceryItemEntity): GroceryItemDTO {
    const dto = new GroceryItemDTO();

    if (entity?.id) {
      dto.id = entity.id;
    }

    dto.account = entity.account;
    dto.location = entity.location;
    dto.grocery = entity.grocery;
    dto.expiryDate = entity.expiryDate;
    dto.price = entity.price;
    dto.barcode = entity.barcode;
    dto.vendor = entity.vendor;
    dto.done = entity.done;
    // dto.remark = entity.remark;

    return dto;
  }
}
