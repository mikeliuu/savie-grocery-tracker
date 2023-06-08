import { ApiProperty } from '@nestjs/swagger';
import { LocationEntity } from '../location.entity';

export class LocationVO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  createdAt: Date;

  @ApiProperty({ nullable: true })
  updatedAt: Date;

  static toVO(entity: LocationEntity): LocationVO {
    const vo = new LocationVO();

    vo.id = entity?.id;
    vo.name = entity?.name;

    return vo;
  }
}
