import { ApiProperty } from '@nestjs/swagger';

export class BaseGroceryDTO {
  @ApiProperty()
  name: string;
}
