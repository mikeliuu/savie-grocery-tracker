import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../../guards/auth/jwt-auth.guard';
import { AccountsService } from '../accounts/accounts.service';
import { CategoriesService } from './categories.service';
import { CategoryDTO } from './dto/category.dto';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { CategoryVO } from './vo/category.vo';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Category')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly service: CategoriesService,
    private readonly accountsService: AccountsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all categories by account',
  })
  @ApiResponse({
    status: 200,
    type: CategoryVO,
    isArray: true,
  })
  async getAll(@Req() req: Request): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.findAllByAccountId(defaultAccount?.id);
  }

  @Get(':categoryId')
  @ApiOperation({
    summary: 'Get a category by id',
  })
  @ApiResponse({
    status: 200,
    type: CategoryVO,
  })
  async getOne(@Param('categoryId') categoryId: number): Promise<object> {
    return await this.service.findOneById(categoryId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a category',
  })
  @ApiResponse({
    status: 200,
    type: CategoryVO,
  })
  async create(
    @Body() payload: CreateCategoryDTO,
    @Req() req: Request,
  ): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.create(payload, defaultAccount);
  }

  @Put(':categoryId')
  @ApiOperation({
    summary: 'Update a category name by id',
  })
  @ApiResponse({
    status: 200,
    type: CategoryVO,
  })
  updateName(
    @Param('categoryId') categoryId: number,
    @Body() payload: CreateCategoryDTO,
  ): Promise<object> {
    return this.service.updateNameById(categoryId, payload?.name);
  }
}
