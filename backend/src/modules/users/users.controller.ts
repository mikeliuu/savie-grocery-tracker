import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTRequest } from 'src/core/interfaces/jwt-request.interface';
import { JwtAuthGuard } from '../../guards/auth/jwt-auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserVO } from './vo/user.vo';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @ApiOperation({
    summary: 'Get user info',
  })
  @ApiResponse({
    status: 200,
    type: UserVO,
  })
  @Get('/info')
  async getUserInfo(@Request() req: JWTRequest): Promise<UserVO> {
    return this.service.getUserInfo(req?.user?.userId);
  }

  @ApiOperation({
    summary: 'Update user info',
  })
  @ApiResponse({
    status: 200,
    type: UserVO,
  })
  @Put('/info')
  async updateUserInfo(
    @Request() req: JWTRequest,
    @Body() payload: UpdateUserDTO,
  ): Promise<UserVO> {
    return this.service.updateUserInfo(req?.user?.userId, payload);
  }
}
