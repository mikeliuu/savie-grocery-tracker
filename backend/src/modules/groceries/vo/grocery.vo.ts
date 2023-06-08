import { ApiProperty } from '@nestjs/swagger';
import { GroceryItemVO } from 'src/modules/grocery-items/vo/grocery-item.vo';
import { GroceryEntity } from '../grocery.entity';

export class GroceryVO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  expiryDate: Date;

  @ApiProperty({ nullable: true })
  createdAt: Date;

  @ApiProperty({ nullable: true })
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  categoryName: string;

  @ApiProperty({
    isArray: true,
    type: GroceryItemVO,
  })
  items: GroceryItemVO[];

  static toVO(entity: GroceryEntity): GroceryVO {
    const vo = new GroceryVO();

    const groceryItems = entity?.items?.map((grocery) =>
      GroceryItemVO.toVO(grocery),
    );

    vo.id = entity?.id;
    vo.createdAt = entity?.createdAt ?? null;
    vo.updatedAt = entity?.updatedAt ?? null;
    vo.deletedAt = entity?.deletedAt ?? null;
    vo.name = entity?.name;
    vo.categoryId = entity?.category?.id ?? null;
    vo.categoryName = entity?.category?.name ?? null;
    vo.items = groceryItems;

    return vo;
  }
}
