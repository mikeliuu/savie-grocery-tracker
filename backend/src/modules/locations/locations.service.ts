import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/modules/categories/category.entity';
import { Repository } from 'typeorm';
import { AccountsService } from '../accounts/accounts.service';
import { LocationEntity } from './location.entity';
import { LocationDTO } from './dto/location.dto';
import { LocationVO } from './vo/location.vo';
import { AccountEntity } from '../accounts/account.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>,
  ) {}

  mapToVo(lcoations: LocationEntity[]) {
    return lcoations.map((lcoations) => LocationVO.toVO(lcoations));
  }

  async findOneById(ctegoryId: number): Promise<LocationVO> {
    const location = await this.locationRepository.findOneBy({
      id: ctegoryId,
    });

    return LocationVO.toVO(location);
  }

  async create(
    payload: { name: string },
    defaultAccount: AccountEntity,
  ): Promise<LocationVO> {
    try {
      const existing = await this.locationRepository.findOne({
        where: {
          name: payload?.name,
          account: {
            id: defaultAccount?.id,
          },
        },
      });

      if (existing?.name === payload?.name) {
        throw new BadRequestException('Location already exist');
      }

      const dto = new LocationDTO();
      dto.name = payload?.name;
      dto.account = defaultAccount;

      const newLocation = LocationDTO.toEntity(dto);

      const updated = await this.locationRepository.save(newLocation);

      return LocationVO.toVO(updated);
    } catch (err) {
      console.log({ err });
    }
  }

  async findAllByAccountId(accountId: number): Promise<Promise<LocationVO[]>> {
    const results = await this.locationRepository.find({
      where: {
        account: {
          id: accountId,
        },
      },
    });

    return this.mapToVo(results);
  }

  async updateNameById(locationId: number, name: string): Promise<LocationVO> {
    const existing = await this.locationRepository.findOne({
      where: {
        id: locationId,
      },
    });

    if (!existing) throw new BadRequestException('Category not found');

    existing.name = name;

    const updated = await this.locationRepository.save(existing);

    return LocationVO.toVO(updated);
  }
}
