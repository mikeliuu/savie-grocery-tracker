import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserDTO {
  @ApiProperty({ nullable: true, default: '' })
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  static toEntity(dto: UserDTO): UserEntity {
    const entity = new UserEntity();

    entity.name = dto?.name;
    entity.email = dto?.email;
    entity.password = dto?.password;

    return entity;
  }

  static toDTO(entity: UserEntity): UserDTO {
    const dto = new UserDTO();

    dto.name = entity?.name;
    dto.email = entity?.email;
    dto.password = entity?.password;
    return dto;
  }
}
