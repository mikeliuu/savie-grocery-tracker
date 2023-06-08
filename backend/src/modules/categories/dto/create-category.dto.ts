import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Please fill in category name' })
  name: string;
}
