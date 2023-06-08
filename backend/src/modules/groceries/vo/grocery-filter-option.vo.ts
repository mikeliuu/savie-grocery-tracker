import { ApiProperty } from '@nestjs/swagger';

export class GroceryFilterOptionVO {
  @ApiProperty()
  filter: string;

  @ApiProperty({ default: [] })
  value: {
    id: number;
    name: string;
  }[];
}
