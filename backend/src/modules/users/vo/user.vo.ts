import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from 'src/modules/accounts/account.entity';
import { AccountVO } from 'src/modules/accounts/vo/account.vo';
import { UserEntity, UserRole } from '../entities/user.entity';

export class UserVO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  defaultAccount?: AccountVO;

  static toVO(entity: UserEntity, defaultAccount?: AccountEntity): UserVO {
    const vo = new UserVO();

    const accountVo = AccountVO.toVO(defaultAccount);

    vo.id = entity?.id;
    vo.name = entity?.name;
    vo.email = entity?.email;
    vo.isVerified = entity?.isVerified;
    vo.role = entity?.role;

    if (accountVo?.id) {
      vo.defaultAccount = accountVo;
    }

    return vo;
  }
}
