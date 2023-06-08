import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { DataRepsonseDTO } from 'src/core/dto/data-repsonse.dto';
import { JwtAuthGuard } from '../../guards/auth/jwt-auth.guard';
import { AccountsService } from '../accounts/accounts.service';
import { CreateGroceryItemDTO } from '../grocery-items/dto/create-grocery-item.dto';
import { UpdateGroceryItemDTO } from '../grocery-items/dto/update-grocery-item.dto';
import { GroceryItemsService } from '../grocery-items/grocery-items.service';
import { GroceryItemDetailVO } from '../grocery-items/vo/grocery-item-detail.vo';
import { CreateGroceryDTO } from './dto/create-grocery.dto';
import { GroceryFilterOptionDTO } from './dto/grocery-filter-option.dto';
import { UpdateGroceryDTO } from './dto/update-grocery.dto';
import { GroceriesService } from './groceries.service';
import { SinceParam } from './grocery.interface';
import { GroceryVO } from './vo/grocery.vo';
import { GroceryWasteCostVO } from './vo/grocery-waste-cost.vo';
import { GroceryFilterOptionVO } from './vo/grocery-filter-option.vo';
import { GroceryItemVO } from '../grocery-items/vo/grocery-item.vo';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptService } from '../receipt/receipt.service';
import { BulkCreateGroceryDTO } from './dto/bulk-create-grocery.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Groceries')
@Controller('groceries')
export class GroceriesController {
  constructor(
    private readonly service: GroceriesService,
    private readonly groceryItemsService: GroceryItemsService,
    private readonly accountsService: AccountsService,
    private readonly receiptService: ReceiptService,
  ) {}

  @Get('/expiry')
  @ApiOperation({
    summary: 'Get expired groceries in default account',
  })
  @ApiResponse({
    status: 200,
    type: GroceryVO,
  })
  async getExpiredGroceries(@Req() req: Request): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.findAllExpiries(defaultAccount?.id);
  }

  @Get('/expiring')
  @ApiOperation({
    summary: 'Get expiring soon groceries in default account',
  })
  @ApiResponse({
    status: 200,
    type: GroceryVO,
  })
  @ApiQuery({
    name: 'since',
    enum: SinceParam,
    required: false,
  })
  async getExpiringGroceries(
    @Req() req: Request,
    @Query('since') since?: SinceParam,
  ): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.findAllExpiring(defaultAccount?.id, since);
  }

  @Get('/recent')
  @ApiOperation({
    summary: 'Get recent groceries in default account',
  })
  @ApiResponse({
    status: 200,
    type: GroceryVO,
  })
  @ApiQuery({
    name: 'since',
    enum: SinceParam,
    required: false,
  })
  async getRecentGroceries(
    @Req() req: Request,
    @Query('since') since?: SinceParam,
  ): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.findAllRecent(defaultAccount?.id, since);
  }

  @Get('/names')
  @ApiResponse({
    status: 200,
    type: 'string',
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get all grocery names in default account',
  })
  async getAllNames(@Req() req: Request): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.findAllNames(defaultAccount?.id);
  }

  @Get('/waste-cost')
  @ApiOperation({
    summary: 'Get grocery waste cost data in default account',
  })
  @ApiQuery({
    name: 'since',
    enum: SinceParam,
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: GroceryWasteCostVO,
  })
  async getWasteCostSummary(
    @Req() req: Request,
    @Query('since') since?: SinceParam,
  ): Promise<GroceryWasteCostVO> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.getWasteCostSummary(defaultAccount?.id, since);
  }

  // @Get('/remarks')
  // @ApiOperation({
  //   summary: 'Get all grocery remarks in default account',
  // })
  // async getAllRemarks(@Req() req: Request): Promise<object> {
  //   const defaultAccount = await this.accountsService.getDefaultAccount(req);

  //   return this.service.findAllRemarks(defaultAccount?.id);
  // }

  @Get(':groceryId/grocery-items/:groceryItemId')
  @ApiOperation({
    summary: 'Get a grocery item by id in default account',
  })
  @ApiResponse({
    status: 200,
    type: GroceryItemDetailVO,
  })
  async getGroceryItem(
    @Param('groceryId') groceryId: number,
    @Param('groceryItemId') groceryItemId: number,
    @Req() req: Request,
  ): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.groceryItemsService.findOneById(
      defaultAccount?.id,
      groceryId,
      groceryItemId,
    );
  }

  @Get(':groceryId')
  @ApiOperation({
    summary: 'Get a grocery by id in default account',
  })
  @ApiResponse({
    status: 200,
    type: GroceryVO,
  })
  async getGrocery(
    @Param('groceryId') groceryId: number,
    @Req() req: Request,
  ): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.findOneById(defaultAccount?.id, groceryId);
  }

  @Get(':groceryId/price-history')
  @ApiOperation({
    summary: 'Get price history of a grocery by id in default account',
  })
  async getGroceryPriceHistory(
    @Param('groceryId') groceryId: number,
    @Req() req: Request,
  ): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.getPriceHistory(defaultAccount?.id, groceryId);
  }

  @Get('/list/filter-options')
  @ApiOperation({
    summary: 'Get grocery list filter options in default account',
  })
  @ApiResponse({
    status: 200,
    type: GroceryFilterOptionVO,
    isArray: true,
  })
  async getListFilterOptions(@Req() req: Request): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.findFilterOptions(defaultAccount?.id);
  }

  @Post('/list')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get grocery list in default account',
  })
  @ApiResponse({
    status: 200,
    type: GroceryVO,
    isArray: true,
  })
  async getList(
    @Body() payload: GroceryFilterOptionDTO,
    @Req() req: Request,
  ): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.findAll(defaultAccount?.id, payload);
  }

  @Post('/upload-receipt')
  @ApiOperation({
    summary: 'Upload a grocery receipt',
  })
  @ApiResponse({
    status: 201,
    type: GroceryVO,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadGroceryReceipt(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<object> {
    // const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.receiptService.uploadReceipt(file);
  }

  @Post('/bulk')
  @ApiOperation({
    summary: 'Bulk create groceries in default account',
  })
  @ApiResponse({
    status: 201,
    type: GroceryVO,
    isArray: true,
  })
  async bulkCreate(
    @Body() payload: BulkCreateGroceryDTO,
    @Req() req: Request,
  ): Promise<GroceryVO[]> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.bulkCreate(defaultAccount?.id, payload);
  }

  @Post(':groceryId/grocery-items')
  @ApiOperation({
    summary: 'Create a grocery item in default account',
  })
  async createGroceryItem(
    @Param('groceryId') groceryId: number,
    @Body() payload: CreateGroceryItemDTO,
    @Req() req: Request,
  ): Promise<void> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.groceryItemsService.create(
      defaultAccount?.id,
      groceryId,
      payload,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Create a grocery in default account',
  })
  async create(
    @Body() payload: CreateGroceryDTO,
    @Req() req: Request,
  ): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.create(defaultAccount?.id, payload);
  }

  @Put(':groceryId/grocery-items/:groceryItemId')
  @ApiOperation({
    summary: 'Update a grocery item in default account',
  })
  @ApiResponse({
    status: 200,
    type: GroceryItemVO,
  })
  async updateGroceryItem(
    @Param('groceryId') groceryId: number,
    @Param('groceryItemId') groceryItemId: number,
    @Body() payload: UpdateGroceryItemDTO,
    @Req() req: Request,
  ): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.groceryItemsService.update(
      defaultAccount?.id,
      groceryId,
      groceryItemId,
      payload,
    );
  }

  @Put(':groceryId')
  @ApiOperation({
    summary: 'Update a grocery in default account',
  })
  @ApiResponse({
    status: 200,
    type: GroceryVO,
  })
  async update(
    @Param('groceryId') groceryId: number,
    @Body() payload: UpdateGroceryDTO,
    @Req() req: Request,
  ): Promise<object> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.update(defaultAccount?.id, groceryId, payload);
  }

  @Put(':groceryId/restore')
  @ApiOperation({
    summary: 'Restore a deleted grocery by id',
  })
  async restoreGrocery(
    @Param('groceryId') groceryId: number,
    @Req() req: Request,
  ): Promise<void> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.restore(defaultAccount?.id, groceryId);
  }

  @Put(':groceryId/grocery-items/:groceryItemId/restore')
  @ApiOperation({
    summary: 'Restore a deleted grocery item by id',
  })
  async restoreGroceryItem(
    @Param('groceryId') groceryId: number,
    @Param('groceryItemId') groceryItemId: number,
    @Req() req: Request,
  ): Promise<void> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.groceryItemsService.restore(
      defaultAccount?.id,
      groceryId,
      groceryItemId,
    );
  }

  @Delete(':groceryId/grocery-items/:groceryItemId')
  @ApiOperation({
    summary: 'Delete a grocery item by id',
  })
  async deleteGroceryItem(
    @Param('groceryId') groceryId: number,
    @Param('groceryItemId') groceryItemId: number,
    @Req() req: Request,
  ): Promise<void> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.groceryItemsService.delete(
      defaultAccount?.id,
      groceryId,
      groceryItemId,
    );
  }

  @Delete(':groceryId')
  @ApiOperation({
    summary: 'Delete a grocery by id',
  })
  async delete(
    @Param('groceryId') groceryId: number,
    @Req() req: Request,
  ): Promise<void> {
    const defaultAccount = await this.accountsService.getDefaultAccount(req);

    return this.service.delete(defaultAccount?.id, groceryId);
  }
}
