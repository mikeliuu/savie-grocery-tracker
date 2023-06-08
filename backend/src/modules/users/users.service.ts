import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AccountEntity } from '../accounts/account.entity';
import { AuthService } from '../auth/auth.service';
import { AuthDTO } from '../auth/dto/auth.dto';
import { MailService } from '../mail/mail.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDTO } from './dto/user.dto';
import { UserVO } from './vo/user.vo';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(AccountEntity)
    private accountsRepository: Repository<AccountEntity>,
    private auhService: AuthService,
    private mailService: MailService,
  ) {}

  async save(userEntity: UserEntity): Promise<UserEntity> {
    return this.usersRepository.save(userEntity);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  async verifyEmail(userId: number): Promise<UserVO> {
    const exisingUser = await this.usersRepository.findOneBy({
      id: userId,
    });

    if (!exisingUser?.id) throw new BadRequestException('User not found');

    if (exisingUser?.isVerified)
      throw new BadRequestException('User already verified');

    exisingUser.isVerified = true;

    const user = await this.usersRepository.save(exisingUser);

    return UserVO.toVO(user);
  }

  async sendEmailVerification(email: string): Promise<void> {
    if (!email) throw new BadRequestException('Missing eamil address');

    const exisingUser = await this.usersRepository.findOneBy({
      email,
    });

    if (!exisingUser?.id) throw new BadRequestException('User not found');

    if (exisingUser?.isVerified)
      throw new BadRequestException('User already verified');

    // generate token for user email verification
    const { token } = await this.auhService.generateToken(exisingUser, {
      expiresIn: '1d', //* 24 hours to verify
    });

    this.mailService.sendEmailVerification(exisingUser?.email, token);
  }

  async getUserInfo(userId: number): Promise<UserVO> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :_userId', { _userId: userId })
      .getOne();

    const defaultAccountEntity = await this.accountsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        isDefault: true,
      },
    });

    return UserVO.toVO(user, defaultAccountEntity);
  }

  async updateUserInfo(
    userId: number,
    payload: UpdateUserDTO,
  ): Promise<UserVO> {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new BadRequestException('Uesr not found');

    user.name = payload?.name;

    const updatedUser = await this.usersRepository.save(user);

    return UserVO.toVO(updatedUser);
  }
}
