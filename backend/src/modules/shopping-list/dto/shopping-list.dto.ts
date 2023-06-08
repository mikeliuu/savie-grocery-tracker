import { ApiProperty } from '@nestjs/swagger';
import { AccountEntity } from 'src/modules/accounts/account.entity';
import { ShoppingListEntity } from '../shopping-list.entity';

export class ShoppingListDTO {
  @ApiProperty({ nullable: true })
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true, default: '' })
  description: string;

  @ApiProperty({ nullable: true })
  isCompleted: boolean;

  @ApiProperty({ nullable: true })
  isArchived: boolean;

  static toEntity(dto: ShoppingListDTO): ShoppingListEntity {
    const entity = new ShoppingListEntity();

    entity.id = dto?.id;
    entity.name = dto?.name;
    entity.description = dto?.description;
    entity.isCompleted = dto?.isCompleted;
    entity.isArchived = dto?.isArchived;

    return entity;
  }

  static toDTO(entity: ShoppingListEntity): ShoppingListDTO {
    const dto = new ShoppingListDTO();

    dto.name = entity?.name;
    dto.description = entity?.description;
    dto.isCompleted = entity?.isCompleted;
    dto.isArchived = entity?.isArchived;

    return dto;
  }
}
