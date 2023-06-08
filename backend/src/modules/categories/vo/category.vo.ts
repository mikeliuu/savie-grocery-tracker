import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '../category.entity';

export class CategoryVO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  createdAt: Date;

  @ApiProperty({ nullable: true })
  updatedAt: Date;

  static toVO(entity: CategoryEntity): CategoryVO {
    const vo = new CategoryVO();

    vo.id = entity?.id;
    vo.name = entity?.name;

    return vo;
  }
}
