import { ApiProperty } from '@nestjs/swagger';
import { AuthType } from '../auth.interface';

export class AuthTypeVO {
  @ApiProperty()
  authType: AuthType.Register | AuthType.Login;

  static toVO(type: AuthType.Register | AuthType.Login): AuthTypeVO {
    const vo = new AuthTypeVO();

    vo.authType = type;

    return vo;
  }
}
