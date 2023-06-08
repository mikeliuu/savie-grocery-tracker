import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseGroceryItemDTO } from './base-grocery-item.dto';

export class UpdateGroceryItemDTO extends BaseGroceryItemDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'missing grocery id' })
  id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  locationId: number;

  @ApiProperty()
  done: boolean;
}
