import { ApiProperty } from '@nestjs/swagger';

export class CreateShoppingListDTO {
  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true, default: '' })
  description: string;
}
