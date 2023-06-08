import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class GoogleAuthDTO {
  @ApiProperty()
  code: string;
}

export class EmailAuthDTO {
  @ApiProperty()
  email: string;
}
