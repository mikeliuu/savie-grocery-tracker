import { ApiProperty } from '@nestjs/swagger';

export class BaseGroceryItemDTO {
  @ApiProperty({ nullable: true })
  expiryDate: Date;

  @ApiProperty({ nullable: true, default: 0 })
  price: number;

  @ApiProperty({ nullable: true, default: '' })
  barcode: string;

  @ApiProperty({ nullable: true, default: '' })
  vendor: string;

  // @ApiProperty({ nullable: true, default: '' })
  // remark: string;
}
