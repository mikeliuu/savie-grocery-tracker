import { ApiProperty } from '@nestjs/swagger';
import { ShoppingListEntity } from '../shopping-list.entity';

export class ShoppingListVO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isCompleted: boolean;

  @ApiProperty()
  isArchived: boolean;

  @ApiProperty({ nullable: true })
  createdAt: Date;

  @ApiProperty({ nullable: true })
  updatedAt: Date;

  static toVO(entity: ShoppingListEntity): ShoppingListVO {
    const vo = new ShoppingListVO();

    vo.id = entity?.id;
    vo.name = entity?.name;
    vo.description = entity?.description;
    vo.isCompleted = entity?.isCompleted;
    vo.isArchived = entity?.isArchived;
    vo.createdAt = entity?.createdAt;
    vo.updatedAt = entity?.updatedAt;

    return vo;
  }
}
