import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateGroceryDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'missing grocery id' })
  id: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'missing grocery name' })
  name: string;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  quantity: number;
}
