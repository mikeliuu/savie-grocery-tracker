import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { AccountEntity } from 'src/modules/accounts/account.entity';
import { CategoryEntity } from './../category.entity';
import { CreateCategoryDTO } from './create-category.dto';

export class CategoryDTO extends CreateCategoryDTO {
  @ApiProperty()
  account: AccountEntity;

  static toEntity(dto: CategoryDTO): CategoryEntity {
    const entity = new CategoryEntity();

    entity.name = dto.name;
    entity.account = dto.account;

    return entity;
  }

  static toDTO(entity: CategoryEntity): CategoryDTO {
    const dto = new CategoryDTO();

    dto.name = entity.name;
    dto.account = entity.account;

    return dto;
  }
}
