import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateAccountDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Please fill in account name' })
  name: string;
}
