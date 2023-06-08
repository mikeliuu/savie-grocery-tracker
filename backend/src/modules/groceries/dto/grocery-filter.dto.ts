import { ApiProperty } from '@nestjs/swagger';

export class GroceryFilterDTO {
  @ApiProperty({ nullable: true, default: [] })
  categories: number[];

  @ApiProperty({ nullable: true, default: [] })
  locations: number[];

  @ApiProperty({ nullable: true, default: false })
  isExpired: boolean;
}
