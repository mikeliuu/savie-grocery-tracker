import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { AccountEntity as AccountEntity } from './account.entity';
import { AccountDTO } from './dto/account.dto';
import { UpdateAccountDTO } from './dto/update-account.dto';
import { AccountVO } from './vo/account.vo';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  mapToVo(accounts: AccountEntity[]) {
    return accounts.map((account) => AccountVO.toVO(account));
  }

  async getAllDefaultAccounts(): Promise<AccountEntity[]> {
    return this.accountRepository.find({
      where: {
        isDefault: true,
      },
      relations: ['user'],
    });
  }

  async getDefaultAccount(req: Request): Promise<AccountEntity> {
    const user = await this.authService.extractTokenInfo(
      req?.headers?.authorization,
    );

    return this.accountRepository.findOne({
      where: { isDefault: true, user: { id: user?.id } },
    });
  }

  async findOneById(accountId: number): Promise<AccountVO> {
    const result = await this.accountRepository.findOne({
      where: {
        id: accountId,
      },
    });

    return AccountVO.toVO(result);
  }

  async findAllByUserId(userId: number): Promise<AccountVO[]> {
    const results = await this.accountRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return this.mapToVo(results);
  }

  async create(payload: AccountDTO): Promise<AccountEntity> {
    return this.accountRepository.save(payload);
  }

  async updateById(
    accountId: number,
    payload: UpdateAccountDTO,
  ): Promise<AccountVO> {
    const existing = await this.accountRepository.findOneBy({
      id: accountId,
    });

    if (!existing) throw new BadRequestException('Account not found');

    existing.name = payload?.name;

    const updated = await this.accountRepository.save(existing);

    return AccountVO.toVO(updated);
  }
}
