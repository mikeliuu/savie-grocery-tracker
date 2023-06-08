import {
  BadGatewayException,
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { hashPassword } from 'src/utils/bcrypt';
import { AccountsService } from '../accounts/accounts.service';
import { AccountDTO } from '../accounts/dto/account.dto';
import { MailService } from '../mail/mail.service';
import { UserDTO } from '../users/dto/user.dto';
import {
  UserEntity,
  UserProvider,
  UserRole,
} from '../users/entities/user.entity';
import { UserVO } from '../users/vo/user.vo';
import { comparePassword } from './../../utils/bcrypt';
import { UsersService } from './../users/users.service';
import { AuthType, GoogleUserInfo } from './auth.interface';
import { AuthDTO } from './dto/auth.dto';
import { DEFAULT_ACCOUNT_NAME } from 'src/core/constants/global';
import { AuthTypeVO } from './vo/auth-type.vo';
import { AuthVO } from './vo/auth.vo';

export interface JwtPayload {
  email: string;
  userId: number;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => AccountsService))
    private accountsService: AccountsService,
    private mailService: MailService,
  ) {}

  async isTokenValid(bearerToken: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(bearerToken, {
        secret: process.env.JWT_SECRET,
      });

      const { email } = payload;

      const user = await this.usersService.findByEmail(email);

      if (!user) throw new BadRequestException('User not found');

      return !!user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async extractTokenInfo(bearerToken: string): Promise<UserVO> {
    const token = bearerToken?.split('Bearer ')[1];

    const jwtPayload = (await this.jwtService.decode(token)) as JwtPayload;

    return this.usersService.getUserInfo(jwtPayload?.userId);
  }

  async generateToken(
    userEntity: UserEntity,
    jwtSignOptions: JwtSignOptions = {
      expiresIn: '7 days',
    },
  ): Promise<{ token: string; accessToken: string }> {
    const jwtPayload: JwtPayload = {
      email: userEntity?.email,
      userId: userEntity?.id,
      role: userEntity?.role,
    };

    const token = this.jwtService.sign(jwtPayload, {
      ...jwtSignOptions,
    });

    const accessToken = `Bearer ${token}`;

    return { token, accessToken };
  }

  async getLocalAuthType(email: string): Promise<AuthTypeVO> {
    try {
      const existingUser = await this.usersService.findByEmail(email);

      return AuthTypeVO.toVO(
        !existingUser ? AuthType.Register : AuthType.Login,
      );
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  async register(payload: UserDTO, userRole?: UserRole): Promise<UserVO> {
    try {
      if (!payload?.email || !payload?.password) {
        const badRequestMessage =
          !payload?.email && !payload?.password
            ? 'Email & password not found'
            : !payload?.email
            ? 'Email not found'
            : 'Password not found';

        throw new BadRequestException(badRequestMessage);
      }

      const existingUser = await this.usersService.findByEmail(payload?.email);

      if (existingUser?.email === payload?.email) {
        throw new BadRequestException('Email has been registered');
      }

      const user = UserDTO.toEntity(payload);

      const hashed = hashPassword(user?.password);

      user.password = hashed;

      user.role = userRole;

      const newUser = await this.usersService.save(user);

      // create default account
      const accountDto = new AccountDTO();
      accountDto.user = newUser;
      accountDto.isDefault = true;
      accountDto.name = DEFAULT_ACCOUNT_NAME;

      await this.accountsService.create(accountDto);

      // generate token for user email verification
      const { token } = await this.generateToken(newUser, {
        expiresIn: '1d', //* 24 hours to verify
      });

      this.mailService.sendEmailVerification(newUser?.email, token);

      return UserVO.toVO(newUser);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  async login(payload: AuthDTO): Promise<AuthVO> {
    try {
      const existingUser = await this.usersService.findByEmail(payload?.email);

      if (!existingUser) throw new NotFoundException('User not found');

      const isValidPassword = await comparePassword(
        payload?.password,
        existingUser?.password,
      );

      if (!isValidPassword)
        throw new BadRequestException('Password does not match');

      //* throw error if user login method does not match
      if (
        payload?.email === existingUser?.email &&
        existingUser?.provider !== UserProvider.Local
      ) {
        throw new BadRequestException(
          'The email is used by other login methods',
        );
      }

      const { accessToken } = await this.generateToken(existingUser);

      return AuthVO.toVO(accessToken);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  async googleLogin(googleCode: string): Promise<AuthVO> {
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_SECRET,
      'postmessage',
    );

    const { tokens } = await oAuth2Client.getToken(googleCode);

    //* get google usuer profile by accessing google api with token
    const googleUser: GoogleUserInfo = await this.httpService
      .axiosRef('https://www.googleapis.com/oauth2/v3/userinfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`,
        },
      })
      .then((res) => res?.data);

    const existingUser = await this.usersService.findByEmail(googleUser?.email);

    if (!existingUser) {
      //* create new user from google oauth if user does not exist
      const newUserEntity = new UserEntity();

      newUserEntity.email = googleUser?.email;
      newUserEntity.name = googleUser?.given_name;
      newUserEntity.providerId = googleUser?.sub;
      newUserEntity.provider = UserProvider.Google;
      newUserEntity.isVerified = true;

      const newUser = await this.usersService.save(newUserEntity);

      //* create default account
      const accountDto = new AccountDTO();
      accountDto.user = newUser;
      accountDto.isDefault = true;
      accountDto.name = 'Account#1';

      await this.accountsService.create(accountDto);

      const { accessToken } = await this.generateToken(newUser);

      return AuthVO.toVO(accessToken);
    }

    //* patch providerId if user detail matches but missing id
    if (
      existingUser?.provider === UserProvider.Google &&
      googleUser?.email === existingUser?.email &&
      !existingUser?.providerId
    ) {
      existingUser.providerId = googleUser?.sub;

      await this.usersService.save(existingUser);
    }

    //* throw error if user login method does not match
    if (
      googleUser?.email === existingUser?.email &&
      existingUser?.provider !== UserProvider.Google
    ) {
      throw new BadRequestException('The email is used by other login methods');
    }

    //* throw error if user detail does not match, email & providerId
    if (
      googleUser?.email !== existingUser?.email &&
      googleUser?.sub !== existingUser?.providerId
    ) {
      throw new BadRequestException('User credential does not match');
    }

    //* generate token for existing google user
    const { accessToken } = await this.generateToken(existingUser);

    return AuthVO.toVO(accessToken);
  }
}
