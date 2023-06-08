import { ApiProperty } from '@nestjs/swagger';

export class DataRepsonseDTO<T = any> {
  @ApiProperty({ default: 200 })
  statusCode: number;

  @ApiProperty()
  data: T;
}
