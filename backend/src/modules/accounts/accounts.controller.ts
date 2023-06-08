import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTRequest } from 'src/core/interfaces/jwt-request.interface';
import { JwtAuthGuard } from '../../guards/auth/jwt-auth.guard';

import { AccountsService } from './accounts.service';
import { UpdateAccountDTO } from './dto/update-account.dto';
import { AccountVO } from './vo/account.vo';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Account')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly service: AccountsService) {}

  @Get(':accountId')
  @ApiOperation({
    summary: 'Get an account by id',
  })
  @ApiResponse({
    status: 200,
    type: AccountVO,
  })
  async findOne(@Param('accountId') accountId: number): Promise<AccountVO> {
    return this.service.findOneById(accountId);
  }

  //* @phase2
  // @Get()
  // @ApiOperation({
  //   summary: 'Get all accounts',
  // })
  // async findAll(@Req() req: JWTRequest): Promise<AccountVO[]> {
  //   return this.service.findAllByUserId(req?.user?.userId);
  // }

  //* @phase2
  // @Post()
  // @ApiOperation({
  //   summary: 'Create an account',
  // })
  // async createAccount(@Body() payload: AccountDTO): Promise<AccountVO> {
  //   return this.service.create(payload);
  // }

  @Put(':accountId')
  @ApiOperation({
    summary: 'Update an account name by id',
  })
  @ApiResponse({
    status: 200,
    type: AccountVO,
  })
  async updateName(
    @Param('accountId') accountId: number,
    @Body() payload: UpdateAccountDTO,
  ): Promise<AccountVO> {
    return this.service.updateById(accountId, payload);
  }
}
