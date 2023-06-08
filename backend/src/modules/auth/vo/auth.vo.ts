import { ApiProperty } from '@nestjs/swagger';
import { AuthType } from '../auth.interface';

export class AuthVO {
  @ApiProperty()
  accessToken: string;

  static toVO(token: string): AuthVO {
    const vo = new AuthVO();

    vo.accessToken = token;

    return vo;
  }
}
