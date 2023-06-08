import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AccountEntity } from 'src/modules/accounts/account.entity';
import { LocationEntity } from '../location.entity';
import { CreateLocationDTO } from './create-location.dto';

export class LocationDTO extends CreateLocationDTO {
  @ApiProperty()
  account: AccountEntity;

  static toEntity(dto: LocationDTO): LocationEntity {
    const entity = new LocationEntity();

    entity.name = dto.name;
    entity.account = dto.account;

    return entity;
  }

  static toDTO(entity: LocationEntity): LocationDTO {
    const dto = new LocationDTO();

    dto.name = entity.name;
    dto.account = entity.account;

    return dto;
  }
}
