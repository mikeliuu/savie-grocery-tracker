import { ApiProperty } from '@nestjs/swagger';
import { GroceryEntity } from 'src/modules/groceries/grocery.entity';

export class GroceryItemDetailVO {
  @ApiProperty()
  groceryId: number;

  @ApiProperty()
  id: number;

  @ApiProperty({ default: '' })
  name: string;

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

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  categoryName: string;

  // @ApiProperty({ nullable: true, default: '' })
  // remark: string;

  static toVO(groceryEntity: GroceryEntity): GroceryItemDetailVO {
    const vo = new GroceryItemDetailVO();

    const groceryItem = groceryEntity?.items[0];

    vo.name = groceryEntity?.name;
    vo.id = groceryItem?.id;
    vo.done = groceryItem?.done;
    vo.createdAt = groceryItem?.createdAt ?? null;
    vo.updatedAt = groceryItem?.updatedAt ?? null;
    vo.deletedAt = groceryItem?.deletedAt ?? null;
    vo.expiryDate = groceryItem?.expiryDate ?? null;
    vo.price = groceryItem?.price;
    vo.barcode = groceryItem?.barcode ?? null;
    vo.vendor = groceryItem?.vendor ?? null;
    vo.locationId = groceryItem?.location?.id ?? null;
    vo.locationName = groceryItem?.location?.name ?? null;

    vo.groceryId = groceryEntity?.id;
    vo.categoryId = groceryEntity?.category?.id ?? null;
    vo.categoryName = groceryEntity?.category?.name ?? null;

    // vo.remark = entity?.remark;

    return vo;
  }
}
