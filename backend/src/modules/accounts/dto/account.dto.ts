import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { AccountEntity } from '../account.entity';

export class AccountDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Please fill in account name' })
  name: string;

  @ApiProperty({ nullable: true, default: true })
  isDefault: boolean;

  @ApiProperty()
  @IsNotEmpty()
  user: UserEntity;

  static toEntity(dto: AccountDTO): AccountEntity {
    const entity = new AccountEntity();

    entity.name = dto.name;
    entity.isDefault = dto.isDefault;
    entity.user = dto.user;

    return entity;
  }

  static toDTO(entity: AccountEntity): AccountDTO {
    const dto = new AccountDTO();

    dto.name = entity.name;
    dto.isDefault = entity.isDefault;
    dto.user = entity.user;

    return dto;
  }
}
