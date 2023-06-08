import { ApiProperty } from '@nestjs/swagger';
import { GroceryItemEntity } from '../grocery-item.entity';

export class GroceryItemVO {
  @ApiProperty()
  id: number;

  @ApiProperty({ nullable: true, default: 0 })
  price: number;

  @ApiProperty({ nullable: true, default: '' })
  barcode: string;

  @ApiProperty({ nullable: true, default: '' })
  vendor: string;

  @ApiProperty({ nullable: true, default: 'false' })
  done: boolean;

  @ApiProperty({ nullable: true })
  expiryDate: Date;

  @ApiProperty({ nullable: true })
  createdAt: Date;

  @ApiProperty({ nullable: true })
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date;

  @ApiProperty()
  locationId: number;

  @ApiProperty()
  locationName: string;

  // @ApiProperty({ nullable: true, default: '' })
  // remark: string;

  static toVO(entity: GroceryItemEntity): GroceryItemVO {
    const vo = new GroceryItemVO();

    vo.id = entity?.id;
    vo.createdAt = entity?.createdAt ?? null;
    vo.updatedAt = entity?.updatedAt ?? null;
    vo.deletedAt = entity?.deletedAt ?? null;
    vo.done = entity?.done;
    vo.expiryDate = entity?.expiryDate ?? null;
    vo.price = entity?.price;
    vo.barcode = entity?.barcode ?? null;
    vo.vendor = entity?.vendor ?? null;
    vo.locationId = entity?.location?.id ?? null;
    vo.locationName = entity?.location?.name ?? null;

    // vo.remark = entity?.remark;

    return vo;
  }
}
