import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseGroceryItemDTO } from './base-grocery-item.dto';

export class CreateGroceryItemDTO extends BaseGroceryItemDTO {
  @ApiProperty({ nullable: true, default: 1 })
  quantity: number;

  // @ApiProperty()
  // @IsNotEmpty({ message: 'missing grocery id' })
  // groceryId: number;

  @ApiProperty({ nullable: true })
  locationId: number;
}
