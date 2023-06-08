import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateLocationDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Please fill in location name' })
  name: string;
}
