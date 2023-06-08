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
import { LocationsService } from './locations.service';
import { CreateLocationDTO } from './dto/create-location.dto';
import { LocationVO } from './vo/location.vo';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Location')
@Controller('locations')
export class LocationsController {
  constructor(
    private readonly service: LocationsService,
    private readonly accountsService: AccountsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all locations by account',
  })
  @ApiResponse({
    status: 200,
    type: LocationVO,
    isArray: true,
  })
  async getAll(@Req() req: Request): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.findAllByAccountId(defaultAccount?.id);
  }

  @Get(':locationId')
  @ApiOperation({
    summary: 'Get a location by id',
  })
  @ApiResponse({
    status: 200,
    type: LocationVO,
  })
  async getOne(@Param('locationId') locationId: number): Promise<object> {
    return await this.service.findOneById(locationId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a location',
  })
  @ApiResponse({
    status: 201,
    type: LocationVO,
  })
  async create(
    @Body() payload: CreateLocationDTO,
    @Req() req: Request,
  ): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.create(payload, defaultAccount);
  }

  @Put(':locationId')
  @ApiOperation({
    summary: 'Update a location name by id',
  })
  @ApiResponse({
    status: 200,
    type: LocationVO,
  })
  updateName(
    @Param('locationId') locationId: number,
    @Body() payload: CreateLocationDTO,
  ): Promise<object> {
    return this.service.updateNameById(locationId, payload?.name);
  }
}
