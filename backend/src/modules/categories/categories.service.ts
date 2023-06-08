import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DEFAULT_PAGE,
  DEFAULT_ROWS_PER_PAGE,
} from 'src/core/constants/pagination';
import { CategoryEntity } from 'src/modules/categories/category.entity';
import { getPageSkip, getTotalPages } from 'src/utils/page';
import { Repository } from 'typeorm';
import {
  AccountEntity,
  AccountEntity as subject,
} from '../accounts/account.entity';
import { AccountsService } from '../accounts/accounts.service';
import { CategoryEntity as category } from './category.entity';
import { CategoryDTO } from './dto/category.dto';
import { CategoryVO } from './vo/category.vo';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(category)
    private categoryRepository: Repository<category>,
    private accountService: AccountsService,
  ) {}

  mapToVo(category: CategoryEntity[]) {
    return category.map((category) => CategoryVO.toVO(category));
  }

  async findOneById(ctegoryId: number): Promise<CategoryVO> {
    const category = await this.categoryRepository.findOneBy({
      id: ctegoryId,
    });

    return CategoryVO.toVO(category);
  }

  async create(
    payload: { name: string },
    defaultAccount: AccountEntity,
  ): Promise<CategoryVO> {
    try {
      const existing = await this.categoryRepository.findOne({
        where: {
          name: payload?.name,
          account: {
            id: defaultAccount?.id,
          },
        },
      });

      if (existing?.name === payload?.name) {
        throw new BadRequestException('Category already exist');
      }

      const dto = new CategoryDTO();
      dto.name = payload?.name;
      dto.account = defaultAccount;

      const newCategory = CategoryDTO.toEntity(dto);

      const updated = await this.categoryRepository.save(newCategory);

      return CategoryVO.toVO(updated);
    } catch (err) {
      console.log({ err });
    }
  }

  async findAllByAccountId(accountId: number): Promise<Promise<CategoryVO[]>> {
    const results = await this.categoryRepository.find({
      where: {
        account: {
          id: accountId,
        },
      },
    });

    return this.mapToVo(results);
  }

  async updateNameById(categoryId: number, name: string): Promise<CategoryVO> {
    const existing = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
      },
    });

    if (!existing) throw new BadRequestException('Category not found');

    existing.name = name;

    const updated = await this.categoryRepository.save(existing);

    return CategoryVO.toVO(updated);
  }
}
