import { ApiProperty } from '@nestjs/swagger';
import { CreateGroceryDTO } from './create-grocery.dto';

export class BulkCreateGroceryDTO {
  @ApiProperty()
  items: CreateGroceryDTO[];
}
