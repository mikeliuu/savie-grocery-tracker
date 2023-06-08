import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from '../account.entity';

export class AccountVO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty({ nullable: true })
  createdAt: Date;

  @ApiProperty({ nullable: true })
  updatedAt: Date;

  static toVO(entity: AccountEntity): AccountVO {
    const vo = new AccountVO();

    vo.id = entity?.id;
    vo.isDefault = entity?.isDefault;
    vo.name = entity?.name;

    return vo;
  }
}
