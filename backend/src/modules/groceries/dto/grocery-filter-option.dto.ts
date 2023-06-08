import { ApiProperty } from '@nestjs/swagger';
import { SortParam } from '../grocery.interface';
import { GroceryFilterDTO } from './grocery-filter.dto';

export class GroceryFilterOptionDTO {
  @ApiProperty({ nullable: true, default: '' })
  search: string;

  @ApiProperty({ nullable: true, default: SortParam.WhatIsNew })
  sort: SortParam;

  @ApiProperty({
    nullable: true,
    default: {
      categories: [],
      locations: [],
      isExpired: false,
    },
  })
  filters: GroceryFilterDTO;
}
