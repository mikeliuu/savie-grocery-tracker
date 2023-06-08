import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTRequest } from 'src/core/interfaces/jwt-request.interface';
import { JwtAuthGuard } from 'src/guards/auth/jwt-auth.guard';
import { UserDTO } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { UserVO } from '../users/vo/user.vo';
import { AuthService } from './auth.service';
import { AuthDTO, EmailAuthDTO, GoogleAuthDTO } from './dto/auth.dto';
import { AuthTypeVO } from './vo/auth-type.vo';
import { AuthVO } from './vo/auth.vo';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/auth-type')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get local auth type',
  })
  @ApiResponse({
    status: 200,
    type: AuthTypeVO,
  })
  getLocalAuthType(@Body() payload: EmailAuthDTO): Promise<object> {
    return this.authService.getLocalAuthType(payload?.email);
  }

  @Post('/register')
  @ApiOperation({
    summary: 'Register a new user',
  })
  @ApiResponse({
    status: 201,
    type: UserVO,
  })
  register(@Body() payload: UserDTO): Promise<object> {
    return this.authService.register(payload);
  }

  @Post('/google')
  @HttpCode(200)
  @ApiOperation({
    summary: 'OAuth by google',
  })
  @ApiResponse({
    status: 200,
    type: AuthVO,
  })
  async googleAuth(@Body() payload: GoogleAuthDTO) {
    return this.authService.googleLogin(payload?.code);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login an user',
  })
  @ApiResponse({
    status: 200,
    type: AuthVO,
  })
  login(@Body() payload: AuthDTO): Promise<object> {
    return this.authService.login(payload);
  }

  @Post('/verify-email')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Resend user email verification',
  })
  resendEmailVerifcation(@Body() payload: EmailAuthDTO): Promise<void> {
    return this.usersService.sendEmailVerification(payload?.email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Verify user email',
  })
  @ApiResponse({
    status: 200,
    type: UserVO,
  })
  @Put('/verify-email')
  async verifyEmail(@Request() req: JWTRequest): Promise<UserVO> {
    return this.usersService.verifyEmail(req?.user?.userId);
  }
}
