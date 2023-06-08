import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {
  @ApiProperty({ default: 10 })
  rowsPerPage: number;
  @ApiProperty({ default: 1 })
  page: number;
}
