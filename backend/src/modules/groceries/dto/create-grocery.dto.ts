import { ApiProperty } from '@nestjs/swagger';
import { BaseGroceryItemDTO } from 'src/modules/grocery-items/dto/base-grocery-item.dto';

export class CreateGroceryDTO extends BaseGroceryItemDTO {
  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true, default: 1 })
  quantity: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  locationId: number;
}
